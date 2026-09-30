import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

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

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
