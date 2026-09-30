import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").$type<"admin" | "editor" | "author">().default("admin").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const authors = sqliteTable(
  "authors",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    bio: text("bio"),
    avatarUrl: text("avatar_url"),
    socialLinks: text("social_links"), // JSON string { twitter, github, website }
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("authors_slug_idx").on(table.slug),
    index("authors_user_id_idx").on(table.userId),
  ]
);

export const categories = sqliteTable(
  "categories",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("categories_slug_idx").on(table.slug),
  ]
);

export const tags = sqliteTable(
  "tags",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("tags_slug_idx").on(table.slug),
  ]
);

export const posts = sqliteTable(
  "posts",
  {
    id: text("id").primaryKey(),
    authorId: text("author_id")
      .notNull()
      .references(() => authors.id, { onDelete: "restrict" }),
    categoryId: text("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    coverImage: text("cover_image"),
    status: text("status")
      .$type<"draft" | "published" | "scheduled">()
      .default("draft")
      .notNull(),
    featured: integer("featured", { mode: "boolean" }).default(false).notNull(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    canonicalUrl: text("canonical_url"),
    readingTime: integer("reading_time").default(1).notNull(),
    publishedAt: integer("published_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("posts_slug_idx").on(table.slug),
    index("posts_status_idx").on(table.status),
    index("posts_published_at_idx").on(table.publishedAt),
    index("posts_author_id_idx").on(table.authorId),
    index("posts_category_id_idx").on(table.categoryId),
  ]
);

export const postTags = sqliteTable(
  "post_tags",
  {
    id: text("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("post_tags_post_id_idx").on(table.postId),
    index("post_tags_tag_id_idx").on(table.tagId),
  ]
);

export const media = sqliteTable(
  "media",
  {
    id: text("id").primaryKey(),
    fileName: text("file_name").notNull(),
    objectKey: text("object_key").notNull().unique(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    url: text("url").notNull(),
    altText: text("alt_text"),
    width: integer("width"),
    height: integer("height"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("media_object_key_idx").on(table.objectKey),
  ]
);

export const comments = sqliteTable(
  "comments",
  {
    id: text("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    authorName: text("author_name").notNull(),
    authorEmail: text("author_email").notNull(),
    content: text("content").notNull(),
    status: text("status")
      .$type<"pending" | "approved" | "rejected">()
      .default("pending")
      .notNull(),
    ipHash: text("ip_hash"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("comments_post_id_idx").on(table.postId),
    index("comments_status_idx").on(table.status),
  ]
);

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("sessions_token_idx").on(table.token),
    index("sessions_user_id_idx").on(table.userId),
  ]
);

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const postViews = sqliteTable(
  "post_views",
  {
    id: text("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    visitorHash: text("visitor_hash").notNull(),
    viewedAt: integer("viewed_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("post_views_post_id_idx").on(table.postId),
    index("post_views_dedup_idx").on(table.postId, table.visitorHash),
  ]
);

export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    userId: text("user_id"),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    details: text("details"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("audit_logs_created_at_idx").on(table.createdAt),
    index("audit_logs_user_id_idx").on(table.userId),
  ]
);

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(sessions),
  author: one(authors, {
    fields: [users.id],
    references: [authors.userId],
  }),
}));

export const authorsRelations = relations(authors, ({ one, many }) => ({
  user: one(users, {
    fields: [authors.userId],
    references: [users.id],
  }),
  posts: many(posts),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(authors, {
    fields: [posts.authorId],
    references: [authors.id],
  }),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  postTags: many(postTags),
  comments: many(comments),
  views: many(postViews),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Author = typeof authors.$inferSelect;
export type NewAuthor = typeof authors.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type PostTag = typeof postTags.$inferSelect;
export type NewPostTag = typeof postTags.$inferInsert;
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;
export type PostView = typeof postViews.$inferSelect;
export type NewPostView = typeof postViews.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
