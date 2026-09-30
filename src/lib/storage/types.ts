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
