"use client";

import { useState } from "react";
import { LayoutTemplate, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ARTICLE_TEMPLATES, type ArticleTemplate } from "@/lib/editor/templates";

interface TemplatePickerDialogProps {
  onSelectTemplate: (template: ArticleTemplate) => void;
}

export function TemplatePickerDialog({ onSelectTemplate }: TemplatePickerDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (tmpl: ArticleTemplate) => {
    onSelectTemplate(tmpl);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className: "h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground",
        })}
      >
        <LayoutTemplate className="w-3.5 h-3.5 text-primary" />
        <span>Templates</span>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-primary" />
            <span>Choose Article Template</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
          {ARTICLE_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => handleSelect(tmpl)}
              className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                    {tmpl.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {tmpl.category}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <div className="flex items-center justify-end text-xs text-primary font-medium gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Use Template</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
