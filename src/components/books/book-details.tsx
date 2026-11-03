"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  CircleAlertIcon,
  LibraryIcon,
  Loader2Icon,
  LogInIcon,
  PencilIcon,
  Trash2Icon,
  UserRoundIcon,
} from "lucide-react";
import { toast } from "sonner";
import { FadeIn } from "@/components/motion/fade-in";
import { useAuth } from "@/components/providers/auth-provider";
import { Container } from "@/components/site/container";
import { EmptyState } from "@/components/site/empty-state";
import { ErrorState } from "@/components/site/error-state";
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
import { Spinner } from "@/components/ui/spinner";
import {
  ApiError,
  borrowBook,
  deleteBook,
  errorMessage,
  getBook,
} from "@/lib/api";
import { coverFor, coverForCategory } from "@/lib/covers";
import { formatDate } from "@/lib/format";
import type { Book } from "@/lib/types";
import { cn } from "cn";

export function BookDetails({ id }: { id: string }) {
  const router = useRouter();
  const { user, token } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");
  const [errorStatus, setErrorStatus] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [borrowing, setBorrowing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    getBook(id, token, controller.signal)
      .then((result) => {
        setBook(result);
        setStatus("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setMessage(errorMessage(error));
        setErrorStatus(error instanceof ApiError ? error.status : 0);
        setStatus("error");
      });
    return () => controller.abort();
  }, [id, token, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  const isOwner =
    Boolean(user?.email) &&
    book?.addedBy?.email?.toLowerCase() === user?.email?.toLowerCase();

  const available = book?.availableCopies ?? 0;
  const total = book?.totalCopies ?? available;

  const handleBorrow = async () => {
    if (!book) return;
    if (!user) {
      toast.error("Sign in to borrow this book", {
        description: "A library card keeps track of what's on your shelf.",
      });
      router.push(`/login?redirect=${encodeURIComponent(`/books/${id}`)}`);
      return;
    }
    setBorrowing(true);
    try {
      await borrowBook(book._id, token);
      setBook((current) =>
        current
          ? {
              ...current,
              availableCopies: Math.max(0, current.availableCopies - 1),
            }
          : current,
      );
      toast.success(`You borrowed “${book.title}”`, {
        description: "It's waiting for you in My Borrows.",
        action: {
          label: "View borrows",
          onClick: () => router.push("/my-borrows"),
        },
      });
    } catch (error) {
      toast.error("Couldn't borrow this book", {
        description: errorMessage(error),
      });
    } finally {
      setBorrowing(false);
    }
  };

  const handleDelete = async () => {
    if (!book) return;
    setDeleting(true);
    try {
      await deleteBook(book._id, token);
      toast.success("Book removed from the shelves", {
        description: `“${book.title}” is no longer listed.`,
      });
      setDeleteOpen(false);
      router.push("/manage-books");
    } catch (error) {
      toast.error("Couldn't remove this book", {
        description: errorMessage(error),
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Container className="space-y-8 py-8 sm:py-12">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
        >
          <ArrowLeftIcon className="size-4" />
          All books
        </Link>
        <span className="text-border">/</span>
        <span className="truncate text-foreground">
          {book?.title ?? "Book details"}
        </span>
      </nav>

      {status === "loading" ? <DetailsSkeleton /> : null}

      {status === "error" && errorStatus === 401 ? (
        <EmptyState
          icon={LogInIcon}
          title="Sign in to open this book"
          description="Book details live behind the library desk. Sign in and we'll bring you straight back to this page."
          action={
            <Button
              render={
                <Link href={`/login?redirect=${encodeURIComponent(`/books/${id}`)}`} />
              }
            >
              <LogInIcon />
              Sign in
            </Button>
          }
        />
      ) : null}

      {status === "error" && errorStatus !== 401 ? (
        <ErrorState
          title="This book is hiding between the stacks"
          description={message}
          onRetry={retry}
        />
      ) : null}

      {status === "ready" && !book ? (
        <EmptyState
          title="We couldn't find this book"
          description="The record may have been moved or removed from the catalogue."
          action={
            <Button render={<Link href="/books" />}>
              <ArrowLeftIcon />
              Back to all books
            </Button>
          }
        />
      ) : null}

      {status === "ready" && book ? (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <FadeIn>
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-5 rounded-[2.5rem] bg-primary/5 blur-2xl"
              />
              <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-4 shadow-soft sm:p-5">
                <div className="relative overflow-hidden rounded-2xl bg-secondary">
                  <span
                    className="book-spine absolute inset-y-0 left-0 z-10 w-2"
                    aria-hidden
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverFor(book)}
                    alt={`Cover of ${book.title}`}
                    className="aspect-[2/3] w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = coverForCategory(book.category);
                    }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 px-1 pb-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <LibraryIcon className="size-3.5" />
                    {total} {total === 1 ? "copy" : "copies"} in the collection
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
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
                    {available > 0 ? `${available} available` : "All copies out"}
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08} className="space-y-7">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold tracking-wide text-accent">
                  {book.category || "Others"}
                </span>
                {isOwner ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                    <CheckCircle2Icon className="size-3.5" />
                    Added by you
                  </span>
                ) : null}
              </div>

              <h1 className="font-serif text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {book.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                by <span className="font-medium text-foreground">{book.author || "Unknown author"}</span>
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-card">
              <h2 className="mb-2 font-serif text-lg font-semibold text-foreground">
                About this book
              </h2>
              <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                {book.description || "The borrower who added this book hasn't written a description yet."}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/80 bg-card p-4">
                <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  <UserRoundIcon className="size-3.5 text-accent" />
                  Shared by
                </p>
                <p className="text-sm font-medium text-foreground">
                  {book.addedBy?.name || "A BookNook neighbour"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {book.addedBy?.email || "Contact the library desk"}
                </p>
              </div>
              <div className="rounded-2xl border border-border/80 bg-card p-4">
                <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  <CalendarDaysIcon className="size-3.5 text-accent" />
                  On the shelf since
                </p>
                <p className="text-sm font-medium text-foreground">
                  {formatDate(book.createdAt)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {available > 0 ? "Ready to be borrowed" : "Returns expected soon"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center">
              <Button
                size="lg"
                onClick={handleBorrow}
                disabled={borrowing || available <= 0}
                className="sm:min-w-44"
              >
                {borrowing ? <Spinner /> : <BookOpenIcon />}
                {available <= 0 ? "All copies borrowed" : borrowing ? "Borrowing…" : "Borrow this book"}
              </Button>
              {isOwner ? (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    render={<Link href={`/books/${book._id}/edit`} />}
                  >
                    <PencilIcon />
                    Edit book
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2Icon />
                    Remove
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="lg" render={<Link href="/books" />}>
                  Keep browsing
                  <ArrowRightIcon />
                </Button>
              )}
            </div>

            {available <= 0 ? (
              <p className="inline-flex items-start gap-2 rounded-xl bg-secondary/70 px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
                <CircleAlertIcon className="mt-0.5 size-4 shrink-0 text-accent" />
                Every copy is currently with a reader. Check back soon, or ask the
                library desk to reserve the next return.
              </p>
            ) : null}
          </FadeIn>
        </div>
      ) : null}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove “{book?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This takes the book off the shared shelves for everyone. You can add it
              again later if you change your mind.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Keep it listed</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2Icon className="animate-spin" /> : <Trash2Icon />}
              {deleting ? "Removing…" : "Remove book"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  );
}

function DetailsSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
      <div className="rounded-3xl border border-border/80 bg-card p-5">
        <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-12 w-4/5" />
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-11 w-44 rounded-full" />
          <Skeleton className="h-11 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}
