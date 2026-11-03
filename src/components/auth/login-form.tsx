"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockKeyholeIcon,
  LogInIcon,
  MailIcon,
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

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, signIn } = useAuth();
  const redirect = safeRedirect(searchParams.get("redirect"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(redirect);
    }
  }, [isLoading, user, router, redirect]);

  if (isLoading || user) {
    return <FullPageLoader label="Checking your library card…" />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const result = await signIn({ email, password });
    if (!result.ok) {
      setSubmitting(false);
      toast.error("We couldn't sign you in", { description: result.error });
      return;
    }
    toast.success("Welcome back to BookNook", {
      description: "Your borrowed books are right where you left them.",
    });
    router.replace(redirect);
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your library card"
      description="Pick up where you left off: check your borrows, add a book, or find something new for the weekend."
      footer={
        <p>
          New to the nook?{" "}
          <Link
            href={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Create a library card
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <span className="text-xs text-muted-foreground">
              6 characters or more
            </span>
          </div>
          <div className="relative">
            <LockKeyholeIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              className="h-11 rounded-xl pr-11 pl-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? <Loader2Icon className="animate-spin" /> : <LogInIcon />}
          {submitting ? "Signing in…" : "Sign in"}
        </Button>

        <p className="rounded-xl bg-secondary/60 px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
          This is the frontend preview, so any valid email and a password of six or
          more characters will open a demo library card on this device.
        </p>
      </form>
    </AuthShell>
  );
}
