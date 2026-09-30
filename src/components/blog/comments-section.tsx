"use client";

import { useState } from "react";
import { MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PublicComment } from "@/lib/services/comments";
import { submitCommentAction } from "@/app/actions/comments";

interface CommentsSectionProps {
  postId: string;
  initialComments: PublicComment[];
  allowComments?: boolean;
}

export function CommentsSection({
  postId,
  initialComments,
  allowComments = true,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<PublicComment[]>(initialComments);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("postId", postId);

    const result = await submitCommentAction(formData);

    setLoading(false);

    if (result.success) {
      setStatusMessage({ type: "success", text: result.message });
      form.reset();

      if (result.status === "approved" && result.commentId) {
        setComments((prev) => [
          {
            id: result.commentId!,
            authorName: (formData.get("authorName") as string) || "Anonymous",
            content: (formData.get("content") as string) || "",
            createdAt: new Date(),
          },
          ...prev,
        ]);
      }
    } else {
      setStatusMessage({ type: "error", text: result.message });
    }
  };

  return (
    <section className="space-y-8 pt-10 border-t border-border/70" id="comments">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold font-heading tracking-tight">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment submission form */}
      {allowComments ? (
        <div className="p-6 rounded-xl border border-border/80 bg-card/60 space-y-4">
          <h4 className="font-semibold text-sm">Join the discussion</h4>

          {statusMessage && (
            <div
              className={`p-3.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                statusMessage.type === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-destructive/10 border border-destructive/20 text-destructive"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field for spam prevention (hidden from real users) */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="authorName">
                  Your Name *
                </label>
                <Input
                  id="authorName"
                  name="authorName"
                  placeholder="e.g. Jane Doe"
                  required
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="authorEmail">
                  Your Email * (Kept private)
                </label>
                <Input
                  id="authorEmail"
                  name="authorEmail"
                  type="email"
                  placeholder="jane@example.com"
                  required
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="content">
                Comment *
              </label>
              <Textarea
                id="content"
                name="content"
                placeholder="Share your thoughts or feedback on this article..."
                rows={3}
                required
                className="text-xs resize-none"
              />
            </div>

            <Button type="submit" size="sm" disabled={loading} className="gap-1.5 text-xs">
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? "Submitting..." : "Post Comment"}</span>
            </Button>
          </form>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">
          Comments are currently closed for this article.
        </p>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 italic">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => {
            const dateStr = new Date(comment.createdAt).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            );

            return (
              <div
                key={comment.id}
                className="p-4 rounded-xl border border-border/60 bg-card space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">
                    {comment.authorName}
                  </span>
                  <span className="text-muted-foreground font-mono">
                    {dateStr}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {comment.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
