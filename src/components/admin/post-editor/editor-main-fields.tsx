"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownEditor } from "@/components/admin/markdown-editor";

interface EditorMainFieldsProps {
  title: string;
  onTitleChange: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  manualSlug: boolean;
  setManualSlug: (v: boolean) => void;
  excerpt: string;
  setExcerpt: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  onAutosave: () => void;
}

export function EditorMainFields({
  title,
  onTitleChange,
  slug,
  setSlug,
  manualSlug,
  setManualSlug,
  excerpt,
  setExcerpt,
  content,
  setContent,
  onAutosave,
}: EditorMainFieldsProps) {
  return (
    <div className="xl:col-span-9 lg:col-span-8 space-y-6">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase font-mono" htmlFor="title">
          Article Title *
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g. Architecting Distributed Systems with Cloudflare Workers"
          className="text-lg font-bold font-heading h-12"
          required
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-muted-foreground uppercase font-mono" htmlFor="slug">
            URL Slug *
          </label>
          <button
            type="button"
            onClick={() => setManualSlug(!manualSlug)}
            className="text-[11px] text-primary hover:underline font-mono cursor-pointer"
          >
            {manualSlug ? "Auto-generate from title" : "Edit slug manually"}
          </button>
        </div>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => {
            setManualSlug(true);
            setSlug(e.target.value);
          }}
          placeholder="url-slug-here"
          className="font-mono text-xs h-9"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase font-mono" htmlFor="excerpt">
          Article Excerpt / Subtitle
        </label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="A concise summary of the article for cards, social previews, and search engines..."
          rows={2}
          className="text-xs resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">
          Article Content (Markdown / MDX) *
        </label>
        <MarkdownEditor
          initialContent={content}
          onChange={setContent}
          onAutosave={onAutosave}
        />
      </div>
    </div>
  );
}
