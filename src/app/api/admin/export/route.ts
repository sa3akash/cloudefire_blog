import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  getDb,
  posts,
  categories,
  tags,
  postTags,
  comments,
  siteSettings,
  authors,
} from "@/lib/db";

export async function GET() {
  await requireAuth("admin");
  const db = getDb();

  const [
    allPosts,
    allCategories,
    allTags,
    allPostTags,
    allComments,
    allSettings,
    allAuthors,
  ] = await Promise.all([
    db.select().from(posts),
    db.select().from(categories),
    db.select().from(tags),
    db.select().from(postTags),
    db.select().from(comments),
    db.select().from(siteSettings),
    db.select().from(authors),
  ]);

  const backupData = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    posts: allPosts,
    categories: allCategories,
    tags: allTags,
    postTags: allPostTags,
    comments: allComments,
    settings: allSettings,
    authors: allAuthors,
  };

  const filename = `cloudblog-backup-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(backupData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
