"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Trash2, ExternalLink } from "lucide-react";

export interface CommentRow {
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

interface CommentCardProps {
  comment: CommentRow;
  loading: boolean;
  onModerate: (id: string, status: "approved" | "rejected") => void;
  onDelete: (id: string) => void;
}

export function CommentCard({
  comment,
  loading,
  onModerate,
  onDelete,
}: CommentCardProps) {
  return (
    <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-foreground">
              {comment.authorName}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              &lt;{comment.authorEmail}&gt;
            </span>
            <Badge
              variant={
                comment.status === "approved"
                  ? "default"
                  : comment.status === "pending"
                  ? "secondary"
                  : "destructive"
              }
              className="text-[10px] capitalize"
            >
              {comment.status}
            </Badge>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span>On article:</span>
            <Link
              href={`/blog/${comment.postSlug}`}
              target="_blank"
              className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>{comment.postTitle}</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </Link>
          </div>
        </div>

        <time className="text-[11px] text-muted-foreground font-mono">
          {new Date(comment.createdAt).toLocaleString()}
        </time>
      </div>

      <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">
        {comment.content}
      </p>

      <div className="flex items-center justify-end gap-2 pt-2">
        {comment.status !== "approved" && (
          <Button
            type="button"
            size="sm"
            disabled={loading}
            onClick={() => onModerate(comment.id, "approved")}
            className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Check className="w-3 h-3" />
            <span>Approve</span>
          </Button>
        )}

        {comment.status !== "rejected" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => onModerate(comment.id, "rejected")}
            className="h-7 text-xs gap-1 text-amber-600 hover:text-amber-700"
          >
            <X className="w-3 h-3" />
            <span>Reject</span>
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={loading}
          onClick={() => onDelete(comment.id)}
          className="h-7 text-xs gap-1 text-destructive hover:text-destructive"
        >
          <Trash2 className="w-3 h-3" />
          <span>Delete</span>
        </Button>
      </div>
    </div>
  );
}
