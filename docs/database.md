# Cloudflare D1 Database Specification

CloudBlog uses **Cloudflare D1**—a distributed serverless relational database built on the SQLite dialect. Object Relational Mapping (ORM) and schema definition are managed via **Drizzle ORM**.

---

## 1. Relational Schema & Tables

| Table | Primary Key | Description | Key Indexes |
| :--- | :--- | :--- | :--- |
| `users` | `id` (UUID) | System administrators and staff | `users_email_unique` |
| `authors` | `id` (UUID) | Author profiles linked to users | `authors_slug_unique`, `authors_user_id_idx` |
| `categories` | `id` (UUID) | Top-level topic taxonomies | `categories_slug_unique`, `categories_slug_idx` |
| `tags` | `id` (UUID) | Modular article keyword tags | `tags_slug_unique`, `tags_slug_idx` |
| `posts` | `id` (UUID) | Markdown publications & metadata | `posts_slug_unique`, `posts_status_idx`, `posts_published_at_idx`, `posts_author_id_idx`, `posts_category_id_idx` |
| `post_tags` | `id` (UUID) | Many-to-many junction table | `post_tags_post_id_idx`, `post_tags_tag_id_idx` |
| `media` | `id` (UUID) | R2 object keys, URLs & metadata | `media_object_key_unique`, `media_object_key_idx` |
| `comments` | `id` (UUID) | Reader discussion & moderation | `comments_post_id_idx`, `comments_status_idx` |
| `sessions` | `id` (UUID) | Hashed authentication sessions | `sessions_token_unique`, `sessions_user_id_idx` |
| `site_settings` | `key` (Text) | Configurable site parameters | Primary key index |
| `post_views` | `id` (UUID) | Privacy-conscious 24h deduplicated hits | `post_views_post_id_idx`, `post_views_dedup_idx` (`postId` + `visitorHash`) |
| `audit_logs` | `id` (UUID) | System audit trails | `audit_logs_created_at_idx`, `audit_logs_user_id_idx` |

---

## 2. Migration Workflow

Migrations are generated using `drizzle-kit` and executed natively via `wrangler`:

```bash
# 1. Generate new SQL migrations from schema modifications
bun run db:generate

# 2. Apply migrations to the local D1 emulator
bun run db:migrate:local

# 3. Apply migrations to the live Cloudflare production D1 database
bun run db:migrate:remote
```

---

## 3. Seed & Initial Setup

```bash
# Generate seed SQL with secure PBKDF2 hashed administrator password
bun run db:seed:generate

# Execute seed script on local D1
bun run db:seed:local

# Execute seed script on production D1
bun run db:seed:remote
```

---

## 4. Disaster Recovery & Backup Strategy

Because SQLite is an atomic relational database, CloudBlog provides two complementary backup mechanisms:

### Method A: One-Click JSON Database Dump (In-App)
From `/admin/settings`, the administrator can click **Download Database Backup (.json)**. This queries all tables and streams an encrypted/downloadable JSON dump (`cloudblog-backup-YYYY-MM-DD.json`).

### Method B: Wrangler CLI Direct Export
Administrators can create an atomic SQLite snapshot directly from Cloudflare's network:

```bash
# Export remote D1 database to a local SQL file
bun x wrangler d1 export cloudblog-d1 --remote --output=./backups/cloudblog-backup-$(date +%F).sql

# Restore a previous backup into D1
bun x wrangler d1 execute cloudblog-d1 --remote --file=./backups/cloudblog-backup-2026-09-30.sql
```
