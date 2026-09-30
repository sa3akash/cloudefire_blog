import { getDb, tags, postTags, type Tag } from "@/lib/db";
import { eq, count } from "drizzle-orm";

export async function getAllTags(): Promise<(Tag & { postCount: number })[]> {
  const db = getDb();

  const rows = await db
    .select({
      id: tags.id,
      name: tags.name,
      slug: tags.slug,
      createdAt: tags.createdAt,
      updatedAt: tags.updatedAt,
      postCount: count(postTags.id),
    })
    .from(tags)
    .leftJoin(postTags, eq(tags.id, postTags.tagId))
    .groupBy(tags.id)
    .orderBy(tags.name);

  return rows;
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const db = getDb();
  const res = await db.select().from(tags).where(eq(tags.slug, slug)).limit(1);
  return res[0] || null;
}

export async function createTag(data: { name: string; slug: string }) {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date();

  await db.insert(tags).values({
    id,
    name: data.name,
    slug: data.slug,
    createdAt: now,
    updatedAt: now,
  });

  return id;
}

export async function deleteTag(id: string) {
  const db = getDb();
  await db.delete(tags).where(eq(tags.id, id));
}
