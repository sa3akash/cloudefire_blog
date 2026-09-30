"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Trash2 } from "lucide-react";
import type { Media } from "@/lib/db";

interface MediaCardProps {
  item: Media;
  isCopied: boolean;
  onCopy: (url: string, id: string) => void;
  onDelete: (id: string, name: string) => void;
}

export function MediaCard({ item, isCopied, onCopy, onDelete }: MediaCardProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="group rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between">
      <div className="relative aspect-video w-full bg-muted/40 overflow-hidden border-b border-border/50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt={item.altText || item.fileName}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-[10px] font-mono backdrop-blur-md bg-background/80">
            {formatSize(item.sizeBytes)}
          </Badge>
        </div>
      </div>

      <div className="p-3.5 space-y-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate" title={item.fileName}>
            {item.fileName}
          </p>
          <p className="text-[10px] text-muted-foreground font-mono">
            {item.mimeType}
          </p>
        </div>

        <div className="flex items-center gap-1.5 pt-1 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onCopy(item.url, item.id)}
            className="flex-1 text-[11px] h-7 gap-1"
          >
            {isCopied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy URL</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item.id, item.fileName)}
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            title="Delete from R2"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
