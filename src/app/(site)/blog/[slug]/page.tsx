import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import {
  getPostBySlug,
  getAdjacentPosts,
  recordPostViewFromHeaders,
} from "@/lib/services/posts";
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
import { ArticleHeader } from "@/components/blog/article-header";
import { ArticleNavigation } from "@/components/blog/article-navigation";
import { ArticleTags } from "@/components/blog/article-tags";
import {
  RelatedPostsSection,
  RelatedPostsSkeleton,
  CommentsSectionLoader,
  CommentsSectionSkeleton,
} from "@/components/blog/article-streamed-sections";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

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

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolved = await params;
  const [post, allowCommentsSetting] = await Promise.all([
    getPostBySlug(resolved.slug),
    getSetting("allowComments", "true"),
  ]);

  if (!post) notFound();

  headers().then((h) => recordPostViewFromHeaders(post.id, h)).catch(() => {});

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

  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    ...(post.category ? [{ name: post.category.name, url: `/category/${post.category.slug}` }] : []),
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  const fullUrl = `${getBaseUrl()}/blog/${post.slug}`;
  const isMultiCol = headings.length > 0;

  return (
    <article className="container mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbs }} />

      <ArticleHeader
        title={post.title}
        excerpt={post.excerpt}
        category={post.category}
        author={post.author}
        publishedAt={post.publishedAt}
        readingTime={post.readingTime}
        coverImage={post.coverImage}
      />

      <div className={`grid grid-cols-1 ${isMultiCol ? "lg:grid-cols-12" : "max-w-3xl mx-auto"} gap-10`}>
        <div className={`${isMultiCol ? "lg:col-span-8" : "w-full"} space-y-10 min-w-0`}>
          {isMultiCol && <div className="lg:hidden"><TableOfContents headings={headings} /></div>}
          <div className="prose-article" dangerouslySetInnerHTML={{ __html: renderedContent }} />
          <ArticleTags tags={post.tags} />
          <div className="lg:hidden py-4 border-t border-border/80">
            <ShareButtons title={post.title} url={fullUrl} />
          </div>
          <ArticleNavigation author={post.author} adjacent={adjacent} />
          <Suspense fallback={<CommentsSectionSkeleton />}>
            <CommentsSectionLoader postId={post.id} allowComments={allowCommentsSetting === "true"} />
          </Suspense>
        </div>

        {isMultiCol && (
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <TableOfContents headings={headings} />
              <ShareButtons title={post.title} url={fullUrl} />
            </div>
          </aside>
        )}
      </div>

      <Suspense fallback={<RelatedPostsSkeleton />}>
        <RelatedPostsSection postId={post.id} categoryId={post.categoryId} />
      </Suspense>
    </article>
  );
}
