"use client";

interface CategoryOption {
  id: string;
  name: string;
}

interface TagOption {
  id: string;
  name: string;
}

interface EditorSidebarTaxonomyProps {
  categories: CategoryOption[];
  categoryId: string | null;
  setCategoryId: (id: string | null) => void;
  tags: TagOption[];
  selectedTagIds: string[];
  toggleTag: (tagId: string) => void;
}

export function EditorSidebarTaxonomy({
  categories,
  categoryId,
  setCategoryId,
  tags,
  selectedTagIds,
  toggleTag,
}: EditorSidebarTaxonomyProps) {
  return (
    <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-4">
      <h3 className="font-bold text-sm font-heading">Taxonomy</h3>

      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground font-medium" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          value={categoryId || ""}
          onChange={(e) => setCategoryId(e.target.value || null)}
          className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Uncategorized</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5 pt-1">
        <label className="text-xs text-muted-foreground font-medium">
          Tags
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-lg border border-border/70 bg-muted/20">
          {tags.map((t) => {
            const isSelected = selectedTagIds.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleTag(t.id)}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-colors font-mono cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                #{t.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
