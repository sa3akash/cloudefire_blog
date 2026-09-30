"use client";

import { Info, Sparkles, AlertTriangle, ShieldAlert, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AlertButtonsProps {
  insertText: (before: string, after?: string, placeholder?: string) => void;
}

export function AlertButtons({ insertText }: AlertButtonsProps) {
  return (
    <div className="flex items-center gap-0.5">
      <div className="w-px h-5 bg-border mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("\n> [!NOTE]\n> ", "", "Helpful context or note.")}
        className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
        title="Note Alert (> [!NOTE])"
      >
        <Info className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("\n> [!TIP]\n> ", "", "Pro-tip or performance optimization.")}
        className="h-8 w-8 p-0 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
        title="Tip Alert (> [!TIP])"
      >
        <Sparkles className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("\n> [!IMPORTANT]\n> ", "", "Crucial information to remember.")}
        className="h-8 w-8 p-0 text-purple-500 hover:text-purple-600 hover:bg-purple-500/10"
        title="Important Alert (> [!IMPORTANT])"
      >
        <BookmarkCheck className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("\n> [!WARNING]\n> ", "", "Careful: this operation has caveats.")}
        className="h-8 w-8 p-0 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
        title="Warning Alert (> [!WARNING])"
      >
        <AlertTriangle className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("\n> [!CAUTION]\n> ", "", "High-risk action: proceed with caution.")}
        className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
        title="Caution Alert (> [!CAUTION])"
      >
        <ShieldAlert className="h-4 w-4" />
      </Button>
    </div>
  );
}
