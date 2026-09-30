"use client";

import { useState, useRef } from "react";
import { uploadMediaAction } from "@/app/actions/admin";

export function useEditorImageUpload(
  insertText: (before: string, after?: string, placeholder?: string) => void
) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", file.name.replace(/\.[^/.]+$/, ""));

    const result = await uploadMediaAction(formData);
    setUploadingImage(false);

    if (result.success && result.data) {
      const data = result.data as { url: string; fileName: string };
      insertText(`\n![${data.fileName}](${data.url})\n`);
    } else {
      alert(result.message || "Failed to upload image to R2");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          await uploadFile(file);
          break;
        }
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
      await uploadFile(file);
    }
  };

  return {
    uploadingImage,
    isDragging,
    setIsDragging,
    fileInputRef,
    handleImageUpload,
    handlePaste,
    handleDrop,
  };
}
