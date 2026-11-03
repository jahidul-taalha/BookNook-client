"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ShieldAlertIcon } from "lucide-react";
import { BookForm } from "@/components/books/book-form";
import { FadeIn } from "@/components/motion/fade-in";
import { useAuth } from "@/components/providers/auth-provider";
import { Container } from "@/components/site/container";
import { EmptyState } from "@/components/site/empty-state";
import { ErrorState } from "@/components/site/error-state";
import { PageHeader } from "@/components/site/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { errorMessage, getBook } from "@/lib/api";
import type { Book } from "@/lib/types";

export function EditBookView({ id }: { id: string }) {
  const { user, token } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getBook(id, token, controller.signal)
      .then((result) => {
        setBook(result);
        setStatus("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setMessage(errorMessage(error));
        setStatus("error");
      });
    return () => controller.abort();
  }, [id, token, attempt]);

  const retry = useCallback(() => {
    setStatus("loading");
    setAttempt((value) => value + 1);
  }, []);

  const ownerEmail = book?.addedBy?.email?.toLowerCase();
  const canEdit =
    status === "ready" &&
    Boolean(book) &&
    (!ownerEmail || ownerEmail === user?.email?.toLowerCase());

  return (
    <Container className="space-y-8 py-10 sm:py-14">
      <Link
        href={book ? `/books/${book._id}` : "/manage-books"}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeftIcon className="size-4" />
        {book ? "Back to book" : "Back to manage books"}
      </Link>

      {status === "loading" ? <EditSkeleton /> : null}

      {status === "error" ? (
        <ErrorState
          title="We couldn't open this book for editing"
          description={message}
          onRetry={retry}
        />
      ) : null}

      {status === "ready" && book && !canEdit ? (
        <EmptyState
          icon={ShieldAlertIcon}
          title="This book belongs to another shelf"
          description="Only the neighbour who added a book can edit its details. You can still borrow it, though."
          action={
            <Button render={<Link href={`/books/${book._id}`} />}>
              View the book
            </Button>
          }
        />
      ) : null}

      {status === "ready" && book && canEdit ? (
        <>
          <FadeIn>
            <PageHeader
              eyebrow="Manage books"
              title="Edit Book"
              description={`Update the details for “${book.title}”. Changes are visible to every borrower straight away.`}
            />
          </FadeIn>
          <BookForm mode="edit" book={book} />
        </>
      ) : null}
    </Container>
  );
}

function EditSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4 border-b border-border/70 pb-8">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-5 rounded-3xl border border-border/80 bg-card p-6">
          <Skeleton className="h-11 w-full rounded-xl" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    </div>
  );
}
