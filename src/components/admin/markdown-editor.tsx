"use client";

import { useState, useRef, useEffect } from "react";
import { calculateReadingTime } from "@/lib/markdown";
import { uploadMediaAction } from "@/app/actions/admin";
import { EditorToolbar } from "./markdown-editor/editor-toolbar";
import { EditorPane } from "./markdown-editor/editor-pane";
import { EditorFooter } from "./markdown-editor/editor-footer";
import { useEditorAutosave } from "./markdown-editor/use-editor-autosave";
import { useEditorShortcuts } from "./markdown-editor/use-editor-shortcuts";
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { renderedPreview, isSaved, setIsSaved } = useEditorAutosave(content, onAutosave);

  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = calculateReadingTime(content);

  const insertText = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;
    const selected = currentVal.substring(start, end) || placeholder;

    const newVal = currentVal.substring(0, start) + before + selected + after + currentVal.substring(end);
    setContent(newVal);
    setIsSaved(false);
    onChange(newVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  useEditorShortcuts({
    onSave: () => onAutosave?.(content),
    onPublish,
    onOpenPalette: () => setPaletteOpen(true),
    insertText,
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSaved && content.length > 50) e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isSaved, content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    setIsSaved(false);
    onChange(val);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", file.name.replace(/\.[^/.]+$/, ""));

    const result = await uploadMediaAction(formData);
    setUploadingImage(false);

    if (result.success && result.data) {
      const data = result.data as { url: string; fileName: string };
      insertText(`\n![${data.fileName}](${data.url})\n`);
    } else {
      alert(result.message || "Failed to upload image to R2");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <EditorToolbar
        mode={mode}
        setMode={setMode}
        insertText={insertText}
        uploadingImage={uploadingImage}
        onImageUpload={handleImageUpload}
        fileInputRef={fileInputRef}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <EditorPane
        mode={mode}
        content={content}
        renderedPreview={renderedPreview}
        textareaRef={textareaRef}
        onChange={handleChange}
      />

      <EditorFooter
        charCount={charCount}
        wordCount={wordCount}
        readingTime={readingTime}
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
