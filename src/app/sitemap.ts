import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/services/posts";
import { getAllCategories } from "@/lib/services/categories";
import { getAllTags } from "@/lib/services/tags";
import { getBaseUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const [postsData, categoriesList, tagsList] = await Promise.all([
    getPublishedPosts({ page: 1, limit: 1000 }),
    getAllCategories(),
    getAllTags(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = postsData.posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt || post.createdAt,
    changeFrequency: "weekly",
    priority: post.featured ? 0.9 : 0.8,
  }));

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

  return [...staticRoutes, ...postRoutes, ...categoryRoutes, ...tagRoutes];
}
