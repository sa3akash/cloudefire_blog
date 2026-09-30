import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const redirects = sqliteTable(
  "redirects",
  {
    id: text("id").primaryKey(),
    fromPath: text("from_path").notNull().unique(),
    toPath: text("to_path").notNull(),
    statusCode: integer("status_code").default(301).notNull(),
    hits: integer("hits").default(0).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("redirects_from_path_idx").on(table.fromPath),
  ]
);

export type Redirect = typeof redirects.$inferSelect;
export type NewRedirect = typeof redirects.$inferInsert;
