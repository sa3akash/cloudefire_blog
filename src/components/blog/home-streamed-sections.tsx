import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedPosts, getPublishedPosts } from "@/lib/services/posts";
import { getAllCategories } from "@/lib/services/categories";
import { getAllTags } from "@/lib/services/tags";
import { PostCard } from "@/components/blog/post-card";
import { TopicCloud } from "@/components/blog/topic-cloud";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FeaturedPostCardSkeleton,
  PostCardSkeleton,
} from "@/components/blog/skeletons";

export async function FeaturedAndTopicsSection() {
  const [featuredPosts, categoriesList, tagsList] = await Promise.all([
    getFeaturedPosts(1),
    getAllCategories(),
    getAllTags(),
  ]);
  const featured = featuredPosts[0] || null;

  return (
    <>
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
    </>
  );
}

export function FeaturedAndTopicsSkeleton() {
  return (
    <div className="space-y-16 sm:space-y-20 animate-pulse">
      <div className="space-y-6">
        <div className="space-y-1">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded" />
        </div>
        <FeaturedPostCardSkeleton />
      </div>
      <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/60 space-y-4">
        <Skeleton className="h-5 w-52 rounded-lg" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-24 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export async function LatestPostsSection() {
  const [featuredPosts, latestResult] = await Promise.all([
    getFeaturedPosts(1),
    getPublishedPosts({ page: 1, limit: 7 }),
  ]);
  const featured = featuredPosts[0] || null;
  const latestPosts = latestResult.posts
    .filter((p) => p.id !== featured?.id)
    .slice(0, 6);

  return (
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
  );
}

export function LatestPostsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-1">
        <Skeleton className="h-7 w-48 rounded-lg" />
        <Skeleton className="h-4 w-64 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
