"use client";

import { RefObject } from "react";

export function useEditorInsert(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  content: string,
  setContent: (val: string) => void,
  setIsSaved: (val: boolean) => void,
  onChange: (val: string) => void
) {
  return (before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;
    const selected = currentVal.substring(start, end) || placeholder;

    const newVal = currentVal.substring(0, start) + before + selected + after + currentVal.substring(end);
    setContent(newVal);
    setIsSaved(false);
    onChange(newVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };
}
