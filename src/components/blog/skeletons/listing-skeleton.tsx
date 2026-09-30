import { Skeleton } from "@/components/ui/skeleton";
import { PostCardSkeleton } from "./post-card-skeleton";

export function ListingSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3 text-center sm:text-left">
        <Skeleton className="h-10 w-72 sm:w-96 rounded-xl" />
        <Skeleton className="h-4 w-full max-w-xl rounded" />
      </div>

      {/* Filter / Search Bar Skeleton */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-border/80 bg-card/60">
        <Skeleton className="h-9.5 w-full md:w-80 rounded-xl" />
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
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
