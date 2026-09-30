"use client";

import { useMemo } from "react";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface SeoAssistantProps {
  title: string;
  seoDescription: string;
  content: string;
  hasCoverImage: boolean;
  hasCategory: boolean;
}

export function SeoAssistant({
  title,
  seoDescription,
  content,
  hasCoverImage,
  hasCategory,
}: SeoAssistantProps) {
  const analysis = useMemo(() => {
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const hasHeadings = /^##\s+.+$/m.test(content);
    const titleLen = title.trim().length;
    const descLen = seoDescription.trim().length;

    const checks = [
      {
        id: "title",
        label: "Title Length",
        passed: titleLen >= 30 && titleLen <= 70,
        tip: `Current: ${titleLen} chars (Recommended: 40-60)`,
      },
      {
        id: "desc",
        label: "Meta Description",
        passed: descLen >= 100 && descLen <= 165,
        tip: `Current: ${descLen} chars (Recommended: 120-160)`,
      },
      {
        id: "words",
        label: "Content Depth",
        passed: wordCount >= 300,
        tip: `Current: ${wordCount} words (Recommended: 300+)`,
      },
      {
        id: "headings",
        label: "H2 Section Headings",
        passed: hasHeadings,
        tip: hasHeadings ? "Good structure with H2 sections" : "Add ## headings for scannability",
      },
      {
        id: "cover",
        label: "Cover / OG Image",
        passed: hasCoverImage,
        tip: hasCoverImage ? "Cover image configured" : "Add a cover image for social cards",
      },
      {
        id: "category",
        label: "Category Taxonomy",
        passed: hasCategory,
        tip: hasCategory ? "Category assigned" : "Select a category for better indexing",
      },
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);

    return { checks, score };
  }, [title, seoDescription, content, hasCoverImage, hasCategory]);

  const scoreBadgeColor =
    analysis.score >= 80
      ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/30"
      : analysis.score >= 50
      ? "text-amber-500 bg-amber-500/10 border-amber-500/30"
      : "text-rose-500 bg-rose-500/10 border-rose-500/30";

  return (
    <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-semibold text-xs">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>SEO Assistant</span>
        </div>
        <div className={`px-2 py-0.5 rounded-full border text-[11px] font-bold font-mono ${scoreBadgeColor}`}>
          Score: {analysis.score}/100
        </div>
      </div>

      <div className="space-y-2">
        {analysis.checks.map((chk) => (
          <div key={chk.id} className="flex items-start justify-between text-xs gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              {chk.passed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              )}
              <span className={`font-medium truncate ${chk.passed ? "text-foreground" : "text-muted-foreground"}`}>
                {chk.label}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0 font-mono text-right">
              {chk.tip}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
