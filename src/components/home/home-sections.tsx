import Link from "next/link";
import {
  ArrowRightIcon,
  BookHeartIcon,
  BookPlusIcon,
  HandHeartIcon,
  QuoteIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { categoryCards, staffPicks } from "@/lib/curated-books";

const steps = [
  {
    number: "01",
    title: "Find your next read",
    description:
      "Browse by shelf, search by title or author, and peek at how many copies are waiting.",
    icon: SearchIcon,
  },
  {
    number: "02",
    title: "Borrow with a click",
    description:
      "Sign in, reserve a copy, and it moves to your borrowed list with the date you picked it up.",
    icon: BookHeartIcon,
  },
  {
    number: "03",
    title: "Return and pass it on",
    description:
      "When you're finished, return the book so the next neighbour can take it home.",
    icon: HandHeartIcon,
  },
];

export function HomeSections() {
  return (
    <>
      <section className="border-y border-border/60 bg-secondary/35 py-16 sm:py-20">
        <Container className="space-y-8">
          <FadeIn>
            <SectionHeading
              eyebrow="Choose a shelf"
              title="There's a corner for every kind of reader"
              description="Five shelves, one shared collection. Start with what you love and wander from there."
            />
          </FadeIn>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categoryCards.map((category, index) => (
              <FadeIn key={category.name} delay={index * 0.05}>
                <Link
                  href={`/books?category=${encodeURIComponent(category.name)}`}
                  className="group relative flex h-full min-h-56 flex-col justify-end overflow-hidden rounded-2xl border border-border/80 bg-card p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.image}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c14]/90 via-[#0d1c14]/45 to-[#0d1c14]/10" />
                  <div className="relative space-y-2 text-white">
                    <h3 className="font-serif text-xl font-semibold">
                      {category.name}
                    </h3>
                    <p className="line-clamp-3 text-xs leading-relaxed text-white/75">
                      {category.blurb}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-white">
                      Explore
                      <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="space-y-10">
          <FadeIn>
            <SectionHeading
              align="center"
              eyebrow="How BookNook works"
              title="Three small steps, one good book"
              description="No queues, no late fees. Just a simple loop that keeps stories moving."
            />
          </FadeIn>

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <FadeIn key={step.number} delay={index * 0.08}>
                <div className="relative h-full overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-card">
                  <span className="absolute top-5 right-5 font-serif text-5xl font-semibold text-secondary">
                    {step.number}
                  </span>
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                    <step.icon className="size-5" />
                  </div>
                  <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 bg-secondary/35 py-16 sm:py-20">
        <Container className="space-y-8">
          <FadeIn>
            <SectionHeading
              eyebrow="Picked by the people who shelve"
              title="Staff picks for a slow afternoon"
              description="A few favourites our volunteer librarians keep pressing into borrowers' hands."
              action={
                <Button variant="outline" render={<Link href="/books" />}>
                  See the whole catalogue
                  <ArrowRightIcon />
                </Button>
              }
            />
          </FadeIn>

          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {staffPicks.map((book, index) => (
              <FadeIn key={book.title} delay={index * 0.05}>
                <Link
                  href={`/books?search=${encodeURIComponent(book.title)}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
                >
                  <div className="relative aspect-[2/3] overflow-hidden bg-secondary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={book.image}
                      alt={`Cover of ${book.title}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                      {book.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-1 p-4">
                    <h3 className="line-clamp-2 font-serif text-lg leading-snug font-semibold text-card-foreground">
                      {book.title}
                    </h3>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      by {book.author}
                    </p>
                    <p className="mt-auto pt-3 text-xs leading-relaxed text-muted-foreground">
                      {book.note}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <FadeIn>
            <figure className="mx-auto max-w-3xl space-y-5 text-center">
              <QuoteIcon className="mx-auto size-8 text-accent" />
              <blockquote className="font-serif text-2xl leading-snug font-medium text-foreground sm:text-3xl">
                “I came in for one mystery and left with three neighbours who now
                trade books with me every month. That's the whole point.”
              </blockquote>
              <figcaption className="text-sm font-medium text-muted-foreground">
                Mira Patel — borrower, shelf volunteer, and chronic re-reader
              </figcaption>
            </figure>
          </FadeIn>
        </Container>
      </section>

      <section className="pb-4 sm:pb-8">
        <Container>
          <FadeIn>
            <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-primary-foreground shadow-soft sm:px-10 sm:py-14 lg:px-14">
              <div
                aria-hidden
                className="absolute -top-16 -right-10 size-56 rounded-full bg-accent/20 blur-2xl"
              />
              <div
                aria-hidden
                className="absolute -bottom-20 -left-6 size-56 rounded-full bg-white/10 blur-3xl"
              />
              <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl space-y-3">
                  <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase">
                    <SparklesIcon className="size-3.5 text-accent" />
                    Keep the shelves growing
                  </p>
                  <h2 className="font-serif text-3xl leading-tight font-semibold sm:text-4xl">
                    Your shelf has room for one more story.
                  </h2>
                  <p className="text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                    Add a book you've finished, borrow something you've been curious
                    about, and help a small library feel a little more alive.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
                  <Button
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    render={<Link href="/add-book" />}
                  >
                    <BookPlusIcon />
                    Add a book
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    render={<Link href="/books" />}
                  >
                    Find a borrow
                  </Button>
                </div>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
