import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card/70 backdrop-blur-sm overflow-hidden shadow-xs h-full">
      <div>
        <div className="relative aspect-[16/10] w-full bg-muted/60 overflow-hidden">
          <Skeleton className="w-full h-full rounded-none" />
          <div className="absolute top-3 left-3">
            <Skeleton className="h-6 w-20 rounded-full bg-background/90" />
          </div>
          <div className="absolute top-3 right-3">
            <Skeleton className="h-5 w-12 rounded-full bg-neutral-900/80" />
          </div>
        </div>

        <div className="p-5 space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-11/12 rounded-md" />
            <Skeleton className="h-6 w-3/4 rounded-md" />
          </div>

          <div className="space-y-1.5 pt-1">
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3.5 w-4/5 rounded" />
          </div>

          <div className="flex items-center gap-1.5 pt-2">
            <Skeleton className="h-5 w-14 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-12 rounded-md" />
          </div>
        </div>
      </div>

      <div className="px-5 py-3.5 border-t border-border/50 flex items-center justify-between mt-auto bg-muted/15">
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="h-3.5 w-24 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-20 rounded" />
          <Skeleton className="w-4 h-4 rounded" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedPostCardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center rounded-3xl border border-border/80 bg-card/70 p-5 sm:p-8 shadow-sm">
      <div className="lg:col-span-7 relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted/60 border border-border/60">
        <Skeleton className="w-full h-full rounded-2xl" />
      </div>

      <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-9 sm:h-10 w-full rounded-lg" />
            <Skeleton className="h-9 sm:h-10 w-4/5 rounded-lg" />
          </div>

          <div className="space-y-1.5 pt-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
        </div>

        <div className="pt-5 border-t border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </div>
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}
