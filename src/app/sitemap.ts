import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo";
import { getFullSitemap } from "@/lib/services/sitemap";

export const revalidate = 3600; // Edge cached for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  return await getFullSitemap(baseUrl);
}
