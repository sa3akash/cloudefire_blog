import { requireAuth } from "@/lib/auth";
import { getAllTags } from "@/lib/services/tags";
import { TagManager } from "./tag-manager";

export default async function AdminTagsPage() {
  await requireAuth();
  const tags = await getAllTags();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight">
          Tags
        </h1>
        <p className="text-xs text-muted-foreground">
          Index posts with modular keywords and technical identifiers.
        </p>
      </div>

      <TagManager initialTags={tags} />
    </div>
  );
}
