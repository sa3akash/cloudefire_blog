"use client";

import { Button } from "@/components/ui/button";
import { Edit3, Eye, Columns } from "lucide-react";

interface ModeSwitcherProps {
  mode: "write" | "preview" | "split";
  setMode: (mode: "write" | "preview" | "split") => void;
}

export function ModeSwitcher({ mode, setMode }: ModeSwitcherProps) {
  return (
    <div className="flex items-center gap-0.5 bg-muted/50 p-0.5 rounded-lg border border-border/80">
      <Button
        type="button"
        variant={mode === "write" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setMode("write")}
        className="h-7 px-2.5 text-xs font-semibold gap-1.5"
        title="Edit Markdown (Ctrl+Shift+W)"
      >
        <Edit3 className="h-3.5 w-3.5" />
        <span>Write</span>
      </Button>
      <Button
        type="button"
        variant={mode === "split" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setMode("split")}
        className="h-7 px-2.5 text-xs font-semibold gap-1.5 hidden md:flex"
        title="Side-by-side editing and live preview"
      >
        <Columns className="h-3.5 w-3.5" />
        <span>Split</span>
      </Button>
      <Button
        type="button"
        variant={mode === "preview" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setMode("preview")}
        className="h-7 px-2.5 text-xs font-semibold gap-1.5"
        title="Full-page GitHub README preview"
      >
        <Eye className="h-3.5 w-3.5" />
        <span>Preview</span>
      </Button>
    </div>
  );
}
