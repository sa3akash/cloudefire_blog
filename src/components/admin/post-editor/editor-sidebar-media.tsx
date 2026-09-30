"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from "lucide-react";

interface EditorSidebarMediaProps {
  coverImage: string;
  setCoverImage: (url: string) => void;
  uploadingCover: boolean;
  onCoverUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EditorSidebarMedia({
  coverImage,
  setCoverImage,
  uploadingCover,
  onCoverUpload,
}: EditorSidebarMediaProps) {
  return (
    <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-4">
      <h3 className="font-bold text-sm font-heading">Featured Cover Image</h3>

      {coverImage ? (
        <div className="space-y-2">
          <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCoverImage("")}
            className="w-full text-xs h-7 text-destructive hover:text-destructive"
          >
            Remove Cover Image
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border/80 hover:border-primary/50 rounded-xl cursor-pointer bg-muted/10 transition-colors">
            {uploadingCover ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                <span className="text-xs font-medium">Upload to R2</span>
                <span className="text-[10px] text-muted-foreground">
                  PNG, JPG, WebP, AVIF up to 5MB
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={onCoverUpload}
              disabled={uploadingCover}
              className="hidden"
            />
          </label>

          <div className="space-y-1">
            <span className="text-[11px] text-muted-foreground">Or enter image URL:</span>
            <Input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="h-8 text-xs font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
}
