"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Copy,
  Check,
  Trash2,
  Loader2,
} from "lucide-react";
import { uploadMediaAction, deleteMediaAction } from "@/app/actions/admin";
import type { Media } from "@/lib/db";

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
      {/* Upload Box */}
      <div className="p-8 rounded-2xl border-2 border-dashed border-border/80 bg-card/60 flex flex-col items-center justify-center text-center space-y-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
          className="hidden"
        />

        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Upload className="w-6 h-6" />
          )}
        </div>

        <div>
          <h3 className="font-bold text-sm font-heading">
            {uploading ? "Uploading to Cloudflare R2..." : "Upload Media to R2 Storage"}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-0.5">
            Supported formats: JPEG, PNG, WebP, AVIF, SVG. Max file size: 5 MB.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="gap-2 text-xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Select Files</span>
        </Button>
      </div>

      {/* Media Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span>{mediaList.length} Objects stored</span>
          <span>Zero-Egress Cache</span>
        </div>

        {mediaList.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-border rounded-xl text-muted-foreground text-xs italic">
            No media files uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mediaList.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl border border-border/70 bg-card overflow-hidden flex flex-col justify-between shadow-xs hover:border-primary/50 transition-colors"
              >
                {/* Image preview */}
                <div className="relative aspect-square w-full bg-muted overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.altText || item.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Info & Actions */}
                <div className="p-2.5 space-y-1.5 border-t border-border/60">
                  <div className="text-[11px] font-medium truncate" title={item.fileName}>
                    {item.fileName}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                    <span>{(item.sizeBytes / 1024).toFixed(0)} KB</span>
                    <Badge variant="outline" className="text-[9px] px-1 py-0 uppercase">
                      {item.mimeType.split("/")[1] || "img"}
                    </Badge>
                  </div>

                  <div className="pt-1 flex items-center justify-between gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyUrl(item.url, item.id)}
                      className="h-7 px-2 text-[10px] gap-1 flex-1 text-muted-foreground hover:text-foreground"
                    >
                      {copiedKey === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id, item.fileName)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      title="Delete from R2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
