import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { posts } from "./posts";

export const postVersions = sqliteTable(
  "post_versions",
  {
    id: text("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    versionNumber: integer("version_number").notNull(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    excerpt: text("excerpt"),
    createdBy: text("created_by"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("post_versions_post_id_idx").on(table.postId),
    uniqueIndex("post_versions_post_version_idx").on(table.postId, table.versionNumber),
  ]
);

export type PostVersion = typeof postVersions.$inferSelect;
export type NewPostVersion = typeof postVersions.$inferInsert;
