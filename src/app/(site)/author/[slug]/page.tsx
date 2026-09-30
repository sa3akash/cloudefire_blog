import { notFound } from "next/navigation";
import { getDb, authors } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getPublishedPosts } from "@/lib/services/posts";
import { PostCard } from "@/components/blog/post-card";
import { PaginationBar } from "@/components/blog/pagination-bar";
import { AuthorProfileCard } from "@/components/blog/author-profile-card";
import type { Metadata } from "next";
import {
  buildPageMetadata,
  generateBreadcrumbJsonLd,
  generatePersonJsonLd,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

interface AuthorPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const resolved = await params;
  const db = getDb();
  const authorRes = await db
    .select()
    .from(authors)
    .where(eq(authors.slug, resolved.slug))
    .limit(1);

  if (authorRes.length === 0) return { title: "Author Not Found | CloudBlog" };
  const author = authorRes[0];

  return buildPageMetadata({
    title: `${author.name} | CloudBlog Author`,
    description:
      author.bio ||
      `Read technical articles and engineering guides written by ${author.name} on CloudBlog.`,
    path: `/author/${author.slug}`,
    image: author.avatarUrl || undefined,
  });
}

export default async function AuthorPage({
  params,
  searchParams,
}: AuthorPageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const db = getDb();

  const authorRes = await db
    .select()
    .from(authors)
    .where(eq(authors.slug, resolvedParams.slug))
    .limit(1);

  if (authorRes.length === 0) {
    notFound();
  }

  const author = authorRes[0];
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const postsData = await getPublishedPosts({
    authorSlug: author.slug,
    page,
    limit: 9,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Authors", url: "/blog" },
    { name: author.name, url: `/author/${author.slug}` },
  ]);

  const personJsonLd = generatePersonJsonLd({
    name: author.name,
    slug: author.slug,
    bio: author.bio,
    avatarUrl: author.avatarUrl,
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd }} />

      <AuthorProfileCard author={author} />

      {/* Author Publications */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-heading tracking-tight">
          Articles by {author.name} ({postsData.total})
        </h2>

        {postsData.posts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl text-muted-foreground">
            No articles published by this author yet.
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
          basePath={`/author/${author.slug}`}
        />
      </div>
    </div>
  );
}
