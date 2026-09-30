/// <reference types="@cloudflare/workers-types" />

declare global {
  interface CloudflareEnv {
    DB: D1Database;
    MEDIA_BUCKET: R2Bucket;
    KV?: KVNamespace;
    ASSETS?: Fetcher;
    SITE_URL?: string;
    SITE_NAME?: string;
    ADMIN_SETUP_SECRET?: string;
  }
}

export {};
