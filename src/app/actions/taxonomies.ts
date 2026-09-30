"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { categorySchema, tagSchema } from "@/lib/validation";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/services/categories";
import { createTag, deleteTag } from "@/lib/services/tags";
import type { ActionResult } from "./types";

export async function saveCategoryAction(
  id: string | null,
  data: { name: string; slug: string; description?: string }
): Promise<ActionResult> {
  await requireAuth();

  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Validation failed" };
  }

  try {
    if (id) {
      await updateCategory(id, parsed.data);
      revalidatePath("/admin/categories");
      revalidatePath("/blog");
      return { success: true, message: "Category updated successfully" };
    } else {
      const newId = await createCategory(parsed.data);
      revalidatePath("/admin/categories");
      revalidatePath("/blog");
      return { success: true, message: "Category created successfully", data: { id: newId } };
    }
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || "Failed to save category" };
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  await requireAuth();
  try {
    await deleteCategory(id);
    revalidatePath("/admin/categories");
    revalidatePath("/blog");
    return { success: true, message: "Category deleted" };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || "Failed to delete category" };
  }
}

export async function saveTagAction(data: { name: string; slug: string }): Promise<ActionResult> {
  await requireAuth();

  const parsed = tagSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Validation failed" };
  }

  try {
    const newId = await createTag(parsed.data);
    revalidatePath("/admin/tags");
    revalidatePath("/blog");
    return { success: true, message: "Tag created successfully", data: { id: newId } };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || "Failed to create tag" };
  }
}

export async function deleteTagAction(id: string): Promise<ActionResult> {
  await requireAuth();
  try {
    await deleteTag(id);
    revalidatePath("/admin/tags");
    revalidatePath("/blog");
    return { success: true, message: "Tag deleted" };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || "Failed to delete tag" };
  }
}
