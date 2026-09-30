import Link from "next/link";
import type { Metadata } from "next";
import { Home, ArrowLeft, Search, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "404 — Page Not Found | CloudBlog",
  description: "The page you're looking for doesn't exist or has been moved.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      {/* Glowing blob background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
      >
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* 404 number */}
      <div className="relative mb-6 select-none">
        <span
          className="text-[9rem] sm:text-[12rem] font-black font-heading tracking-tighter leading-none text-transparent bg-clip-text"
          style={{
            backgroundImage:
              "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.3) 100%)",
          }}
          aria-hidden="true"
        >
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-24 h-24 rounded-full border-2 border-primary/20 flex items-center justify-center bg-card/80 backdrop-blur-sm shadow-xl">
            <BookOpen className="w-10 h-10 text-primary/60" />
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-3 mb-10 max-w-lg">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          The article, author, or page you&apos;re looking for doesn&apos;t
          exist or may have been moved. Try browsing our latest publications.
        </p>
      </div>

      {/* Error code badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-xs font-semibold text-destructive font-mono mb-8">
        <span>HTTP 404 · Resource Not Found</span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="sm" className="gap-2 h-10 px-5 font-medium">
          <Link href="/">
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-2 h-10 px-5 font-medium"
        >
          <Link href="/blog">
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Articles</span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="gap-2 h-10 px-5 font-medium"
        >
          <Link href="/search">
            <Search className="w-4 h-4" />
            <span>Search</span>
          </Link>
        </Button>
      </div>

      {/* Quick links */}
      <div className="mt-14 pt-8 border-t border-border/50 w-full max-w-sm">
        <p className="text-xs text-muted-foreground mb-4 font-mono uppercase tracking-wider">
          Quick navigation
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            { label: "Articles", href: "/blog" },
            { label: "Search", href: "/search" },
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
