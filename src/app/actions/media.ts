"use server";

import { revalidatePath } from "next/cache";
import { getDb, media } from "@/lib/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { getStorageService } from "@/lib/storage";
import type { ActionResult } from "./types";

export async function uploadMediaAction(formData: FormData): Promise<ActionResult> {
  await requireAuth();

  const file = formData.get("file") as File;
  const altText = (formData.get("altText") as string) || "";

  if (!file) {
    return { success: false, message: "No file provided" };
  }

  try {
    const storage = getStorageService();
    const buffer = await file.arrayBuffer();
    const result = await storage.uploadFile(buffer, file.name, {
      contentType: file.type || "application/octet-stream",
    });

    const db = getDb();
    const mediaId = crypto.randomUUID();

    await db.insert(media).values({
      id: mediaId,
      fileName: file.name,
      objectKey: result.key,
      mimeType: result.mimeType,
      sizeBytes: result.sizeBytes,
      url: result.url,
      altText,
      createdAt: new Date(),
    });

    revalidatePath("/admin/media");
    return {
      success: true,
      message: "File uploaded successfully to Cloudflare R2",
      data: { id: mediaId, url: result.url, fileName: file.name },
    };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || "Failed to upload file to R2" };
  }
}

export async function deleteMediaAction(id: string): Promise<ActionResult> {
  await requireAuth();

  const db = getDb();
  const fileRecord = await db.select().from(media).where(eq(media.id, id)).limit(1);

  if (fileRecord.length === 0) {
    return { success: false, message: "Media record not found" };
  }

  try {
    const storage = getStorageService();
    await storage.deleteFile(fileRecord[0].objectKey);
    await db.delete(media).where(eq(media.id, id));

    revalidatePath("/admin/media");
    return { success: true, message: "Media removed from R2 and database" };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || "Failed to delete media" };
  }
}
