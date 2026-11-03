<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# BookNook — Project Spec Summary

BookNook is a small online library frontend: add a book, borrow a book, return a book.

## Stack
- Next.js App Router (v16) + TypeScript + Tailwind CSS v4 + shadcn/ui (base-nova, `@base-ui/react` primitives)
- next-themes (light/dark), sonner (toasts), framer-motion (subtle motion), swiper (hero slider), lucide-react

## Design
- Warm cozy library palette. Light: cream background `#FAF6EE`, forest primary `#1F4D3A`, amber accent `#D98E04`. Dark: charcoal-green.
- Headings use Playfair Display, body uses Inter.
- Rounded cards, soft shadows, book-spine accents, equal-height cards, consistent button/heading styles.
- All pages fully responsive. No `alert`/`confirm`/`prompt`; use sonner + shadcn Dialog/AlertDialog.

## API contract
Base URL: `NEXT_PUBLIC_API_URL`. Every route except `GET /books` needs `Authorization: Bearer <jwt>`.

- `GET /books` — public; query `search`, `category`, `sort=newest|oldest|title`, `limit`
- `GET /books/:id`
- `POST /books`
- `PATCH /books/:id`
- `DELETE /books/:id`
- `POST /borrows` — body `{ bookId }`
- `GET /borrows` — current user's borrows
- `DELETE /borrows/:id` — return a book

Book: `{ _id, title, author, category, image, description, totalCopies, availableCopies, addedBy: { name, email }, createdAt }`
Borrow: `{ _id, bookId, bookTitle, bookImage, userName, userEmail, borrowDate, returnDate }`

The backend is not ready yet. Every request must fail gracefully with friendly empty/error states.

## Auth
Local demo auth provider stores a session token/user in localStorage and provides a loading state so private routes
never redirect until the session has finished loading. Replace with the real backend JWT when available.

## Routes
`/`, `/books`, `/books/[id]`, `/books/[id]/edit`, `/add-book`, `/my-books`, `/my-borrows`, `/profile`, `/login`, `/register`.
Page titles follow `BookNook | <Page>`.
