import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Category } from "@/lib/db";

interface BlogSearchBarProps {
  categories: (Category & { postCount: number })[];
  categorySlug?: string;
  tagSlug?: string;
  sort?: string;
  search?: string;
}

export function BlogSearchBar({
  categories,
  categorySlug,
  tagSlug,
  sort = "newest",
  search,
}: BlogSearchBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-xs">
        {/* Search input with live aesthetics */}
        <form action="/blog" method="GET" className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={search || ""}
            placeholder="Filter articles..."
            className="pl-9.5 pr-8 h-9.5 text-xs rounded-xl bg-background/80"
          />
          {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
          {tagSlug && <input type="hidden" name="tag" value={tagSlug} />}
          {sort && <input type="hidden" name="sort" value={sort} />}
        </form>

        {/* Topics Pills & Sort */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          <Link href="/blog">
            <Badge
              variant={!categorySlug && !tagSlug ? "default" : "outline"}
              className="text-xs cursor-pointer py-1 px-3 rounded-full transition-all"
            >
              All Topics
            </Badge>
          </Link>
          {categories.slice(0, 5).map((cat) => (
            <Link key={cat.id} href={`/blog?category=${cat.slug}`}>
              <Badge
                variant={categorySlug === cat.slug ? "default" : "outline"}
                className="text-xs cursor-pointer py-1 px-3 rounded-full transition-all gap-1"
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-70">({cat.postCount})</span>
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Active filters bar */}
      {(categorySlug || tagSlug || search) && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap px-1">
          <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono">Active filters:</span>
          {categorySlug && (
            <Badge variant="secondary" className="gap-1.5 py-0.5 px-2.5 rounded-full font-mono text-[11px]">
              <span>category: {categorySlug}</span>
              <Link href="/blog" className="hover:text-foreground">
                <X className="w-3 h-3" />
              </Link>
            </Badge>
          )}
          {tagSlug && (
            <Badge variant="secondary" className="gap-1.5 py-0.5 px-2.5 rounded-full font-mono text-[11px]">
              <span>tag: #{tagSlug}</span>
              <Link href="/blog" className="hover:text-foreground">
                <X className="w-3 h-3" />
              </Link>
            </Badge>
          )}
          {search && (
            <Badge variant="secondary" className="gap-1.5 py-0.5 px-2.5 rounded-full font-mono text-[11px]">
              <span>query: &ldquo;{search}&rdquo;</span>
              <Link href="/blog" className="hover:text-foreground">
                <X className="w-3 h-3" />
              </Link>
            </Badge>
          )}
          <Link href="/blog" className="text-xs font-semibold text-primary hover:underline ml-1">
            Reset all
          </Link>
        </div>
      )}
    </div>
  );
}
