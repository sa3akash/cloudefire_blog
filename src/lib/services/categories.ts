import { getDb, categories, posts, type Category, type NewCategory } from "@/lib/db";
import { eq, count, sql } from "drizzle-orm";

export async function getAllCategories(): Promise<(Category & { postCount: number })[]> {
  const db = getDb();

  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
      postCount: count(posts.id),
    })
    .from(categories)
    .leftJoin(posts, eq(categories.id, posts.categoryId))
    .groupBy(categories.id)
    .orderBy(categories.name);

  return rows;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const db = getDb();
  const res = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return res[0] || null;
}

export async function createCategory(data: { name: string; slug: string; description?: string }) {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date();

  await db.insert(categories).values({
    id,
    name: data.name,
    slug: data.slug,
    description: data.description || "",
    createdAt: now,
    updatedAt: now,
  });

  return id;
}

export async function updateCategory(
  id: string,
  data: { name?: string; slug?: string; description?: string }
) {
  const db = getDb();
  await db
    .update(categories)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, id));
}

export async function deleteCategory(id: string) {
  const db = getDb();
  await db.delete(categories).where(eq(categories.id, id));
}
