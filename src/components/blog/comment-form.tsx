"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, AlertCircle, X } from "lucide-react";

interface CommentFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>, parentId?: string | null) => void;
  loading: boolean;
  statusMessage: { type: "success" | "error"; text: string } | null;
  parentId?: string | null;
  replyToName?: string | null;
  onCancelReply?: () => void;
}

export function CommentForm({
  onSubmit,
  loading,
  statusMessage,
  parentId = null,
  replyToName = null,
  onCancelReply,
}: CommentFormProps) {
  return (
    <div className="p-5 rounded-xl border border-border/80 bg-card/60 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">
          {replyToName ? `Replying to @${replyToName}` : "Join the discussion"}
        </h4>
        {replyToName && onCancelReply && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancelReply}
            className="h-7 px-2 text-xs text-muted-foreground gap-1 hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </Button>
        )}
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 border border-destructive/20 text-destructive"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={(e) => onSubmit(e, parentId)} className="space-y-3.5">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        {parentId && <input type="hidden" name="parentId" value={parentId} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium" htmlFor={parentId ? `rName-${parentId}` : "cName"}>
              Name *
            </label>
            <Input
              id={parentId ? `rName-${parentId}` : "cName"}
              name="authorName"
              required
              placeholder="Your name"
              maxLength={50}
              className="text-xs h-8.5"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium" htmlFor={parentId ? `rEmail-${parentId}` : "cEmail"}>
              Email * <span className="text-[10px]">(never published)</span>
            </label>
            <Input
              id={parentId ? `rEmail-${parentId}` : "cEmail"}
              name="authorEmail"
              type="email"
              required
              placeholder="you@domain.com"
              className="text-xs h-8.5"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground font-medium" htmlFor={parentId ? `rContent-${parentId}` : "cContent"}>
            Comment *
          </label>
          <Textarea
            id={parentId ? `rContent-${parentId}` : "cContent"}
            name="content"
            required
            rows={parentId ? 2 : 3}
            placeholder={parentId ? `Write a reply to ${replyToName}...` : "Share your thoughts, feedback, or technical questions..."}
            maxLength={1000}
            className="text-xs resize-none"
          />
        </div>

        <Button type="submit" size="sm" disabled={loading} className="gap-2 text-xs font-semibold h-8.5">
          <Send className="w-3.5 h-3.5" />
          <span>{loading ? "Posting..." : parentId ? "Post Reply" : "Submit Comment"}</span>
        </Button>
      </form>
    </div>
  );
}
