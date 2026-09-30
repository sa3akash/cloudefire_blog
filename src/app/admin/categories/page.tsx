import { requireAuth } from "@/lib/auth";
import { getAllCategories } from "@/lib/services/categories";
import { CategoryManager } from "./category-manager";

export default async function AdminCategoriesPage() {
  await requireAuth();
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight">
          Categories
        </h1>
        <p className="text-xs text-muted-foreground">
          Organize articles into top-level topic directories.
        </p>
      </div>

      <CategoryManager initialCategories={categories} />
    </div>
  );
}
