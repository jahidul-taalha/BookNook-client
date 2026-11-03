import type { Metadata } from "next";
import { BookForm } from "@/components/books/book-form";
import { FadeIn } from "@/components/motion/fade-in";
import { Container } from "@/components/site/container";
import { PageHeader } from "@/components/site/page-header";
import { ProtectedRoute } from "@/components/site/protected-route";

export const metadata: Metadata = {
  title: "BookNook | Add Book",
  description:
    "Share a book with the BookNook shelves. Add the title, author, cover, and a short note for the next reader.",
};

export default function AddBookPage() {
  return (
    <ProtectedRoute label="Opening the add-book desk…">
      <Container className="space-y-8 py-10 sm:py-14">
        <FadeIn>
          <PageHeader
            eyebrow="Share a story"
            title="Add a Book"
            description="Give a finished book a new reader. Add the details below and we'll find it a spot on the shelves."
          />
        </FadeIn>
        <BookForm mode="create" />
      </Container>
    </ProtectedRoute>
  );
}
