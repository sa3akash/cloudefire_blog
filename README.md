# CloudBlog: Production-Ready Next.js on Cloudflare Free Tier

[![Deploy to Cloudflare Workers](https://github.com/shakil-dev/blog/actions/workflows/deploy.yml/badge.svg)](https://github.com/shakil-dev/blog/actions/workflows/deploy.yml)
[![Framework: Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![Database: Cloudflare D1](https://img.shields.io/badge/Cloudflare-D1%20SQLite-orange?logo=cloudflare)](https://developers.cloudflare.com/d1/)
[![Storage: Cloudflare R2](https://img.shields.io/badge/Cloudflare-R2%20Storage-orange?logo=cloudflare)](https://developers.cloudflare.com/r2/)
[![Runtime: Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare)](https://workers.cloudflare.com/)

**CloudBlog** is a modern, high-performance, full-featured publishing platform engineered specifically to run entirely on **Cloudflare's Free Tier**. It requires **zero external backend services** (no Vercel, Supabase, Firebase, Railway, or AWS).

---

## Architecture Diagram

```
                                    +-----------------------------------+
                                    |         Visitor / Browser         |
                                    +-----------------+-----------------+
                                                      |
                                            HTTPS / Edge Routing
                                                      |
                                    +-----------------v-----------------+
                                    |   Cloudflare Global Anycast Edge  |
                                    |   - 300+ Edge Locations           |
                                    |   - DDoS & SSL / TLS Termination  |
                                    |   - Asset & Cache API             |
                                    +-----------------+-----------------+
                                                      |
                         +----------------------------+----------------------------+
                         |                                                         |
                         | (Static & Media Streams)                                | (Dynamic SSR / Mutations)
                         v                                                         v
        +-----------------------------------+                     +-----------------------------------+
        |        Cloudflare R2 Bucket       |                     |    Cloudflare Workers Runtime     |
        |    - Media Images (WebP/AVIF/PNG) |                     |    - OpenNext Cloudflare Adapter  |
        |    - Zero Egress Bandwidth Fees   |                     |    - React 19 Server Components   |
        |    - 1-Year Immutable Caching     |                     |    - Secure Server Actions        |
        +-----------------------------------+                     +-----------------+-----------------+
                                                                                    |
                                                                           Drizzle ORM Queries
                                                                                    |
                                                                  +-----------------v-----------------+
                                                                  |       Cloudflare D1 Database      |
                                                                  |    - Serverless SQLite at Edge    |
                                                                  |    - 5M Reads / 100k Writes Free  |
                                                                  |    - Compound Index Seek          |
                                                                  +-----------------------------------+
```

---

## 1. Core Stack & Technology Decisions

* **Framework**: Next.js 16 (App Router) + React 19 (Server Components by default).
* **Edge Runtime**: Cloudflare Workers via `@opennextjs/cloudflare`.
* **Database**: Cloudflare D1 (Serverless SQLite) with **Drizzle ORM**.
* **Object Storage**: Cloudflare R2 for all image/media assets (zero egress bandwidth costs).
* **Styling**: Tailwind CSS v4 + **shadcn/ui** components.
* **Authentication**: Workers-compatible Web Crypto API (`PBKDF2-SHA256`) with HttpOnly/Secure/SameSite cookies and server-side authorization on every mutation.
* **Markdown/MDX**: Rich editor with live split-preview, syntax highlighting (`highlight.js`), table of contents extractor, and direct R2 image upload.
* **Testing**: **Vitest** for unit test suites and **Playwright** for critical end-to-end browser flows.

---

## 2. Quick Start & Local Development

You can run CloudBlog locally without needing a paid Cloudflare account or active cloud connection.

### Step 1: Install Dependencies
```bash
bun install
# or: npm install
```

### Step 2: Apply Local D1 Database Migrations
```bash
bun run db:migrate:local
```

### Step 3: Seed Demonstration Data
```bash
# Populates admin account, sample categories, tags, and articles
bun run db:seed:local
```

> **Default Seed Credentials**:
> * **Email**: `admin@cloudblog.local`
> * **Password**: `CloudBlogDev2026!`

### Step 4: Start the Development Server
```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public site or [http://localhost:3000/admin](http://localhost:3000/admin) to access the CMS.

---

## 3. Cloudflare Production Deployment

Follow these steps to deploy CloudBlog to your Cloudflare account.

### 1. Authenticate with Cloudflare
```bash
bun x wrangler login
```

### 2. Create the D1 Relational Database
```bash
bun x wrangler d1 create cloudblog-d1
```
Note the generated `database_id`.

### 3. Create the R2 Storage Bucket
```bash
bun x wrangler r2 bucket create cloudblog-media
```

### 4. Configure `wrangler.jsonc`
Open `wrangler.jsonc` and insert your `database_id`:
```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "cloudblog-d1",
    "database_id": "YOUR_D1_DATABASE_ID_HERE",
    "migrations_dir": "drizzle"
  }
]
```

### 5. Apply Migrations to Remote Production Database
```bash
bun run db:migrate:remote
```

### 6. (Optional) Seed Initial Production Data
```bash
bun run db:seed:remote
```

### 7. Build and Deploy Worker
```bash
# Adapts Next.js to Cloudflare Worker bundle
bun run cf:build

# Deploys to Cloudflare Workers
bun x wrangler deploy
```

---

## 4. Environment Variables

Create a `.env.local` file for local development overrides (see `.env.example`):

| Variable | Required | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Fully-qualified URL of your blog (e.g. `https://blog.yourdomain.com`) |
| `NEXT_PUBLIC_SITE_NAME` | No | Display name of the blog (defaults to `CloudBlog`) |
| `ADMIN_SETUP_SECRET` | No | Secret token for automated initialization scripts |
| `CLOUDFLARE_ACCOUNT_ID` | CI/CD | Cloudflare Account ID for GitHub Actions / remote deployment |
| `CLOUDFLARE_API_TOKEN` | CI/CD | Scoped Cloudflare API Token with Workers, D1, and R2 permissions |

---

## 5. Free-Tier Resource Safeguards

| Cloudflare Resource | Free Limit | Architectural Protection |
| :--- | :--- | :--- |
| **Worker Requests** | 100,000 / day | Static routes prerendered; public caching headers applied |
| **D1 Row Reads** | 5,000,000 / day | Strict column projections; compound indexing seeks |
| **D1 Row Writes** | 100,000 / day | 24-hour visitor-hash deduplication on page views |
| **D1 Storage** | 5 GB | Images stored strictly in R2; zero base64 database bloat |
| **R2 Storage** | 10 GB | 5 MB upload limit; WebP/AVIF recommended |
| **R2 Egress** | **Unlimited ($0.00)** | 1-year immutable edge caching headers |

---

## 6. Disaster Recovery & Backups

1. **In-App JSON Backup**: Log in to `/admin/settings` and click **Download Database Backup (.json)** to receive an atomic export of all posts, categories, tags, comments, and settings.
2. **Wrangler SQL Dump**:
   ```bash
   bun x wrangler d1 export cloudblog-d1 --remote --output=./backups/backup.sql
   ```

---

## 7. Testing Suite

```bash
# Run unit tests (Authentication, Storage, Validation, Slug, SEO)
bun run test

# Run linter
bun run lint

# Run Playwright end-to-end tests
bun run test:e2e
```

---

## 8. Documentation Index

Detailed architectural blueprints are available in [`docs/`](./docs/):
* [`docs/architecture.md`](./docs/architecture.md): System topology, decoupling, and edge runtime design.
* [`docs/database.md`](./docs/database.md): D1 schema, relational tables, indexing, and migrations.
* [`docs/deployment.md`](./docs/deployment.md): Complete Cloudflare setup and custom domain guide.
* [`docs/security.md`](./docs/security.md): Web Crypto PBKDF2 hashing, secure sessions, and honeypot anti-spam.
* [`docs/cloudflare.md`](./docs/cloudflare.md): Free-tier limits analysis and performance benchmarks.
