import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { posts } from "./posts";

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

export type PostView = typeof postViews.$inferSelect;
export type NewPostView = typeof postViews.$inferInsert;
