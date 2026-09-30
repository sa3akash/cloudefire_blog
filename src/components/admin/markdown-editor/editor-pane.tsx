"use client";

import { RefObject, useRef } from "react";
import { UploadCloud } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { MermaidRunner } from "@/components/blog/mermaid-runner";
import { cn } from "@/lib/utils";

interface EditorPaneProps {
  mode: "write" | "preview" | "split";
  content: string;
  renderedPreview: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isFullscreen?: boolean;
  onPaste?: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
  setIsDragging?: (v: boolean) => void;
}

export function EditorPane({
  mode,
  content,
  renderedPreview,
  textareaRef,
  onChange,
  isFullscreen,
  onPaste,
  onDrop,
  isDragging,
  setIsDragging,
}: EditorPaneProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "relative grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border",
        isFullscreen ? "flex-1 min-h-0 h-full overflow-hidden" : "min-h-[620px]"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging?.(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging?.(false);
      }}
      onDrop={onDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-30 bg-primary/10 backdrop-blur-xs border-2 border-dashed border-primary rounded-xl flex flex-col items-center justify-center pointer-events-none transition-all">
          <UploadCloud className="w-10 h-10 text-primary animate-bounce mb-2" />
          <p className="text-sm font-semibold text-primary">Drop image to upload & insert into Markdown</p>
        </div>
      )}

      {(mode === "write" || mode === "split") && (
        <div
          className={cn(
            mode === "split" ? "md:col-span-6 p-3" : "col-span-12 p-3",
            isFullscreen && "h-full flex flex-col"
          )}
        >
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={onChange}
            onPaste={onPaste}
            placeholder="Write article in GitHub Flavored Markdown... (Supports drag & drop images and paste)"
            className={cn(
              "w-full p-4 font-mono text-sm leading-relaxed resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-muted-foreground/50",
              isFullscreen ? "flex-1 h-full min-h-0" : "min-h-[600px] h-full"
            )}
          />
        </div>
      )}

      {(mode === "preview" || mode === "split") && (
        <div
          ref={previewRef}
          className={cn(
            "p-6 sm:p-8 overflow-y-auto bg-card",
            mode === "split" ? "md:col-span-6" : "col-span-12",
            isFullscreen ? "h-full max-h-none" : "max-h-[760px]"
          )}
        >
          {content.trim() ? (
            <div className="max-w-4xl mx-auto">
              <div
                className="prose-article markdown-body"
                dangerouslySetInnerHTML={{ __html: renderedPreview }}
              />
              <MermaidRunner containerRef={previewRef} contentKey={renderedPreview} />
            </div>
          ) : (
            <div className="text-muted-foreground text-sm italic py-16 text-center font-mono">
              Preview will render here in authentic GitHub README format...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
