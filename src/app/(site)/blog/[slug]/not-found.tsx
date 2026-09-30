import Link from "next/link";
import { BookOpen, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArticleNotFound() {
  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-20 text-center space-y-6">
      {/* Glow effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden -z-10"
      >
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="w-20 h-20 rounded-2xl bg-muted border border-border/80 flex items-center justify-center mx-auto">
        <BookOpen className="w-9 h-9 text-muted-foreground" />
      </div>

      <div className="space-y-3 max-w-md mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-xs font-semibold text-destructive font-mono">
          HTTP 404 · Article Not Found
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
          Article Not Found
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This article may have been removed, unpublished, or the URL may be
          incorrect. Explore our latest publications below.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button size="sm" className="gap-2 h-10 px-5 font-medium">
          <Link href="/blog">
            <ArrowLeft className="w-4 h-4" />
            <span>All Articles</span>
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 h-10 px-5 font-medium"
        >
          <Link href="/search">
            <Search className="w-4 h-4" />
            <span>Search</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
