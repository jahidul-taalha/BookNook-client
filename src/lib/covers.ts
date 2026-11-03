const CATEGORY_COVERS: Record<string, string> = {
  Fiction:
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80",
  Science:
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
  History:
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80",
  Kids: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80",
  Others:
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80",
};

export const DEFAULT_COVER = CATEGORY_COVERS.Others;

export function coverForCategory(category?: string | null) {
  return (category && CATEGORY_COVERS[category]) || DEFAULT_COVER;
}

export function coverFor(book: { image?: string | null; category?: string | null }) {
  return book.image?.trim() || coverForCategory(book.category);
}
