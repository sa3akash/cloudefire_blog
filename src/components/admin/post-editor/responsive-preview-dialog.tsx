"use client";

import { useState } from "react";
import { Eye, Monitor, Tablet, Smartphone } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MermaidRunner } from "@/components/blog/mermaid-runner";

interface ResponsivePreviewDialogProps {
  title: string;
  excerpt: string;
  content: string;
  renderedHtml: string;
  coverImage?: string;
}

export function ResponsivePreviewDialog({
  title,
  excerpt,
  renderedHtml,
  coverImage,
}: ResponsivePreviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const frameWidthClass =
    device === "mobile"
      ? "max-w-[390px]"
      : device === "tablet"
        ? "max-w-[768px]"
        : "max-w-4xl";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className: "h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground",
        })}
      >
        <Eye className="w-3.5 h-3.5 text-primary" />
        <span>Device Preview</span>
      </DialogTrigger>

      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="px-6 py-3 border-b border-border/80 flex flex-row items-center justify-between shrink-0">
          <DialogTitle className="text-sm font-bold flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            <span>Responsive Reader Preview</span>
          </DialogTitle>

          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
            <Button
              type="button"
              variant={device === "desktop" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setDevice("desktop")}
              className="h-7 px-2 text-xs gap-1"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </Button>
            <Button
              type="button"
              variant={device === "tablet" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setDevice("tablet")}
              className="h-7 px-2 text-xs gap-1"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </Button>
            <Button
              type="button"
              variant={device === "mobile" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setDevice("mobile")}
              className="h-7 px-2 text-xs gap-1"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-muted/30 p-6 flex justify-center">
          <div
            className={`w-full ${frameWidthClass} bg-card rounded-2xl border border-border/80 shadow-md p-6 sm:p-10 space-y-6 transition-all duration-200 self-start`}
          >
            {coverImage && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={coverImage}
                alt={title}
                className="w-full h-48 sm:h-72 object-cover rounded-xl border border-border/60"
              />
            )}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading">
                {title || "Untitled Article"}
              </h1>
              {excerpt && <p className="text-sm text-muted-foreground italic">{excerpt}</p>}
            </div>

            <div
              className="prose-article"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
            <MermaidRunner contentKey={renderedHtml} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
