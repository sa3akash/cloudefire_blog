import { requireAuth } from "@/lib/auth";
import { getAllCategories } from "@/lib/services/categories";
import { getAllTags } from "@/lib/services/tags";
import { PostEditorForm } from "@/components/admin/post-editor-form";

export default async function NewPostPage() {
  await requireAuth();

  const [categories, tags] = await Promise.all([
    getAllCategories(),
    getAllTags(),
  ]);

  return (
    <PostEditorForm
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      tags={tags.map((t) => ({ id: t.id, name: t.name }))}
    />
  );
}
