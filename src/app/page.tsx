import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/home/hero";
import { HomeSections } from "@/components/home/home-sections";
import { NewArrivals } from "@/components/home/new-arrivals";

export const metadata: Metadata = {
  title: "BookNook | Home",
};

function HeroFallback() {
  return (
    <div className="border-b border-border/60 bg-background">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-20">
        <div className="space-y-6">
          <div className="h-6 w-52 animate-pulse rounded-full bg-muted" />
          <div className="h-28 w-full animate-pulse rounded-2xl bg-muted" />
          <div className="h-14 w-4/5 animate-pulse rounded-xl bg-muted" />
          <div className="h-11 w-48 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="h-80 animate-pulse rounded-[2rem] bg-muted" />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<HeroFallback />}>
        <Hero />
      </Suspense>
      <NewArrivals />
      <HomeSections />
    </>
  );
}
