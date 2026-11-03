"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, BookOpenIcon } from "lucide-react";
import { BookCard } from "@/components/books/book-card";
import { BookGridSkeleton } from "@/components/books/book-card-skeleton";
import { FadeIn } from "@/components/motion/fade-in";
import { Container } from "@/components/site/container";
import { EmptyState } from "@/components/site/empty-state";
import { ErrorState } from "@/components/site/error-state";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { errorMessage, getBooks } from "@/lib/api";
import type { Book } from "@/lib/types";

export function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");
  const [attempt, setAttempt] = useState(0);

  const load = useCallback(() => {
    setAttempt((value) => value + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    getBooks({ sort: "newest", limit: 8 }, controller.signal)
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
  }, [attempt]);

  return (
    <section className="py-16 sm:py-20">
      <Container className="space-y-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Fresh from the box"
            title="New arrivals worth a look"
            description="The newest additions to our shared shelves, ready for their first borrower."
            action={
              <Button variant="outline" render={<Link href="/books" />}>
                Browse all books
                <ArrowRightIcon />
              </Button>
            }
          />
        </FadeIn>

        {status === "loading" ? <BookGridSkeleton count={4} /> : null}

        {status === "error" ? (
          <ErrorState
            title="The new arrivals are still in transit"
            description={`${message} You can still browse our staff picks below while the catalogue reconnects.`}
            onRetry={load}
          />
        ) : null}

        {status === "ready" && books.length === 0 ? (
          <EmptyState
            icon={BookOpenIcon}
            title="The arrivals table is waiting"
            description="No books have been added just yet. Be the first neighbour to share a favourite with the shelf."
            action={
              <Button render={<Link href="/add-book" />}>
                <BookOpenIcon />
                Add the first book
              </Button>
            }
          />
        ) : null}

        {status === "ready" && books.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {books.slice(0, 8).map((book, index) => (
              <BookCard key={book._id} book={book} index={index} />
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
