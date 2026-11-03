"use client";

import { useEffect } from "react";
import Link from "next/link";
import { HomeIcon, RotateCcwIcon, TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    toast.error("A page ran into a problem", {
      description: "The library is still here — try the page again in a moment.",
    });
  }, [error]);

  return (
    <Container className="py-16 sm:py-24">
      <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-border bg-card/70 px-6 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <TriangleAlertIcon className="size-6" />
        </div>
        <div className="max-w-md space-y-2">
          <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
            A shelf wobbled over
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Something unexpected interrupted this page. Nothing was lost, and the
            rest of BookNook is still open.
          </p>
          {error.digest ? (
            <p className="text-xs text-muted-foreground">
              Reference: <span className="font-mono">{error.digest}</span>
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => reset()}>
            <RotateCcwIcon />
            Try again
          </Button>
          <Button variant="outline" render={<Link href="/" />}>
            <HomeIcon />
            Back home
          </Button>
        </div>
      </div>
    </Container>
  );
}
