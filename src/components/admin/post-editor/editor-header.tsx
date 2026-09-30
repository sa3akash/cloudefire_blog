"use client";

import { Button } from "@/components/ui/button";
import { Globe, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface EditorHeaderProps {
  isEditing: boolean;
  slug: string;
  saving: boolean;
  feedback: { type: "success" | "error"; message: string } | null;
  onSave: (status?: "draft" | "published") => void;
}

export function EditorHeader({
  isEditing,
  slug,
  saving,
  feedback,
  onSave,
}: EditorHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight">
          {isEditing ? "Edit Article" : "Create New Article"}
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          {slug ? `/blog/${slug}` : "Draft will be saved to Cloudflare D1"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {feedback && (
          <div
            className={`text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
              feedback.type === "success"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={saving}
          onClick={() => onSave("draft")}
          className="text-xs"
        >
          Save Draft
        </Button>

        <Button
          type="button"
          size="sm"
          disabled={saving}
          onClick={() => onSave("published")}
          className="text-xs gap-1.5 shadow-xs"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Globe className="w-3.5 h-3.5" />
          )}
          <span>Publish to Edge</span>
        </Button>
      </div>
    </div>
  );
}
