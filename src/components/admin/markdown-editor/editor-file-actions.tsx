"use client";

import { useState, useRef } from "react";
import { Copy, Check, Download, UploadCloud, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorFileActionsProps {
  content: string;
  onImportMarkdown?: (text: string) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function EditorFileActions({
  content,
  onImportMarkdown,
  isFullscreen,
  onToggleFullscreen,
}: EditorFileActionsProps) {
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `post-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string" && onImportMarkdown) {
        onImportMarkdown(text);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        title={copied ? "Copied!" : "Copy raw Markdown"}
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleDownload}
        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        title="Download as .md file"
      >
        <Download className="w-3.5 h-3.5" />
      </Button>

      {onImportMarkdown && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".md,.markdown,.txt"
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            title="Import Markdown file from computer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
          </Button>
        </>
      )}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onToggleFullscreen}
        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        title={isFullscreen ? "Exit Fullscreen (Esc)" : "Zen Fullscreen Mode"}
      >
        {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-primary" /> : <Maximize2 className="w-3.5 h-3.5" />}
      </Button>
    </div>
  );
}
