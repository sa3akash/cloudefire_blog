import type { IStorageService, UploadOptions, UploadResult, StorageFile } from "./types";
import { validateFile, generateSafeKey } from "./validation";

const globalForMemoryStorage = globalThis as unknown as {
  __memoryStorageFiles?: Map<string, { data: Uint8Array; contentType: string }>;
};

if (!globalForMemoryStorage.__memoryStorageFiles) {
  globalForMemoryStorage.__memoryStorageFiles = new Map();
}

export class MemoryStorageService implements IStorageService {
  private get files(): Map<string, { data: Uint8Array; contentType: string }> {
    return globalForMemoryStorage.__memoryStorageFiles!;
  }

  async uploadFile(
    data: Uint8Array | ArrayBuffer,
    originalFilename: string,
    options: UploadOptions
  ): Promise<UploadResult> {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    const validation = validateFile(
      bytes,
      originalFilename,
      options.contentType,
      options.maxSizeBytes
    );

    if (!validation.valid) {
      throw new Error(validation.error || "File validation failed");
    }

    const key = generateSafeKey(validation.extension);
    const mimeType = validation.mimeType || options.contentType;
    this.files.set(key, { data: bytes, contentType: mimeType });

    return {
      key,
      url: this.getPublicUrl(key),
      sizeBytes: bytes.byteLength,
      mimeType,
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    const cleanKey = key.startsWith("/") ? key.slice(1) : key;
    const deletedDirect = this.files.delete(cleanKey);
    const deletedWithMedia = this.files.delete(`media/${cleanKey}`);
    const deletedWithoutMedia = cleanKey.startsWith("media/")
      ? this.files.delete(cleanKey.replace(/^media\//, ""))
      : false;
    return deletedDirect || deletedWithMedia || deletedWithoutMedia;
  }

  async getFile(key: string): Promise<StorageFile | null> {
    const cleanKey = key.startsWith("/") ? key.slice(1) : key;
    let file = this.files.get(cleanKey);

    if (!file && !cleanKey.startsWith("media/")) {
      file = this.files.get(`media/${cleanKey}`);
    } else if (!file && cleanKey.startsWith("media/")) {
      file = this.files.get(cleanKey.replace(/^media\//, ""));
    }

    if (!file) return null;
    return {
      data: file.data,
      contentType: file.contentType,
      size: file.data.byteLength,
    };
  }

  getPublicUrl(key: string): string {
    const cleanKey = key.startsWith("/") ? key.slice(1) : key;
    return `/api/media/${cleanKey}`;
  }
}
