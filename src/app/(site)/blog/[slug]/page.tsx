import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";
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

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolved = await params;
  const post = await getPostBySlug(resolved.slug);
  if (!post) notFound();

  try {
    const headerList = await headers();
    const ip = headerList.get("cf-connecting-ip") || headerList.get("x-forwarded-for") || "anonymous";
    const userAgent = headerList.get("user-agent") || "unknown";
    const visitorHash = btoa(`${ip}:${userAgent.slice(0, 30)}`).slice(0, 32);
    incrementPostView(post.id, visitorHash).catch(() => {});
  } catch {
    // Edge case if headers not available
  }

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
    categoryName: post.category?.name,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    ...(post.category ? [{ name: post.category.name, url: `/category/${post.category.slug}` }] : []),
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  const fullUrl = `${getBaseUrl()}/blog/${post.slug}`;

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            <TableOfContents headings={headings} />
            <ShareButtons title={post.title} url={fullUrl} />
          </div>
        </aside>

        <div className="lg:col-span-9 space-y-10 min-w-0">
          <div className="prose-article" dangerouslySetInnerHTML={{ __html: renderedContent }} />
          <ArticleTags tags={post.tags} />
          <div className="lg:hidden py-4 border-t border-b border-border/80">
            <ShareButtons title={post.title} url={fullUrl} />
          </div>
          <ArticleNavigation author={post.author} adjacent={adjacent} />
          {allowCommentsSetting === "true" && (
            <CommentsSection postId={post.id} initialComments={comments} />
          )}
        </div>
      </div>

      <RelatedPosts posts={relatedPosts} />
    </article>
  );
}
