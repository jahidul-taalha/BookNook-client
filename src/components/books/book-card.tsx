"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRightIcon, LibraryIcon } from "lucide-react";
import { coverFor, coverForCategory } from "@/lib/covers";
import type { Book } from "@/lib/types";
import { cn } from "cn";

interface BookCardProps {
  book: Book;
  index?: number;
  className?: string;
}

export function BookCard({ book, index = 0, className }: BookCardProps) {
  const available = Number.isFinite(book.availableCopies)
    ? book.availableCopies
    : 0;
  const total = Number.isFinite(book.totalCopies) ? book.totalCopies : available;

  return (
    <Link
      href={`/books/${book._id}`}
      className={cn("group block h-full rounded-2xl focus-visible:outline-none", className)}
      aria-label={`View ${book.title} by ${book.author}`}
    >
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.05 }}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-soft group-focus-visible:ring-3 group-focus-visible:ring-ring/40"
      >
        <span className="book-spine absolute inset-y-0 left-0 z-10 w-1.5" aria-hidden />
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-secondary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverFor(book)}
            alt={`Cover of ${book.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = coverForCategory(book.category);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
          <span className="absolute top-3 left-3 inline-flex rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-sm">
            {book.category || "Others"}
          </span>
          <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm",
                available > 0
                  ? "bg-white/90 text-primary"
                  : "bg-black/60 text-white/90",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  available > 0 ? "bg-primary" : "bg-white/70",
                )}
              />
              {available > 0 ? `${available} available` : "All copies out"}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-4 pl-5">
          <h3 className="line-clamp-2 font-serif text-lg leading-snug font-semibold text-card-foreground">
            {book.title}
          </h3>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            by {book.author || "Unknown author"}
          </p>
          <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/70 pt-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <LibraryIcon className="size-3.5" />
              {total} {total === 1 ? "copy" : "copies"}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-primary transition-transform group-hover:translate-x-0.5">
              View
              <ArrowUpRightIcon className="size-3.5" />
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
