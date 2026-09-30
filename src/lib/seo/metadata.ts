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

export function buildArticleMetadata(data: ArticleSeoData): Metadata {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/blog/${data.slug}`;
  const canonical = data.canonicalUrl || url;
  const image = data.coverImage || `${baseUrl}/og-default.png`;
  const description = data.description || `Read "${data.title}" on CloudBlog.`;

  return {
    title: `${data.title} | CloudBlog`,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
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
