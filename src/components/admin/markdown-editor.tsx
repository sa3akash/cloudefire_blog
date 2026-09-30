"use client";

import { useState, useRef, useEffect } from "react";
import { calculateReadingTime } from "@/lib/markdown";
import { cn } from "@/lib/utils";
import type { ArticleTemplate } from "@/lib/editor/templates";
import { EditorToolbar } from "./markdown-editor/editor-toolbar";
import { EditorPane } from "./markdown-editor/editor-pane";
import { EditorFooter } from "./markdown-editor/editor-footer";
import { useEditorAutosave } from "./markdown-editor/use-editor-autosave";
import { useEditorShortcuts } from "./markdown-editor/use-editor-shortcuts";
import { useEditorImageUpload } from "./markdown-editor/use-editor-image-upload";
import { useEditorInsert } from "./markdown-editor/use-editor-insert";
import { CommandPalette } from "./markdown-editor/command-palette";

interface MarkdownEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
  onAutosave?: (content: string) => void;
  onPublish?: () => void;
}

export function MarkdownEditor({
  initialContent,
  onChange,
  onAutosave,
  onPublish,
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [prevInitial, setPrevInitial] = useState(initialContent);

  if (initialContent !== prevInitial) {
    setPrevInitial(initialContent);
    setContent(initialContent);
  }

  const [mode, setMode] = useState<"write" | "preview" | "split">("split");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { renderedPreview, isSaved, setIsSaved } = useEditorAutosave(content, onAutosave);
  const insertText = useEditorInsert(textareaRef, content, setContent, setIsSaved, onChange);
  const {
    uploadingImage, isDragging, setIsDragging,
    fileInputRef, handleImageUpload, handlePaste, handleDrop,
  } = useEditorImageUpload(insertText);

  useEditorShortcuts({
    onSave: () => onAutosave?.(content),
    onPublish,
    onOpenPalette: () => setPaletteOpen(true),
    insertText,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const handleSelectTemplate = (tmpl: ArticleTemplate) => {
    if (!content.trim()) {
      setContent(tmpl.content);
      onChange(tmpl.content);
      setIsSaved(false);
      return;
    }
    const replace = window.confirm(
      `Replace current content with "${tmpl.name}" template?\n\nClick OK to replace, or Cancel to append to bottom.`
    );
    const updated = replace ? tmpl.content : `${content}\n\n---\n\n${tmpl.content}`;
    setContent(updated);
    onChange(updated);
    setIsSaved(false);
  };

  const handleImportMarkdown = (imported: string) => {
    setContent(imported);
    onChange(imported);
    setIsSaved(false);
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs transition-all",
        isFullscreen && "fixed inset-0 z-50 rounded-none border-0 h-screen w-screen"
      )}
    >
      <EditorToolbar
        mode={mode}
        setMode={setMode}
        insertText={insertText}
        uploadingImage={uploadingImage}
        onImageUpload={handleImageUpload}
        fileInputRef={fileInputRef}
        onOpenPalette={() => setPaletteOpen(true)}
        onSelectTemplate={handleSelectTemplate}
        onInsertOutline={(md) => insertText(md)}
        content={content}
        onImportMarkdown={handleImportMarkdown}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
      />

      <EditorPane
        mode={mode}
        content={content}
        renderedPreview={renderedPreview}
        textareaRef={textareaRef}
        onChange={(e) => {
          setContent(e.target.value);
          setIsSaved(false);
          onChange(e.target.value);
        }}
        isFullscreen={isFullscreen}
        onPaste={handlePaste}
        onDrop={handleDrop}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />

      <EditorFooter
        charCount={content.length}
        wordCount={content.trim() ? content.trim().split(/\s+/).length : 0}
        readingTime={calculateReadingTime(content)}
        isSaved={isSaved}
      />

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        insertText={insertText}
        onSave={() => onAutosave?.(content)}
        onPublish={onPublish}
      />
    </div>
  );
}
