import { coverForCategory } from "@/lib/covers";

export interface CuratedBook {
  title: string;
  author: string;
  category: string;
  description: string;
  note: string;
}

export const heroSlides: CuratedBook[] = [
  {
    title: "The Night Circus",
    author: "Erin Morgenstern",
    category: "Fiction",
    description:
      "A duel between two young illusionists unfolds inside a magical circus that appears without warning and leaves every visitor changed.",
    note: "A dreamlike read for slow evenings",
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "History",
    description:
      "A sweeping account of how stories, trade, and imagination carried our species from small bands to a connected world.",
    note: "History that reads like a conversation",
  },
  {
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    category: "Kids",
    description:
      "A pilot, a small traveler, and a handful of gentle lessons about friendship, wonder, and what grown-ups tend to forget.",
    note: "Beloved by readers of every age",
  },
];

export const staffPicks: CuratedBook[] = [
  {
    title: "The Book Thief",
    author: "Markus Zusak",
    category: "Fiction",
    description:
      "A story about words, courage, and a girl who steals books in a difficult time.",
    note: "Our most-requested shelf favourite",
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    description:
      "Big questions about time, black holes, and the universe, explained with real clarity.",
    note: "For the endlessly curious",
  },
  {
    title: "The Silk Roads",
    author: "Peter Frankopan",
    category: "History",
    description:
      "A fresh look at world history told through the routes that connected east and west.",
    note: "History with a wider map",
  },
  {
    title: "Charlotte's Web",
    author: "E. B. White",
    category: "Kids",
    description:
      "A gentle farmyard friendship and a reminder that small voices can make a difference.",
    note: "Perfect for reading together",
  },
];

export const categoryCards = [
  {
    name: "Fiction",
    blurb: "Novels, short stories, and imagined worlds worth getting lost in.",
    image: coverForCategory("Fiction"),
  },
  {
    name: "Science",
    blurb: "Nature, space, medicine, and the questions that keep us looking up.",
    image: coverForCategory("Science"),
  },
  {
    name: "History",
    blurb: "People, places, and turning points that shaped the world we share.",
    image: coverForCategory("History"),
  },
  {
    name: "Kids",
    blurb: "Picture books and early reads for curious young borrowers.",
    image: coverForCategory("Kids"),
  },
  {
    name: "Others",
    blurb: "Memoir, poetry, cooking, travel, and everything between the shelves.",
    image: coverForCategory("Others"),
  },
];
