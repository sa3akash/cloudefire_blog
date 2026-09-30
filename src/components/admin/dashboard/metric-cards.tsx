import { FileText, Eye, CheckCircle, Clock } from "lucide-react";

interface MetricCardsProps {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
}

export function MetricCards({
  totalPosts,
  publishedPosts,
  draftPosts,
  totalViews,
}: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-2">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium uppercase font-mono">Total Posts</span>
          <FileText className="w-4 h-4 text-primary" />
        </div>
        <div className="text-3xl font-extrabold font-heading">{totalPosts}</div>
        <p className="text-[11px] text-muted-foreground">Articles in D1 database</p>
      </div>

      <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-2">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium uppercase font-mono">Published</span>
          <CheckCircle className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-3xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400">
          {publishedPosts}
        </div>
        <p className="text-[11px] text-muted-foreground">Live on global edge</p>
      </div>

      <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-2">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium uppercase font-mono">Drafts</span>
          <Clock className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-3xl font-extrabold font-heading text-amber-600 dark:text-amber-400">
          {draftPosts}
        </div>
        <p className="text-[11px] text-muted-foreground">Unpublished revisions</p>
      </div>

      <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-2">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium uppercase font-mono">Total Views</span>
          <Eye className="w-4 h-4 text-blue-500" />
        </div>
        <div className="text-3xl font-extrabold font-heading text-blue-600 dark:text-blue-400">
          {totalViews}
        </div>
        <p className="text-[11px] text-muted-foreground">Deduplicated edge hits</p>
      </div>
    </div>
  );
}
