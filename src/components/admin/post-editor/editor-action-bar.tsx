"use client";

import { TemplatePickerDialog } from "@/components/admin/markdown-editor/template-picker-dialog";
import { OutlineGeneratorDialog } from "@/components/admin/markdown-editor/outline-generator-dialog";
import { VersionHistoryDialog } from "./version-history-dialog";
import { ImportExportButtons } from "./import-export-buttons";
import { ResponsivePreviewDialog } from "./responsive-preview-dialog";
import type { ArticleTemplate } from "@/lib/editor/templates";

interface EditorActionBarProps {
  postId?: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  renderedHtml: string;
  coverImage?: string;
  onSelectTemplate: (template: ArticleTemplate) => void;
  onInsertOutline: (markdown: string) => void;
  onImport: (imported: { title?: string; excerpt?: string; content: string }) => void;
}

export function EditorActionBar({
  postId,
  title,
  slug,
  excerpt,
  content,
  renderedHtml,
  coverImage,
  onSelectTemplate,
  onInsertOutline,
  onImport,
}: EditorActionBarProps) {
  return (
    <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-card border border-border/80 flex-wrap">
      <div className="flex items-center gap-1.5 flex-wrap">
        <TemplatePickerDialog onSelectTemplate={onSelectTemplate} />
        <OutlineGeneratorDialog currentTitle={title} onInsertOutline={onInsertOutline} />
        <ImportExportButtons
          title={title}
          slug={slug}
          excerpt={excerpt}
          content={content}
          onImport={onImport}
        />
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {postId && <VersionHistoryDialog postId={postId} />}
        <ResponsivePreviewDialog
          title={title}
          excerpt={excerpt}
          content={content}
          renderedHtml={renderedHtml}
          coverImage={coverImage}
        />
      </div>
    </div>
  );
}
