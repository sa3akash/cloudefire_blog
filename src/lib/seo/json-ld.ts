import { getBaseUrl } from "./metadata";
import type { ArticleSeoData } from "./metadata";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

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
    articleSection: data.categoryName,
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

  return JSON.stringify(schema, null, 2);
}

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]): string {
  const baseUrl = getBaseUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  };

  return JSON.stringify(schema, null, 2);
}

export function generateWebSiteJsonLd(siteName: string, siteDescription: string): string {
  const baseUrl = getBaseUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: baseUrl,
    description: siteDescription,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return JSON.stringify(schema, null, 2);
}

export function generatePersonJsonLd(author: {
  name: string;
  slug: string;
  bio?: string | null;
  avatarUrl?: string | null;
}): string {
  const baseUrl = getBaseUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `${baseUrl}/author/${author.slug}`,
    description: author.bio || undefined,
    image: author.avatarUrl || undefined,
    mainEntityOfPage: `${baseUrl}/author/${author.slug}`,
  };

  return JSON.stringify(schema, null, 2);
}

export function generateCollectionJsonLd({
  name,
  description,
  url,
  count,
}: {
  name: string;
  description: string;
  url: string;
  count?: number;
}): string {
  const baseUrl = getBaseUrl();
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: fullUrl,
    numberOfItems: count,
  };

  return JSON.stringify(schema, null, 2);
}

