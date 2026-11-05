"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpenIcon,
  CheckCircle2Icon,
  ImagePlusIcon,
  LinkIcon,
  Loader2Icon,
  SparklesIcon,
  UploadCloudIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createBook, errorMessage, updateBook } from "@/lib/api";
import { coverForCategory, isDirectImageUrl } from "@/lib/covers";
import {
  BOOK_CATEGORIES,
  type Book,
  type BookCategory,
  type BookInput,
} from "@/lib/types";
import { cn } from "cn";

interface BookFormProps {
  mode: "create" | "edit";
  book?: Book;
}

export function BookForm({ mode, book }: BookFormProps) {
  const router = useRouter();
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [category, setCategory] = useState<BookCategory>(
    (book?.category as BookCategory) ?? "Fiction",
  );
  const [description, setDescription] = useState(book?.description ?? "");
  const storedImage = mode === "edit" ? book?.image ?? "" : "";
  const [image, setImage] = useState(
    isDirectImageUrl(storedImage) ? storedImage.trim() : "",
  );
  const [imageError, setImageError] = useState("");
  const [totalCopies, setTotalCopies] = useState(
    String(book?.totalCopies ?? 1),
  );
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const preview = isDirectImageUrl(image)
    ? image.trim()
    : coverForCategory(category);

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setCategory("Fiction");
    setDescription("");
    setImage("");
    setImageError("");
    setTotalCopies("1");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("That file doesn't look like an image", {
        description: "Choose a JPG, PNG, WEBP, or GIF file for the cover.",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("That cover is a little too large", {
        description: "Please choose an image smaller than 5 MB.",
      });
      return;
    }

    const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!key) {
      toast.error("Cover uploads aren't connected yet", {
        description: "Paste an image URL below instead, or add NEXT_PUBLIC_IMGBB_API_KEY.",
      });
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("image", file);
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`,
        { method: "POST", body },
      );
      const payload = (await response.json()) as {
        data?: { url?: string; display_url?: string };
        error?: { message?: string };
      };
      const url = payload.data?.display_url || payload.data?.url;
      if (!response.ok || !url) {
        throw new Error(payload.error?.message || "The image host rejected the upload.");
      }
      setImage(url);
      setImageError("");
      toast.success("Cover uploaded", {
        description: "Your book is looking good on the shelf.",
      });
    } catch (error) {
      toast.error("Couldn't upload that cover", {
        description: errorMessage(error),
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();
    const trimmedDescription = description.trim();
    const copies = Number(totalCopies);

    if (trimmedTitle.length < 2) {
      toast.error("Give the book a title", {
        description: "Even a working title helps neighbours find it on the shelf.",
      });
      return;
    }
    if (trimmedAuthor.length < 2) {
      toast.error("Who wrote it?", {
        description: "Add the author's name so the catalogue stays tidy.",
      });
      return;
    }
    if (trimmedDescription.length < 20) {
      toast.error("Tell readers a little more", {
        description: "A sentence or two about the book helps the next borrower decide.",
      });
      return;
    }
    if (!Number.isInteger(copies) || copies < 1 || copies > 999) {
      toast.error("Check the number of copies", {
        description: "Choose a whole number between 1 and 999.",
      });
      return;
    }
    const trimmedImage = image.trim();
    if (trimmedImage && !isDirectImageUrl(trimmedImage)) {
      setImageError(
        "That link is a page, not an image. Paste a direct image link ending in .jpg, .png or .webp (for example from images.unsplash.com or i.ibb.co), or use Upload cover.",
      );
      return;
    }
    if (!token) {
      toast.error("Your session has ended", {
        description: "Please sign in again before saving this book.",
      });
      return;
    }

    const payload: BookInput = {
      title: trimmedTitle,
      author: trimmedAuthor,
      category,
      image: trimmedImage,
      description: trimmedDescription,
      totalCopies: copies,
    };

    setSubmitting(true);
    try {
      if (mode === "edit" && book) {
        await updateBook(book._id, payload, token);
        toast.success("Book updated", {
          description: "Your changes are now on the shelf.",
        });
        router.push(`/books/${book._id}`);
      } else {
        const created = await createBook(payload, token);
        toast.success("Book added to the shelves", {
          description: `“${trimmedTitle}” is ready for its first borrower.`,
        });
        resetForm();
        router.push(created?._id ? `/books/${created._id}` : "/my-books");
      }
    } catch (error) {
      toast.error(
        mode === "edit" ? "Couldn't update this book" : "Couldn't add this book",
        { description: errorMessage(error) },
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-10">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-border/80 bg-card p-5 shadow-card sm:p-7"
      >
        <div className="space-y-2">
          <Label htmlFor="title">
            Book title <span className="text-accent">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="The Night Circus"
            className="h-11 rounded-xl"
            maxLength={140}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="author">
              Author <span className="text-accent">*</span>
            </Label>
            <Input
              id="author"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              placeholder="Erin Morgenstern"
              className="h-11 rounded-xl"
              maxLength={120}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Shelf</Label>
            <Select
              items={BOOK_CATEGORIES.map((value) => ({ value, label: value }))}
              value={category}
              onValueChange={(value) => setCategory(value as BookCategory)}
            >
              <SelectTrigger
                id="category"
                className="h-11 w-full rounded-xl bg-background px-3"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BOOK_CATEGORIES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            A few words about the book <span className="text-accent">*</span>
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is it about, and who might love it? A short, honest note is perfect."
            className="min-h-32 rounded-xl"
            maxLength={1200}
          />
          <p className="text-xs text-muted-foreground">
            {description.trim().length}/1200 characters
          </p>
        </div>

        <div className="space-y-3">
          <Label htmlFor="image">Cover image</Label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <LinkIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="image"
                value={image}
                onChange={(event) => {
                  setImage(event.target.value);
                  if (imageError) setImageError("");
                }}
                placeholder="https://example.com/cover.jpg"
                className="h-11 rounded-xl pr-3 pl-10"
                aria-invalid={imageError ? true : undefined}
                aria-describedby={imageError ? "image-error" : undefined}
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleUpload(file);
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="h-11"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? <Loader2Icon className="animate-spin" /> : <UploadCloudIcon />}
              {uploading ? "Uploading…" : "Upload cover"}
            </Button>
          </div>
          {imageError ? (
            <p id="image-error" role="alert" className="text-xs font-medium text-destructive">
              {imageError}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Paste a direct image link (one ending in .jpg, .png or .webp, such as
            images.unsplash.com or i.ibb.co) or upload a file — page links like
            unsplash.com/photos/… won’t work. Leave it blank and we’ll use a shelf
            illustration for the category.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="copies">Copies available to lend</Label>
            <Input
              id="copies"
              type="number"
              min={1}
              max={999}
              value={totalCopies}
              onChange={(event) => setTotalCopies(event.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="flex items-end">
            <p className="rounded-xl bg-secondary/60 px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
              <SparklesIcon className="mr-1 inline size-3.5 text-accent" />
              Start with the number of physical copies you can actually lend.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border/70 pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            render={
              <Link href={mode === "edit" && book ? `/books/${book._id}` : "/books"} />
            }
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting || uploading} className="sm:min-w-44">
            {submitting ? <Loader2Icon className="animate-spin" /> : <CheckCircle2Icon />}
            {submitting
              ? "Saving…"
              : mode === "edit"
                ? "Save changes"
                : "Add to the shelves"}
          </Button>
        </div>
      </form>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-card">
          <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
            Cover preview
          </p>
          <div className="relative mx-auto max-w-64 overflow-hidden rounded-2xl bg-secondary shadow-soft">
            <span className="book-spine absolute inset-y-0 left-0 z-10 w-2" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt={title ? `Cover preview for ${title}` : "Book cover preview"}
              className="aspect-[2/3] w-full object-cover"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = coverForCategory(category);
              }}
            />
          </div>
          <div className="mt-4 space-y-1 text-center">
            <p className="line-clamp-2 font-serif text-lg font-semibold text-foreground">
              {title.trim() || "Your book title"}
            </p>
            <p className="text-sm text-muted-foreground">
              {author.trim() || "Author name"}
            </p>
            <span
              className={cn(
                "mt-2 inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground",
              )}
            >
              {category}
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-border/80 bg-secondary/50 p-5">
          <h2 className="mb-2 inline-flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
            <BookOpenIcon className="size-4 text-primary" />
            A good shelf note
          </h2>
          <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-2">
              <ImagePlusIcon className="mt-0.5 size-4 shrink-0 text-accent" />
              Use a clear cover image so the card looks good in the grid.
            </li>
            <li className="flex gap-2">
              <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-accent" />
              Mention the mood or the reader who would enjoy it.
            </li>
            <li className="flex gap-2">
              <SparklesIcon className="mt-0.5 size-4 shrink-0 text-accent" />
              Keep it honest and short; two or three sentences is plenty.
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
