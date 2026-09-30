import { getDb, comments, posts } from "@/lib/db";
import { eq, desc, asc, and, count } from "drizzle-orm";
import { getSetting } from "./settings";

export interface PublicComment {
  id: string;
  parentId?: string | null;
  authorName: string;
  content: string;
  createdAt: Date;
  replies?: PublicComment[];
}

export async function getApprovedCommentsForPost(postId: string): Promise<PublicComment[]> {
  const db = getDb();

  const rows = await db
    .select({
      id: comments.id,
      parentId: comments.parentId,
      authorName: comments.authorName,
      content: comments.content,
      createdAt: comments.createdAt,
    })
    .from(comments)
    .where(and(eq(comments.postId, postId), eq(comments.status, "approved")))
    .orderBy(asc(comments.createdAt));

  // Build threaded tree
  const commentMap = new Map<string, PublicComment>();
  const rootComments: PublicComment[] = [];

  for (const row of rows) {
    commentMap.set(row.id, { ...row, replies: [] });
  }

  for (const row of rows) {
    const item = commentMap.get(row.id)!;
    if (row.parentId && commentMap.has(row.parentId)) {
      commentMap.get(row.parentId)!.replies!.push(item);
    } else {
      rootComments.push(item);
    }
  }

  return rootComments.reverse();
}

export async function submitComment(data: {
  postId: string;
  parentId?: string | null;
  authorName: string;
  authorEmail: string;
  content: string;
  ipHash?: string;
}): Promise<{ id: string; status: "pending" | "approved" }> {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date();

  const autoApproveSetting = await getSetting("autoApproveComments", "false");
  const initialStatus: "pending" | "approved" =
    autoApproveSetting === "true" ? "approved" : "pending";

  await db.insert(comments).values({
    id,
    postId: data.postId,
    parentId: data.parentId || null,
    authorName: data.authorName.trim(),
    authorEmail: data.authorEmail.trim().toLowerCase(),
    content: data.content.trim(),
    status: initialStatus,
    ipHash: data.ipHash || null,
    createdAt: now,
    updatedAt: now,
  });

  return { id, status: initialStatus };
}

export async function getAllCommentsForAdmin(options: {
  status?: string;
  page?: number;
  limit?: number;
} = {}) {
  const db = getDb();
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(50, options.limit || 20);
  const offset = (page - 1) * limit;

  const conditions = [];
  if (options.status && options.status !== "all") {
    conditions.push(eq(comments.status, options.status as "pending" | "approved" | "rejected"));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  const totalRes = await db.select({ count: count() }).from(comments).where(whereClause);
  const total = totalRes[0]?.count || 0;

  const rows = await db
    .select({
      id: comments.id,
      parentId: comments.parentId,
      postId: comments.postId,
      postTitle: posts.title,
      postSlug: posts.slug,
      authorName: comments.authorName,
      authorEmail: comments.authorEmail,
      content: comments.content,
      status: comments.status,
      createdAt: comments.createdAt,
    })
    .from(comments)
    .innerJoin(posts, eq(comments.postId, posts.id))
    .where(whereClause)
    .orderBy(desc(comments.createdAt))
    .limit(limit)
    .offset(offset);

  return { comments: rows, total, page, totalPages: Math.ceil(total / limit) };
}

export async function updateCommentStatus(
  id: string,
  status: "pending" | "approved" | "rejected"
) {
  const db = getDb();
  await db
    .update(comments)
    .set({ status, updatedAt: new Date() })
    .where(eq(comments.id, id));
}

export async function deleteComment(id: string) {
  const db = getDb();
  await db.delete(comments).where(eq(comments.id, id));
}
