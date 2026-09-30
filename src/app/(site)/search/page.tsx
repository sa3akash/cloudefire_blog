import { getPublishedPosts } from "@/lib/services/posts";
import { PostCard } from "@/components/blog/post-card";
import { PaginationBar } from "@/components/blog/pagination-bar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Search Articles | CloudBlog",
  description:
    "Search technical articles, architecture teardowns, and engineering guides on CloudBlog. Find content on Cloudflare Workers, Next.js, D1 database, and edge computing.",
  path: "/search",
  noIndex: true,
});

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolved = await searchParams;
  const query = resolved.q?.trim() || "";
  const page = parseInt(resolved.page || "1", 10);

  const results = query
    ? await getPublishedPosts({
      search: query,
      page,
      limit: 9,
    })
    : { posts: [], total: 0, page: 1, totalPages: 0 };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10" >
      {/* Search Header */ }
      < div className = "max-w-2xl mx-auto text-center space-y-4" >
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
          Search CloudBlog
        </h1>
        <p className="text-sm text-muted-foreground">
          Find topics across systems architecture, serverless performance, and Cloudflare Workers.
        </p>

  {/* Search Form */ }
  <form action="/search" method="GET" className="relative flex items-center gap-2 pt-2">
    <div className="relative flex-1">
      <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        name="q"
        defaultValue={query}
        placeholder="Search by keywords, title, or topic..."
        className="pl-10 h-11 text-sm shadow-xs"
        autoFocus
      />
    </div>
    <Button type="submit" className="h-11 px-5 text-sm gap-1.5 font-medium">
      <span>Search</span>
    </Button>
  </form>
      </div >

    {/* Query Stats */ }
  {
    query && (
      <div className="border-b border-border/60 pb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Found <strong className="text-foreground">{results.total}</strong> results for &ldquo;{query}&rdquo;
        </span>
        <span className="text-xs font-mono">SQLite Indexed Search</span>
      </div>
    )
  }

  {/* Results Grid */ }
  {
    query && results.posts.length === 0 ? (
      <div className="text-center py-20 border border-dashed border-border rounded-xl space-y-3">
        <h3 className="font-semibold text-base font-heading">No results matched your search</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Try searching for broader keywords like &ldquo;Cloudflare&rdquo;, &ldquo;D1&rdquo;, &ldquo;Next.js&rdquo;, or &ldquo;Performance&rdquo;.
        </p>
      </div>
    ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
  }

  {/* Pagination */ }
  {
    query && (
      <PaginationBar
        currentPage={results.page}
        totalPages={results.totalPages}
        basePath="/search"
        searchParams={{ q: query }}
      />
    )
  }
    </div >
  );
}
