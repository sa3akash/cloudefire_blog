"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

interface CommentFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  statusMessage: { type: "success" | "error"; text: string } | null;
}

export function CommentForm({ onSubmit, loading, statusMessage }: CommentFormProps) {
  return (
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
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Honeypot field for spam prevention */}
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
            <label className="text-xs text-muted-foreground font-medium" htmlFor="cName">
              Name *
            </label>
            <Input
              id="cName"
              name="authorName"
              required
              placeholder="Your name"
              maxLength={50}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium" htmlFor="cEmail">
              Email * <span className="text-[10px]">(never published)</span>
            </label>
            <Input
              id="cEmail"
              name="authorEmail"
              type="email"
              required
              placeholder="you@domain.com"
              className="text-xs h-9"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground font-medium" htmlFor="cContent">
            Comment *
          </label>
          <Textarea
            id="cContent"
            name="content"
            required
            rows={3}
            placeholder="Share your thoughts, feedback, or technical questions..."
            maxLength={1000}
            className="text-xs resize-none"
          />
        </div>

        <Button
          type="submit"
          size="sm"
          disabled={loading}
          className="gap-2 text-xs font-semibold"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{loading ? "Posting..." : "Submit Comment"}</span>
        </Button>
      </form>
    </div>
  );
}
