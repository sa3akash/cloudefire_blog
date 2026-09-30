"use client";

import { RefObject } from "react";
import { Textarea } from "@/components/ui/textarea";

interface EditorPaneProps {
  mode: "write" | "preview" | "split";
  content: string;
  renderedPreview: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function EditorPane({
  mode,
  content,
  renderedPreview,
  textareaRef,
  onChange,
}: EditorPaneProps) {
  return (
    <div className="relative min-h-[480px] grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border">
      {(mode === "write" || mode === "split") && (
        <div className={mode === "split" ? "md:col-span-6 p-2" : "col-span-12 p-2"}>
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={onChange}
            placeholder="Write your article in Markdown..."
            className="w-full h-full min-h-[460px] p-4 font-mono text-sm leading-relaxed resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          />
        </div>
      )}

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
  );
}
