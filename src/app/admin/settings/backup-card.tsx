"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function BackupCard() {
  const handleExportBackup = async () => {
    try {
      const response = await fetch("/api/admin/export");
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cloudblog-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      alert("Failed to generate backup export. Please try again.");
    }
  };

  return (
    <div className="p-8 rounded-2xl border border-border/80 bg-card shadow-xs space-y-4">
      <div>
        <h2 className="text-lg font-bold font-heading">Database Backup &amp; Disaster Recovery</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Export your entire Cloudflare D1 content database (posts, categories, tags, comments, authors, settings) as a structured JSON file.
        </p>
      </div>

      <div className="pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleExportBackup}
          className="gap-2 text-xs"
        >
          <Download className="w-3.5 h-3.5 text-primary" />
          <span>Export Database as JSON</span>
        </Button>
      </div>
    </div>
  );
}
