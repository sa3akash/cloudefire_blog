"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Table as TableIcon,
  Minus,
  Eye,
  Edit3,
  Columns,
  Upload,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { calculateReadingTime, renderMarkdown } from "@/lib/markdown";
import { uploadMediaAction } from "@/app/actions/admin";

interface MarkdownEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
  onAutosave?: (content: string) => void;
}

export function MarkdownEditor({
  initialContent,
  onChange,
  onAutosave,
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [renderedPreview, setRenderedPreview] = useState("");
  const [mode, setMode] = useState<"write" | "preview" | "split">("split");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Stats calculation
  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = calculateReadingTime(content);

  // Live render preview when preview/split is active
  useEffect(() => {
    let active = true;
    renderMarkdown(content).then((html) => {
      if (active) setRenderedPreview(html);
    });
    return () => {
      active = false;
    };
  }, [content]);

  // Autosave timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSaved && onAutosave) {
        onAutosave(content);
        setIsSaved(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [content, isSaved, onAutosave]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSaved) {
        e.preventDefault();
        return "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isSaved]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    setIsSaved(false);
    onChange(val);
  };

  const insertText = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;
    const selected = currentVal.substring(start, end) || placeholder;

    const newVal =
      currentVal.substring(0, start) +
      before +
      selected +
      after +
      currentVal.substring(end);

    setContent(newVal);
    setIsSaved(false);
    onChange(newVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    }, 0);
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
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/80 bg-muted/30 flex-wrap gap-2">
        {/* Formatting buttons */}
        <div className="flex items-center gap-1 flex-wrap">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText("## ", "", "Heading 2")}
            className="h-8 w-8 p-0"
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText("### ", "", "Heading 3")}
            className="h-8 w-8 p-0"
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <div className="w-px h-5 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText("**", "**", "bold text")}
            className="h-8 w-8 p-0"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText("*", "*", "italic text")}
            className="h-8 w-8 p-0"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText("[", "](https://example.com)", "link text")}
            className="h-8 w-8 p-0"
            title="Insert Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <div className="w-px h-5 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText("\n- ", "", "list item")}
            className="h-8 w-8 p-0"
            title="Unordered List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText("\n1. ", "", "list item")}
            className="h-8 w-8 p-0"
            title="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText("\n> ", "", "quote")}
            className="h-8 w-8 p-0"
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText("\n```typescript\n", "\n```\n", "// code here")}
            className="h-8 w-8 p-0"
            title="Code Block"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              insertText(
                "\n| Column 1 | Column 2 |\n| :--- | :--- |\n| Data 1 | Data 2 |\n"
              )
            }
            className="h-8 w-8 p-0"
            title="Insert Table"
          >
            <TableIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText("\n---\n")}
            className="h-8 w-8 p-0"
            title="Horizontal Divider"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="w-px h-5 bg-border mx-1" />
          {/* Upload image to R2 directly */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
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

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
          <Button
            type="button"
            variant={mode === "write" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode("write")}
            className="h-7 px-2 text-xs gap-1"
          >
            <Edit3 className="h-3 w-3" />
            <span>Write</span>
          </Button>
          <Button
            type="button"
            variant={mode === "preview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode("preview")}
            className="h-7 px-2 text-xs gap-1"
          >
            <Eye className="h-3 w-3" />
            <span>Preview</span>
          </Button>
          <Button
            type="button"
            variant={mode === "split" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode("split")}
            className="h-7 px-2 text-xs gap-1 hidden md:flex"
          >
            <Columns className="h-3 w-3" />
            <span>Split</span>
          </Button>
        </div>
      </div>

      {/* Main Editor Body */}
      <div className="relative min-h-[480px] grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Write Pane */}
        {(mode === "write" || mode === "split") && (
          <div className={mode === "split" ? "md:col-span-6 p-2" : "col-span-12 p-2"}>
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={handleChange}
              placeholder="Write your article in Markdown..."
              className="w-full h-full min-h-[460px] p-4 font-mono text-sm leading-relaxed resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            />
          </div>
        )}

        {/* Preview Pane */}
        {(mode === "preview" || mode === "split") && (
          <div
            className={
              mode === "split"
                ? "md:col-span-6 p-6 overflow-y-auto max-h-[600px] bg-muted/10"
                : "col-span-12 p-6 overflow-y-auto max-h-[600px] bg-muted/10"
            }
          >
            {content.trim() ? (
              <div
                className="prose-article"
                dangerouslySetInnerHTML={{ __html: renderedPreview }}
              />
            ) : (
              <div className="text-muted-foreground text-sm italic py-8 text-center">
                Markdown preview will appear here as you type...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats and Autosave Footer */}
      <div className="px-4 py-2 bg-muted/40 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <span>{charCount} characters</span>
          <span>&bull;</span>
          <span>{wordCount} words</span>
          <span>&bull;</span>
          <span>~{readingTime} min read</span>
        </div>

        <div className="flex items-center gap-2">
          {isSaved ? (
            <span className="text-emerald-500 font-sans text-xs">Saved</span>
          ) : (
            <span className="text-amber-500 font-sans text-xs">Unsaved changes</span>
          )}
        </div>
      </div>
    </div>
  );
}
