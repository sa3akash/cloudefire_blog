"use client";

import { useState } from "react";
import { History, RotateCcw, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getPostVersionsAction,
  restorePostVersionAction,
} from "@/app/actions/admin";
import type { VersionSummary } from "@/lib/services/post-versions";
import { getPostVersionDetailAction } from "@/app/actions/admin/versions";

interface VersionHistoryDialogProps {
  postId?: string | null;
  onRestored?: () => void;
}

export function VersionHistoryDialog({ postId, onRestored }: VersionHistoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState<VersionSummary[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<{
    id: string;
    versionNumber: number;
    title: string;
    content: string;
  } | null>(null);
  const [restoring, setRestoring] = useState(false);

  const loadVersions = async () => {
    if (!postId) return;
    setLoading(true);
    const res = await getPostVersionsAction(postId);
    setLoading(false);
    if (res.success && res.data) {
      setVersions(res.data as VersionSummary[]);
    }
  };

  const selectVersion = async (id: string) => {
    const res = await getPostVersionDetailAction(id);
    if (res.success && res.data) {
      setSelectedVersion(res.data as { id: string; versionNumber: number; title: string; content: string });
    }
  };

  const handleRestore = async (versionId: string) => {
    if (!confirm("Are you sure you want to restore this version? Your current state will be preserved as a new version.")) return;
    setRestoring(true);
    const res = await restorePostVersionAction(versionId);
    setRestoring(false);
    if (res.success) {
      setOpen(false);
      onRestored?.();
      window.location.reload();
    } else {
      alert(res.message || "Failed to restore version");
    }
  };

  if (!postId) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) loadVersions(); }}>
      <DialogTrigger 
      
      className={buttonVariants({
        variant: "outline",
        size: "sm",
        className: "h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      })}
      >
        
          <History className="w-3.5 h-3.5 text-primary" />
          <span>Versions</span>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b border-border/80">
          <DialogTitle className="text-sm font-bold flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <span>Revision History</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="md:col-span-5 p-3 space-y-2 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-xs text-muted-foreground">Loading revisions...</div>
            ) : versions.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">No past revisions recorded yet.</div>
            ) : (
              versions.map((ver) => (
                <div
                  key={ver.id}
                  onClick={() => selectVersion(ver.id)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedVersion?.id === ver.id
                      ? "border-primary bg-primary/5"
                      : "border-border/70 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>Version {ver.versionNumber}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(ver.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate mt-1">{ver.title}</p>
                </div>
              ))
            )}
          </div>

          <div className="md:col-span-7 p-4 max-h-[60vh] overflow-y-auto space-y-4">
            {selectedVersion ? (
              <>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm">Version {selectedVersion.versionNumber} Preview</h4>
                  <Button
                    type="button"
                    size="sm"
                    disabled={restoring}
                    onClick={() => handleRestore(selectedVersion.id)}
                    className="h-7 text-xs gap-1.5"
                  >
                    {restoring ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                    <span>Restore This Version</span>
                  </Button>
                </div>
                <div className="p-3 rounded-lg bg-muted/40 border border-border/70 text-xs font-mono whitespace-pre-wrap max-h-80 overflow-y-auto">
                  {selectedVersion.content}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic">
                Select a revision on the left to preview and restore.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
