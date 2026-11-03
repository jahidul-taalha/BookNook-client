"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { BookCard } from "@/components/books/book-card";
import { BookGridSkeleton } from "@/components/books/book-card-skeleton";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { getBooks } from "@/lib/api";
import type { Book } from "@/lib/types";

export function RelatedBooks({
  category,
  currentId,
}: {
  category?: string;
  currentId: string;
}) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(Boolean(category));

  useEffect(() => {
    if (!category) return;
    const controller = new AbortController();
    getBooks({ category, limit: 8 }, controller.signal)
      .then((result) => {
        setBooks(result.filter((book) => book._id !== currentId).slice(0, 4));
      })
      .catch(() => {
        setBooks([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [category, currentId]);

  if (!category) return null;
  if (!loading && books.length === 0) return null;

  return (
    <section className="space-y-6 border-t border-border/70 pt-10">
      <FadeIn>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.24em] text-accent uppercase">
              From the same shelf
            </p>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              More {category || "books"} to borrow
            </h2>
          </div>
          <Button
            variant="outline"
            render={
              <Link href={`/books?category=${encodeURIComponent(category || "All")}`} />
            }
          >
            Browse this shelf
            <ArrowRightIcon />
          </Button>
        </div>
      </FadeIn>

      {loading ? (
        <BookGridSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {books.map((book, index) => (
            <BookCard key={book._id} book={book} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
