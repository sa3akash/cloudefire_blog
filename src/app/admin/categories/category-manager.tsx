"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Folder, Loader2 } from "lucide-react";
import { saveCategoryAction, deleteCategoryAction } from "@/app/actions/admin";
import type { Category } from "@/lib/db";

interface CategoryWithCount extends Category {
  postCount: number;
}

export function CategoryManager({
  initialCategories,
}: {
  initialCategories: CategoryWithCount[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const startEdit = (cat: CategoryWithCount) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await saveCategoryAction(editingId, {
      name,
      slug: slug || undefined,
      description,
    });

    setLoading(false);

    if (res.success) {
      cancelEdit();
      router.refresh();
    } else {
      alert(res.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Existing posts will be uncategorized.`)) return;

    setLoading(true);
    const res = await deleteCategoryAction(id);
    setLoading(false);

    if (res.success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Category List (Left 7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4 text-center">Posts</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground italic">
                    No categories defined yet.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {cat.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">
                      {cat.slug}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      {cat.postCount}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEdit(cat)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Form (Right 5 cols) */}
      <div className="lg:col-span-5">
        <form onSubmit={handleSubmit} className="p-6 rounded-xl border border-border/80 bg-card shadow-xs space-y-4">
          <h3 className="font-bold text-base font-heading">
            {editingId ? "Edit Category" : "Add New Category"}
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="catName">
              Category Name *
            </label>
            <Input
              id="catName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Distributed Systems"
              required
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="catSlug">
              Slug (Optional, auto-generated)
            </label>
            <Input
              id="catSlug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. distributed-systems"
              className="h-9 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="catDesc">
              Description (Optional)
            </label>
            <Textarea
              id="catDesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description for category index pages..."
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
              <Button type="button" variant="outline" size="sm" onClick={cancelEdit} className="text-xs">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
