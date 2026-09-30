import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/services/posts";
import { getAllCategories } from "@/lib/services/categories";
import { getAllTags } from "@/lib/services/tags";
import { getBaseUrl } from "@/lib/seo";

export const revalidate = 3600;

export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }];
}

export default async function sitemap(props: {
  id?: number | string;
}): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const sitemapId = Number(props?.id ?? 0);

  // Sitemap 0: Core pages, categories, tags
  if (sitemapId === 0) {
    const [categoriesList, tagsList] = await Promise.all([
      getAllCategories(),
      getAllTags(),
    ]);

    const staticRoutes: MetadataRoute.Sitemap = [
      { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
      { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
      { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
      { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
      { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ];

    const categoryRoutes: MetadataRoute.Sitemap = categoriesList.map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const tagRoutes: MetadataRoute.Sitemap = tagsList.map((tag) => ({
      url: `${baseUrl}/tag/${tag.slug}`,
      lastModified: tag.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [...staticRoutes, ...categoryRoutes, ...tagRoutes];
  }

  // Sitemap 1+: Paginated blog posts (supports millions of articles)
  const postsLimit = 50000;
  const page = sitemapId;
  const postsData = await getPublishedPosts({ page, limit: postsLimit });

  return postsData.posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt || post.createdAt,
    changeFrequency: "weekly",
    priority: post.featured ? 0.9 : 0.8,
  }));
}
