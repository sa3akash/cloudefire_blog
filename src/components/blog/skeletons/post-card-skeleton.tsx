import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm overflow-hidden p-0 shadow-xs">
      <div>
        <div className="relative aspect-[16/10] w-full bg-muted/70 overflow-hidden">
          <Skeleton className="w-full h-full" />
          <div className="absolute top-3 left-3">
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="absolute top-3 right-3">
            <Skeleton className="h-4 w-10 rounded-full" />
          </div>
        </div>

        <div className="p-5 space-y-3">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-4/5 rounded-md" />
            <Skeleton className="h-5 w-3/5 rounded-md" />
          </div>

          <div className="space-y-1 pt-1">
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3.5 w-4/5 rounded" />
          </div>

          <div className="flex items-center gap-1.5 pt-2">
            <Skeleton className="h-4 w-12 rounded-md" />
            <Skeleton className="h-4 w-14 rounded-md" />
          </div>
        </div>
      </div>

      <div className="px-5 py-3.5 border-t border-border/50 flex items-center justify-between bg-muted/15">
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="h-3.5 w-20 rounded" />
        </div>
        <Skeleton className="h-3 w-16 rounded" />
      </div>
    </div>
  );
}

export function FeaturedPostCardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center rounded-3xl border border-border/80 bg-card/60 p-5 sm:p-8 shadow-sm">
      <div className="lg:col-span-7 relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-4/5 rounded-lg" />
          </div>

          <div className="space-y-1.5 pt-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
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
