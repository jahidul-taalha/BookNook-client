import type { Metadata } from "next";
import { ManageBooksView } from "@/components/books/manage-books-view";
import { ProtectedRoute } from "@/components/site/protected-route";

export const metadata: Metadata = {
  title: "BookNook | Manage Books",
  description:
    "Edit or remove the books you've shared with the BookNook shelves.",
};

export default function ManageBooksPage() {
  return (
    <ProtectedRoute label="Fetching your shelf…">
      <ManageBooksView />
    </ProtectedRoute>
  );
}
