"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import {
  ArrowRightIcon,
  BookOpenIcon,
  QuoteIcon,
  SparklesIcon,
} from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";
import { heroSlides } from "@/lib/curated-books";

const stats = [
  { value: "2,400+", label: "books on the shelves" },
  { value: "780", label: "neighbours reading" },
  { value: "5", label: "shelves to explore" },
];

export function Hero() {
  return (
    <section className="hero-grain relative overflow-hidden border-b border-border/60">
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 hidden w-1/3 bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--secondary)_65%,transparent))] lg:block"
      />
      <Container className="relative grid gap-12 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16 lg:py-20">
        <FadeIn className="space-y-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-primary shadow-sm backdrop-blur-sm">
            <SparklesIcon className="size-3.5 text-accent" />
            A neighbourhood library, online
          </span>

          <div className="space-y-5">
            <h1 className="font-serif text-4xl leading-[1.05] font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Find a book.
              <br />
              <span className="text-primary">Borrow it.</span>{" "}
              <span className="text-accent">Pass it on.</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              BookNook is a small shared library for curious neighbours. Add a book
              you love, borrow something new, and return it when you're ready to let
              the next reader in.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" render={<Link href="/books" />}>
              <BookOpenIcon />
              Browse the shelves
              <ArrowRightIcon />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/add-book" />}
            >
              Share a book
            </Button>
          </div>

          <dl className="grid max-w-lg grid-cols-3 gap-4 border-t border-border/70 pt-6">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-serif text-2xl font-semibold text-primary sm:text-3xl">
                  {stat.value}
                </dd>
                <p className="text-xs leading-snug text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>
        </FadeIn>

        <FadeIn delay={0.15} y={24} className="relative">
          <div
            aria-hidden
            className="absolute -inset-6 rounded-[2.5rem] bg-primary/5 blur-2xl"
          />
          <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-card p-4 shadow-soft sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">
                On the nightstand
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                <span className="size-1.5 rounded-full bg-accent" />
                Staff picks
              </span>
            </div>

            <Swiper
              modules={[Autoplay, EffectFade, Pagination]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              loop
              autoplay={{ delay: 4800, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              className="hero-swiper !pb-9"
            >
              {heroSlides.map((slide) => (
                <SwiperSlide key={slide.title}>
                  <div className="grid gap-5 sm:grid-cols-[0.72fr_1.28fr] sm:items-center">
                    <div className="relative mx-auto w-full max-w-40 sm:max-w-none">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.image}
                        alt={`Cover of ${slide.title}`}
                        className="cover-shadow w-full rounded-xl object-cover"
                        style={{ aspectRatio: "2 / 3" }}
                      />
                    </div>
                    <div className="space-y-3">
                      <span className="inline-flex rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-accent">
                        {slide.category}
                      </span>
                      <h2 className="font-serif text-2xl leading-tight font-semibold text-foreground">
                        {slide.title}
                      </h2>
                      <p className="text-sm font-medium text-muted-foreground">
                        {slide.author}
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {slide.description}
                      </p>
                      <p className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
                        <QuoteIcon className="size-3.5 text-accent" />
                        {slide.note}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
