"use client";

import { useEffect } from "react";

interface ShortcutHandlers {
  onSave?: () => void;
  onPublish?: () => void;
  onOpenPalette?: () => void;
  insertText?: (before: string, after?: string, placeholder?: string) => void;
}

export function useEditorShortcuts({
  onSave,
  onPublish,
  onOpenPalette,
  insertText,
}: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (!modifier) return;

      // Ctrl/Cmd + S -> Save
      if (e.key === "s" && !e.shiftKey) {
        e.preventDefault();
        onSave?.();
        return;
      }

      // Ctrl/Cmd + Enter -> Publish
      if (e.key === "Enter") {
        e.preventDefault();
        onPublish?.();
        return;
      }

      // Ctrl/Cmd + K or Ctrl/Cmd + / -> Command Palette
      if (e.key === "k" || e.key === "/") {
        e.preventDefault();
        onOpenPalette?.();
        return;
      }

      // Text formatting shortcuts
      if (!insertText) return;

      if (e.key === "b" && !e.shiftKey) {
        e.preventDefault();
        insertText("**", "**", "bold text");
      } else if (e.key === "i" && !e.shiftKey) {
        e.preventDefault();
        insertText("*", "*", "italic text");
      } else if (e.key === "x" && e.shiftKey) {
        e.preventDefault();
        insertText("~~", "~~", "strikethrough");
      } else if (e.key === "1" && e.shiftKey) {
        e.preventDefault();
        insertText("# ", "", "Heading 1");
      } else if (e.key === "2" && e.shiftKey) {
        e.preventDefault();
        insertText("## ", "", "Heading 2");
      } else if (e.key === "3" && e.shiftKey) {
        e.preventDefault();
        insertText("### ", "", "Heading 3");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSave, onPublish, onOpenPalette, insertText]);
}
