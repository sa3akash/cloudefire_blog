import { getPublishedPosts } from "@/lib/services/posts";
import { getAllCategories } from "@/lib/services/categories";
import { PostCard } from "@/components/blog/post-card";
import { PaginationBar } from "@/components/blog/pagination-bar";
import { BlogSearchBar } from "@/components/blog/blog-search-bar";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  buildPageMetadata,
  generateBreadcrumbJsonLd,
  generateCollectionJsonLd,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "All Articles | CloudBlog",
  description:
    "Browse all articles, technical guides, and architectural breakdowns on Next.js, Cloudflare Workers, edge computing, and modern full-stack engineering.",
  path: "/blog",
});

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

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ]);

  const collectionJsonLd = generateCollectionJsonLd({
    name: "All Articles & Publications",
    description: "Deep technical insights, systems architecture, and edge engineering tutorials.",
    url: "/blog",
    count: postsData.total,
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: collectionJsonLd }} />

      <div className="space-y-3 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
          Articles &amp; Publications
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
          Deep technical insights, systems architecture, and tutorials optimized for edge computing.
        </p>
      </div>

      <BlogSearchBar
        categories={categoriesList}
        categorySlug={categorySlug}
        tagSlug={tagSlug}
        sort={sort}
        search={search}
      />

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
