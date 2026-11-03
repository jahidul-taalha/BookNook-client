export function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function borrowDuration(value?: string | null) {
  if (!value) return "Just borrowed";
  const start = new Date(value);
  if (Number.isNaN(start.getTime())) return "Just borrowed";
  const days = Math.max(0, Math.floor((Date.now() - start.getTime()) / 86_400_000));
  if (days === 0) return "Borrowed today";
  if (days === 1) return "Borrowed 1 day ago";
  return `Borrowed ${days} days ago`;
}

export function initials(name?: string | null) {
  if (!name) return "BN";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function displayNameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "Reader";
  return local
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
    .trim();
}
