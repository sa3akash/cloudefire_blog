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

export async function recordPostViewFromHeaders(
  postId: string,
  headerList: { get(name: string): string | null }
): Promise<void> {
  try {
    const ip =
      headerList.get("cf-connecting-ip") ||
      headerList.get("x-forwarded-for") ||
      "anonymous";
    const userAgent = headerList.get("user-agent") || "unknown";
    const visitorHash = btoa(`${ip}:${userAgent.slice(0, 30)}`).slice(0, 32);
    await incrementPostView(postId, visitorHash);
  } catch {}
}
