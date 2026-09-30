"use client";

import { RefObject } from "react";
import { Upload, Loader2, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormatButtons } from "./format-buttons";
import { AlertButtons } from "./alert-buttons";
import { ModeSwitcher } from "./mode-switcher";
import { SnippetsDropdown } from "./snippets-dropdown";
import { TemplatePickerDialog } from "./template-picker-dialog";
import { OutlineGeneratorDialog } from "./outline-generator-dialog";
import { EditorFileActions } from "./editor-file-actions";
import type { ArticleTemplate } from "@/lib/editor/templates";

interface EditorToolbarProps {
  mode: "write" | "preview" | "split";
  setMode: (mode: "write" | "preview" | "split") => void;
  insertText: (before: string, after?: string, placeholder?: string) => void;
  uploadingImage: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onOpenPalette?: () => void;
  onSelectTemplate: (template: ArticleTemplate) => void;
  onInsertOutline: (markdown: string) => void;
  content: string;
  onImportMarkdown?: (text: string) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function EditorToolbar({
  mode,
  setMode,
  insertText,
  uploadingImage,
  onImageUpload,
  fileInputRef,
  onOpenPalette,
  onSelectTemplate,
  onInsertOutline,
  content,
  onImportMarkdown,
  isFullscreen,
  onToggleFullscreen,
}: EditorToolbarProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-border/80 bg-muted/30 flex-wrap gap-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        <FormatButtons insertText={insertText} />
        <AlertButtons insertText={insertText} />

        <div className="w-px h-5 bg-border mx-1" />

        <SnippetsDropdown onInsertSnippet={(s) => insertText(s)} />
        <TemplatePickerDialog onSelectTemplate={onSelectTemplate} />
        <OutlineGeneratorDialog onInsertOutline={onInsertOutline} />

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

        {onOpenPalette && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onOpenPalette}
            className="h-8 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
            title="Open Command Palette (Ctrl+K or Ctrl+/)"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[10px] font-mono border border-border px-1 rounded">⌘K</span>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <EditorFileActions
          content={content}
          onImportMarkdown={onImportMarkdown}
          isFullscreen={isFullscreen}
          onToggleFullscreen={onToggleFullscreen}
        />
        <div className="w-px h-5 bg-border" />
        <ModeSwitcher mode={mode} setMode={setMode} />
      </div>
    </div>
  );
}
