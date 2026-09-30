"use server";

import { revalidatePath } from "next/cache";
import { getDb, authors } from "@/lib/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { postSchema } from "@/lib/validation";
import { createPost, updatePost, deletePost, duplicatePost } from "@/lib/services/posts";
import { createPostVersion } from "@/lib/services/post-versions";
import type { ActionResult } from "./types";

export async function savePostAction(
  id: string | null,
  data: Record<string, unknown>
): Promise<ActionResult> {
  const user = await requireAuth();

  const parsed = postSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Validation failed",
    };
  }

  const db = getDb();
  const authorRecord = await db
    .select({ id: authors.id })
    .from(authors)
    .where(eq(authors.userId, user.id))
    .limit(1);

  let authorId = authorRecord[0]?.id;
  if (!authorId) {
    const authorRes = await db.select({ id: authors.id }).from(authors).limit(1);
    authorId = authorRes[0]?.id;
  }

  if (!authorId) {
    return { success: false, message: "No author profile found for this account" };
  }

  try {
    if (id) {
      await updatePost(id, {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt || null,
        content: parsed.data.content,
        coverImage: parsed.data.coverImage || null,
        categoryId: parsed.data.categoryId || null,
        tagIds: parsed.data.tagIds,
        status: parsed.data.status,
        featured: parsed.data.featured,
        seoTitle: parsed.data.seoTitle || null,
        seoDescription: parsed.data.seoDescription || null,
        canonicalUrl: parsed.data.canonicalUrl || null,
      });

      await createPostVersion(id, {
        title: parsed.data.title,
        content: parsed.data.content,
        excerpt: parsed.data.excerpt,
        createdBy: user.name || user.email,
      }).catch(() => {});

      revalidatePath("/");
      revalidatePath("/blog");
      revalidatePath(`/blog/${parsed.data.slug}`);
      revalidatePath("/feed.xml");
      revalidatePath("/sitemap.xml");

      return { success: true, message: "Article updated successfully", data: { id, slug: parsed.data.slug } };
    } else {
      const newId = await createPost({
        authorId,
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt || null,
        content: parsed.data.content,
        coverImage: parsed.data.coverImage || null,
        categoryId: parsed.data.categoryId || null,
        tagIds: parsed.data.tagIds,
        status: parsed.data.status,
        featured: parsed.data.featured,
        seoTitle: parsed.data.seoTitle || null,
        seoDescription: parsed.data.seoDescription || null,
        canonicalUrl: parsed.data.canonicalUrl || null,
        publishedAt: parsed.data.status === "published" ? new Date() : null,
      });

      await createPostVersion(newId, {
        title: parsed.data.title,
        content: parsed.data.content,
        excerpt: parsed.data.excerpt,
        createdBy: user.name || user.email,
      }).catch(() => {});

      revalidatePath("/");
      revalidatePath("/blog");
      revalidatePath("/feed.xml");
      revalidatePath("/sitemap.xml");

      return { success: true, message: "Article created successfully", data: { id: newId, slug: parsed.data.slug } };
    }
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || "Failed to save post" };
  }
}

export async function deletePostAction(id: string): Promise<ActionResult> {
  await requireAuth();
  try {
    await deletePost(id);
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/posts");
    return { success: true, message: "Article deleted successfully" };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || "Failed to delete post" };
  }
}

export async function duplicatePostAction(id: string): Promise<ActionResult> {
  await requireAuth();
  try {
    const newId = await duplicatePost(id);
    revalidatePath("/admin/posts");
    return { success: true, message: "Article duplicated as draft", data: { id: newId } };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || "Failed to duplicate post" };
  }
}
