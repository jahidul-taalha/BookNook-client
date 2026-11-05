import Link from "next/link";
import { ArrowLeftIcon, QuoteIcon, SparklesIcon } from "lucide-react";
import { Container } from "@/components/site/container";

const spines = [
  "bg-accent/80",
  "bg-primary-foreground/25",
  "bg-primary-foreground/40",
  "bg-accent/45",
  "bg-primary-foreground/20",
  "bg-primary-foreground/35",
];

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[1.02fr_0.98fr]">
      <aside className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex">
        <div
          aria-hidden
          className="absolute -top-24 -right-16 size-72 rounded-full bg-accent/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-10 size-72 rounded-full bg-primary-foreground/10 blur-3xl"
        />

        <Container className="relative flex flex-1 flex-col justify-between gap-10 py-10 xl:py-14">
          <Link
            href="/"
            className="relative inline-flex items-center gap-2.5 text-primary-foreground"
          >
            <span className="relative flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15">
              <BookSpineIcon />
              <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-accent ring-2 ring-primary" />
            </span>
            <span className="font-serif text-xl font-semibold tracking-tight">
              Book<span className="text-accent">Nook</span>
            </span>
          </Link>

          <div className="relative max-w-md space-y-6">
            <QuoteIcon className="size-8 text-accent" />
            <blockquote className="font-serif text-3xl leading-snug font-medium xl:text-4xl">
              “A library is not a luxury but one of the necessities of life.”
            </blockquote>
            <p className="text-sm text-primary-foreground/70">
              Henry Ward Beecher
            </p>
            <div className="flex items-end gap-1.5 pt-6" aria-hidden>
              {spines.map((className, index) => (
                <span
                  key={index}
                  className={`rounded-sm ${className}`}
                  style={{
                    height: `${44 + ((index * 17) % 46)}px`,
                    width: `${10 + (index % 3) * 3}px`,
                  }}
                />
              ))}
              <span className="ml-2 text-xs text-primary-foreground/60">
                Every shelf has room for one more.
              </span>
            </div>
          </div>

          <p className="relative inline-flex items-center gap-2 text-xs text-primary-foreground/60">
            <SparklesIcon className="size-3.5 text-accent" />
            A small library run by neighbours, for neighbours.
          </p>
        </Container>
      </aside>

      <section className="flex flex-col">
        <div className="hidden py-4 lg:flex lg:pt-8">
          <Container className="flex items-center justify-between">
            <Link
              href="/"
              className="ml-auto inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeftIcon className="size-4" />
              Back to the library
            </Link>
          </Container>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <Container className="py-10">
            <div className="mx-auto w-full max-w-md space-y-7">
              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-[0.24em] text-accent uppercase">
                  {eyebrow}
                </p>
                <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {title}
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
              {children}
              {footer ? (
                <div className="border-t border-border/70 pt-5 text-sm text-muted-foreground">
                  {footer}
                </div>
              ) : null}
            </div>
          </Container>
        </div>
      </section>
    </div>
  );
}

function BookSpineIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden
    >
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v18H6.5A2.5 2.5 0 0 1 4 18.5z" />
      <path d="M4 17.5h15" />
      <path d="M8 7h6" />
    </svg>
  );
}
