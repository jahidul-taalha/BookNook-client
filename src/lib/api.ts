import type { Book, BookInput, Borrow } from "@/lib/types";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
export const API_URL = rawBaseUrl.replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
};

function friendlyMessage(status: number) {
  switch (status) {
    case 400:
      return "Some of the details didn't look right. Please check the form and try again.";
    case 401:
      return "Your session has expired. Please sign in again to continue.";
    case 403:
      return "You don't have permission to do that.";
    case 404:
      return "We couldn't find that record in the catalogue.";
    case 409:
      return "That action can't be completed right now. Please refresh and try again.";
    case 429:
      return "Too many requests. Give it a moment and try again.";
    default:
      return "The library service ran into a problem. Please try again shortly.";
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_URL) {
    throw new ApiError(
      "The library desk is reconnecting. Our shelves will be back as soon as the service is ready — please check in again shortly.",
    );
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const controller = new AbortController();
  const callerSignal = options.signal;
  let timedOut = false;

  const forwardAbort = () => controller.abort();
  if (callerSignal) {
    if (callerSignal.aborted) {
      controller.abort();
    } else {
      callerSignal.addEventListener("abort", forwardAbort);
    }
  }

  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, 20_000);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: "no-store",
      signal: controller.signal,
    });

    const text = await response.text();
    let payload: unknown = null;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = null;
      }
    }

    if (!response.ok) {
      const message =
        payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof (payload as { message?: unknown }).message === "string"
          ? (payload as { message: string }).message
          : friendlyMessage(response.status);
      throw new ApiError(message, response.status);
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (callerSignal?.aborted) throw error;
    if (timedOut) {
      throw new ApiError(
        "The library service is taking longer than usual. Please try again in a moment.",
      );
    }
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new ApiError(
      "We couldn't reach the library service. Check your connection and try again.",
    );
  } finally {
    clearTimeout(timeout);
    callerSignal?.removeEventListener("abort", forwardAbort);
  }
}

function listFrom<T>(payload: unknown, keys: string[]): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    for (const key of keys) {
      const value = (payload as Record<string, unknown>)[key];
      if (Array.isArray(value)) return value as T[];
    }
  }
  return [];
}

function bookFrom(payload: unknown): Book {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of ["book", "data", "result"]) {
      if (record[key] && typeof record[key] === "object") {
        return record[key] as Book;
      }
    }
  }
  return payload as Book;
}

export type BookQuery = {
  search?: string;
  category?: string;
  sort?: string;
  limit?: number;
};

export async function getBooks(query: BookQuery = {}, signal?: AbortSignal) {
  const params = new URLSearchParams();
  if (query.search?.trim()) params.set("search", query.search.trim());
  if (query.category && query.category !== "All") params.set("category", query.category);
  if (query.sort) params.set("sort", query.sort);
  if (query.limit) params.set("limit", String(query.limit));
  const suffix = params.toString() ? `?${params.toString()}` : "";
  const payload = await request<unknown>(`/books${suffix}`, { signal });
  return listFrom<Book>(payload, ["books", "data", "items", "results"]);
}

export async function getBook(id: string, token?: string | null, signal?: AbortSignal) {
  const payload = await request<unknown>(`/books/${encodeURIComponent(id)}`, {
    token,
    signal,
  });
  return bookFrom(payload);
}

export async function createBook(input: BookInput, token?: string | null) {
  return request<Book>("/books", { method: "POST", body: input, token });
}

export async function updateBook(id: string, input: BookInput, token?: string | null) {
  return request<Book>(`/books/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: input,
    token,
  });
}

export async function deleteBook(id: string, token?: string | null) {
  return request<unknown>(`/books/${encodeURIComponent(id)}`, {
    method: "DELETE",
    token,
  });
}

export async function borrowBook(bookId: string, token?: string | null) {
  return request<unknown>("/borrows", {
    method: "POST",
    body: { bookId },
    token,
  });
}

export async function getBorrows(token?: string | null, signal?: AbortSignal) {
  const payload = await request<unknown>("/borrows", { token, signal });
  return listFrom<Borrow>(payload, ["borrows", "data", "items", "results"]);
}

export async function returnBorrow(id: string, token?: string | null) {
  return request<unknown>(`/borrows/${encodeURIComponent(id)}`, {
    method: "DELETE",
    token,
  });
}

export function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
}
