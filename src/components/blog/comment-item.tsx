import type { PublicComment } from "@/lib/services/comments";

export function CommentItem({ comment }: { comment: PublicComment }) {
  const formattedDate = new Date(comment.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="p-4 rounded-xl border border-border/70 bg-card space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            {comment.authorName[0]?.toUpperCase() || "A"}
          </div>
          <span className="font-semibold text-xs">{comment.authorName}</span>
        </div>
        <time className="text-[11px] text-muted-foreground font-mono">
          {formattedDate}
        </time>
      </div>
      <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed pl-8">
        {comment.content}
      </p>
    </article>
  );
}
