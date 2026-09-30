import { Skeleton } from "@/components/ui/skeleton";

export function ContactPageSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3 text-center sm:text-left">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-10 sm:h-12 w-56 rounded-xl" />
        <Skeleton className="h-4 w-full max-w-lg rounded" />
        <Skeleton className="h-4 w-4/5 max-w-lg rounded" />
      </div>

      {/* Form card Skeleton */}
      <div className="p-8 max-w-3xl rounded-2xl border border-border/80 bg-card/60 space-y-6">
        <Skeleton className="h-6 w-36 rounded" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-20 rounded" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28 rounded" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-16 rounded" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>

        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-20 rounded" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>

        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
    </div>
  );
}
