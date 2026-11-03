"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  BookMarkedIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  Loader2Icon,
  RotateCcwIcon,
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
import { errorMessage, getBorrows, returnBorrow } from "@/lib/api";
import { coverForCategory } from "@/lib/covers";
import { formatDate } from "@/lib/format";
import type { Borrow } from "@/lib/types";
import { cn } from "cn";

type View = "active" | "returned";

export function MyBorrowsView() {
  const { token } = useAuth();
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [view, setView] = useState<View>("active");
  const [pendingReturn, setPendingReturn] = useState<Borrow | null>(null);
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getBorrows(token, controller.signal)
      .then((result) => {
        setBorrows(result);
        setStatus("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setMessage(errorMessage(error));
        setStatus("error");
      });
    return () => controller.abort();
  }, [token, attempt]);

  const retry = useCallback(() => {
    setStatus("loading");
    setAttempt((value) => value + 1);
  }, []);

  const active = useMemo(
    () => borrows.filter((borrow) => !borrow.returnDate),
    [borrows],
  );
  const returned = useMemo(
    () => borrows.filter((borrow) => Boolean(borrow.returnDate)),
    [borrows],
  );
  const visible = view === "active" ? active : returned;

  const confirmReturn = async () => {
    if (!pendingReturn) return;
    setReturning(true);
    try {
      await returnBorrow(pendingReturn._id, token);
      setBorrows((current) =>
        current.map((borrow) =>
          borrow._id === pendingReturn._id
            ? { ...borrow, returnDate: new Date().toISOString() }
            : borrow,
        ),
      );
      toast.success(`“${pendingReturn.bookTitle}” is back on the shelf`, {
        description: "Thank you for passing it along to the next reader.",
      });
      setPendingReturn(null);
    } catch (error) {
      toast.error("Couldn't return this book", {
        description: errorMessage(error),
      });
    } finally {
      setReturning(false);
    }
  };

  return (
    <>
      <Container className="space-y-8 py-10 sm:py-14">
        <FadeIn>
          <PageHeader
            eyebrow="Your reading shelf"
            title="My Borrows"
            description="Every book you've taken home, with the dates to remember and a one-click return when you're finished."
            action={
              <Button render={<Link href="/books" />}>
                <BookOpenIcon />
                Find another book
              </Button>
            }
          />
        </FadeIn>

        {status === "ready" ? (
          <FadeIn delay={0.05}>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                icon={BookMarkedIcon}
                label="On loan"
                value={String(active.length)}
                hint="Books currently with you"
                tone="primary"
              />
              <StatCard
                icon={CheckCircle2Icon}
                label="Returned"
                value={String(returned.length)}
                hint="Books you've passed on"
                tone="accent"
              />
              <StatCard
                icon={CalendarDaysIcon}
                label="Total borrowed"
                value={String(borrows.length)}
                hint="All time on BookNook"
                tone="muted"
              />
            </div>
          </FadeIn>
        ) : null}

        <div className="inline-flex rounded-full border border-border/80 bg-card p-1">
          <button
            type="button"
            onClick={() => setView("active")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              view === "active"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            On loan
            <span className="ml-2 rounded-full bg-black/10 px-1.5 py-0.5 text-[11px]">
              {active.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setView("returned")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              view === "returned"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Returned
            <span className="ml-2 rounded-full bg-black/10 px-1.5 py-0.5 text-[11px]">
              {returned.length}
            </span>
          </button>
        </div>

        {status === "loading" ? <RowsSkeleton /> : null}

        {status === "error" ? (
          <ErrorState
            title="We couldn't open your borrows"
            description={message}
            onRetry={retry}
          />
        ) : null}

        {status === "ready" && borrows.length === 0 ? (
          <EmptyState
            icon={BookMarkedIcon}
            title="No borrows yet"
            description="When you borrow a book, it will appear here with its dates and a return button. Start with a browse through the catalogue."
            action={
              <Button render={<Link href="/books" />}>
                Browse the shelves
                <ArrowRightIcon />
              </Button>
            }
          />
        ) : null}

        {status === "ready" && borrows.length > 0 && visible.length === 0 ? (
          <EmptyState
            icon={view === "active" ? CheckCircle2Icon : BookMarkedIcon}
            title={
              view === "active"
                ? "Every book is back on the shelf"
                : "Nothing returned yet"
            }
            description={
              view === "active"
                ? "You're all caught up. Borrow something new whenever you're ready."
                : "Returned books will be collected here so you can remember what you've read."
            }
            action={
              view === "active" ? (
                <Button render={<Link href="/books" />}>
                  Browse the shelves
                  <ArrowRightIcon />
                </Button>
              ) : null
            }
          />
        ) : null}

        {status === "ready" && visible.length > 0 ? (
          <div className="space-y-3">
            {visible.map((borrow, index) => {
              const isReturned = Boolean(borrow.returnDate);
              return (
                <FadeIn key={borrow._id} delay={Math.min(index, 8) * 0.04}>
                  <article className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-card sm:flex-row sm:items-center">
                    <div className="relative shrink-0 overflow-hidden rounded-xl bg-secondary">
                      <span
                        className="book-spine absolute inset-y-0 left-0 z-10 w-1.5"
                        aria-hidden
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={borrow.bookImage || coverForCategory()}
                        alt={`Cover of ${borrow.bookTitle}`}
                        className="h-28 w-20 object-cover"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = coverForCategory();
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                          isReturned
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-accent/15 text-accent",
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            isReturned ? "bg-muted-foreground" : "bg-accent",
                          )}
                        />
                        {isReturned ? "Returned" : "On loan"}
                      </span>
                      <h2 className="truncate font-serif text-lg font-semibold text-foreground">
                        {borrow.bookTitle || "Untitled book"}
                      </h2>
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDaysIcon className="size-3.5 text-accent" />
                          Borrowed {formatDate(borrow.borrowDate)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <CheckCircle2Icon className="size-3.5 text-accent" />
                          {isReturned
                            ? `Returned ${formatDate(borrow.returnDate)}`
                            : "Not returned yet"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      {borrow.bookId ? (
                        <Button
                          variant="outline"
                          size="sm"
                          render={<Link href={`/books/${borrow.bookId}`} />}
                        >
                          View book
                        </Button>
                      ) : null}
                      {isReturned ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
                          <CheckCircle2Icon className="size-3.5" />
                          Back on the shelf
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setPendingReturn(borrow)}
                        >
                          <RotateCcwIcon />
                          Return book
                        </Button>
                      )}
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        ) : null}
      </Container>

      <AlertDialog
        open={Boolean(pendingReturn)}
        onOpenChange={(open) => {
          if (!open && !returning) setPendingReturn(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Return “{pendingReturn?.bookTitle}”?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This marks the book as returned and makes it available to the next
              reader. Make sure it’s back on the shelf first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={returning}>Not yet</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReturn} disabled={returning}>
              {returning ? <Loader2Icon className="animate-spin" /> : <RotateCcwIcon />}
              {returning ? "Returning…" : "Return book"}
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
  tone,
}: {
  icon: typeof BookMarkedIcon;
  label: string;
  value: string;
  hint: string;
  tone: "primary" | "accent" | "muted";
}) {
  const toneClass =
    tone === "primary"
      ? "bg-primary text-primary-foreground"
      : tone === "accent"
        ? "bg-accent/15 text-accent"
        : "bg-secondary text-primary";

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-card">
      <span className={cn("flex size-11 items-center justify-center rounded-xl", toneClass)}>
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
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      ))}
    </div>
  );
}
