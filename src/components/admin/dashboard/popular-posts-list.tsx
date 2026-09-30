import Link from "next/link";
import { TrendingUp, Eye } from "lucide-react";

interface PopularPostItem {
  id: string;
  title: string;
  slug: string;
  views?: number;
  viewsCount?: number;
}

export function PopularPostsList({ posts }: { posts: PopularPostItem[] }) {
  return (
    <div className="lg:col-span-5 rounded-xl border border-border/80 bg-card shadow-xs p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base font-heading flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span>Most Popular</span>
        </h3>
        <Link href="/admin/analytics" className="text-xs text-primary hover:underline font-medium">
          Analytics &rarr;
        </Link>
      </div>

      <div className="divide-y divide-border/60">
        {posts.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center">
            No view data recorded yet.
          </p>
        ) : (
          posts.map((p, idx) => (
            <div key={p.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-mono font-bold text-muted-foreground w-4 text-center">
                  #{idx + 1}
                </span>
                <Link
                  href={`/blog/${p.slug}`}
                  target="_blank"
                  className="text-xs font-medium hover:text-primary transition-colors line-clamp-1"
                >
                  {p.title}
                </Link>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-muted-foreground shrink-0">
                <Eye className="w-3.5 h-3.5" />
                <span>{p.viewsCount ?? p.views ?? 0}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
