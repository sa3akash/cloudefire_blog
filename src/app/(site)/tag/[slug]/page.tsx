import { notFound } from "next/navigation";
import { getTagBySlug } from "@/lib/services/tags";
import { getPublishedPosts } from "@/lib/services/posts";
import { PostCard } from "@/components/blog/post-card";
import { PaginationBar } from "@/components/blog/pagination-bar";
import type { Metadata } from "next";
import { Tag as TagIcon } from "lucide-react";

interface TagPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const resolved = await params;
  const tag = await getTagBySlug(resolved.slug);
  if (!tag) return { title: "Tag Not Found | CloudBlog" };

  return {
    title: `#${tag.name} Articles | CloudBlog`,
    description: `Browse articles tagged with #${tag.name} on CloudBlog`,
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const tag = await getTagBySlug(resolvedParams.slug);

  if (!tag) {
    notFound();
  }

  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const postsData = await getPublishedPosts({
    tagSlug: tag.slug,
    page,
    limit: 9,
  });

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      <div className="space-y-3 border-b border-border/60 pb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary font-mono">
          <TagIcon className="w-3.5 h-3.5" />
          <span>Tag</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight font-mono">
          #{tag.name}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          All articles and publications tagged under #{tag.name}.
        </p>
      </div>

      {postsData.posts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl text-muted-foreground">
          No articles found for this tag yet.
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
        basePath={`/tag/${tag.slug}`}
      />
    </div>
  );
}
