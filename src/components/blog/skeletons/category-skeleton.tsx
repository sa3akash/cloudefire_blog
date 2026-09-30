import { Skeleton } from "@/components/ui/skeleton";
import { PostCardSkeleton } from "./post-card-skeleton";

export function CategoryTagSkeleton({
  isTag = false,
  count = 9,
}: {
  isTag?: boolean;
  count?: number;
}) {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 animate-pulse">
      {/* Category / Tag Header Skeleton */}
      <div className="space-y-3 border-b border-border/60 pb-8 text-center sm:text-left">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className={`h-10 ${isTag ? "w-48 sm:w-60 font-mono" : "w-64 sm:w-80"} rounded-xl`} />
        <Skeleton className="h-4 w-full max-w-xl rounded" />
      </div>

      {/* Grid of Post Card Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-center gap-2 pt-6">
        <Skeleton className="h-9 w-20 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>
    </div>
  );
}
