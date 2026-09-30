import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { authors } from "./authors";
import { categories } from "./categories";

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

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
