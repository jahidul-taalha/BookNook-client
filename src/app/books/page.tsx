import type { Metadata } from "next";
import { Suspense } from "react";
import { BooksExplorer } from "@/components/books/books-explorer";
import { BookGridSkeleton } from "@/components/books/book-card-skeleton";
import { Container } from "@/components/site/container";

export const metadata: Metadata = {
  title: "BookNook | All Books",
  description:
    "Browse every book on the BookNook shelves. Search by title or author, filter by category, and borrow your next read.",
};

function BooksFallback() {
  return (
    <Container className="space-y-8 py-10 sm:py-14">
      <div className="space-y-4 border-b border-border/70 pb-8">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-12 w-64 animate-pulse rounded-xl bg-muted" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded bg-muted" />
      </div>
      <div className="h-32 animate-pulse rounded-2xl bg-muted" />
      <BookGridSkeleton count={8} />
    </Container>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<BooksFallback />}>
      <BooksExplorer />
    </Suspense>
  );
}
