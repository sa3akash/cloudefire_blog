import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getPostByIdForAdmin } from "@/lib/services/posts";
import { getAllCategories } from "@/lib/services/categories";
import { getAllTags } from "@/lib/services/tags";
import { PostEditorForm } from "@/components/admin/post-editor-form";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  await requireAuth();
  const resolved = await params;

  const [post, categories, tags] = await Promise.all([
    getPostByIdForAdmin(resolved.id),
    getAllCategories(),
    getAllTags(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <PostEditorForm
      initialPost={post}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      tags={tags.map((t) => ({ id: t.id, name: t.name }))}
    />
  );
}
