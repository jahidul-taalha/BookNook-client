const CATEGORY_COVERS: Record<string, string> = {
  Fiction: "/covers/fiction.svg",
  Science: "/covers/science.svg",
  History: "/covers/history.svg",
  Kids: "/covers/kids.svg",
  Others: "/covers/others.svg",
};

export const DEFAULT_COVER = CATEGORY_COVERS.Others;

const DIRECT_IMAGE_HOSTS = new Set([
  "images.unsplash.com",
  "plus.unsplash.com",
  "i.ibb.co",
  "i.imgur.com",
  "images.pexels.com",
  "cdn.pixabay.com",
  "upload.wikimedia.org",
  "raw.githubusercontent.com",
  "lh3.googleusercontent.com",
]);

const IMAGE_EXTENSION = /\.(jpe?g|png|webp|gif|avif|svg|bmp)$/i;

export function isDirectImageUrl(value?: string | null): boolean {
  const raw = value?.trim();
  if (!raw) return false;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  if (IMAGE_EXTENSION.test(url.pathname)) return true;
  return DIRECT_IMAGE_HOSTS.has(url.hostname.toLowerCase());
}

export function coverForCategory(category?: string | null) {
  return (category && CATEGORY_COVERS[category]) || DEFAULT_COVER;
}

export function coverFor(book: { image?: string | null; category?: string | null }) {
  return isDirectImageUrl(book.image)
    ? book.image!.trim()
    : coverForCategory(book.category);
}
