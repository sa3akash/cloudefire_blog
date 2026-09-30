import type { Metadata } from "next";
import Link from "next/link";
import { getFeaturedPosts, getPublishedPosts } from "@/lib/services/posts";
import { getAllCategories } from "@/lib/services/categories";
import { getAllTags } from "@/lib/services/tags";
import { PostCard } from "@/components/blog/post-card";
import { HomeHero } from "@/components/blog/home-hero";
import { TopicCloud } from "@/components/blog/topic-cloud";
import { ArrowRight } from "lucide-react";
import { buildPageMetadata, generateWebSiteJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "CloudBlog — High-Performance Edge Engineering Blog",
  description:
    "Deep dives into systems architecture, serverless databases, edge computing, and modern full-stack web engineering. Built on Next.js 16 and Cloudflare.",
  path: "/",
});

export default async function HomePage() {
  const [featuredPosts, latestResult, categoriesList, tagsList] = await Promise.all([
    getFeaturedPosts(1),
    getPublishedPosts({ page: 1, limit: 6 }),
    getAllCategories(),
    getAllTags(),
  ]);

  const featured = featuredPosts[0] || null;
  const latestPosts = latestResult.posts.filter((p) => p.id !== featured?.id).slice(0, 6);
  const websiteJsonLd = generateWebSiteJsonLd(
    "CloudBlog",
    "Engineering insights, systems architecture, and tutorials optimized for edge computing."
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 space-y-16 sm:space-y-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: websiteJsonLd }} />
      <HomeHero />

      {featured && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-heading tracking-tight">
                Featured Editorial
              </h2>
              <p className="text-xs text-muted-foreground">
                Hand-picked technical analysis from our editorial team
              </p>
            </div>
            <Link
              href="/blog"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <PostCard post={featured} featured={true} />
        </section>
      )}

      <TopicCloud categories={categoriesList} tags={tagsList} />

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-heading tracking-tight">
              Latest Publications
            </h2>
            <p className="text-xs text-muted-foreground">
              Recent articles and edge architecture updates
            </p>
          </div>
          <Link
            href="/blog"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>All articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
