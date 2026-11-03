import type { Metadata } from "next";
import { MyBorrowsView } from "@/components/books/my-borrows-view";
import { ProtectedRoute } from "@/components/site/protected-route";

export const metadata: Metadata = {
  title: "BookNook | My Borrows",
  description:
    "See the books you've borrowed from BookNook and return them when you're finished.",
};

export default function MyBorrowsPage() {
  return (
    <ProtectedRoute label="Opening your borrows…">
      <MyBorrowsView />
    </ProtectedRoute>
  );
}
