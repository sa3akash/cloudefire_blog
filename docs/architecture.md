# CloudBlog Architecture Specification

CloudBlog is a production-grade, edge-native publication and Content Management System built with **Next.js 16 (App Router)** and **Cloudflare Infrastructure**. It is designed to operate completely within Cloudflare's **Free Tier** limits without sacrificing performance, security, or developer experience.

---

## 1. System Architecture Overview

```
                                    +-----------------------------------+
                                    |         Visitor / Browser         |
                                    +-----------------+-----------------+
                                                      |
                                             HTTPS / DNS / TLS
                                                      |
                                    +-----------------v-----------------+
                                    |    Cloudflare Global Anycast Edge |
                                    |    - 300+ Edge Data Centers       |
                                    |    - Static Asset Caching         |
                                    |    - DDoS Protection & SSL        |
                                    +-----------------+-----------------+
                                                      |
                         +----------------------------+----------------------------+
                         |                                                         |
                         | (Static Asset / Media)                                  | (Dynamic Request / SSR)
                         v                                                         v
        +-----------------------------------+                     +-----------------------------------+
        |        Cloudflare R2 Bucket       |                     |    Cloudflare Workers Runtime     |
        |    - Media Images (WebP/AVIF/PNG) |                     |    - OpenNext Cloudflare Adapter  |
        |    - Zero Egress Bandwidth Fees   |                     |    - React 19 Server Components   |
        |    - Immutable HTTP Cache-Control |                     |    - Server Actions               |
        +-----------------------------------+                     +-----------------+-----------------+
                                                                                    |
                                                                           Drizzle ORM Queries
                                                                                    |
                                                                  +-----------------v-----------------+
                                                                  |       Cloudflare D1 Database      |
                                                                  |    - Serverless SQLite at Edge    |
                                                                  |    - Compound Index Seek          |
                                                                  |    - 5M Reads / 100k Writes Free  |
                                                                  +-----------------------------------+
```

---

## 2. Core Design Principles

### A. Zero External Vendor Lock-In
All business logic is decoupled from direct Cloudflare proprietary APIs using clean TypeScript abstractions:
- **Storage Abstraction (`src/lib/storage/storage.ts`)**: `IStorageService` interface with implementations for Cloudflare R2 (`R2StorageService`) and Local/Memory Fallback (`MemoryStorageService`).
- **Database Layer (`src/lib/db/index.ts`)**: Universal `getDb()` factory returning a Drizzle ORM client supporting Cloudflare D1 runtime, local development proxies, and build-time static analysis stubs.
- **Authentication Abstraction (`src/lib/auth/`)**: 100% standard Web Crypto API (`crypto.subtle`) for PBKDF2 password hashing, running universally across Cloudflare Workers, Node.js, and browser runtimes without native C++ binary dependencies (such as bcrypt or argon2 binaries).

### B. Free-Tier Optimization Strategy
Cloudflare provides generous free allowances that are protected through careful architectural safeguards:
1. **Workers CPU & Requests**: 100,000 requests/day. Public pages use aggressive `Cache-Control` headers and Server Components to minimize execution overhead.
2. **D1 Read/Write Limits**: 5,000,000 row reads and 100,000 row writes/day.
   - All queries use strict column selection (avoiding `SELECT *`).
   - Foreign keys, slugs, and dates are indexed with compound indexes (`posts_status_idx`, `posts_slug_idx`, `post_views_dedup_idx`).
   - Page view tracking is deduplicated with a 24-hour visitor hash to avoid recording repeated writes for every page refresh.
3. **R2 Zero Egress**: Unlike AWS S3, Cloudflare R2 charges **$0.00** for outbound data transfer. High-resolution images are served with `Cache-Control: public, max-age=31536000, immutable`.

### C. Server Components by Default
Interactive client components (`"use client"`) are strictly restricted to leaf nodes:
- Theme toggle
- Mobile navigation drawer
- Table of Contents scroll observer
- Markdown live editor
- Comment submission form
All other markup (article prose, lists, grids, metadata) is rendered server-side with zero client JavaScript runtime tax.
