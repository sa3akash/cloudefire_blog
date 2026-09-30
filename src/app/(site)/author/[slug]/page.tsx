import { notFound } from "next/navigation";
import Image from "next/image";
import { getDb, authors } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getPublishedPosts } from "@/lib/services/posts";
import { PostCard } from "@/components/blog/post-card";
import { PaginationBar } from "@/components/blog/pagination-bar";
import type { Metadata } from "next";
import { User } from "lucide-react";
import { buildPageMetadata, generateBreadcrumbJsonLd, getBaseUrl } from "@/lib/seo";

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
  const baseUrl = getBaseUrl();

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

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />

      {/* Author Profile Card */}
      <div className="p-8 sm:p-10 rounded-2xl border border-border/80 bg-card/60 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        {author.avatarUrl ? (
          <Image
            src={author.avatarUrl}
            alt={author.name}
            width={96}
            height={96}
            className="rounded-full object-cover ring-4 ring-border/80 shrink-0"
            priority
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl shrink-0">
            {author.name.charAt(0)}
          </div>
        )}

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary font-mono">
            <User className="w-3.5 h-3.5" />
            <span>Author Profile</span>
          </div>

          <h1 className="text-3xl font-extrabold font-heading tracking-tight">
            {author.name}
          </h1>

          {author.bio && (
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
              {author.bio}
            </p>
          )}
        </div>
      </div>

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
