import type { Metadata } from "next";
import { MyBooksView } from "@/components/books/my-books-view";
import { ProtectedRoute } from "@/components/site/protected-route";

export const metadata: Metadata = {
  title: "BookNook | My Books",
  description:
    "Edit or remove the books you've shared with the BookNook shelves.",
};

export default function MyBooksPage() {
  return (
    <ProtectedRoute label="Fetching your shelf…">
      <MyBooksView />
    </ProtectedRoute>
  );
}
