import { requireAuth } from "@/lib/auth";
import { getAllCategories } from "@/lib/services/categories";
import { getAllTags } from "@/lib/services/tags";
import { PostEditorForm } from "@/components/admin/post-editor-form";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WritePostPage() {
  await requireAuth();

  const [categories, tags] = await Promise.all([
    getAllCategories(),
    getAllTags(),
  ]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 max-w-5xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/70">
        <div className="space-y-1">
          <Link
            href="/blog"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to publication</span>
          </Link>
          <div className="flex items-center gap-2 pt-1">
            <div className="p-1 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading tracking-tight">
              Author Studio
            </h1>
          </div>
        </div>
      </div>

      <PostEditorForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        tags={tags.map((t) => ({ id: t.id, name: t.name }))}
      />
    </div>
  );
}
