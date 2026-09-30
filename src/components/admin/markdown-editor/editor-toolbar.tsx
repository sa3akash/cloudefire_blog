"use client";

import { RefObject } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormatButtons } from "./format-buttons";
import { ModeSwitcher } from "./mode-switcher";

interface EditorToolbarProps {
  mode: "write" | "preview" | "split";
  setMode: (mode: "write" | "preview" | "split") => void;
  insertText: (before: string, after?: string, placeholder?: string) => void;
  uploadingImage: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export function EditorToolbar({
  mode,
  setMode,
  insertText,
  uploadingImage,
  onImageUpload,
  fileInputRef,
}: EditorToolbarProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-border/80 bg-muted/30 flex-wrap gap-2">
      <div className="flex items-center gap-1 flex-wrap">
        <FormatButtons insertText={insertText} />

        <div className="w-px h-5 bg-border mx-1" />

        <input
          type="file"
          ref={fileInputRef}
          onChange={onImageUpload}
          accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
          className="hidden"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={uploadingImage}
          onClick={() => fileInputRef.current?.click()}
          className="h-8 gap-1.5 px-2 text-xs"
          title="Upload image to Cloudflare R2"
        >
          {uploadingImage ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5 text-primary" />
          )}
          <span className="hidden sm:inline">Upload Image</span>
        </Button>
      </div>

      <ModeSwitcher mode={mode} setMode={setMode} />
    </div>
  );
}
