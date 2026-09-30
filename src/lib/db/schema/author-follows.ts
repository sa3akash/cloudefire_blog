import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { authors } from "./authors";

export const authorFollows = sqliteTable(
  "author_follows",
  {
    id: text("id").primaryKey(),
    authorId: text("author_id")
      .notNull()
      .references(() => authors.id, { onDelete: "cascade" }),
    followerKey: text("follower_key").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("author_follows_author_id_idx").on(table.authorId),
    index("author_follows_dedup_idx").on(table.authorId, table.followerKey),
  ]
);

export type AuthorFollow = typeof authorFollows.$inferSelect;
export type NewAuthorFollow = typeof authorFollows.$inferInsert;
