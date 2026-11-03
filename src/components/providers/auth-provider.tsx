"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { displayNameFromEmail } from "@/lib/format";

const TOKEN_KEY = "booknook:token";
const USER_KEY = "booknook:user";
const NAMES_KEY = "booknook:names";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

type AuthResult = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  signIn: (input: { email: string; password: string }) => Promise<AuthResult>;
  signUp: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<AuthResult>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function base64Url(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function createDemoToken(user: AuthUser) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      iat: issuedAt,
      exp: issuedAt + 60 * 60 * 24 * 7,
    }),
  );
  return `${header}.${payload}.booknook-demo`;
}

function userIdFor(email: string) {
  let hash = 0;
  for (let index = 0; index < email.length; index += 1) {
    hash = (hash * 31 + email.charCodeAt(index)) >>> 0;
  }
  return `reader-${hash.toString(36)}`;
}

function readNames(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(NAMES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function readSession(): { user: AuthUser | null; token: string | null } {
  if (typeof window === "undefined") return { user: null, token: null };
  try {
    const rawUser = window.localStorage.getItem(USER_KEY);
    const rawToken = window.localStorage.getItem(TOKEN_KEY);
    if (!rawUser || !rawToken) return { user: null, token: null };
    const parsed = JSON.parse(rawUser) as Partial<AuthUser>;
    if (!parsed.email || !parsed.name) return { user: null, token: null };
    return {
      user: {
        id: parsed.id ?? userIdFor(parsed.email),
        name: parsed.name,
        email: parsed.email,
      },
      token: rawToken,
    };
  } catch {
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = readSession();
    setUser(session.user);
    setToken(session.token);
    setIsLoading(false);
  }, []);

  const persist = useCallback((nextUser: AuthUser) => {
    const nextToken = createDemoToken(nextUser);
    window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    window.localStorage.setItem(TOKEN_KEY, nextToken);
    setUser(nextUser);
    setToken(nextToken);
  }, []);

  const signIn = useCallback<AuthContextValue["signIn"]>(
    async ({ email, password }) => {
      const normalized = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        return { ok: false, error: "Enter a valid email address." };
      }
      if (password.length < 6) {
        return { ok: false, error: "Your password needs at least 6 characters." };
      }
      const names = readNames();
      const nextUser: AuthUser = {
        id: userIdFor(normalized),
        name: names[normalized] || displayNameFromEmail(normalized),
        email: normalized,
      };
      persist(nextUser);
      return { ok: true };
    },
    [persist],
  );

  const signUp = useCallback<AuthContextValue["signUp"]>(
    async ({ name, email, password }) => {
      const trimmedName = name.trim();
      const normalized = email.trim().toLowerCase();
      if (trimmedName.length < 2) {
        return { ok: false, error: "Please share the name you'd like on your library card." };
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        return { ok: false, error: "Enter a valid email address." };
      }
      if (password.length < 6) {
        return { ok: false, error: "Choose a password with at least 6 characters." };
      }
      const names = readNames();
      names[normalized] = trimmedName;
      window.localStorage.setItem(NAMES_KEY, JSON.stringify(names));
      const nextUser: AuthUser = {
        id: userIdFor(normalized),
        name: trimmedName,
        email: normalized,
      };
      persist(nextUser);
      return { ok: true };
    },
    [persist],
  );

  const signOut = useCallback(() => {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== USER_KEY && event.key !== TOKEN_KEY) return;
      const session = readSession();
      setUser(session.user);
      setToken(session.token);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = useMemo(
    () => ({ user, token, isLoading, signIn, signUp, signOut }),
    [user, token, isLoading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
