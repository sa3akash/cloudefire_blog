import { getDb, authorFollows } from "@/lib/db";
import { eq, and, count } from "drizzle-orm";

export async function getAuthorFollowStats(
  authorId: string,
  followerKey: string
): Promise<{ count: number; isFollowing: boolean }> {
  const db = getDb();

  const totalRes = await db
    .select({ count: count() })
    .from(authorFollows)
    .where(eq(authorFollows.authorId, authorId));

  const total = totalRes[0]?.count || 0;

  const userRes = await db
    .select()
    .from(authorFollows)
    .where(
      and(
        eq(authorFollows.authorId, authorId),
        eq(authorFollows.followerKey, followerKey)
      )
    )
    .limit(1);

  return {
    count: total,
    isFollowing: userRes.length > 0,
  };
}

export async function toggleAuthorFollow(
  authorId: string,
  followerKey: string
): Promise<{ count: number; isFollowing: boolean }> {
  const db = getDb();

  const existing = await db
    .select()
    .from(authorFollows)
    .where(
      and(
        eq(authorFollows.authorId, authorId),
        eq(authorFollows.followerKey, followerKey)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db.delete(authorFollows).where(eq(authorFollows.id, existing[0].id));
  } else {
    await db.insert(authorFollows).values({
      id: crypto.randomUUID(),
      authorId,
      followerKey,
      createdAt: new Date(),
    });
  }

  return getAuthorFollowStats(authorId, followerKey);
}
