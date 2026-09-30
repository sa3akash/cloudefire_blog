import { getDb, posts, categories, tags, authors } from "@/lib/db";
import { eq, desc, count } from "drizzle-orm";
import type { MetadataRoute } from "next";

export const SITEMAP_CHUNK_SIZE = 10000;

export interface SitemapChunkId {
  id: string;
}

export async function getSitemapIndexChunks(): Promise<SitemapChunkId[]> {
  try {
    const db = getDb();
    const [pCount, tCount, aCount] = await Promise.all([
      db.select({ total: count() }).from(posts).where(eq(posts.status, "published")),
      db.select({ total: count() }).from(tags),
      db.select({ total: count() }).from(authors),
    ]);

    const totalPosts = pCount[0]?.total || 0;
    const totalTags = tCount[0]?.total || 0;
    const totalAuthors = aCount[0]?.total || 0;

    const chunks: SitemapChunkId[] = [{ id: "core" }];

    const postPages = Math.max(1, Math.ceil(totalPosts / SITEMAP_CHUNK_SIZE));
    for (let i = 1; i <= postPages; i++) {
      chunks.push({ id: `posts-${i}` });
    }

    const tagPages = Math.max(1, Math.ceil(totalTags / SITEMAP_CHUNK_SIZE));
    for (let i = 1; i <= tagPages; i++) {
      chunks.push({ id: `tags-${i}` });
    }

    if (totalAuthors > 0) {
      const authorPages = Math.ceil(totalAuthors / SITEMAP_CHUNK_SIZE);
      for (let i = 1; i <= authorPages; i++) {
        chunks.push({ id: `authors-${i}` });
      }
    }

    return chunks;
  } catch {
    return [{ id: "core" }, { id: "posts-1" }];
  }
}

export async function getSitemapCoreRoutes(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  try {
    const db = getDb();
    const allCategories = await db.select({ slug: categories.slug, updatedAt: categories.updatedAt }).from(categories);

    const categoryUrls: MetadataRoute.Sitemap = allCategories.map((c) => ({
      url: `${baseUrl}/category/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticUrls, ...categoryUrls];
  } catch {
    return staticUrls;
  }
}

export async function getSitemapPostsChunk(page: number, baseUrl: string): Promise<MetadataRoute.Sitemap> {
  try {
    const db = getDb();
    const offset = (Math.max(1, page) - 1) * SITEMAP_CHUNK_SIZE;

    const rows = await db
      .select({
        slug: posts.slug,
        publishedAt: posts.publishedAt,
        updatedAt: posts.updatedAt,
        featured: posts.featured,
      })
      .from(posts)
      .where(eq(posts.status, "published"))
      .orderBy(desc(posts.publishedAt))
      .limit(SITEMAP_CHUNK_SIZE)
      .offset(offset);

    return rows.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt || p.publishedAt || new Date(),
      changeFrequency: "weekly",
      priority: p.featured ? 0.9 : 0.8,
    }));
  } catch {
    return [];
  }
}

export async function getSitemapTagsChunk(page: number, baseUrl: string): Promise<MetadataRoute.Sitemap> {
  try {
    const db = getDb();
    const offset = (Math.max(1, page) - 1) * SITEMAP_CHUNK_SIZE;

    const rows = await db
      .select({ slug: tags.slug, updatedAt: tags.updatedAt })
      .from(tags)
      .orderBy(desc(tags.updatedAt))
      .limit(SITEMAP_CHUNK_SIZE)
      .offset(offset);

    return rows.map((t) => ({
      url: `${baseUrl}/tag/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    return [];
  }
}

export async function getSitemapAuthorsChunk(page: number, baseUrl: string): Promise<MetadataRoute.Sitemap> {
  try {
    const db = getDb();
    const offset = (Math.max(1, page) - 1) * SITEMAP_CHUNK_SIZE;

    const rows = await db
      .select({ slug: authors.slug, updatedAt: authors.updatedAt })
      .from(authors)
      .orderBy(desc(authors.updatedAt))
      .limit(SITEMAP_CHUNK_SIZE)
      .offset(offset);

    return rows.map((a) => ({
      url: `${baseUrl}/author/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    return [];
  }
}

export async function getFullSitemap(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const [core, postList, tagList, authorList] = await Promise.all([
    getSitemapCoreRoutes(baseUrl),
    getSitemapPostsChunk(1, baseUrl),
    getSitemapTagsChunk(1, baseUrl),
    getSitemapAuthorsChunk(1, baseUrl),
  ]);

  return [...core, ...postList, ...tagList, ...authorList];
}

