"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadMediaAction, deleteMediaAction } from "@/app/actions/admin";
import type { Media } from "@/lib/db";
import { MediaUploadZone } from "./media-upload-zone";
import { MediaCard } from "./media-card";

export function MediaManager({ initialMedia }: { initialMedia: Media[] }) {
  const router = useRouter();
  const [mediaList, setMediaList] = useState(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("altText", file.name.replace(/\.[^/.]+$/, ""));

      const res = await uploadMediaAction(formData);
      if (!res.success) {
        alert(res.message);
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" from Cloudflare R2?`)) return;

    const res = await deleteMediaAction(id);
    if (res.success) {
      setMediaList((prev) => prev.filter((m) => m.id !== id));
      router.refresh();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="space-y-6">
      <MediaUploadZone
        uploading={uploading}
        fileInputRef={fileInputRef}
        onUpload={handleUpload}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mediaList.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground text-xs italic">
            No media uploaded yet.
          </div>
        ) : (
          mediaList.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              isCopied={copiedKey === item.id}
              onCopy={copyUrl}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
