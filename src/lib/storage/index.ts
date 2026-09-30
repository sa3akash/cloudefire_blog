import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { IStorageService } from "./types";
import { R2StorageService } from "./r2-service";
import { MemoryStorageService } from "./memory-service";

export * from "./types";
export * from "./validation";
export * from "./r2-service";
export * from "./memory-service";

let memoryFallback: MemoryStorageService | null = null;

export function getStorageService(): IStorageService {
  try {
    const cf = getCloudflareContext();
    const bucket = (cf.env as unknown as { MEDIA_BUCKET?: R2Bucket })?.MEDIA_BUCKET;

    if (bucket && typeof bucket.put === "function") {
      return new R2StorageService(bucket);
    }
  } catch {
    // Cloudflare context is not available (e.g. during local tests or static builds)
  }

  if (!memoryFallback) {
    memoryFallback = new MemoryStorageService();
  }
  return memoryFallback;
}
