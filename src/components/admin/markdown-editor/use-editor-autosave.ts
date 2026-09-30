"use client";

import { useState, useEffect } from "react";
import { renderMarkdown } from "@/lib/markdown";

export function useEditorAutosave(
  content: string,
  onAutosave?: (content: string) => void
) {
  const [renderedPreview, setRenderedPreview] = useState("");
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    let active = true;
    renderMarkdown(content).then((html) => {
      if (active) setRenderedPreview(html);
    });
    return () => {
      active = false;
    };
  }, [content]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSaved && onAutosave) {
        onAutosave(content);
        setIsSaved(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [content, isSaved, onAutosave]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSaved) {
        e.preventDefault();
        return "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isSaved]);

  return { renderedPreview, isSaved, setIsSaved };
}
