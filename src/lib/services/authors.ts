import { getDb, authors, type Author } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const db = getDb();
  const res = await db.select().from(authors).where(eq(authors.slug, slug)).limit(1);
  return res[0] || null;
}

export async function getAuthorById(id: string): Promise<Author | null> {
  const db = getDb();
  const res = await db.select().from(authors).where(eq(authors.id, id)).limit(1);
  return res[0] || null;
}

export async function getAllAuthors(): Promise<Author[]> {
  const db = getDb();
  return await db.select().from(authors);
}
