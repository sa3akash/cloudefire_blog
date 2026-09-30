import { getDb, postViews } from "@/lib/db";
import { eq, and, sql } from "drizzle-orm";

export async function incrementPostView(postId: string, visitorHash: string): Promise<void> {
  const db = getDb();
  const now = Date.now();

  try {
    const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
    const existing = await db
      .select({ id: postViews.id })
      .from(postViews)
      .where(
        and(
          eq(postViews.postId, postId),
          eq(postViews.visitorHash, visitorHash),
          sql`${postViews.viewedAt} > ${twentyFourHoursAgo.getTime()}`
        )
      )
      .limit(1);

    if (existing.length === 0) {
      await db.insert(postViews).values({
        id: crypto.randomUUID(),
        postId,
        visitorHash,
        viewedAt: new Date(now),
      });
    }
  } catch (error) {
    console.error("View tracking error:", error);
  }
}
