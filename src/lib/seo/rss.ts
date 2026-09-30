import { getBaseUrl } from "./metadata";

export interface RssItem {
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | null;
  authorName: string;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateRssFeed(
  siteTitleOrPosts: string | RssItem[],
  siteDescriptionOrPosts?: string | RssItem[],
  optionalPosts?: RssItem[]
): string {
  const baseUrl = getBaseUrl();
  const buildDate = new Date().toUTCString();

  let title = "CloudBlog";
  let description = "A high-performance technical blog engineered on Cloudflare Workers, D1, and R2.";
  let posts: RssItem[] = [];

  if (Array.isArray(siteTitleOrPosts)) {
    posts = siteTitleOrPosts;
  } else {
    title = siteTitleOrPosts || title;
    if (typeof siteDescriptionOrPosts === "string") {
      description = siteDescriptionOrPosts;
      posts = optionalPosts || [];
    } else if (Array.isArray(siteDescriptionOrPosts)) {
      posts = siteDescriptionOrPosts;
    }
  }

  const itemsXml = posts
    .map((post) => {
      const postUrl = `${baseUrl}/blog/${post.slug}`;
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : buildDate;

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.excerpt || ""}]]></description>
      <dc:creator><![CDATA[${post.authorName}]]></dc:creator>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:dc="http://purl.org/dc/elements/1.1/" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/" 
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>${escapeXml(description)}</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;
}
