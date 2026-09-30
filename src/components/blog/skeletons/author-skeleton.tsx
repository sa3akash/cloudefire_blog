import { Skeleton } from "@/components/ui/skeleton";
import { PostCardSkeleton } from "./post-card-skeleton";

export function AuthorPageSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 animate-pulse">
      {/* Profile Card Skeleton */}
      <div className="p-8 sm:p-10 rounded-2xl border border-border/80 bg-card/60 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <Skeleton className="w-24 h-24 rounded-full shrink-0" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-4 w-full max-w-xl rounded" />
          <Skeleton className="h-4 w-3/4 max-w-xl rounded" />
        </div>
      </div>

      {/* Publications Grid Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-60 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
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
