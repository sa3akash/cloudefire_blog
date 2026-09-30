import { getDb, posts, comments, postViews, categories } from "@/lib/db";
import { eq, count, desc, sql } from "drizzle-orm";

export interface DashboardMetrics {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  recentPosts: {
    id: string;
    title: string;
    slug: string;
    status: string;
    publishedAt: Date | null;
    updatedAt: Date;
  }[];
  recentComments: {
    id: string;
    authorName: string;
    postTitle: string;
    content: string;
    status: string;
    createdAt: Date;
  }[];
  popularPosts: {
    id: string;
    title: string;
    slug: string;
    viewsCount: number;
  }[];
}

export async function getDashboardAnalytics(): Promise<DashboardMetrics> {
  const db = getDb();

  // Run aggregate counts efficiently
  const [totalPostsRes, publishedPostsRes, draftPostsRes, totalViewsRes] =
    await Promise.all([
      db.select({ count: count() }).from(posts),
      db.select({ count: count() }).from(posts).where(eq(posts.status, "published")),
      db.select({ count: count() }).from(posts).where(eq(posts.status, "draft")),
      db.select({ count: count() }).from(postViews),
    ]);

  const totalPosts = totalPostsRes[0]?.count || 0;
  const publishedPosts = publishedPostsRes[0]?.count || 0;
  const draftPosts = draftPostsRes[0]?.count || 0;
  const totalViews = totalViewsRes[0]?.count || 0;

  // Recent 5 posts
  const recentPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      status: posts.status,
      publishedAt: posts.publishedAt,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .orderBy(desc(posts.updatedAt))
    .limit(5);

  // Recent 5 comments
  const recentComments = await db
    .select({
      id: comments.id,
      authorName: comments.authorName,
      postTitle: posts.title,
      content: comments.content,
      status: comments.status,
      createdAt: comments.createdAt,
    })
    .from(comments)
    .innerJoin(posts, eq(comments.postId, posts.id))
    .orderBy(desc(comments.createdAt))
    .limit(5);

  // Top 5 popular posts by view count
  const popularPostsRaw = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      viewsCount: count(postViews.id),
    })
    .from(posts)
    .leftJoin(postViews, eq(posts.id, postViews.postId))
    .where(eq(posts.status, "published"))
    .groupBy(posts.id)
    .orderBy(desc(count(postViews.id)))
    .limit(5);

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
    totalViews,
    recentPosts,
    recentComments,
    popularPosts: popularPostsRaw,
  };
}
