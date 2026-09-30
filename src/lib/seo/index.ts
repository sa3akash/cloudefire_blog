import type { Metadata } from "next";

export interface ArticleSeoData {
  title: string;
  description?: string | null;
  slug: string;
  coverImage?: string | null;
  publishedAt?: Date | null;
  updatedAt?: Date | null;
  authorName: string;
  authorUrl?: string;
  categoryName?: string;
  canonicalUrl?: string | null;
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}

/**
 * Builds Next.js Metadata object with OpenGraph, Twitter, and canonical URL.
 */
export function buildArticleMetadata(data: ArticleSeoData): Metadata {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/blog/${data.slug}`;
  const canonical = data.canonicalUrl || url;
  const image = data.coverImage || `${baseUrl}/og-default.png`;
  const description =
    data.description || `Read "${data.title}" on CloudBlog.`;

  return {
    title: `${data.title} | CloudBlog`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: data.title,
      description,
      url,
      siteName: "CloudBlog",
      type: "article",
      publishedTime: data.publishedAt ? data.publishedAt.toISOString() : undefined,
      modifiedTime: data.updatedAt ? data.updatedAt.toISOString() : undefined,
      authors: [data.authorName],
      section: data.categoryName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description,
      images: [image],
    },
  };
}

/**
 * Generates schema.org BlogPosting JSON-LD.
 */
export function generateArticleJsonLd(data: ArticleSeoData): string {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/blog/${data.slug}`;
  const image = data.coverImage || `${baseUrl}/og-default.png`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.description || "",
    image: [image],
    datePublished: data.publishedAt ? data.publishedAt.toISOString() : undefined,
    dateModified: (data.updatedAt || data.publishedAt || new Date()).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Person",
      name: data.authorName,
      url: data.authorUrl ? `${baseUrl}/author/${data.authorUrl}` : undefined,
    },
    publisher: {
      "@type": "Organization",
      name: "CloudBlog",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icon.png`,
      },
    },
  };

  return JSON.stringify(schema);
}

/**
 * Generates RSS 2.0 XML string from published posts.
 */
export function generateRssFeed(
  siteName: string,
  siteDescription: string,
  posts: {
    title: string;
    slug: string;
    excerpt: string | null;
    publishedAt: Date | null;
    authorName: string;
  }[]
): string {
  const baseUrl = getBaseUrl();

  const itemsXml = posts
    .map((post) => {
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : new Date().toUTCString();
      const postUrl = `${baseUrl}/blog/${post.slug}`;
      const desc = post.excerpt ? escapeXml(post.excerpt) : "";

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(post.authorName)}</author>
      <description>${desc}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}
