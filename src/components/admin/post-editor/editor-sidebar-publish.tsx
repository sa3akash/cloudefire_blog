"use client";

interface EditorSidebarPublishProps {
  status: "draft" | "published" | "scheduled";
  setStatus: (status: "draft" | "published" | "scheduled") => void;
  featured: boolean;
  setFeatured: (featured: boolean) => void;
}

export function EditorSidebarPublish({
  status,
  setStatus,
  featured,
  setFeatured,
}: EditorSidebarPublishProps) {
  return (
    <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-4">
      <h3 className="font-bold text-sm font-heading">Publishing Controls</h3>

      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground font-medium" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "draft" | "published" | "scheduled")
          }
          className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="draft">Draft (Private)</option>
          <option value="published">Published (Public)</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="featured"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
        />
        <label htmlFor="featured" className="text-xs font-medium cursor-pointer">
          Highlight as Featured Article
        </label>
      </div>
    </div>
  );
}
