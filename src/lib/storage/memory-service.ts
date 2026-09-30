import type { IStorageService, UploadOptions, UploadResult, StorageFile } from "./types";
import { validateFile, generateSafeKey } from "./validation";

export class MemoryStorageService implements IStorageService {
  private files = new Map<string, { data: Uint8Array; contentType: string }>();

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
    this.files.set(key, { data: bytes, contentType: options.contentType });

    return {
      key,
      url: `/api/media/${key}`,
      sizeBytes: bytes.byteLength,
      mimeType: options.contentType,
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    return this.files.delete(key);
  }

  async getFile(key: string): Promise<StorageFile | null> {
    const file = this.files.get(key);
    if (!file) return null;
    return {
      data: file.data,
      contentType: file.contentType,
      size: file.data.byteLength,
    };
  }

  getPublicUrl(key: string): string {
    return `/api/media/${key}`;
  }
}
