import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/services/categories";
import { getPublishedPosts } from "@/lib/services/posts";
import { PostCard } from "@/components/blog/post-card";
import { PaginationBar } from "@/components/blog/pagination-bar";
import type { Metadata } from "next";
import { Folder } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const resolved = await params;
  const category = await getCategoryBySlug(resolved.slug);
  if (!category) return { title: "Category Not Found | CloudBlog" };

  return {
    title: `${category.name} Articles | CloudBlog`,
    description: category.description || `Browse articles in category ${category.name}`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const category = await getCategoryBySlug(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const postsData = await getPublishedPosts({
    categorySlug: category.slug,
    page,
    limit: 9,
  });

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      <div className="space-y-3 border-b border-border/60 pb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary font-mono">
          <Folder className="w-3.5 h-3.5" />
          <span>Category</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {postsData.posts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl text-muted-foreground">
          No articles found in this category yet.
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
        basePath={`/category/${category.slug}`}
      />
    </div>
  );
}
