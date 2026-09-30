"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { saveSettingsAction } from "@/app/actions/admin";
import { Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { GeneralFields } from "./general-fields";
import { CommunityFields } from "./community-fields";
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
    const settingsMap: Record<string, string> = {
      allowComments: "false",
      autoApproveComments: "false",
    };

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
        <h2 className="text-lg font-bold font-heading">Publication & System Configuration</h2>

        <GeneralFields settings={initialSettings} />
        <CommunityFields settings={initialSettings} />

        <div className="pt-2">
          <Button type="submit" size="sm" disabled={loading} className="gap-2 text-xs">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Configuration</span>
          </Button>
        </div>
      </form>

      <BackupCard />
    </div>
  );
}
