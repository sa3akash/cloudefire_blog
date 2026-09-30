import { requireAuth } from "@/lib/auth";
import { getDb, media } from "@/lib/db";
import { desc } from "drizzle-orm";
import { MediaManager } from "./media-manager";

export default async function AdminMediaPage() {
  await requireAuth();
  const db = getDb();
  const mediaRows = await db.select().from(media).orderBy(desc(media.createdAt)).limit(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight">
          Media Library
        </h1>
        <p className="text-xs text-muted-foreground">
          Upload and manage images stored in Cloudflare R2 bucket.
        </p>
      </div>

      <MediaManager initialMedia={mediaRows} />
    </div>
  );
}
