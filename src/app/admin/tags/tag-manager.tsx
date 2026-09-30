"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { saveTagAction, deleteTagAction } from "@/app/actions/admin";
import type { Tag } from "@/lib/db";

interface TagWithCount extends Tag {
  postCount: number;
}

export function TagManager({ initialTags }: { initialTags: TagWithCount[] }) {
  const router = useRouter();
  const [tags, setTags] = useState(initialTags);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    const cleanName = name.trim();
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const res = await saveTagAction({ name: cleanName, slug });
    setLoading(false);

    if (res.success) {
      setName("");
      router.refresh();
    } else {
      alert(res.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete tag #${name}?`)) return;

    setLoading(true);
    const res = await deleteTagAction(id);
    setLoading(false);

    if (res.success) {
      setTags((prev) => prev.filter((t) => t.id !== id));
      router.refresh();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Tags Cloud / Table (Left 7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="p-6 rounded-xl border border-border/80 bg-card shadow-xs space-y-4">
          <h3 className="font-bold text-base font-heading">
            Existing Tags ({tags.length})
          </h3>

          {tags.length === 0 ? (
            <p className="text-xs text-muted-foreground italic py-6 text-center">
              No tags created yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="group inline-flex items-center gap-2 pl-3 pr-1.5 py-1 rounded-lg border border-border/70 bg-muted/30 text-xs font-mono"
                >
                  <span className="font-semibold text-foreground">#{tag.name}</span>
                  <span className="text-[10px] text-muted-foreground opacity-75">
                    ({tag.postCount})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(tag.id, tag.name)}
                    className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title={`Delete #${tag.name}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Tag Form (Right 5 cols) */}
      <div className="lg:col-span-5">
        <form onSubmit={handleSubmit} className="p-6 rounded-xl border border-border/80 bg-card shadow-xs space-y-4">
          <h3 className="font-bold text-base font-heading">Add New Tag</h3>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="tagName">
              Tag Name *
            </label>
            <Input
              id="tagName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. SQLite"
              required
              className="h-9 text-xs font-mono"
            />
          </div>

          <Button type="submit" size="sm" disabled={loading} className="gap-1.5 text-xs">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            <span>Create Tag</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
