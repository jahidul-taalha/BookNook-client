"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpenIcon,
  BookPlusIcon,
  LibraryIcon,
  Loader2Icon,
  PencilIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import { FadeIn } from "@/components/motion/fade-in";
import { useAuth } from "@/components/providers/auth-provider";
import { Container } from "@/components/site/container";
import { EmptyState } from "@/components/site/empty-state";
import { ErrorState } from "@/components/site/error-state";
import { PageHeader } from "@/components/site/page-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteBook, errorMessage, getBooks } from "@/lib/api";
import { coverFor, coverForCategory } from "@/lib/covers";
import { formatDate } from "@/lib/format";
import type { Book } from "@/lib/types";
import { cn } from "cn";

export function ManageBooksView() {
  const { user, token } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [pendingDelete, setPendingDelete] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getBooks({ sort: "newest" }, controller.signal)
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

  const retry = useCallback(() => {
    setStatus("loading");
    setAttempt((value) => value + 1);
  }, []);

  const mine = useMemo(() => {
    const email = user?.email?.toLowerCase();
    if (!email) return [];
    return books.filter(
      (book) => book.addedBy?.email?.toLowerCase() === email,
    );
  }, [books, user?.email]);

  const totals = useMemo(() => {
    return mine.reduce(
      (accumulator, book) => {
        accumulator.copies += book.totalCopies || 0;
        accumulator.available += book.availableCopies || 0;
        return accumulator;
      },
      { copies: 0, available: 0 },
    );
  }, [mine]);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteBook(pendingDelete._id, token);
      setBooks((current) =>
        current.filter((book) => book._id !== pendingDelete._id),
      );
      toast.success("Book removed from the shelves", {
        description: `“${pendingDelete.title}” is no longer listed.`,
      });
      setPendingDelete(null);
    } catch (error) {
      toast.error("Couldn't remove this book", {
        description: errorMessage(error),
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Container className="space-y-8 py-10 sm:py-14">
        <FadeIn>
          <PageHeader
            eyebrow="Your shelf"
            title="Manage Books"
            description="Keep the books you've shared up to date, and take one off the shelves when it's time to pass it on elsewhere."
            action={
              <Button render={<Link href="/add-book" />}>
                <BookPlusIcon />
                Add a book
              </Button>
            }
          />
        </FadeIn>

        {status === "ready" && mine.length > 0 ? (
          <FadeIn delay={0.05}>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                icon={LibraryIcon}
                label="Books shared"
                value={String(mine.length)}
                hint="Titles on your shelf"
              />
              <StatCard
                icon={UsersIcon}
                label="Copies listed"
                value={String(totals.copies)}
                hint="Total physical copies"
              />
              <StatCard
                icon={BookOpenIcon}
                label="Out on loan"
                value={String(Math.max(0, totals.copies - totals.available))}
                hint="Copies with readers"
              />
            </div>
          </FadeIn>
        ) : null}

        {status === "loading" ? <RowsSkeleton /> : null}

        {status === "error" ? (
          <ErrorState
            title="We couldn't load your shelf"
            description={message}
            onRetry={retry}
          />
        ) : null}

        {status === "ready" && mine.length === 0 ? (
          <EmptyState
            icon={ShieldCheckIcon}
            title="You haven't shared a book yet"
            description="Add a book you've finished and it will appear here. You can edit the details or remove it at any time."
            action={
              <Button render={<Link href="/add-book" />}>
                <BookPlusIcon />
                Share your first book
              </Button>
            }
          />
        ) : null}

        {status === "ready" && mine.length > 0 ? (
          <div className="space-y-3">
            {mine.map((book, index) => {
              const available = book.availableCopies ?? 0;
              const total = book.totalCopies ?? available;
              return (
                <FadeIn key={book._id} delay={Math.min(index, 8) * 0.04}>
                  <article className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-card sm:flex-row sm:items-center">
                    <div className="relative shrink-0 overflow-hidden rounded-xl bg-secondary">
                      <span
                        className="book-spine absolute inset-y-0 left-0 z-10 w-1.5"
                        aria-hidden
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverFor(book)}
                        alt={`Cover of ${book.title}`}
                        className="h-28 w-20 object-cover"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = coverForCategory(book.category);
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                          {book.category || "Others"}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                            available > 0
                              ? "bg-primary/10 text-primary"
                              : "bg-destructive/10 text-destructive",
                          )}
                        >
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              available > 0 ? "bg-primary" : "bg-destructive",
                            )}
                          />
                          {available > 0
                            ? `${available} of ${total} available`
                            : "All copies out"}
                        </span>
                      </div>
                      <h2 className="truncate font-serif text-lg font-semibold text-foreground">
                        {book.title}
                      </h2>
                      <p className="truncate text-sm text-muted-foreground">
                        by {book.author || "Unknown author"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Added {formatDate(book.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        render={<Link href={`/books/${book._id}`} />}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        render={<Link href={`/books/${book._id}/edit`} />}
                      >
                        <PencilIcon />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setPendingDelete(book)}
                      >
                        <Trash2Icon />
                        Remove
                      </Button>
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        ) : null}
      </Container>

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open && !deleting) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Remove “{pendingDelete?.title}” from the shelves?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This deletes the listing for everyone. Borrowers who already have a
              copy can still return it through My Borrows.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Keep it listed</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleting}>
              {deleting ? <Loader2Icon className="animate-spin" /> : <Trash2Icon />}
              {deleting ? "Removing…" : "Remove book"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof LibraryIcon;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-card">
      <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="font-serif text-2xl font-semibold text-foreground">{value}</p>
        <p className="truncate text-xs text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}

function RowsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-4 sm:flex-row sm:items-center"
        >
          <Skeleton className="h-28 w-20 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
