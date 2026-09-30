"use client";

import { useState } from "react";
import { ListTree, Plus, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface OutlineGeneratorDialogProps {
  onInsertOutline: (markdown: string) => void;
  currentTitle?: string;
}

const DEFAULT_SECTIONS = [
  "Introduction & Core Problem",
  "Why This Technology / Approach Matters",
  "Step-by-Step Implementation",
  "Edge Cases & Common Pitfalls",
  "Performance Benchmarks",
  "Summary & Key Takeaways",
];

export function OutlineGeneratorDialog({
  onInsertOutline,
  currentTitle,
}: OutlineGeneratorDialogProps) {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState(currentTitle || "");
  const [sections, setSections] = useState<string[]>(DEFAULT_SECTIONS);
  const [newSection, setNewSection] = useState("");

  const addSection = () => {
    if (!newSection.trim()) return;
    setSections([...sections, newSection.trim()]);
    setNewSection("");
  };

  const removeSection = (idx: number) => {
    setSections(sections.filter((_, i) => i !== idx));
  };

  const handleGenerate = () => {
    let md = `## Introduction\n\nBriefly introduce ${topic || "the subject"}...\n\n`;
    sections.forEach((sec, i) => {
      md += `### ${i + 1}. ${sec}\n\nDetails and implementation for ${sec}...\n\n`;
    });
    md += `## Conclusion\n\nWrap up core takeaways and next steps.\n`;

    onInsertOutline(md);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
      className={buttonVariants({
        size: "sm",
        variant: "outline",
        className: "h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground",
      })}
      >
          <ListTree className="w-3.5 h-3.5 text-primary" />
          <span>Outline Generator</span>
      </DialogTrigger>

      <DialogContent className="max-w-md space-y-4">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold flex items-center gap-2">
            <ListTree className="w-4 h-4 text-primary" />
            <span>Generate Article Outline</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Topic or Title</label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Next.js Edge Caching Architecture"
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Sections</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg border border-border/70 bg-muted/20 text-xs"
                >
                  <span className="font-mono text-muted-foreground mr-2">{idx + 1}.</span>
                  <span className="flex-1 truncate">{sec}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(idx)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <Input
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSection())}
                placeholder="Add custom section..."
                className="h-8 text-xs"
              />
              <Button type="button" size="sm" onClick={addSection} className="h-8 px-2.5">
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <Button type="button" onClick={handleGenerate} className="w-full text-xs font-semibold h-8.5">
          Insert Outline into Article
        </Button>
      </DialogContent>
    </Dialog>
  );
}
