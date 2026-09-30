/**
 * Storage Abstraction Layer (Cloudflare R2 and Test/Local Fallback)
 * Prevents vendor lock-in and provides strict file validation, sanitization, and safe key generation.
 */

export interface UploadOptions {
  contentType: string;
  maxSizeBytes?: number;
  customMetadata?: Record<string, string>;
}

export interface UploadResult {
  key: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
}

export interface StorageFile {
  data: ReadableStream | ArrayBuffer | Uint8Array;
  contentType: string;
  size: number;
}

export interface IStorageService {
  uploadFile(
    data: Uint8Array | ArrayBuffer,
    originalFilename: string,
    options: UploadOptions
  ): Promise<UploadResult>;
  deleteFile(key: string): Promise<boolean>;
  getFile(key: string): Promise<StorageFile | null>;
  getPublicUrl(key: string): string;
}

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/avif": [".avif"],
  "image/svg+xml": [".svg"],
};

export function sanitizeExtension(filename: string): string {
  const parts = filename.split(".");
  if (parts.length < 2) return "";
  const ext = "." + parts.pop()!.toLowerCase().replace(/[^a-z0-9]/g, "");
  return ext;
}

export function validateFile(
  data: Uint8Array | ArrayBuffer,
  originalFilename: string,
  declaredMimeType: string,
  maxSize: number = MAX_FILE_SIZE_BYTES
): { valid: boolean; error?: string; extension: string } {
  const byteLength = data.byteLength;

  if (byteLength === 0) {
    return { valid: false, error: "File is empty", extension: "" };
  }

  if (byteLength > maxSize) {
    const maxMb = (maxSize / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${(byteLength / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed size of ${maxMb} MB`,
      extension: "",
    };
  }

  const mime = declaredMimeType.toLowerCase().trim();
  const allowedExtensions = ALLOWED_MIME_TYPES[mime];

  if (!allowedExtensions) {
    return {
      valid: false,
      error: `File type "${declaredMimeType}" is not supported. Allowed types: JPEG, PNG, WebP, AVIF, SVG.`,
      extension: "",
    };
  }

  const ext = sanitizeExtension(originalFilename);
  if (!allowedExtensions.includes(ext) && ext !== "") {
    // If extension doesn't match mime, prefer primary valid extension for that mime
    return { valid: true, extension: allowedExtensions[0] };
  }

  // Basic SVG safety check (disallow <script> tags)
  if (mime === "image/svg+xml") {
    const text = new TextDecoder().decode(data);
    if (/<script[\s>]/i.test(text) || /javascript:/i.test(text) || /onload=/i.test(text)) {
      return {
        valid: false,
        error: "SVG file contains dangerous executable scripts or event handlers",
        extension: ".svg",
      };
    }
  }

  return { valid: true, extension: ext || allowedExtensions[0] };
}

export function generateSafeObjectKey(extension: string): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const uuid = crypto.randomUUID();
  const cleanExt = extension.startsWith(".") ? extension : `.${extension}`;
  return `media/${year}/${month}/${uuid}${cleanExt}`;
}

/**
 * Cloudflare R2 Storage Service Implementation
 */
export class R2StorageService implements IStorageService {
  private bucket: R2Bucket;

  constructor(bucket: R2Bucket) {
    this.bucket = bucket;
  }

  async uploadFile(
    data: Uint8Array | ArrayBuffer,
    originalFilename: string,
    options: UploadOptions
  ): Promise<UploadResult> {
    const validation = validateFile(
      data,
      originalFilename,
      options.contentType,
      options.maxSizeBytes ?? MAX_FILE_SIZE_BYTES
    );

    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const key = generateSafeObjectKey(validation.extension);

    await this.bucket.put(key, data, {
      httpMetadata: {
        contentType: options.contentType,
      },
      customMetadata: options.customMetadata,
    });

    return {
      key,
      url: this.getPublicUrl(key),
      sizeBytes: data.byteLength,
      mimeType: options.contentType,
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      await this.bucket.delete(key);
      return true;
    } catch {
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
    // Media route serves files with optimal caching and headers
    return `/api/media/${key}`;
  }
}

/**
 * In-memory Storage Service for testing and offline development
 */
export class MemoryStorageService implements IStorageService {
  private store = new Map<string, { data: Uint8Array; contentType: string }>();

  async uploadFile(
    data: Uint8Array | ArrayBuffer,
    originalFilename: string,
    options: UploadOptions
  ): Promise<UploadResult> {
    const validation = validateFile(
      data,
      originalFilename,
      options.contentType,
      options.maxSizeBytes ?? MAX_FILE_SIZE_BYTES
    );

    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const key = generateSafeObjectKey(validation.extension);
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);

    this.store.set(key, { data: bytes, contentType: options.contentType });

    return {
      key,
      url: this.getPublicUrl(key),
      sizeBytes: bytes.byteLength,
      mimeType: options.contentType,
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    return this.store.delete(key);
  }

  async getFile(key: string): Promise<StorageFile | null> {
    const item = this.store.get(key);
    if (!item) return null;
    return {
      data: item.data,
      contentType: item.contentType,
      size: item.data.byteLength,
    };
  }

  getPublicUrl(key: string): string {
    return `/api/media/${key}`;
  }
}

let mockStorage: IStorageService | null = null;

export function setTestStorage(storage: IStorageService | null) {
  mockStorage = storage;
}

export function getStorageService(): IStorageService {
  if (mockStorage) {
    return mockStorage;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const ctx = getCloudflareContext();
    if (ctx?.env?.MEDIA_BUCKET) {
      return new R2StorageService(ctx.env.MEDIA_BUCKET);
    }
  } catch {
    // Not running inside Cloudflare context
  }

  if (typeof (globalThis as unknown as { MEDIA_BUCKET?: R2Bucket }).MEDIA_BUCKET !== "undefined") {
    const bucket = (globalThis as unknown as { MEDIA_BUCKET: R2Bucket }).MEDIA_BUCKET;
    return new R2StorageService(bucket);
  }

  // Safe fallback to in-memory storage for dev/test when R2 bucket is not yet provisioned
  if (!globalMemoryStorage) {
    globalMemoryStorage = new MemoryStorageService();
  }
  return globalMemoryStorage;
}

let globalMemoryStorage: MemoryStorageService | null = null;
