import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeHero } from "@/components/blog/home-hero";
import { buildPageMetadata, generateWebSiteJsonLd } from "@/lib/seo";
import {
  FeaturedAndTopicsSection,
  FeaturedAndTopicsSkeleton,
  LatestPostsSection,
  LatestPostsSkeleton,
} from "@/components/blog/home-streamed-sections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "CloudBlog — High-Performance Edge Engineering Blog",
  description:
    "Deep dives into systems architecture, serverless databases, edge computing, and modern full-stack web engineering. Built on Next.js and Cloudflare.",
  path: "/",
});

export default function HomePage() {
  const websiteJsonLd = generateWebSiteJsonLd(
    "CloudBlog",
    "Engineering insights, systems architecture, and tutorials optimized for edge computing."
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-16 sm:space-y-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: websiteJsonLd }}
      />

      {/* Hero renders immediately — zero waiting time */}
      <HomeHero />

      {/* Featured post + topic cloud streamed */}
      <Suspense fallback={<FeaturedAndTopicsSkeleton />}>
        <FeaturedAndTopicsSection />
      </Suspense>

      {/* Latest posts streamed */}
      <Suspense fallback={<LatestPostsSkeleton />}>
        <LatestPostsSection />
      </Suspense>
    </div>
  );
}
