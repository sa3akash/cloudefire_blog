"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveCategoryAction, deleteCategoryAction } from "@/app/actions/admin";
import type { Category } from "@/lib/db";
import { CategoryTable } from "./category-table";
import { CategoryForm } from "./category-form";

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
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "category",
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
      <CategoryTable
        categories={categories}
        editingId={editingId}
        loading={loading}
        onEdit={startEdit}
        onDelete={handleDelete}
      />
      <CategoryForm
        editingId={editingId}
        name={name}
        setName={setName}
        slug={slug}
        setSlug={setSlug}
        description={description}
        setDescription={setDescription}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={cancelEdit}
      />
    </div>
  );
}
