"use client";

import { useState } from "react";
import { MessageSquareReply } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicComment } from "@/lib/services/comments";
import { CommentForm } from "./comment-form";

interface CommentItemProps {
  comment: PublicComment;
  onReplySubmit: (e: React.FormEvent<HTMLFormElement>, parentId?: string | null) => Promise<void>;
  loading: boolean;
  statusMessage: { type: "success" | "error"; text: string } | null;
  activeReplyId: string | null;
  setActiveReplyId: (id: string | null) => void;
  depth?: number;
}

export function CommentItem({
  comment,
  onReplySubmit,
  loading,
  statusMessage,
  activeReplyId,
  setActiveReplyId,
  depth = 0,
}: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(true);
  const isReplying = activeReplyId === comment.id;
  const hasReplies = comment.replies && comment.replies.length > 0;

  const formattedDate = new Date(comment.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className={`space-y-3 ${depth > 0 ? "ml-5 pl-4 border-l-2 border-primary/20" : ""}`}>
      <article className="p-4 rounded-xl border border-border/70 bg-card space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              {comment.authorName[0]?.toUpperCase() || "A"}
            </div>
            <span className="font-semibold text-xs">{comment.authorName}</span>
          </div>
          <div className="flex items-center gap-3">
            <time className="text-[11px] text-muted-foreground font-mono">{formattedDate}</time>
            {depth < 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveReplyId(isReplying ? null : comment.id)}
                className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1"
              >
                <MessageSquareReply className="w-3 h-3" />
                <span>Reply</span>
              </Button>
            )}
          </div>
        </div>

        <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed pl-8">
          {comment.content}
        </p>

        {hasReplies && (
          <div className="pl-8 pt-1">
            <button
              type="button"
              onClick={() => setShowReplies(!showReplies)}
              className="text-[11px] text-primary hover:underline font-medium"
            >
              {showReplies ? "Hide replies" : `View ${comment.replies!.length} replies`}
            </button>
          </div>
        )}
      </article>

      {isReplying && (
        <div className="pl-6">
          <CommentForm
            onSubmit={onReplySubmit}
            loading={loading}
            statusMessage={statusMessage}
            parentId={comment.id}
            replyToName={comment.authorName}
            onCancelReply={() => setActiveReplyId(null)}
          />
        </div>
      )}

      {hasReplies && showReplies && (
        <div className="space-y-3 pt-1">
          {comment.replies!.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReplySubmit={onReplySubmit}
              loading={loading}
              statusMessage={statusMessage}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
