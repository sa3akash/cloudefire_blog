import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/services/posts";
import { getAllSettings } from "@/lib/services/settings";
import { generateRssFeed } from "@/lib/seo";

export const revalidate = 3600; // Cache feed for 1 hour

export async function GET() {
  const [postsData, settings] = await Promise.all([
    getPublishedPosts({ page: 1, limit: 30 }),
    getAllSettings(),
  ]);

  const items = postsData.posts.map((p) => ({
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    authorName: p.author.name,
  }));

  const xml = generateRssFeed(
    settings.siteName || "CloudBlog",
    settings.siteDescription || "An edge-native publication on Cloudflare.",
    items
  );

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=14400, stale-while-revalidate=86400",
    },
  });
}
