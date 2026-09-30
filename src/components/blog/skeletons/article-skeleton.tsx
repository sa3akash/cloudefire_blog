import { Skeleton } from "@/components/ui/skeleton";

export function ArticleSkeleton() {
  return (
    <article className="container mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16 space-y-12 animate-pulse">
      {/* Article Header Skeleton */}
      <div className="space-y-8">
        <div className="space-y-6 text-center max-w-3xl mx-auto flex flex-col items-center">
          <Skeleton className="h-6 w-24 rounded-full" />
          <div className="space-y-3 w-full flex flex-col items-center">
            <Skeleton className="h-10 sm:h-14 w-11/12 rounded-xl" />
            <Skeleton className="h-10 sm:h-14 w-3/4 rounded-xl" />
          </div>
          <div className="space-y-2 w-full max-w-xl">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 mx-auto rounded" />
          </div>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
        </div>

        {/* Hero Cover Image Skeleton */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-3xl bg-muted/60 border border-border/80">
          <Skeleton className="w-full h-full" />
        </div>
      </div>

      {/* Grid Layout: Main Content (8 cols) + Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-3">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>

          <Skeleton className="h-8 w-1/2 rounded-lg" />

          <div className="space-y-3">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
          </div>

          {/* Code block shimmer */}
          <div className="rounded-xl border border-border/80 bg-neutral-950 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
              </div>
              <Skeleton className="h-5 w-12 rounded bg-neutral-800" />
            </div>
            <Skeleton className="h-4 w-3/4 bg-neutral-800/80 rounded" />
            <Skeleton className="h-4 w-1/2 bg-neutral-800/80 rounded" />
            <Skeleton className="h-4 w-2/3 bg-neutral-800/80 rounded" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>

          {/* Author Card Skeleton */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/60 flex items-center gap-5">
            <Skeleton className="w-16 h-16 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-5 w-36 rounded" />
              <Skeleton className="h-3.5 w-full rounded" />
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <aside className="hidden lg:block lg:col-span-4 space-y-6">
          <div className="p-5 rounded-2xl border border-border/80 bg-card/60 space-y-3">
            <Skeleton className="h-4 w-28 rounded" />
            <div className="h-px bg-border/60" />
            <div className="space-y-2 pt-1">
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
              <Skeleton className="h-4 w-4/5 rounded" />
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-border/80 bg-card/60 space-y-3">
            <Skeleton className="h-4 w-24 rounded" />
            <div className="h-px bg-border/60" />
            <div className="flex gap-2">
              <Skeleton className="h-8 flex-1 rounded-md" />
              <Skeleton className="h-8 flex-1 rounded-md" />
            </div>
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
        </aside>
      </div>
    </article>
  );
}
