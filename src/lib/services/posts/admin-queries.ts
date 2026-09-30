import { getDb, posts, categories, authors, postTags } from "@/lib/db";
import { eq, desc, and, like, or, count } from "drizzle-orm";

export async function getAllPostsForAdmin(options: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
} = {}) {
  const db = getDb();
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(50, options.limit || 15);
  const offset = (page - 1) * limit;

  const conditions = [];
  if (options.status && options.status !== "all") {
    conditions.push(eq(posts.status, options.status as "draft" | "published" | "scheduled"));
  }

  if (options.search && options.search.trim()) {
    const term = `%${options.search.trim()}%`;
    conditions.push(or(like(posts.title, term), like(posts.slug, term))!);
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const totalRes = await db.select({ count: count() }).from(posts).where(whereClause);
  const total = totalRes[0]?.count || 0;

  const items = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      status: posts.status,
      featured: posts.featured,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      categoryName: categories.name,
      authorName: authors.name,
    })
    .from(posts)
    .innerJoin(authors, eq(posts.authorId, authors.id))
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(whereClause)
    .orderBy(desc(posts.updatedAt))
    .limit(limit)
    .offset(offset);

  return { posts: items, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getPostByIdForAdmin(id: string) {
  const db = getDb();
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (result.length === 0) return null;
  const post = result[0];

  const tagRows = await db
    .select({ tagId: postTags.tagId })
    .from(postTags)
    .where(eq(postTags.postId, id));

  return {
    ...post,
    tagIds: tagRows.map((r) => r.tagId),
  };
}
