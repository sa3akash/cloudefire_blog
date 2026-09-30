import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { posts } from "./posts";

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

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
