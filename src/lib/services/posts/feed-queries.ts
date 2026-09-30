import { getDb, posts, categories, authors, postTags, tags } from "@/lib/db";
import { eq, desc, asc, and, like, or, count, inArray } from "drizzle-orm";
import type { PostListItem, GetPostsOptions } from "./types";

export async function getPublishedPosts(options: GetPostsOptions = {}): Promise<{
  posts: PostListItem[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const db = getDb();
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(50, Math.max(1, options.limit || 9));
  const offset = (page - 1) * limit;

  const conditions = [eq(posts.status, "published")];

  if (options.categorySlug) {
    const cat = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, options.categorySlug))
      .limit(1);
    if (cat.length > 0) {
      conditions.push(eq(posts.categoryId, cat[0].id));
    } else {
      return { posts: [], total: 0, page, totalPages: 0 };
    }
  }

  if (options.authorSlug) {
    const auth = await db
      .select({ id: authors.id })
      .from(authors)
      .where(eq(authors.slug, options.authorSlug))
      .limit(1);
    if (auth.length > 0) {
      conditions.push(eq(posts.authorId, auth[0].id));
    } else {
      return { posts: [], total: 0, page, totalPages: 0 };
    }
  }

  if (options.tagSlug) {
    const tag = await db
      .select({ id: tags.id })
      .from(tags)
      .where(eq(tags.slug, options.tagSlug))
      .limit(1);
    if (tag.length > 0) {
      const postIdsWithTag = await db
        .select({ postId: postTags.postId })
        .from(postTags)
        .where(eq(postTags.tagId, tag[0].id));
      const ids = postIdsWithTag.map((r) => r.postId);
      if (ids.length === 0) {
        return { posts: [], total: 0, page, totalPages: 0 };
      }
      conditions.push(inArray(posts.id, ids));
    } else {
      return { posts: [], total: 0, page, totalPages: 0 };
    }
  }

  if (options.search && options.search.trim()) {
    const term = `%${options.search.trim()}%`;
    conditions.push(
      or(like(posts.title, term), like(posts.excerpt, term), like(posts.content, term))!
    );
  }

  const whereClause = and(...conditions);
  const totalResult = await db.select({ count: count() }).from(posts).where(whereClause);
  const total = totalResult[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);

  const orderByClause =
    options.sort === "oldest"
      ? [asc(posts.publishedAt)]
      : [desc(posts.publishedAt), desc(posts.createdAt)];

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
    .where(whereClause)
    .orderBy(...orderByClause)
    .limit(limit)
    .offset(offset);

  const postIds = rawPosts.map((p) => p.id);
  const postTagsMap = new Map<string, { id: string; name: string; slug: string }[]>();

  if (postIds.length > 0) {
    const tagsResult = await db
      .select({
        postId: postTags.postId,
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
      })
      .from(postTags)
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(inArray(postTags.postId, postIds));

    for (const row of tagsResult) {
      const existing = postTagsMap.get(row.postId) || [];
      existing.push({ id: row.id, name: row.name, slug: row.slug });
      postTagsMap.set(row.postId, existing);
    }
  }

  const items: PostListItem[] = rawPosts.map((p) => ({
    ...p,
    tags: postTagsMap.get(p.id) || [],
  }));

  return { posts: items, total, page, totalPages };
}

export async function getFeaturedPosts(limit = 3): Promise<PostListItem[]> {
  const result = await getPublishedPosts({ limit, page: 1 });
  const featured = result.posts.filter((p) => p.featured);
  if (featured.length >= limit) return featured.slice(0, limit);
  return result.posts.slice(0, limit);
}
