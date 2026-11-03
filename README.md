# BookNook

A warm, community-run online library frontend. Neighbours can add books, borrow
them, and return them for the next reader.

## Features

- Browse and search the catalogue by title or author, filter by shelf, and sort by
  newest, oldest, or title.
- View book details, availability, and the neighbour who shared each copy.
- Add and edit books with a live cover preview and optional ImgBB image upload.
- Borrow a book, return it from **My Borrows**, and keep track of what is out.
- Manage the books you have shared with the library.
- Light and dark themes, responsive navigation, accessible focus states, and
  reduced-motion support.
- Friendly loading, empty, offline, 404, and error states — the UI never crashes
  when the API is unavailable.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS v4 and shadcn/ui on `@base-ui/react`
- next-themes, sonner, framer-motion, swiper, lucide-react
- Playfair Display for headings and Inter for body copy

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the BookNook API, for example `http://localhost:5000`. |
| `NEXT_PUBLIC_IMGBB_API_KEY` | Optional ImgBB key for uploading cover images. Direct image URLs work without it. |

The server-only values in `.env.example` (`BETTER_AUTH_SECRET`, `MONGODB_URI`,
`JWT_SECRET`, Google OAuth keys) are placeholders for the future backend and are
not used by the current demo frontend.

## Demo authentication

The API is not connected yet, so `AuthProvider` stores a local demo user and a
JWT-shaped token in `localStorage`. Any valid email and a password of six or more
characters creates a library card on this device. This keeps private routes,
navigation, and redirects testable before the real auth service exists.

Replace the provider's `signIn`/`signUp` methods with real Better Auth or API calls
when the backend is ready. `ProtectedRoute` already waits for the session to finish
loading before it redirects, so the same flow will work with a real session.

## Routes

| Route | Description |
| --- | --- |
| `/` | Hero, new arrivals, shelves, how it works, staff picks |
| `/books` | Searchable, filterable catalogue |
| `/books/[id]` | Book details, borrow action, and owner actions |
| `/books/[id]/edit` | Edit a book you shared |
| `/add-book` | Add a book with cover upload or URL |
| `/manage-books` | Dashboard for books you shared |
| `/my-borrows` | Active and returned borrows |
| `/login` | Sign in |
| `/register` | Create a library card |

Private routes show a loader while the demo session loads, then redirect to
`/login?redirect=...` when there is no signed-in reader.

## API contract

All requests go through `src/lib/api.ts`. `GET /books` is public; every other
request sends `Authorization: Bearer <token>`.

- `GET /books` with `search`, `category`, `sort`, `limit`
- `GET /books/:id`
- `POST /books`, `PATCH /books/:id`, `DELETE /books/:id`
- `POST /borrows` with `{ bookId }`
- `GET /borrows`
- `DELETE /borrows/:id`

Requests time out after 20 seconds and surface a friendly message. List responses
accept either a bare array or an object with `books`, `data`, `items`, or `results`.

## Scripts

```bash
npm run dev      # start the development server
npm run build    # production build and type check
npm run start    # serve the production build
npm run lint     # run ESLint
```

## Project structure

```
src/
  app/            routes, metadata, loading/error/not-found boundaries
  components/
    auth/         sign-in and registration forms plus split auth shell
    books/        cards, forms, catalogue, details, borrows, management views
    home/         hero, new arrivals, category, and information sections
    motion/       reduced-motion-aware reveal helpers
    providers/    theme, sonner, and demo auth providers
    site/         navbar, footer, containers, headings, and shared states
    ui/           shadcn/ui primitives
  lib/            API client, types, covers, curated data, and formatting helpers
```
