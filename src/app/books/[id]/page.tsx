import type { Metadata } from "next";
import { BookDetails } from "@/components/books/book-details";
import { getBook } from "@/lib/api";

export const instant = false;

type BookPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const book = await getBook(id);
    if (book?.title) {
      return {
        title: `BookNook | ${book.title}`,
        description: book.description?.slice(0, 155) || undefined,
      };
    }
  } catch {
    return { title: "BookNook | Book Details" };
  }
  return { title: "BookNook | Book Details" };
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;
  return <BookDetails id={id} />;
}
