import Link from "next/link";
import { ArrowLeftIcon, BookOpenIcon, CompassIcon } from "lucide-react";
import { Container } from "@/components/site/container";
import { EmptyState } from "@/components/site/empty-state";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="py-16 sm:py-24">
      <EmptyState
        icon={CompassIcon}
        title="This page wandered off the shelf"
        description="We've checked the catalogue and the returns cart, but this address doesn't lead to a book. Let's get you back to a familiar aisle."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button render={<Link href="/" />}>
              <ArrowLeftIcon />
              Back home
            </Button>
            <Button variant="outline" render={<Link href="/books" />}>
              <BookOpenIcon />
              Browse the shelves
            </Button>
          </div>
        }
      />
    </Container>
  );
}
