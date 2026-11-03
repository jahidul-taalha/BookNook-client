"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookMarkedIcon,
  BookPlusIcon,
  ChevronDownIcon,
  LibraryBigIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  ShieldCheckIcon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { BrandMark } from "@/components/site/brand-mark";
import { Container } from "@/components/site/container";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { initials } from "@/lib/format";
import { cn } from "cn";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
] as const;

const MEMBER_LINKS = [
  { href: "/my-borrows", label: "My Borrows", icon: BookMarkedIcon },
  { href: "/my-books", label: "My Books", icon: ShieldCheckIcon },
] as const;

export function Navbar() {
  const pathname = usePathname() || "/";
  const { user, isLoading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const confirmSignOut = () => {
    signOut();
    setLogoutOpen(false);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-20">
        <div className="flex items-center gap-6 lg:gap-9">
          <BrandMark />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {PUBLIC_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
            {user
              ? MEMBER_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                      isActive(link.href)
                        ? "bg-secondary text-primary"
                        : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                    )}
                  >
                    <link.icon className="size-4" />
                    {link.label}
                  </Link>
                ))
              : null}
          </nav>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          {isLoading ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <>
              <Button
                render={<Link href="/add-book" />}
                className="hidden xl:inline-flex"
              >
                <BookPlusIcon />
                Add a book
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      className="h-11 gap-2 rounded-full pr-3 pl-1.5"
                      aria-label="Open account menu"
                    />
                  }
                >
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {initials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-32 truncate text-sm font-medium lg:inline">
                    {user.name}
                  </span>
                  <ChevronDownIcon className="size-4 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="space-y-0.5 py-2">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </span>
                    <span className="block truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href="/profile" />}>
                    <UserIcon />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/add-book" />}>
                    <BookPlusIcon />
                    Add a book
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/my-borrows" />}>
                    <BookMarkedIcon />
                    My borrows
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/my-books" />}>
                    <ShieldCheckIcon />
                    My books
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setLogoutOpen(true)}
                  >
                    <LogOutIcon />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" render={<Link href="/login" />}>
                <LogInIcon />
                Sign in
              </Button>
              <Button render={<Link href="/register" />}>
                <UserPlusIcon />
                Join BookNook
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="rounded-full"
                />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm p-0">
              <SheetHeader className="border-b border-border/70 p-5">
                <SheetTitle>
                  <BrandMark />
                </SheetTitle>
                <SheetDescription>
                  Your cosy corner for borrowing and sharing books.
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
                {PUBLIC_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium",
                      isActive(link.href)
                        ? "bg-secondary text-primary"
                        : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                    )}
                  >
                    <LibraryBigIcon className="size-4" />
                    {link.label}
                  </Link>
                ))}
                {user
                  ? MEMBER_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        aria-current={isActive(link.href) ? "page" : undefined}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium",
                          isActive(link.href)
                            ? "bg-secondary text-primary"
                            : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                        )}
                      >
                        <link.icon className="size-4" />
                        {link.label}
                      </Link>
                    ))
                  : null}

                <div className="mt-4 space-y-2">
                  {user ? (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 transition-colors hover:border-primary/30 hover:bg-secondary/40"
                      >
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {initials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{user.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                        <UserIcon className="size-4 shrink-0 text-muted-foreground" />
                      </Link>
                      <Button
                        className="w-full"
                        render={<Link href="/add-book" />}
                        onClick={() => setMobileOpen(false)}
                      >
                        <BookPlusIcon />
                        Add a book
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setMobileOpen(false);
                          setLogoutOpen(true);
                        }}
                      >
                        <LogOutIcon />
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        render={<Link href="/login" />}
                        onClick={() => setMobileOpen(false)}
                      >
                        <LogInIcon />
                        Sign in
                      </Button>
                      <Button
                        className="w-full"
                        render={<Link href="/register" />}
                        onClick={() => setMobileOpen(false)}
                      >
                        <UserPlusIcon />
                        Join BookNook
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
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
    </header>
  );
}
