"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";

interface EditorSidebarSeoProps {
  title: string;
  seoTitle: string;
  setSeoTitle: (title: string) => void;
  seoDescription: string;
  setSeoDescription: (desc: string) => void;
  canonicalUrl: string;
  setCanonicalUrl: (url: string) => void;
}

export function EditorSidebarSeo({
  title,
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  canonicalUrl,
  setCanonicalUrl,
}: EditorSidebarSeoProps) {
  return (
    <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-3">
      <h3 className="font-bold text-sm font-heading flex items-center gap-1.5">
        <Search className="w-3.5 h-3.5 text-primary" />
        <span>SEO &amp; Social Previews</span>
      </h3>

      <div className="space-y-1">
        <label className="text-[11px] text-muted-foreground font-medium" htmlFor="seoTitle">
          Custom SEO Title (Optional)
        </label>
        <Input
          id="seoTitle"
          value={seoTitle}
          onChange={(e) => setSeoTitle(e.target.value)}
          placeholder={title || "Article title..."}
          maxLength={70}
          className="h-8 text-xs"
        />
        <span className="text-[10px] text-muted-foreground font-mono">
          {seoTitle.length}/70 chars
        </span>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] text-muted-foreground font-medium" htmlFor="seoDesc">
          Meta Description (Optional)
        </label>
        <Textarea
          id="seoDesc"
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
          placeholder="160 characters summary for Google & Twitter cards..."
          maxLength={160}
          rows={2}
          className="text-xs resize-none"
        />
        <span className="text-[10px] text-muted-foreground font-mono">
          {seoDescription.length}/160 chars
        </span>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] text-muted-foreground font-medium" htmlFor="canonicalUrl">
          Canonical URL (Optional)
        </label>
        <Input
          id="canonicalUrl"
          value={canonicalUrl}
          onChange={(e) => setCanonicalUrl(e.target.value)}
          placeholder="https://yourdomain.com/blog/slug"
          className="h-8 text-xs font-mono"
        />
      </div>
    </div>
  );
}
