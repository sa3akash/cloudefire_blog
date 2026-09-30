"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveSettingsAction } from "@/app/actions/admin";
import { Save, Download, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface SettingsFormProps {
  initialSettings: Record<string, string>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    const result = await saveSettingsAction(formData);

    setLoading(false);

    if (result.success) {
      setFeedback({ type: "success", message: result.message });
      router.refresh();
    } else {
      setFeedback({ type: "error", message: result.message });
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {feedback && (
        <div
          className={`p-3.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="p-8 rounded-2xl border border-border/80 bg-card shadow-xs space-y-6">
        <h2 className="text-lg font-bold font-heading">General Site Settings</h2>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="siteName">
            Publication Name *
          </label>
          <Input
            id="siteName"
            name="siteName"
            defaultValue={initialSettings.siteName || "CloudBlog"}
            required
            className="h-9 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="siteDesc">
            Site Description (Tagline)
          </label>
          <Textarea
            id="siteDesc"
            name="siteDescription"
            defaultValue={initialSettings.siteDescription || ""}
            rows={2}
            className="text-xs resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="postsPerPage">
              Articles Per Page
            </label>
            <Input
              id="postsPerPage"
              name="postsPerPage"
              type="number"
              min={1}
              max={50}
              defaultValue={initialSettings.postsPerPage || "6"}
              className="h-9 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="contactEmail">
              Editorial Contact Email
            </label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={initialSettings.contactEmail || "contact@cloudblog.local"}
              className="h-9 text-xs font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="aboutText">
            About Section Statement
          </label>
          <Textarea
            id="aboutText"
            name="aboutText"
            defaultValue={initialSettings.aboutText || ""}
            rows={4}
            className="text-xs resize-none"
          />
        </div>

        {/* Comment Settings */}
        <div className="pt-4 border-t border-border/60 space-y-3">
          <h3 className="text-sm font-semibold font-heading">Discussion &amp; Comments</h3>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="allowComments"
              name="allowComments"
              defaultChecked={initialSettings.allowComments === "true"}
              className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
            />
            <label htmlFor="allowComments" className="text-xs font-medium cursor-pointer">
              Enable public comments on articles
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoApproveComments"
              name="autoApproveComments"
              defaultChecked={initialSettings.autoApproveComments === "true"}
              className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
            />
            <label htmlFor="autoApproveComments" className="text-xs font-medium cursor-pointer">
              Auto-approve comments (Bypasses manual moderation queue)
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-border/60 flex items-center justify-end">
          <Button type="submit" disabled={loading} size="sm" className="gap-1.5 text-xs">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Settings</span>
          </Button>
        </div>
      </form>

      {/* Backup and Disaster Recovery Box */}
      <div className="p-8 rounded-2xl border border-border/80 bg-card shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-bold font-heading">Backup &amp; Disaster Recovery</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Export a full JSON dump of your D1 database containing all posts, categories, tags, comments, and settings.
          </p>
        </div>

        <a href="/api/admin/export" download className="inline-block">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>Download Database Backup (.json)</span>
          </Button>
        </a>
      </div>
    </div>
  );
}
