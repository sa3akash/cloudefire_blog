import type { IStorageService, UploadOptions, UploadResult, StorageFile } from "./types";
import { validateFile, generateSafeKey } from "./validation";

export class R2StorageService implements IStorageService {
  constructor(
    private bucket: R2Bucket,
    private publicBaseUrl: string = "/api/media"
  ) { }

  async uploadFile(
    data: Uint8Array | ArrayBuffer,
    originalFilename: string,
    options: UploadOptions
  ): Promise<UploadResult> {
    const validation = validateFile(
      data,
      originalFilename,
      options.contentType,
      options.maxSizeBytes
    );

    if (!validation.valid) {
      throw new Error(validation.error || "File validation failed");
    }

    const key = generateSafeKey(validation.extension);
    const mimeType = validation.mimeType || options.contentType;

    await this.bucket.put(key, data, {
      httpMetadata: {
        contentType: mimeType,
        cacheControl: "public, max-age=31536000, immutable",
      },
      customMetadata: options.customMetadata,
    });

    const url = this.getPublicUrl(key);

    return {
      key,
      url,
      sizeBytes: data.byteLength,
      mimeType,
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      const cleanKey = key.startsWith("/") ? key.slice(1) : key;
      await this.bucket.delete(cleanKey);
      if (cleanKey.startsWith("media/")) {
        await this.bucket.delete(cleanKey.replace(/^media\//, "")).catch(() => {});
      } else {
        await this.bucket.delete(`media/${cleanKey}`).catch(() => {});
      }
      return true;
    } catch (e) {
      console.error(`Failed to delete object from R2: ${key}`, e);
      return false;
    }
  }

  async getFile(key: string): Promise<StorageFile | null> {
    const cleanKey = key.startsWith("/") ? key.slice(1) : key;
    let object = await this.bucket.get(cleanKey);

    if (!object && !cleanKey.startsWith("media/")) {
      object = await this.bucket.get(`media/${cleanKey}`);
    } else if (!object && cleanKey.startsWith("media/")) {
      object = await this.bucket.get(cleanKey.replace(/^media\//, ""));
    }

    if (!object) return null;

    return {
      data: object.body,
      contentType: object.httpMetadata?.contentType || "application/octet-stream",
      size: object.size,
    };
  }

  getPublicUrl(key: string): string {
    const cleanKey = key.startsWith("/") ? key.slice(1) : key;
    const base = this.publicBaseUrl.endsWith("/")
      ? this.publicBaseUrl.slice(0, -1)
      : this.publicBaseUrl;
    return `${base}/${cleanKey}`;
  }
}
