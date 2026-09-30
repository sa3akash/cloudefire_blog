"use client";

import { CheckSquare, AlertCircle, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AlertButtonsProps {
  insertText: (before: string, after?: string, placeholder?: string) => void;
}

export function AlertButtons({ insertText }: AlertButtonsProps) {
  return (
    <>
      <div className="w-px h-5 bg-border mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("\n- [ ] ", "", "Checklist task")}
        className="h-8 w-8 p-0"
        title="Insert Task List"
      >
        <CheckSquare className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("\n> [!NOTE]\n> ", "", "Helpful context or note.")}
        className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600"
        title="Insert Note Alert"
      >
        <AlertCircle className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("\n> [!TIP]\n> ", "", "Pro-tip or performance optimization.")}
        className="h-8 w-8 p-0 text-emerald-500 hover:text-emerald-600"
        title="Insert Tip Alert"
      >
        <Sparkles className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("\n> [!WARNING]\n> ", "", "Careful: this operation has caveats.")}
        className="h-8 w-8 p-0 text-amber-500 hover:text-amber-600"
        title="Insert Warning Alert"
      >
        <AlertTriangle className="h-4 w-4" />
      </Button>
    </>
  );
}
