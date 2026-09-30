import { getDb, posts, postTags, type NewPost } from "@/lib/db";
import { eq, and, sql } from "drizzle-orm";
import { calculateReadingTime } from "@/lib/markdown";
import { getPostByIdForAdmin } from "./admin-queries";

export async function createPost(
  data: Omit<NewPost, "id" | "createdAt" | "updatedAt" | "readingTime"> & {
    tagIds?: string[];
  }
) {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date();
  const readingTime = calculateReadingTime(data.content);

  const existingSlug = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.slug, data.slug))
    .limit(1);

  if (existingSlug.length > 0) {
    throw new Error(`A post with slug "${data.slug}" already exists. Please choose a unique slug.`);
  }

  await db.insert(posts).values({
    ...data,
    id,
    readingTime,
    createdAt: now,
    updatedAt: now,
    publishedAt: data.status === "published" ? data.publishedAt || now : data.publishedAt,
  });

  if (data.tagIds && data.tagIds.length > 0) {
    for (const tagId of data.tagIds) {
      await db.insert(postTags).values({
        id: crypto.randomUUID(),
        postId: id,
        tagId,
      });
    }
  }

  return id;
}

export async function updatePost(
  id: string,
  data: Partial<Omit<NewPost, "id" | "createdAt">> & { tagIds?: string[] }
) {
  const db = getDb();
  const now = new Date();

  if (data.slug) {
    const existing = await db
      .select({ id: posts.id })
      .from(posts)
      .where(and(eq(posts.slug, data.slug), sql`${posts.id} != ${id}`))
      .limit(1);
    if (existing.length > 0) {
      throw new Error(`Slug "${data.slug}" is already in use by another article.`);
    }
  }

  const updates: Record<string, unknown> = {
    ...data,
    updatedAt: now,
  };

  if (data.content) {
    updates.readingTime = calculateReadingTime(data.content);
  }

  if (data.status === "published" && !data.publishedAt) {
    const current = await db
      .select({ publishedAt: posts.publishedAt })
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);
    if (current[0] && !current[0].publishedAt) {
      updates.publishedAt = now;
    }
  }

  delete updates.tagIds;

  await db.update(posts).set(updates).where(eq(posts.id, id));

  if (data.tagIds) {
    await db.delete(postTags).where(eq(postTags.postId, id));
    for (const tagId of data.tagIds) {
      await db.insert(postTags).values({
        id: crypto.randomUUID(),
        postId: id,
        tagId,
      });
    }
  }
}

export async function deletePost(id: string) {
  const db = getDb();
  await db.delete(posts).where(eq(posts.id, id));
}

export async function duplicatePost(id: string, authorId: string) {
  const post = await getPostByIdForAdmin(id);
  if (!post) throw new Error("Original post not found");

  const newSlug = `${post.slug}-copy-${Math.floor(Math.random() * 1000)}`;
  const newTitle = `${post.title} (Copy)`;

  return await createPost({
    authorId,
    categoryId: post.categoryId,
    title: newTitle,
    slug: newSlug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    status: "draft",
    featured: false,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    canonicalUrl: post.canonicalUrl,
    tagIds: post.tagIds,
  });
}
