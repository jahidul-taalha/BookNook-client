export const BOOK_CATEGORIES = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number];

export interface BookOwner {
  name: string;
  email: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: BookCategory | string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  addedBy?: BookOwner | null;
  createdAt?: string;
}

export interface BookInput {
  title: string;
  author: string;
  category: BookCategory;
  image: string;
  description: string;
  totalCopies: number;
}

export interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userName: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string | null;
}

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
