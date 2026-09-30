"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveSettingsAction } from "@/app/actions/admin";
import { Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { BackupCard } from "./backup-card";

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
    const settingsMap: Record<string, string> = {};
    formData.forEach((value, key) => {
      settingsMap[key] = value.toString();
    });

    const result = await saveSettingsAction(settingsMap);
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
              Contact Email
            </label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={initialSettings.contactEmail || "contact@cloudblog.local"}
              className="h-9 text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="aboutText">
            About Summary
          </label>
          <Textarea
            id="aboutText"
            name="aboutText"
            defaultValue={initialSettings.aboutText || ""}
            rows={3}
            className="text-xs resize-none"
          />
        </div>

        <div className="pt-2">
          <Button type="submit" size="sm" disabled={loading} className="gap-2 text-xs">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Settings</span>
          </Button>
        </div>
      </form>

      <BackupCard />
    </div>
  );
}
