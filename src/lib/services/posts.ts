import { getDb, posts, categories, authors, postTags, tags, postViews, type Post, type NewPost } from "@/lib/db";
import { eq, desc, asc, and, like, or, count, sql, inArray } from "drizzle-orm";
import { calculateReadingTime } from "@/lib/markdown";

export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  status: "draft" | "published" | "scheduled";
  featured: boolean;
  readingTime: number;
  publishedAt: Date | null;
  createdAt: Date;
  category: { id: string; name: string; slug: string } | null;
  author: { id: string; name: string; slug: string; avatarUrl: string | null };
  tags?: { id: string; name: string; slug: string }[];
}

export interface GetPostsOptions {
  page?: number;
  limit?: number;
  categorySlug?: string;
  tagSlug?: string;
  authorSlug?: string;
  search?: string;
  sort?: "newest" | "oldest" | "popular";
}

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

  // Build filter conditions
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

  // Total count query
  const totalResult = await db
    .select({ count: count() })
    .from(posts)
    .where(whereClause);
  const total = totalResult[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);

  // Order
  const orderByClause =
    options.sort === "oldest"
      ? [asc(posts.publishedAt)]
      : [desc(posts.publishedAt), desc(posts.createdAt)];

  // Fetch paginated posts with explicit columns
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

  // Fetch tags for these posts in a single batched query (avoids N+1)
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
  // Prioritize posts flagged as featured
  const featured = result.posts.filter((p) => p.featured);
  if (featured.length >= limit) return featured.slice(0, limit);
  return result.posts.slice(0, limit);
}

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

  // Fetch tags for post
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

export async function incrementPostView(postId: string, visitorHash: string): Promise<void> {
  const db = getDb();
  const now = Date.now();

  try {
    // Only register 1 view per visitorHash per post per 24 hours (prevents write thrashing on D1)
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
    // Graceful silent fail for views so page renders are never blocked
    console.error("View tracking error:", error);
  }
}

// ADMIN SERVICE METHODS

export async function getAllPostsForAdmin(options: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
} = {}) {
  const db = getDb();
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(50, options.limit || 15);
  const offset = (page - 1) * limit;

  const conditions = [];
  if (options.status && options.status !== "all") {
    conditions.push(eq(posts.status, options.status as "draft" | "published" | "scheduled"));
  }

  if (options.search && options.search.trim()) {
    const term = `%${options.search.trim()}%`;
    conditions.push(or(like(posts.title, term), like(posts.slug, term))!);
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const totalRes = await db.select({ count: count() }).from(posts).where(whereClause);
  const total = totalRes[0]?.count || 0;

  const items = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      status: posts.status,
      featured: posts.featured,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      categoryName: categories.name,
      authorName: authors.name,
    })
    .from(posts)
    .innerJoin(authors, eq(posts.authorId, authors.id))
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(whereClause)
    .orderBy(desc(posts.updatedAt))
    .limit(limit)
    .offset(offset);

  return { posts: items, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getPostByIdForAdmin(id: string) {
  const db = getDb();
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (result.length === 0) return null;
  const post = result[0];

  const tagRows = await db
    .select({ tagId: postTags.tagId })
    .from(postTags)
    .where(eq(postTags.postId, id));

  return {
    ...post,
    tagIds: tagRows.map((r) => r.tagId),
  };
}

export async function createPost(
  data: Omit<NewPost, "id" | "createdAt" | "updatedAt" | "readingTime"> & {
    tagIds?: string[];
  }
) {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date();
  const readingTime = calculateReadingTime(data.content);

  // Check unique slug
  const existingSlug = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.slug, data.slug))
    .limit(1);

  if (existingSlug.length > 0) {
    throw new Error(`A post with slug "${data.slug}" already exists. Please choose a unique slug.`);
  }

  await db.insert(posts).values({
    ...data,
    id,
    readingTime,
    createdAt: now,
    updatedAt: now,
    publishedAt: data.status === "published" ? data.publishedAt || now : data.publishedAt,
  });

  if (data.tagIds && data.tagIds.length > 0) {
    for (const tagId of data.tagIds) {
      await db.insert(postTags).values({
        id: crypto.randomUUID(),
        postId: id,
        tagId,
      });
    }
  }

  return id;
}

export async function updatePost(
  id: string,
  data: Partial<Omit<NewPost, "id" | "createdAt">> & { tagIds?: string[] }
) {
  const db = getDb();
  const now = new Date();

  if (data.slug) {
    const existing = await db
      .select({ id: posts.id })
      .from(posts)
      .where(and(eq(posts.slug, data.slug), sql`${posts.id} != ${id}`))
      .limit(1);
    if (existing.length > 0) {
      throw new Error(`Slug "${data.slug}" is already in use by another article.`);
    }
  }

  const updates: Record<string, unknown> = {
    ...data,
    updatedAt: now,
  };

  if (data.content) {
    updates.readingTime = calculateReadingTime(data.content);
  }

  if (data.status === "published" && !data.publishedAt) {
    // If transitioning to published for the first time, set publishedAt
    const current = await db.select({ publishedAt: posts.publishedAt }).from(posts).where(eq(posts.id, id)).limit(1);
    if (current[0] && !current[0].publishedAt) {
      updates.publishedAt = now;
    }
  }

  delete updates.tagIds;

  await db.update(posts).set(updates).where(eq(posts.id, id));

  if (data.tagIds) {
    // Replace tags
    await db.delete(postTags).where(eq(postTags.postId, id));
    for (const tagId of data.tagIds) {
      await db.insert(postTags).values({
        id: crypto.randomUUID(),
        postId: id,
        tagId,
      });
    }
  }
}

export async function deletePost(id: string) {
  const db = getDb();
  await db.delete(posts).where(eq(posts.id, id));
}

export async function duplicatePost(id: string, authorId: string) {
  const post = await getPostByIdForAdmin(id);
  if (!post) throw new Error("Original post not found");

  const newSlug = `${post.slug}-copy-${Math.floor(Math.random() * 1000)}`;
  const newTitle = `${post.title} (Copy)`;

  return await createPost({
    authorId,
    categoryId: post.categoryId,
    title: newTitle,
    slug: newSlug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    status: "draft",
    featured: false,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    canonicalUrl: post.canonicalUrl,
    tagIds: post.tagIds,
  });
}
