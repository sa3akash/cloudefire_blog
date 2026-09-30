import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo";
import {
  getSitemapIndexChunks,
  getSitemapCoreRoutes,
  getSitemapPostsChunk,
  getSitemapTagsChunk,
  getSitemapAuthorsChunk,
} from "@/lib/services/sitemap";

export const revalidate = 3600; // Edge cached for 1 hour

export async function generateSitemaps() {
  return await getSitemapIndexChunks();
}

export default async function sitemap(props: {
  id?: Promise<string | number> | string | number;
}): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const resolved = props?.id instanceof Promise ? await props.id : (props?.id ?? "core");
  const sitemapId = String(resolved);

  if (sitemapId === "core" || sitemapId === "0") {
    return await getSitemapCoreRoutes(baseUrl);
  }

  if (sitemapId.startsWith("posts-")) {
    const page = parseInt(sitemapId.replace("posts-", ""), 10) || 1;
    return await getSitemapPostsChunk(page, baseUrl);
  }

  if (sitemapId.startsWith("tags-")) {
    const page = parseInt(sitemapId.replace("tags-", ""), 10) || 1;
    return await getSitemapTagsChunk(page, baseUrl);
  }

  if (sitemapId.startsWith("authors-")) {
    const page = parseInt(sitemapId.replace("authors-", ""), 10) || 1;
    return await getSitemapAuthorsChunk(page, baseUrl);
  }

  const numeric = parseInt(sitemapId, 10);
  if (!isNaN(numeric) && numeric > 0) {
    return await getSitemapPostsChunk(numeric, baseUrl);
  }

  return await getSitemapCoreRoutes(baseUrl);
}
