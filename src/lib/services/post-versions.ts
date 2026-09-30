import { getDb, postVersions, posts } from "@/lib/db";
import { eq, desc } from "drizzle-orm";

export interface VersionSummary {
  id: string;
  postId: string;
  versionNumber: number;
  title: string;
  excerpt: string | null;
  createdBy: string | null;
  createdAt: Date;
}

export async function createPostVersion(
  postId: string,
  data: {
    title: string;
    content: string;
    excerpt?: string | null;
    createdBy?: string | null;
  }
): Promise<string> {
  const db = getDb();
  const latest = await db
    .select({ versionNumber: postVersions.versionNumber })
    .from(postVersions)
    .where(eq(postVersions.postId, postId))
    .orderBy(desc(postVersions.versionNumber))
    .limit(1);

  const nextVersion = (latest[0]?.versionNumber || 0) + 1;
  const id = crypto.randomUUID();

  await db.insert(postVersions).values({
    id,
    postId,
    versionNumber: nextVersion,
    title: data.title,
    content: data.content,
    excerpt: data.excerpt || null,
    createdBy: data.createdBy || null,
    createdAt: new Date(),
  });

  return id;
}

export async function getPostVersions(postId: string): Promise<VersionSummary[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: postVersions.id,
      postId: postVersions.postId,
      versionNumber: postVersions.versionNumber,
      title: postVersions.title,
      excerpt: postVersions.excerpt,
      createdBy: postVersions.createdBy,
      createdAt: postVersions.createdAt,
    })
    .from(postVersions)
    .where(eq(postVersions.postId, postId))
    .orderBy(desc(postVersions.versionNumber));

  return rows;
}

export async function getPostVersionById(versionId: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(postVersions)
    .where(eq(postVersions.id, versionId))
    .limit(1);

  return rows[0] || null;
}

export async function restorePostVersion(versionId: string): Promise<boolean> {
  const db = getDb();
  const version = await getPostVersionById(versionId);
  if (!version) return false;

  await db
    .update(posts)
    .set({
      title: version.title,
      content: version.content,
      excerpt: version.excerpt,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, version.postId));

  // Also snapshot current restore as a new version
  await createPostVersion(version.postId, {
    title: version.title,
    content: version.content,
    excerpt: version.excerpt,
    createdBy: "Restored from v" + version.versionNumber,
  });

  return true;
}
