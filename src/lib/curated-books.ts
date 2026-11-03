import { coverForCategory } from "@/lib/covers";

export interface CuratedBook {
  title: string;
  author: string;
  category: string;
  description: string;
  image: string;
  note: string;
}

export const heroSlides: CuratedBook[] = [
  {
    title: "The Night Circus",
    author: "Erin Morgenstern",
    category: "Fiction",
    description:
      "A duel between two young illusionists unfolds inside a magical circus that appears without warning and leaves every visitor changed.",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1000&q=80",
    note: "A dreamlike read for slow evenings",
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "History",
    description:
      "A sweeping account of how stories, trade, and imagination carried our species from small bands to a connected world.",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1000&q=80",
    note: "History that reads like a conversation",
  },
  {
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    category: "Kids",
    description:
      "A pilot, a small traveler, and a handful of gentle lessons about friendship, wonder, and what grown-ups tend to forget.",
    image:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1000&q=80",
    note: "Beloved by readers of every age",
  },
];

export const staffPicks: CuratedBook[] = [
  {
    title: "The Book Thief",
    author: "Markus Zusak",
    category: "Fiction",
    description: "A story about words, courage, and a girl who steals books in a difficult time.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    note: "Our most-requested shelf favourite",
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    description: "Big questions about time, black holes, and the universe, explained with real clarity.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80",
    note: "For the endlessly curious",
  },
  {
    title: "The Silk Roads",
    author: "Peter Frankopan",
    category: "History",
    description: "A fresh look at world history told through the routes that connected east and west.",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80",
    note: "History with a wider map",
  },
  {
    title: "Charlotte's Web",
    author: "E. B. White",
    category: "Kids",
    description: "A gentle farmyard friendship and a reminder that small voices can make a difference.",
    image:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80",
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
