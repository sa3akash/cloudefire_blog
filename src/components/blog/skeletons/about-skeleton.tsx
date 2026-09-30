import { Skeleton } from "@/components/ui/skeleton";

export function AboutPageSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16 animate-pulse">
      {/* Intro Skeleton */}
      <div className="space-y-4 text-center sm:text-left">
        <Skeleton className="h-6 w-52 rounded-full" />
        <Skeleton className="h-12 sm:h-14 w-3/4 rounded-xl" />
        <Skeleton className="h-5 w-full max-w-2xl rounded" />
        <Skeleton className="h-5 w-5/6 max-w-2xl rounded" />
      </div>

      {/* Cards section Skeleton */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64 rounded-lg" />
          <Skeleton className="h-4 w-full max-w-xl rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 rounded-2xl border border-border/80 bg-card space-y-3">
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="h-5 w-36 rounded" />
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-4/5 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Principles Skeleton */}
      <div className="p-8 rounded-2xl border border-border/80 bg-muted/20 space-y-5">
        <Skeleton className="h-6 w-56 rounded-lg" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="w-5 h-5 rounded shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-3.5 w-full rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* CTA Skeleton */}
      <div className="flex items-center justify-between p-6 rounded-2xl border border-border/80 bg-card flex-col sm:flex-row gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-52 rounded" />
          <Skeleton className="h-3.5 w-72 rounded" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
    </div>
  );
}
