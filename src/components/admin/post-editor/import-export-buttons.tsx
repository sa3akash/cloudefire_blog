"use client";

import { useRef } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  exportPostAsMarkdown,
  downloadFile,
  parseImportedMarkdown,
} from "@/lib/editor/import-export";

interface ImportExportButtonsProps {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  onImport: (imported: { title?: string; excerpt?: string; content: string }) => void;
}

export function ImportExportButtons({
  title,
  slug,
  excerpt,
  content,
  onImport,
}: ImportExportButtonsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const md = exportPostAsMarkdown({
      title: title || "Untitled Article",
      slug: slug || "untitled",
      excerpt,
      content,
    });
    downloadFile(md, `${slug || "post"}.md`, "text/markdown");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseImportedMarkdown(text);
        onImport(parsed);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".md,.markdown,.txt"
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        title="Import Markdown file with frontmatter"
      >
        <Upload className="w-3.5 h-3.5 text-primary" />
        <span className="hidden sm:inline">Import .md</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleExport}
        className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        title="Export post as Markdown file"
      >
        <Download className="w-3.5 h-3.5 text-primary" />
        <span className="hidden sm:inline">Export .md</span>
      </Button>
    </>
  );
}
