import { getDb, postReactions } from "@/lib/db";
import { eq, and, sql } from "drizzle-orm";

export async function getPostReactionStats(
  postId: string,
  visitorKey: string
): Promise<{ count: number; hasLiked: boolean }> {
  const db = getDb();

  const totalRes = await db
    .select({
      total: sql<number>`COALESCE(SUM(${postReactions.count}), 0)`,
    })
    .from(postReactions)
    .where(and(eq(postReactions.postId, postId), eq(postReactions.reactionType, "like")));

  const total = Number(totalRes[0]?.total || 0);

  const userRes = await db
    .select()
    .from(postReactions)
    .where(
      and(
        eq(postReactions.postId, postId),
        eq(postReactions.reactionType, "like"),
        eq(postReactions.ipHash, visitorKey)
      )
    )
    .limit(1);

  return {
    count: total,
    hasLiked: userRes.length > 0 && userRes[0].count > 0,
  };
}

export async function togglePostReaction(
  postId: string,
  visitorKey: string
): Promise<{ count: number; hasLiked: boolean }> {
  const db = getDb();

  const existing = await db
    .select()
    .from(postReactions)
    .where(
      and(
        eq(postReactions.postId, postId),
        eq(postReactions.reactionType, "like"),
        eq(postReactions.ipHash, visitorKey)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Delete existing reaction (toggle off)
    await db
      .delete(postReactions)
      .where(eq(postReactions.id, existing[0].id));
  } else {
    // Insert new reaction (toggle on)
    await db.insert(postReactions).values({
      id: crypto.randomUUID(),
      postId,
      reactionType: "like",
      count: 1,
      ipHash: visitorKey,
      createdAt: new Date(),
    });
  }

  return getPostReactionStats(postId, visitorKey);
}
