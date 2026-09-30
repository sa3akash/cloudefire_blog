import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import {
  getPostBySlug,
  getRelatedPosts,
  getAdjacentPosts,
  incrementPostView,
} from "@/lib/services/posts";
import { getApprovedCommentsForPost } from "@/lib/services/comments";
import { getSetting } from "@/lib/services/settings";
import { renderMarkdown, extractHeadings } from "@/lib/markdown";
import {
  buildArticleMetadata,
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  getBaseUrl,
} from "@/lib/seo";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ShareButtons } from "@/components/blog/share-buttons";
import { CommentsSection } from "@/components/blog/comments-section";
import { ArticleHeader } from "@/components/blog/article-header";
import { ArticleNavigation } from "@/components/blog/article-navigation";
import { ArticleTags } from "@/components/blog/article-tags";
import { RelatedPosts } from "@/components/blog/related-posts";
import { Skeleton } from "@/components/ui/skeleton";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const resolved = await params;
  const post = await getPostBySlug(resolved.slug);
  if (!post) return { title: "Post Not Found | CloudBlog" };

  return buildArticleMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    slug: post.slug,
    coverImage: post.coverImage,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    authorName: post.author.name,
    authorUrl: post.author.slug,
    categoryName: post.category?.name,
    canonicalUrl: post.canonicalUrl,
  });
}

// ─── Streamed sections ──────────────────────────────────────────────────────

async function RelatedPostsSection({
  postId,
  categoryId,
}: {
  postId: string;
  categoryId: string | null;
}) {
  const relatedPosts = await getRelatedPosts(postId, categoryId, 3);
  return <RelatedPosts posts={relatedPosts} />;
}

async function CommentsSectionLoader({
  postId,
  allowComments,
}: {
  postId: string;
  allowComments: boolean;
}) {
  if (!allowComments) return null;
  const comments = await getApprovedCommentsForPost(postId);
  return <CommentsSection postId={postId} initialComments={comments} />;
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolved = await params;

  // Fetch post and critical data in parallel
  const [post, allowCommentsSetting] = await Promise.all([
    getPostBySlug(resolved.slug),
    getSetting("allowComments", "true"),
  ]);

  if (!post) notFound();

  // Fire-and-forget view counter
  try {
    const headerList = await headers();
    const ip = headerList.get("cf-connecting-ip") || headerList.get("x-forwarded-for") || "anonymous";
    const userAgent = headerList.get("user-agent") || "unknown";
    const visitorHash = btoa(`${ip}:${userAgent.slice(0, 30)}`).slice(0, 32);
    incrementPostView(post.id, visitorHash).catch(() => {});
  } catch {
    // Edge case if headers not available
  }

  // Critical content — needed before streaming
  const [renderedContent, adjacent] = await Promise.all([
    renderMarkdown(post.content),
    getAdjacentPosts(post.publishedAt),
  ]);
  const headings = extractHeadings(post.content);

  const jsonLd = generateArticleJsonLd({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    coverImage: post.coverImage,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    authorName: post.author.name,
    authorUrl: post.author.slug,
    categoryName: post.category?.name,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    ...(post.category ? [{ name: post.category.name, url: `/category/${post.category.slug}` }] : []),
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  const fullUrl = `${getBaseUrl()}/blog/${post.slug}`;
  const allowComments = allowCommentsSetting === "true";

  return (
    <article className="container mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />

      <ArticleHeader
        title={post.title}
        excerpt={post.excerpt}
        category={post.category}
        author={post.author}
        publishedAt={post.publishedAt}
        readingTime={post.readingTime}
        coverImage={post.coverImage}
      />

      <div className={`grid grid-cols-1 ${headings.length > 0 ? "lg:grid-cols-12" : "max-w-3xl mx-auto"} gap-10`}>
        <div className={`${headings.length > 0 ? "lg:col-span-8" : "w-full"} space-y-10 min-w-0`}>
          {headings.length > 0 && (
            <div className="lg:hidden">
              <TableOfContents headings={headings} />
            </div>
          )}
          <div className="prose-article" dangerouslySetInnerHTML={{ __html: renderedContent }} />
          <ArticleTags tags={post.tags} />
          <div className="lg:hidden py-4 border-t border-border/80">
            <ShareButtons title={post.title} url={fullUrl} />
          </div>
          <ArticleNavigation author={post.author} adjacent={adjacent} />

          {/* Comments streamed separately for fast TTFB */}
          <Suspense
            fallback={
              <div className="space-y-4 pt-4 animate-pulse">
                <Skeleton className="h-6 w-40 rounded" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            }
          >
            <CommentsSectionLoader postId={post.id} allowComments={allowComments} />
          </Suspense>
        </div>

        {headings.length > 0 && (
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <TableOfContents headings={headings} />
              <ShareButtons title={post.title} url={fullUrl} />
            </div>
          </aside>
        )}
      </div>

      {/* Related posts streamed separately */}
      <Suspense
        fallback={
          <div className="space-y-4 animate-pulse">
            <Skeleton className="h-7 w-44 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        }
      >
        <RelatedPostsSection postId={post.id} categoryId={post.categoryId} />
      </Suspense>
    </article>
  );
}
