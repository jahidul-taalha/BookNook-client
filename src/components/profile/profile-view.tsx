"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  BookMarkedIcon,
  BookPlusIcon,
  IdCardIcon,
  LibraryIcon,
  LogOutIcon,
  MailIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { useAuth } from "@/components/providers/auth-provider";
import { Container } from "@/components/site/container";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { initials } from "@/lib/format";

export function ProfileView() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [signOutOpen, setSignOutOpen] = useState(false);

  if (!user) return null;

  const confirmSignOut = () => {
    signOut();
    setSignOutOpen(false);
    router.replace("/");
  };

  return (
    <>
      <Container className="space-y-8 py-10 sm:py-14">
        <FadeIn>
          <PageHeader
            eyebrow="Your library card"
            title="Profile"
            description="The account you use to borrow books, share favourites, and keep track of everything waiting on your shelf."
          />
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <FadeIn delay={0.05}>
            <section className="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-4">
                <Avatar size="lg" className="size-16">
                  <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h2 className="truncate font-serif text-2xl font-semibold text-foreground">
                    {user.name}
                  </h2>
                  <p className="truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>

              <dl className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 bg-secondary/40 p-4">
                  <dt className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    <MailIcon className="size-3.5 text-accent" />
                    Email
                  </dt>
                  <dd className="mt-1.5 truncate text-sm font-medium text-foreground">
                    {user.email}
                  </dd>
                </div>
                <div className="rounded-xl border border-border/60 bg-secondary/40 p-4">
                  <dt className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    <IdCardIcon className="size-3.5 text-accent" />
                    Reader ID
                  </dt>
                  <dd className="mt-1.5 truncate text-sm font-medium text-foreground">
                    {user.id}
                  </dd>
                </div>
                <div className="rounded-xl border border-border/60 bg-secondary/40 p-4 sm:col-span-2">
                  <dt className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    <ShieldCheckIcon className="size-3.5 text-accent" />
                    Session
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium text-foreground">
                    Demo library card stored on this device
                  </dd>
                </div>
              </dl>

              <Button
                variant="outline"
                className="mt-7"
                onClick={() => setSignOutOpen(true)}
              >
                <LogOutIcon />
                Sign out
              </Button>
            </section>
          </FadeIn>

          <FadeIn delay={0.1}>
            <section className="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-card sm:p-8">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                Your next stop
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Everything tied to your library card, in one place.
              </p>
              <div className="mt-5 space-y-3">
                <ProfileLink
                  href="/my-borrows"
                  icon={<BookMarkedIcon className="size-4" />}
                  title="My Borrows"
                  description="See what you have out and return a book."
                />
                <ProfileLink
                  href="/my-books"
                  icon={<LibraryIcon className="size-4" />}
                  title="My Books"
                  description="Edit or remove the books you have shared."
                />
                <ProfileLink
                  href="/add-book"
                  icon={<BookPlusIcon className="size-4" />}
                  title="Add a book"
                  description="Put another favourite on the shared shelves."
                />
              </div>
            </section>
          </FadeIn>
        </div>
      </Container>

      <AlertDialog open={signOutOpen} onOpenChange={setSignOutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave the reading room?</AlertDialogTitle>
            <AlertDialogDescription>
              You’ll be signed out on this device. Your books and borrows stay safely
              on the shelves.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay signed in</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSignOut}>
              <LogOutIcon />
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ProfileLink({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-border/60 bg-secondary/30 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-secondary/60 hover:shadow-card"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-primary shadow-sm">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">{title}</span>
        <span className="block text-xs leading-relaxed text-muted-foreground">
          {description}
        </span>
      </span>
      <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}
