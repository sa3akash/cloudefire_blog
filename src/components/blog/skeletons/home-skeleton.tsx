import { Skeleton } from "@/components/ui/skeleton";
import { FeaturedPostCardSkeleton, PostCardSkeleton } from "./post-card-skeleton";

export function HomePageSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-16 sm:space-y-20 animate-pulse" >
      {/* Hero Skeleton */ }
      < div className = "rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-10 md:p-12" >
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl w-full">
            <Skeleton className="h-6 w-52 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-10 sm:h-12 w-full rounded-xl" />
              <Skeleton className="h-10 sm:h-12 w-4/5 rounded-xl" />
            </div>
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-10 w-36 rounded-xl" />
              <Skeleton className="h-10 w-44 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl border border-border/80 bg-card/80 space-y-2 w-36">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div >

    {/* Featured Editorial Skeleton */ }
    < div className = "space-y-6" >
        <div className="space-y-1">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded" />
        </div>
        <FeaturedPostCardSkeleton />
      </div >

    {/* Topic Cloud Skeleton */ }
    < div className = "p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/60 space-y-6" >
        <Skeleton className="h-5 w-52 rounded-lg" />
        <div className="flex flex-wrap gap-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-28 rounded-full" />
          ))}
        </div>
      </div >

    {/* Latest Publications Grid Skeleton */ }
    < div className = "space-y-8" >
        <div className="space-y-1">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div >
    </div >
  );
}
