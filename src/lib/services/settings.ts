import { getDb, siteSettings } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const db = getDb();
    const rows = await db.select().from(siteSettings);
    const map: Record<string, string> = {
      siteName: "CloudBlog",
      siteDescription: "A high-performance editorial publication built on Cloudflare Workers, D1, and R2.",
      postsPerPage: "6",
      allowComments: "true",
      autoApproveComments: "false",
      aboutText: "CloudBlog is an open-source, edge-native blogging platform engineered specifically for Cloudflare's free tier.",
      contactEmail: "contact@cloudblog.local",
    };

    for (const r of rows) {
      map[r.key] = r.value;
    }

    return map;
  } catch {
    return {
      siteName: "CloudBlog",
      siteDescription: "A high-performance editorial publication built on Cloudflare Workers, D1, and R2.",
      postsPerPage: "6",
      allowComments: "true",
      autoApproveComments: "false",
      aboutText: "CloudBlog is an open-source, edge-native blogging platform engineered specifically for Cloudflare's free tier.",
      contactEmail: "contact@cloudblog.local",
    };
  }
}

export async function getSetting(key: string, defaultValue: string = ""): Promise<string> {
  try {
    const db = getDb();
    const res = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
    if (res.length > 0) return res[0].value;
  } catch {
    // DB not available or offline fallback
  }
  return defaultValue;
}

export async function updateSettings(settings: Record<string, string>): Promise<void> {
  const db = getDb();
  const now = new Date();

  for (const [key, value] of Object.entries(settings)) {
    const existing = await db
      .select({ key: siteSettings.key })
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(siteSettings)
        .set({ value, updatedAt: now })
        .where(eq(siteSettings.key, key));
    } else {
      await db.insert(siteSettings).values({
        key,
        value,
        updatedAt: now,
      });
    }
  }
}
