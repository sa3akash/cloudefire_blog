"use client";

interface EditorFooterProps {
  charCount: number;
  wordCount: number;
  readingTime: number;
  isSaved: boolean;
}

export function EditorFooter({
  charCount,
  wordCount,
  readingTime,
  isSaved,
}: EditorFooterProps) {
  return (
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
  );
}
