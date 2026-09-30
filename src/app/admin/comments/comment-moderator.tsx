"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Trash2, ExternalLink } from "lucide-react";
import { moderateCommentAction, deleteCommentAction } from "@/app/actions/admin";

interface CommentRow {
  id: string;
  postId: string;
  postTitle: string;
  postSlug: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

export function CommentModerator({
  initialComments,
}: {
  initialComments: CommentRow[];
}) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleModerate = async (id: string, status: "approved" | "rejected") => {
    setLoadingId(id);
    const res = await moderateCommentAction(id, status);
    setLoadingId(null);

    if (res.success) {
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
      router.refresh();
    } else {
      alert(res.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this comment?")) return;

    setLoadingId(id);
    const res = await deleteCommentAction(id);
    setLoadingId(null);

    if (res.success) {
      setComments((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-border bg-card text-muted-foreground text-xs italic">
          No comments in this view.
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comm) => (
            <div
              key={comm.id}
              className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">
                      {comm.authorName}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      &lt;{comm.authorEmail}&gt;
                    </span>
                    <Badge
                      variant={
                        comm.status === "approved"
                          ? "default"
                          : comm.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-[10px] capitalize"
                    >
                      {comm.status}
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <span>On article:</span>
                    <Link
                      href={`/blog/${comm.postSlug}`}
                      target="_blank"
                      className="font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                    >
                      <span>{comm.postTitle}</span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </Link>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground font-mono">
                  {new Date(comm.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Comment Content */}
              <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                {comm.content}
              </p>

              {/* Moderation Actions */}
              <div className="pt-2 flex items-center justify-end gap-2">
                {comm.status !== "approved" && (
                  <Button
                    size="sm"
                    disabled={loadingId === comm.id}
                    onClick={() => handleModerate(comm.id, "approved")}
                    className="h-8 gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </Button>
                )}

                {comm.status !== "rejected" && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loadingId === comm.id}
                    onClick={() => handleModerate(comm.id, "rejected")}
                    className="h-8 gap-1 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={loadingId === comm.id}
                  onClick={() => handleDelete(comm.id)}
                  className="h-8 gap-1 text-xs text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
