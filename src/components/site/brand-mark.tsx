import Link from "next/link";
import { BookOpenIcon } from "lucide-react";
import { cn } from "cn";

export function BrandMark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="BookNook home"
    >
      <span className="relative flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-3">
        <BookOpenIcon className="size-5" />
        <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-accent ring-2 ring-background" />
      </span>
      {!compact ? (
        <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
          Book<span className="text-accent">Nook</span>
        </span>
      ) : null}
    </Link>
  );
}
