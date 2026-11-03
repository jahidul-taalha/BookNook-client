import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BookNook | A cosy online library",
    template: "%s",
  },
  description:
    "BookNook is a small online library where neighbours add books, borrow favourites, and return them for the next reader.",
  keywords: [
    "online library",
    "book borrowing",
    "community books",
    "BookNook",
  ],
  openGraph: {
    title: "BookNook | A cosy online library",
    description:
      "Add a book, borrow a book, return a book. A warm online library for readers and neighbours.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only rounded-full focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-lg"
        >
          Skip to content
        </a>
        <AppProviders>
          <Navbar />
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
