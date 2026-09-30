import { Skeleton } from "@/components/ui/skeleton";
import { PostCardSkeleton } from "./post-card-skeleton";

export function SearchPageSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 animate-pulse">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <Skeleton className="h-10 w-64 sm:w-80 mx-auto rounded-xl" />
        <Skeleton className="h-4 w-full max-w-md mx-auto rounded" />

        {/* Search Form Skeleton */}
        <div className="relative flex items-center gap-2 pt-2">
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <Skeleton className="h-11 w-24 rounded-xl" />
        </div>
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
