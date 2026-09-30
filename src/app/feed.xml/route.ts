import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/services/posts";
import { getAllSettings } from "@/lib/services/settings";
import { generateRssFeed, getBaseUrl } from "@/lib/seo";

export const revalidate = 1800; // Edge cached for 30 minutes

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tagSlug = url.searchParams.get("tag")?.trim() || undefined;
  const categorySlug = url.searchParams.get("category")?.trim() || undefined;
  const authorSlug = url.searchParams.get("author")?.trim() || undefined;
  const limitParam = url.searchParams.get("limit");
  const limit = Math.min(100, Math.max(10, limitParam ? parseInt(limitParam, 10) : 30));

  const [postsData, settings] = await Promise.all([
    getPublishedPosts({ page: 1, limit, tagSlug, categorySlug, authorSlug }),
    getAllSettings(),
  ]);

  const items = postsData.posts.map((p) => ({
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    authorName: p.author.name,
  }));

  const baseTitle = settings.siteName || "CloudBlog";
  let feedTitle = baseTitle;
  if (tagSlug) feedTitle += ` #${tagSlug}`;
  else if (categorySlug) feedTitle += ` - ${categorySlug}`;
  else if (authorSlug) feedTitle += ` - By ${authorSlug}`;

  const feedDescription = settings.siteDescription || "An edge-native publication on Cloudflare.";
  const baseUrl = getBaseUrl();
  const currentFeedUrl = `${baseUrl}/feed.xml${url.search}`;

  const xml = generateRssFeed(feedTitle, feedDescription, items, currentFeedUrl);

  // Generate lightweight deterministic ETag from latest post and length
  const latestDate = items[0]?.publishedAt?.getTime() || 0;
  const etag = `"${latestDate}-${items.length}"`;

  const ifNoneMatch = req.headers.get("if-none-match");
  if (ifNoneMatch === etag) {
    return new NextResponse(null, { status: 304 });
  }

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400",
      ETag: etag,
    },
  });
}
