import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getPostBySlug,
  getRelatedPosts,
  getAdjacentPosts,
  incrementPostView,
} from "@/lib/services/posts";
import { getApprovedCommentsForPost } from "@/lib/services/comments";
import { getSetting } from "@/lib/services/settings";
import { renderMarkdown, extractHeadings } from "@/lib/markdown";
import { buildArticleMetadata, generateArticleJsonLd, getBaseUrl } from "@/lib/seo";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ShareButtons } from "@/components/blog/share-buttons";
import { CommentsSection } from "@/components/blog/comments-section";
import { PostCard } from "@/components/blog/post-card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, ChevronLeft, ChevronRight, User } from "lucide-react";
import { headers } from "next/headers";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const resolved = await params;
  const post = await getPostBySlug(resolved.slug);
  if (!post) {
    return { title: "Post Not Found | CloudBlog" };
  }

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

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolved = await params;
  const post = await getPostBySlug(resolved.slug);

  if (!post) {
    notFound();
  }

  // Trigger privacy-conscious view counting in the background
  try {
    const headerList = await headers();
    const ip = headerList.get("cf-connecting-ip") || headerList.get("x-forwarded-for") || "anonymous";
    const userAgent = headerList.get("user-agent") || "unknown";
    // Simple hash to avoid storing personal visitor IP in SQLite
    const visitorHash = btoa(`${ip}:${userAgent.slice(0, 30)}`).slice(0, 32);
    // Non-blocking fire-and-forget
    incrementPostView(post.id, visitorHash).catch(() => {});
  } catch {
    // Edge case if headers not available
  }

  // Parse markdown and fetch related entities in parallel
  const [renderedContent, headings, comments, relatedPosts, adjacent, allowCommentsSetting] =
    await Promise.all([
      renderMarkdown(post.content),
      Promise.resolve(extractHeadings(post.content)),
      getApprovedCommentsForPost(post.id),
      getRelatedPosts(post.id, post.categoryId, 3),
      getAdjacentPosts(post.publishedAt),
      getSetting("allowComments", "true"),
    ]);

  const jsonLd = generateArticleJsonLd({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    coverImage: post.coverImage,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    authorName: post.author.name,
    authorUrl: post.author.slug,
  });

  const formattedPublished = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const formattedUpdated =
    post.updatedAt && post.publishedAt && post.updatedAt.getTime() > post.publishedAt.getTime() + 86400000
      ? new Date(post.updatedAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : null;

  const articleUrl = `${getBaseUrl()}/blog/${post.slug}`;

  return (
    <>
      {/* Schema.org BlogPosting Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <article className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Article Header */}
        <header className="max-w-3xl mx-auto space-y-6 text-center sm:text-left mb-10">
          <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
            {post.category && (
              <Link href={`/category/${post.category.slug}`}>
                <Badge variant="outline" className="text-xs hover:bg-muted transition-colors">
                  {post.category.name}
                </Badge>
              </Link>
            )}
            <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.readingTime} min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-tight text-foreground">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-sans">
              {post.excerpt}
            </p>
          )}

          {/* Author and Date Strip */}
          <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href={`/author/${post.author.slug}`}
              className="flex items-center gap-3 group/auth"
            >
              {post.author.avatarUrl ? (
                <Image
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  width={42}
                  height={42}
                  className="rounded-full object-cover ring-2 ring-border/80"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {post.author.name.charAt(0)}
                </div>
              )}
              <div className="text-left">
                <div className="font-semibold text-sm text-foreground group-hover/auth:text-primary transition-colors">
                  {post.author.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  Author &amp; Systems Engineer
                </div>
              </div>
            </Link>

            <div className="text-right text-xs text-muted-foreground font-mono space-y-0.5">
              {formattedPublished && (
                <div className="flex items-center gap-1 justify-center sm:justify-end">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Published {formattedPublished}</span>
                </div>
              )}
              {formattedUpdated && (
                <div className="text-[11px] opacity-75">
                  Updated {formattedUpdated}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        {post.coverImage && (
          <div className="max-w-4xl mx-auto mb-12 relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/80 shadow-sm bg-muted">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content Layout: Main Prose + Sticky TOC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto">
          {/* Main Article Body */}
          <div className="lg:col-span-8 space-y-8">
            <div
              className="prose-article"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />

            {/* Tags Strip */}
            {post.tags.length > 0 && (
              <div className="pt-6 border-t border-border/60 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground font-mono">Tags:</span>
                {post.tags.map((tag) => (
                  <Link key={tag.id} href={`/tag/${tag.slug}`}>
                    <Badge variant="secondary" className="text-xs font-mono">
                      #{tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Share Buttons */}
            <div className="py-4 border-y border-border/60">
              <ShareButtons title={post.title} url={articleUrl} />
            </div>

            {/* Author Bio Box */}
            <div className="p-6 rounded-2xl border border-border/80 bg-muted/20 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              {post.author.avatarUrl ? (
                <Image
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover ring-2 ring-border/80 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0">
                  {post.author.name.charAt(0)}
                </div>
              )}
              <div className="space-y-1.5">
                <div className="font-bold text-base font-heading">
                  Written by {post.author.name}
                </div>
                {post.author.bio && (
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {post.author.bio}
                  </p>
                )}
                <Link
                  href={`/author/${post.author.slug}`}
                  className="text-xs text-primary hover:underline font-medium inline-block pt-1"
                >
                  View all publications by {post.author.name} &rarr;
                </Link>
              </div>
            </div>

            {/* Adjacent Posts Navigation (Previous / Next) */}
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4" aria-label="Adjacent articles">
              {adjacent.prev ? (
                <Link
                  href={`/blog/${adjacent.prev.slug}`}
                  className="p-4 rounded-xl border border-border/70 hover:border-primary/50 transition-colors group flex flex-col justify-between"
                >
                  <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous Article
                  </span>
                  <span className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1 mt-1">
                    {adjacent.prev.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {adjacent.next ? (
                <Link
                  href={`/blog/${adjacent.next.slug}`}
                  className="p-4 rounded-xl border border-border/70 hover:border-primary/50 transition-colors group flex flex-col justify-between text-right sm:text-right"
                >
                  <span className="text-[11px] font-mono text-muted-foreground flex items-center justify-end gap-1">
                    Next Article <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1 mt-1">
                    {adjacent.next.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </nav>

            {/* Comments Section */}
            <CommentsSection
              postId={post.id}
              initialComments={comments}
              allowComments={allowCommentsSetting === "true"}
            />
          </div>

          {/* Sticky Sidebar: Table of Contents */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="max-w-5xl mx-auto mt-20 pt-12 border-t border-border/70 space-y-6">
            <h3 className="text-2xl font-bold font-heading tracking-tight">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <PostCard key={rel.id} post={rel} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
