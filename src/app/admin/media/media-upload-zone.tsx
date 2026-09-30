"use client";

import { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";

interface MediaUploadZoneProps {
  uploading: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MediaUploadZone({
  uploading,
  fileInputRef,
  onUpload,
}: MediaUploadZoneProps) {
  return (
    <div className="p-8 rounded-2xl border-2 border-dashed border-border/80 bg-card/60 flex flex-col items-center justify-center text-center space-y-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onUpload}
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
        className="hidden"
      />

      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
        {uploading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <Upload className="w-6 h-6" />
        )}
      </div>

      <div>
        <h3 className="font-bold text-sm font-heading">
          {uploading ? "Uploading to Cloudflare R2..." : "Upload Media to R2 Storage"}
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mt-0.5">
          Supported formats: JPEG, PNG, WebP, AVIF, SVG. Max file size: 5 MB.
        </p>
      </div>

      <Button
        type="button"
        size="sm"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className="gap-2 text-xs"
      >
        <Upload className="w-3.5 h-3.5" />
        <span>Select Files</span>
      </Button>
    </div>
  );
}
