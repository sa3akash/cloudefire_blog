import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
  sort,
  search,
}: BlogSearchBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-border/80 bg-card/60">
        <form action="/blog" method="GET" className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={search || ""}
            placeholder="Search articles..."
            className="pl-9 h-9 text-xs"
          />
          {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
          {tagSlug && <input type="hidden" name="tag" value={tagSlug} />}
          {sort && <input type="hidden" name="sort" value={sort} />}
        </form>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          <Link href="/blog">
            <Badge
              variant={!categorySlug && !tagSlug ? "default" : "outline"}
              className="text-xs cursor-pointer"
            >
              All Topics
            </Badge>
          </Link>
          {categories.slice(0, 4).map((cat) => (
            <Link key={cat.id} href={`/blog?category=${cat.slug}`}>
              <Badge
                variant={categorySlug === cat.slug ? "default" : "outline"}
                className="text-xs cursor-pointer"
              >
                {cat.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {(categorySlug || tagSlug || search) && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <span>Active filters:</span>
          {categorySlug && (
            <Badge variant="secondary" className="gap-1">
              Category: {categorySlug}
              <Link href="/blog" className="ml-1 hover:text-foreground">
                &times;
              </Link>
            </Badge>
          )}
          {tagSlug && (
            <Badge variant="secondary" className="gap-1">
              Tag: #{tagSlug}
              <Link href="/blog" className="ml-1 hover:text-foreground">
                &times;
              </Link>
            </Badge>
          )}
          {search && (
            <Badge variant="secondary" className="gap-1">
              Search: &ldquo;{search}&rdquo;
              <Link href="/blog" className="ml-1 hover:text-foreground">
                &times;
              </Link>
            </Badge>
          )}
          <Link href="/blog" className="text-xs text-primary hover:underline ml-2">
            Reset all
          </Link>
        </div>
      )}
    </div>
  );
}
