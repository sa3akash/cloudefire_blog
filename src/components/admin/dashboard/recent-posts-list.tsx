import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface RecentPostItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishedAt: Date | null;
  updatedAt: Date;
}

export function RecentPostsList({ posts }: { posts: RecentPostItem[] }) {
  return (
    <div className="lg:col-span-7 rounded-xl border border-border/80 bg-card shadow-xs p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base font-heading">Recent Posts</h3>
        <Link
          href="/admin/posts"
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
        >
          <span>All posts</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-border/60">
        {posts.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center">
            No articles yet. Start by creating your first post.
          </p>
        ) : (
          posts.map((p) => (
            <div key={p.id} className="py-3 flex items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <Link
                  href={`/admin/posts/${p.id}/edit`}
                  className="text-sm font-semibold hover:text-primary transition-colors line-clamp-1"
                >
                  {p.title}
                </Link>
                <div className="text-[11px] text-muted-foreground flex items-center gap-2 font-mono">
                  <span>/blog/{p.slug}</span>
                  <span>&bull;</span>
                  <span>
                    {new Date(p.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <Badge
                  variant={p.status === "published" ? "default" : "secondary"}
                  className="text-[10px] uppercase font-mono"
                >
                  {p.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
