import { getBaseUrl } from "@/lib/seo";
import { getSitemapIndexChunks } from "@/lib/services/sitemap";
import { NextResponse } from "next/server";

export const revalidate = 3600; // Edge cached for 1 hour

export async function GET() {
  const baseUrl = getBaseUrl();
  const chunks = await getSitemapIndexChunks();
  const now = new Date().toISOString();

  const sitemapsXml = chunks
    .map(
      (chunk) => `  <sitemap>
    <loc>${baseUrl}/sitemap/${chunk.id}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapsXml}
</sitemapindex>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
