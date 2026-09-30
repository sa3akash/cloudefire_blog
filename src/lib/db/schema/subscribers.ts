import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const subscribers = sqliteTable(
  "subscribers",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    status: text("status")
      .$type<"active" | "unsubscribed">()
      .default("active")
      .notNull(),
    token: text("token").notNull().unique(),
    confirmedAt: integer("confirmed_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("subscribers_email_idx").on(table.email),
    index("subscribers_status_idx").on(table.status),
  ]
);

export type Subscriber = typeof subscribers.$inferSelect;
export type NewSubscriber = typeof subscribers.$inferInsert;
