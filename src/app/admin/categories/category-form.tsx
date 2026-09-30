"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface CategoryFormProps {
  editingId: string | null;
  name: string;
  setName: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  loading: boolean;
  onSubmit: (e: React.SubmitEvent) => void;
  onCancel: () => void;
}

export function CategoryForm({
  editingId,
  name,
  setName,
  slug,
  setSlug,
  description,
  setDescription,
  loading,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  return (
    <div className="lg:col-span-5 p-6 rounded-xl border border-border/80 bg-card shadow-xs space-y-5 h-fit">
      <div>
        <h3 className="font-bold text-base font-heading">
          {editingId ? "Edit Category" : "Add New Category"}
        </h3>
        <p className="text-xs text-muted-foreground">
          Organize your publications into structured topics.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-muted-foreground uppercase font-mono" htmlFor="catName">
            Name *
          </label>
          <Input
            id="catName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Distributed Systems"
            required
            className="text-xs h-9"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-muted-foreground uppercase font-mono" htmlFor="catSlug">
            Slug (Optional)
          </label>
          <Input
            id="catSlug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated from name if left empty"
            className="text-xs font-mono h-9"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-muted-foreground uppercase font-mono" htmlFor="catDesc">
            Description
          </label>
          <Textarea
            id="catDesc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description for SEO and category headers..."
            rows={3}
            className="text-xs resize-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button type="submit" size="sm" disabled={loading} className="gap-1.5 text-xs">
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{editingId ? "Update Category" : "Create Category"}</span>
          </Button>

          {editingId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="text-xs"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
