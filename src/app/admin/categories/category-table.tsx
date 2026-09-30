"use client";

import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import type { Category } from "@/lib/db";

interface CategoryWithCount extends Category {
  postCount: number;
}

interface CategoryTableProps {
  categories: CategoryWithCount[];
  editingId: string | null;
  loading: boolean;
  onEdit: (cat: CategoryWithCount) => void;
  onDelete: (id: string, name: string) => void;
}

export function CategoryTable({
  categories,
  editingId,
  loading,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
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
                <tr
                  key={cat.id}
                  className={`hover:bg-muted/30 transition-colors ${
                    editingId === cat.id ? "bg-primary/5 font-semibold" : ""
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="font-semibold">{cat.name}</div>
                    {cat.description && (
                      <div className="text-[11px] text-muted-foreground line-clamp-1">
                        {cat.description}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-muted-foreground text-[11px]">
                    /category/{cat.slug}
                  </td>
                  <td className="py-3 px-4 text-center font-mono">{cat.postCount}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={loading}
                        onClick={() => onEdit(cat)}
                        className="h-7 w-7 p-0"
                        title="Edit category"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={loading}
                        onClick={() => onDelete(cat.id, cat.name)}
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        title="Delete category"
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
  );
}
