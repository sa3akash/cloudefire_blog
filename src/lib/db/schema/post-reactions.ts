import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { posts } from "./posts";

export const postReactions = sqliteTable(
  "post_reactions",
  {
    id: text("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    reactionType: text("reaction_type")
      .$type<"like" | "clap" | "heart">()
      .default("clap")
      .notNull(),
    count: integer("count").default(1).notNull(),
    ipHash: text("ip_hash"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("post_reactions_post_id_idx").on(table.postId),
    index("post_reactions_dedup_idx").on(table.postId, table.reactionType, table.ipHash),
  ]
);

export type PostReaction = typeof postReactions.$inferSelect;
export type NewPostReaction = typeof postReactions.$inferInsert;
