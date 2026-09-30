import { getPublishedPosts } from "@/lib/services/posts";
import { getAllCategories } from "@/lib/services/categories";
import { PostCard } from "@/components/blog/post-card";
import { PaginationBar } from "@/components/blog/pagination-bar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Articles | CloudBlog",
  description: "Browse all articles, technical guides, and architectural breakdowns on CloudBlog.",
};

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    tag?: string;
    sort?: "newest" | "oldest" | "popular";
    q?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const categorySlug = resolvedParams.category;
  const tagSlug = resolvedParams.tag;
  const sort = resolvedParams.sort || "newest";
  const search = resolvedParams.q;

  const [postsData, categoriesList] = await Promise.all([
    getPublishedPosts({
      page,
      limit: 9,
      categorySlug,
      tagSlug,
      sort,
      search,
    }),
    getAllCategories(),
  ]);

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
          Articles & Publications
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
          Deep technical insights, systems architecture, and tutorials optimized for edge computing.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-border/80 bg-card/60">
        {/* Search Input */}
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

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          <Link href="/blog">
            <Badge
              variant={!categorySlug && !tagSlug ? "default" : "outline"}
              className="text-xs cursor-pointer"
            >
              All Topics
            </Badge>
          </Link>
          {categoriesList.slice(0, 4).map((cat) => (
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

      {/* Active Filter Indicators */}
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

      {/* Articles Grid */}
      {postsData.posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl space-y-3">
          <BookOpen className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
          <h3 className="font-semibold text-base font-heading">No articles found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search criteria or topic filters to find what you are looking for.
          </p>
          <Link href="/blog">
            <Button variant="outline" size="sm" className="mt-2 text-xs">
              Clear filters
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsData.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <PaginationBar
        currentPage={postsData.page}
        totalPages={postsData.totalPages}
        basePath="/blog"
        searchParams={{
          category: categorySlug,
          tag: tagSlug,
          sort,
          q: search,
        }}
      />
    </div>
  );
}
