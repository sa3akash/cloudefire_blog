"use client";

import { Button } from "@/components/ui/button";
import { Edit3, Eye, Columns } from "lucide-react";

interface ModeSwitcherProps {
  mode: "write" | "preview" | "split";
  setMode: (mode: "write" | "preview" | "split") => void;
}

export function ModeSwitcher({ mode, setMode }: ModeSwitcherProps) {
  return (
    <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
      <Button
        type="button"
        variant={mode === "write" ? "default" : "ghost"}
        size="sm"
        onClick={() => setMode("write")}
        className="h-7 px-2 text-xs gap-1"
      >
        <Edit3 className="h-3 w-3" />
        <span>Write</span>
      </Button>
      <Button
        type="button"
        variant={mode === "preview" ? "default" : "ghost"}
        size="sm"
        onClick={() => setMode("preview")}
        className="h-7 px-2 text-xs gap-1"
      >
        <Eye className="h-3 w-3" />
        <span>Preview</span>
      </Button>
      <Button
        type="button"
        variant={mode === "split" ? "default" : "ghost"}
        size="sm"
        onClick={() => setMode("split")}
        className="h-7 px-2 text-xs gap-1 hidden md:flex"
      >
        <Columns className="h-3 w-3" />
        <span>Split</span>
      </Button>
    </div>
  );
}
