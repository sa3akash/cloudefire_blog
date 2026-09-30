"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { moderateCommentAction, deleteCommentAction } from "@/app/actions/admin";
import { CommentCard, type CommentRow } from "./comment-card";

export function CommentModerator({ initialComments }: { initialComments: CommentRow[] }) {
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
            <CommentCard
              key={comm.id}
              comment={comm}
              loading={loadingId === comm.id}
              onModerate={handleModerate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
