# CloudBlog: Universal Production-Ready Editorial & Developer Publishing Platform

[![Deploy to Cloudflare Workers](https://github.com/shakil-dev/blog/actions/workflows/deploy.yml/badge.svg)](https://github.com/shakil-dev/blog/actions/workflows/deploy.yml)
[![Framework: Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![Database: Cloudflare D1](https://img.shields.io/badge/Cloudflare-D1%20SQLite-orange?logo=cloudflare)](https://developers.cloudflare.com/d1/)
[![Storage: Cloudflare R2](https://img.shields.io/badge/Cloudflare-R2%20Storage-orange?logo=cloudflare)](https://developers.cloudflare.com/r2/)
[![Runtime: Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare)](https://workers.cloudflare.com/)

**CloudBlog** is a modern, high-performance, universal blogging and content publishing platform designed for any editorial format: technical blogs, developer tutorials, case studies, changelogs, product reviews, and documentation. It is engineered to run seamlessly on **Cloudflare's Free Tier** (Workers, D1, R2, KV) while remaining adaptable for standard PostgreSQL, Neon, Supabase, and Vercel.

---

## Key Features

1. **Universal Markdown & MDX Editor**:
   - Write mode, Preview mode, and Split live-preview.
   - **Command Palette (`Ctrl/Cmd + K` or `Ctrl/Cmd + /`)**: Instant access to formatting, callouts, and publishing commands.
   - **Developer Keyboard Shortcuts**: `Ctrl+S` (save draft), `Ctrl+Enter` (publish), `Ctrl+B` (bold), `Ctrl+I` (italic), `Ctrl+Shift+1..3` (headings).
   - **Smart Snippets**: One-click insertion of TL;DR, Key Takeaways, Pros & Cons tables, FAQs, step-by-step guides, and code blocks with filenames.
   - **Article Templates**: Pre-built skeletons for Programming Tutorials, Product Reviews, Changelogs, and Head-to-Head Comparisons.
   - **Article Outline Generator**: Generate structured section outlines from any topic in seconds.
   - **Interactive Code Blocks**: Terminal styling, language badge, syntax highlighting, and one-click copy buttons.
   - **GitHub-Style Callouts**: `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]` with custom SVG icons and badges.
   - **Task Lists & Responsive Tables**: Interactive checklist checkboxes and striped tables.

2. **Real-time SEO Writing Assistant**:
   - Live 0–100 SEO score calculating title length (40–60 chars), description length (120–160 chars), H2 heading structure, content word count, and taxonomy assignment.
   - Automatically generated **JSON-LD schemas** (`BlogPosting`, `BreadcrumbList`, `WebSite` SearchAction).
   - Dynamic OpenGraph and Twitter summary cards.

3. **Revision History & Rollbacks**:
   - Automatic version snapshots saved on every article update.
   - Version history modal with version number, author, and timestamp.
   - Preview historical revisions and restore with one click.

4. **Threaded Multi-Step Comments**:
   - Nested comment discussions with unlimited hierarchical replies.
   - Moderation options: public comments toggle, auto-approve comments setting.
   - SHA-256 IP hashing and honeypot bot defense.

5. **Import & Export**:
   - Export any article as a standard `.md` Markdown file with YAML frontmatter.
   - Import `.md` files to automatically populate title, excerpt, and content.

6. **Responsive Device Preview**:
   - Live reader preview toggling between Desktop (100%), Tablet (768px), and Mobile (390px) device frames.

7. **Scalable Syndication & Dynamic Sitemaps**:
   - Next.js dynamic multi-sitemap indexing (`/sitemap/0.xml` for taxonomy, `/sitemap/1.xml` for articles) scalable to millions of URLs.
   - Dynamic RSS 2.0 feed (`/feed.xml`) with Dublin Core and CDATA escaping.

---

## Quick Start & Local Development

```bash
# 1. Install dependencies
bun install

# 2. Run D1 database migrations locally
bun run db:migrate:local

# 3. Seed demo articles, authors, and categories
bun run db:seed:local

# 4. Start the development server
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the public blog or [http://localhost:3000/admin](http://localhost:3000/admin) for the editorial dashboard.

---

## All Database & Cloudflare Commands

```bash
# Cloudflare Workers & Deployment
bun run cf:build           # Build OpenNext Cloudflare bundle (.open-next/worker.js)
bun run cf:preview         # Run local preview with Wrangler
bun run cf:deploy          # Deploy to Cloudflare Workers

# D1 Database Management
bun run d1:create          # Create remote Cloudflare D1 database
bun run d1:list            # List D1 databases
bun run d1:backup:local    # Export local D1 SQL backup
bun run d1:backup:remote   # Export remote D1 SQL backup

# Drizzle ORM
bun run db:generate        # Generate new migration files from schema
bun run db:migrate:local   # Apply migrations to local D1 instance
bun run db:migrate:remote  # Apply migrations to production Cloudflare D1
bun run db:studio          # Open Drizzle Studio database UI

# Storage & KV
bun run r2:create          # Create Cloudflare R2 bucket for media
bun run kv:create          # Create Cloudflare KV namespace
```

---

## Architecture Compliance

- **Strict File Length**: 100% of custom application files in `src/` are <= 150 lines.
- **Strict TypeScript & ESLint**: 0 errors, 0 warnings.
- **Unit Testing**: All test suites verified with `vitest`.
