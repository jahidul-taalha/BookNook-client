"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockKeyholeIcon,
  MailIcon,
  UserRoundIcon,
  UserPlusIcon,
} from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/auth-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { FullPageLoader } from "@/components/site/full-page-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function safeRedirect(value: string | null) {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/books";
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, signUp } = useAuth();
  const redirect = safeRedirect(searchParams.get("redirect"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(redirect);
    }
  }, [isLoading, user, router, redirect]);

  if (isLoading || user) {
    return <FullPageLoader label="Preparing your library card…" />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Those passwords don't match", {
        description: "Type the same password in both boxes and try again.",
      });
      return;
    }
    setSubmitting(true);
    const result = await signUp({ name, email, password });
    if (!result.ok) {
      setSubmitting(false);
      toast.error("We couldn't create your library card", {
        description: result.error,
      });
      return;
    }
    toast.success("Your library card is ready", {
      description: "Welcome to the nook. Let's find your first book.",
    });
    router.replace(redirect);
  };

  return (
    <AuthShell
      eyebrow="Join the nook"
      title="Create your library card"
      description="One small form, then you can borrow books, keep track of returns, and share a few favourites of your own."
      footer={
        <p>
          Already have a card?{" "}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Sign in instead
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Your name</Label>
          <div className="relative">
            <UserRoundIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Mira Patel"
              className="h-11 rounded-xl pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <MailIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="reader@booknook.example"
              className="h-11 rounded-xl pl-10"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <LockKeyholeIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="6+ characters"
                className="h-11 rounded-xl pr-10 pl-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <div className="relative">
              <LockKeyholeIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat it"
                className="h-11 rounded-xl pl-10"
              />
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? <Loader2Icon className="animate-spin" /> : <UserPlusIcon />}
          {submitting ? "Creating your card…" : "Create library card"}
        </Button>

        <p className="rounded-xl bg-secondary/60 px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
          Your demo card is stored on this device for now. When the BookNook API is
          connected, the same form will use a secure server session instead.
        </p>
      </form>
    </AuthShell>
  );
}
