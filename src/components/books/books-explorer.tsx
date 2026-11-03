"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpenIcon, SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
import { BookCard } from "@/components/books/book-card";
import { BookGridSkeleton } from "@/components/books/book-card-skeleton";
import { FadeIn } from "@/components/motion/fade-in";
import { Container } from "@/components/site/container";
import { EmptyState } from "@/components/site/empty-state";
import { ErrorState } from "@/components/site/error-state";
import { PageHeader } from "@/components/site/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { errorMessage, getBooks } from "@/lib/api";
import {
  BOOK_CATEGORIES,
  SORT_OPTIONS,
  type Book,
  type SortOption,
} from "@/lib/types";
import { cn } from "cn";

const ALL_CATEGORIES = ["All", ...BOOK_CATEGORIES] as const;

export function BooksExplorer() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "All";
  const initialSearch = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(
    ALL_CATEGORIES.includes(initialCategory as (typeof ALL_CATEGORIES)[number])
      ? initialCategory
      : "All",
  );
  const [sort, setSort] = useState<SortOption>("newest");
  const [books, setBooks] = useState<Book[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();
    getBooks({ search, category, sort }, controller.signal)
      .then((result) => {
        setBooks(result);
        setStatus("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setMessage(errorMessage(error));
        setStatus("error");
      });
    return () => controller.abort();
  }, [search, category, sort, attempt]);

  const retry = useCallback(() => {
    setStatus("loading");
    setAttempt((value) => value + 1);
  }, []);

  const hasFilters = search.length > 0 || category !== "All";

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategory("All");
  };

  const summary = useMemo(() => {
    if (status === "loading") return "Looking along the shelves…";
    if (status === "error") return "The catalogue is unavailable right now";
    if (books.length === 0) return "No books match these filters yet";
    if (books.length === 1) return "1 book on this shelf";
    return `${books.length} books on this shelf`;
  }, [status, books.length]);

  return (
    <div className="pb-4">
      <Container className="space-y-8 py-10 sm:py-14">
        <FadeIn>
          <PageHeader
            eyebrow="The catalogue"
            title="All Books"
            description="Wander the whole collection: novels, field guides, histories, picture books, and everything else neighbours have shared."
            action={
              <Button render={<Link href="/add-book" />}>
                <BookOpenIcon />
                Add a book
              </Button>
            }
          />
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-card sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search by title or author…"
                  aria-label="Search books by title or author"
                  className="h-11 rounded-full bg-background pr-10 pl-10"
                />
                {searchInput ? (
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    aria-label="Clear search"
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <XIcon className="size-4" />
                  </button>
                ) : null}
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden items-center gap-1.5 text-xs font-medium text-muted-foreground sm:inline-flex">
                  <SlidersHorizontalIcon className="size-3.5" />
                  Sort
                </span>
                <Select
                  items={[...SORT_OPTIONS]}
                  value={sort}
                  onValueChange={(value) => setSort(value as SortOption)}
                >
                  <SelectTrigger className="h-11 w-full min-w-44 rounded-full bg-background px-4 sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {ALL_CATEGORIES.map((option) => {
                const active = category === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCategory(option)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/80 bg-background text-muted-foreground hover:border-primary/40 hover:text-primary",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
              {hasFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-auto inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-xs font-semibold text-accent hover:bg-accent/10"
                >
                  <XIcon className="size-3.5" />
                  Clear filters
                </button>
              ) : null}
            </div>
          </div>
        </FadeIn>

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-muted-foreground">{summary}</p>
          {search ? (
            <p className="hidden text-xs text-muted-foreground sm:block">
              Showing matches for <span className="font-semibold text-foreground">“{search}”</span>
            </p>
          ) : null}
        </div>

        {status === "loading" ? <BookGridSkeleton count={8} /> : null}

        {status === "error" ? (
          <ErrorState
            title="We can't reach the catalogue"
            description={message}
            onRetry={retry}
          />
        ) : null}

        {status === "ready" && books.length === 0 ? (
          <EmptyState
            icon={BookOpenIcon}
            title={hasFilters ? "No books on this shelf yet" : "The shelves are waiting"}
            description={
              hasFilters
                ? "Try a different category or a shorter search. A new title might arrive any day."
                : "Nothing has been added to the catalogue yet. Share the first book and start the collection."
            }
            action={
              hasFilters ? (
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : (
                <Button render={<Link href="/add-book" />}>
                  <BookOpenIcon />
                  Add the first book
                </Button>
              )
            }
          />
        ) : null}

        {status === "ready" && books.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {books.map((book, index) => (
              <BookCard key={book._id} book={book} index={index} />
            ))}
          </div>
        ) : null}
      </Container>
    </div>
  );
}
