import type { Metadata } from "next";
import { EditBookView } from "@/components/books/edit-book-view";
import { ProtectedRoute } from "@/components/site/protected-route";

export const instant = false;

export const metadata: Metadata = {
  title: "BookNook | Edit Book",
  description: "Update the details of a book you shared with the BookNook shelves.",
};

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <ProtectedRoute label="Opening the editing desk…">
      <EditBookView id={id} />
    </ProtectedRoute>
  );
}
