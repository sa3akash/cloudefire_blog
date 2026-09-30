import { getDb, posts, categories, authors, postTags, tags } from "@/lib/db";
import { eq, desc, asc, and, sql } from "drizzle-orm";
import type { PostListItem } from "./types";

export async function getPostBySlug(slug: string) {
  const db = getDb();

  const postList = await db
    .select({
      id: posts.id,
      authorId: posts.authorId,
      categoryId: posts.categoryId,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      content: posts.content,
      coverImage: posts.coverImage,
      status: posts.status,
      featured: posts.featured,
      seoTitle: posts.seoTitle,
      seoDescription: posts.seoDescription,
      canonicalUrl: posts.canonicalUrl,
      readingTime: posts.readingTime,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
      },
      author: {
        id: authors.id,
        name: authors.name,
        slug: authors.slug,
        bio: authors.bio,
        avatarUrl: authors.avatarUrl,
        socialLinks: authors.socialLinks,
      },
    })
    .from(posts)
    .innerJoin(authors, eq(posts.authorId, authors.id))
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .limit(1);

  if (postList.length === 0) return null;
  const post = postList[0];

  const postTagRows = await db
    .select({
      id: tags.id,
      name: tags.name,
      slug: tags.slug,
    })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, post.id));

  return {
    ...post,
    tags: postTagRows,
  };
}

export async function getRelatedPosts(
  postId: string,
  categoryId: string | null,
  limit = 3
): Promise<PostListItem[]> {
  const db = getDb();
  if (!categoryId) return [];

  const rawPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      coverImage: posts.coverImage,
      status: posts.status,
      featured: posts.featured,
      readingTime: posts.readingTime,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
      author: {
        id: authors.id,
        name: authors.name,
        slug: authors.slug,
        avatarUrl: authors.avatarUrl,
      },
    })
    .from(posts)
    .innerJoin(authors, eq(posts.authorId, authors.id))
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(
      and(
        eq(posts.status, "published"),
        eq(posts.categoryId, categoryId),
        sql`${posts.id} != ${postId}`
      )
    )
    .orderBy(desc(posts.publishedAt))
    .limit(limit);

  return rawPosts.map((p) => ({ ...p, tags: [] }));
}

export async function getAdjacentPosts(publishedAt: Date | null) {
  if (!publishedAt) return { prev: null, next: null };
  const db = getDb();

  const prev = await db
    .select({ title: posts.title, slug: posts.slug })
    .from(posts)
    .where(
      and(
        eq(posts.status, "published"),
        sql`${posts.publishedAt} < ${publishedAt.getTime()}`
      )
    )
    .orderBy(desc(posts.publishedAt))
    .limit(1);

  const next = await db
    .select({ title: posts.title, slug: posts.slug })
    .from(posts)
    .where(
      and(
        eq(posts.status, "published"),
        sql`${posts.publishedAt} > ${publishedAt.getTime()}`
      )
    )
    .orderBy(asc(posts.publishedAt))
    .limit(1);

  return {
    prev: prev[0] || null,
    next: next[0] || null,
  };
}
