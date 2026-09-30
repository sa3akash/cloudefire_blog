import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ArrowRight } from "lucide-react";

interface RecentCommentItem {
  id: string;
  authorName: string;
  content: string;
  status: string;
  createdAt: Date;
  postTitle: string;
}

export function RecentCommentsList({ comments }: { comments: RecentCommentItem[] }) {
  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base font-heading flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span>Recent Comments</span>
        </h3>
        <Link
          href="/admin/comments"
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
        >
          <span>Moderate all</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-border/60">
        {comments.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center">
            No visitor comments yet.
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="py-3 flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">{c.authorName}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    on &quot;{c.postTitle}&quot;
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {c.content}
                </p>
              </div>

              <Badge
                variant={
                  c.status === "approved"
                    ? "default"
                    : c.status === "pending"
                    ? "outline"
                    : "destructive"
                }
                className="text-[10px] uppercase font-mono shrink-0"
              >
                {c.status}
              </Badge>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
