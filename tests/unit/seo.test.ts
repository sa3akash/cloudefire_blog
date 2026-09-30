import { describe, it, expect } from "vitest";
import { generateArticleJsonLd, generateRssFeed, buildArticleMetadata } from "@/lib/seo";

describe("SEO & Syndication Utilities", () => {
  it("should generate valid schema.org BlogPosting JSON-LD", () => {
    const jsonLdString = generateArticleJsonLd({
      title: "Edge Computing with Cloudflare",
      description: "A deep dive into edge computing.",
      slug: "edge-computing-cloudflare",
      authorName: "Alex Mercer",
      publishedAt: new Date("2026-01-15T00:00:00Z"),
    });

    const parsed = JSON.parse(jsonLdString);
    expect(parsed["@type"]).toBe("BlogPosting");
    expect(parsed.headline).toBe("Edge Computing with Cloudflare");
    expect(parsed.author.name).toBe("Alex Mercer");
    expect(parsed.mainEntityOfPage["@id"]).toContain("/blog/edge-computing-cloudflare");
  });

  it("should generate valid RSS feed XML", () => {
    const rss = generateRssFeed("CloudBlog", "A fast blog", [
      {
        title: "First Post & Update",
        slug: "first-post",
        excerpt: "Summary of post <with> characters",
        publishedAt: new Date("2026-01-01T00:00:00Z"),
        authorName: "Alex",
      },
    ]);

    expect(rss).toContain("<rss version=\"2.0\"");
    expect(rss).toContain("<title>First Post &amp; Update</title>");
    expect(rss).toContain("<guid isPermaLink=\"true\">http://localhost:3000/blog/first-post</guid>");
  });

  it("should build proper Next.js metadata", () => {
    const meta = buildArticleMetadata({
      title: "My Article",
      slug: "my-article",
      authorName: "John",
    });

    expect(meta.title).toBe("My Article | CloudBlog");
    expect((meta.openGraph as { type?: string })?.type).toBe("article");
  });
});
