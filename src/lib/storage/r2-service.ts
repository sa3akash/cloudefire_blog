import type { IStorageService, UploadOptions, UploadResult, StorageFile } from "./types";
import { validateFile, generateSafeKey } from "./validation";

export class R2StorageService implements IStorageService {
  constructor(
    private bucket: R2Bucket,
    private publicBaseUrl: string = "/api/media"
  ) {}

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

    await this.bucket.put(key, data, {
      httpMetadata: {
        contentType: options.contentType,
        cacheControl: "public, max-age=31536000, immutable",
      },
      customMetadata: options.customMetadata,
    });

    const url = this.getPublicUrl(key);

    return {
      key,
      url,
      sizeBytes: data.byteLength,
      mimeType: options.contentType,
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      await this.bucket.delete(key);
      return true;
    } catch (e) {
      console.error(`Failed to delete object from R2: ${key}`, e);
      return false;
    }
  }

  async getFile(key: string): Promise<StorageFile | null> {
    const object = await this.bucket.get(key);
    if (!object) return null;

    return {
      data: object.body,
      contentType: object.httpMetadata?.contentType || "application/octet-stream",
      size: object.size,
    };
  }

  getPublicUrl(key: string): string {
    const cleanKey = key.startsWith("/") ? key.slice(1) : key;
    return `${this.publicBaseUrl}/${cleanKey}`;
  }
}
