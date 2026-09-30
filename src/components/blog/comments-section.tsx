"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import type { PublicComment } from "@/lib/services/comments";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";

interface CommentsSectionProps {
  postId: string;
  initialComments: PublicComment[];
  allowComments?: boolean;
}

function countTotal(items: PublicComment[]): number {
  return items.reduce((acc, c) => acc + 1 + (c.replies ? countTotal(c.replies) : 0), 0);
}

export function CommentsSection({
  postId,
  initialComments,
  allowComments = true,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<PublicComment[]>(initialComments);
  const [loading, setLoading] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, parentId?: string | null) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const authorName = (formData.get("authorName") as string)?.trim();
    const authorEmail = (formData.get("authorEmail") as string)?.trim();
    const content = (formData.get("content") as string)?.trim();
    const honeypot = (formData.get("website") as string)?.trim();

    if (honeypot) {
      setLoading(false);
      setStatusMessage({ type: "success", text: "Thank you for your comment!" });
      form.reset();
      return;
    }

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, parentId, authorName, authorEmail, content }),
      });

      const res = (await response.json()) as {
        success?: boolean;
        message?: string;
        status?: string;
        commentId?: string;
      };
      setLoading(false);

      if (response.ok && res.success) {
        setStatusMessage({
          type: "success",
          text: res.message || "Your comment has been submitted.",
        });
        const newCommentId = res.commentId;
        if (res.status === "approved" && newCommentId) {
          const newComment: PublicComment = {
            id: newCommentId,
            parentId: parentId || null,
            authorName: authorName || "Anonymous",
            content,
            createdAt: new Date(),
            replies: [],
          };

          if (parentId) {
            const addReply = (list: PublicComment[]): PublicComment[] =>
              list.map((c) =>
                c.id === parentId
                  ? { ...c, replies: [...(c.replies || []), newComment] }
                  : { ...c, replies: c.replies ? addReply(c.replies) : [] }
              );
            setComments((prev) => addReply(prev));
            setActiveReplyId(null);
          } else {
            setComments((prev) => [newComment, ...prev]);
          }
        }
        form.reset();
      } else {
        setStatusMessage({ type: "error", text: res.message || "Failed to submit comment" });
      }
    } catch {
      setLoading(false);
      setStatusMessage({ type: "error", text: "Network error submitting comment." });
    }
  };

  const totalCount = countTotal(comments);

  return (
    <section className="space-y-8 pt-10 border-t border-border/70" id="comments">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold font-heading tracking-tight">
          Discussion ({totalCount})
        </h3>
      </div>

      {allowComments && (
        <CommentForm onSubmit={handleSubmit} loading={loading} statusMessage={statusMessage} />
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-4 text-center">
            No approved comments yet. Be the first to start the conversation!
          </p>
        ) : (
          comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              onReplySubmit={handleSubmit}
              loading={loading}
              statusMessage={statusMessage}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
            />
          ))
        )}
      </div>
    </section>
  );
}
