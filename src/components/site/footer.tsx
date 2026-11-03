import Link from "next/link";
import {
  ClockIcon,
  MailIcon,
  MapPinIcon,
  SparklesIcon,
} from "lucide-react";
import { BrandMark } from "@/components/site/brand-mark";
import { Container } from "@/components/site/container";

const exploreLinks = [
  { href: "/books", label: "Browse the catalogue" },
  { href: "/books?category=Fiction", label: "Fiction shelf" },
  { href: "/books?category=Kids", label: "Books for young readers" },
  { href: "/add-book", label: "Share a book" },
];

const accountLinks = [
  { href: "/my-borrows", label: "My borrows" },
  { href: "/manage-books", label: "Manage my books" },
  { href: "/login", label: "Sign in" },
  { href: "/register", label: "Create a library card" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/70 bg-secondary/50">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="space-y-4">
            <BrandMark />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              A small online library for neighbours who love to read, share, and
              keep good books moving from hand to hand.
            </p>
            <p className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <SparklesIcon className="size-3.5 text-accent" />
              Borrowed with care since 2024
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-base font-semibold text-foreground">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-base font-semibold text-foreground">
              Your account
            </h3>
            <ul className="space-y-2.5">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-base font-semibold text-foreground">
              Visit the nook
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2.5">
                <MapPinIcon className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>
                  14 Willow Lane
                  <br />
                  Riverside, open to all
                </span>
              </li>
              <li className="flex gap-2.5">
                <ClockIcon className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>
                  Mon–Sat, 9:00–18:00
                  <br />
                  Sunday, 11:00–16:00
                </span>
              </li>
              <li className="flex gap-2.5">
                <MailIcon className="mt-0.5 size-4 shrink-0 text-accent" />
                <a
                  href="mailto:hello@booknook.example"
                  className="transition-colors hover:text-primary"
                >
                  hello@booknook.example
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 BookNook. Made for readers, by readers.</p>
          <p>Every book deserves another reader.</p>
        </div>
      </Container>
    </footer>
  );
}
