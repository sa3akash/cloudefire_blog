# Cloudflare Free Tier Architecture & Limitations

Operating a full-stack Next.js application within Cloudflare's **Free Tier** requires strict adherence to resource budgets and understanding of distributed edge runtimes.

---

## 1. Cloudflare Free Tier Resource Allowances

| Resource | Free Tier Allocation | CloudBlog Strategy |
| :--- | :--- | :--- |
| **Cloudflare Workers** | 100,000 requests / day | Server Components + Edge asset caching |
| **Worker CPU Time** | 10 ms / request | Lightweight execution, no heavy dependencies |
| **Cloudflare D1 Reads** | 5,000,000 rows / day | Compound index lookups, explicit `SELECT` columns |
| **Cloudflare D1 Writes** | 100,000 rows / day | 24-hour deduplicated view counting; batched writes |
| **Cloudflare D1 Storage** | 5 GB total database storage | Normalized schema; images stored exclusively in R2 |
| **Cloudflare R2 Storage** | 10 GB total storage | 5 MB upload limit; WebP/AVIF compression |
| **Cloudflare R2 Egress** | **Unlimited ($0.00 / GB)** | 1-year immutable `Cache-Control` header caching |

---

## 2. Why Workers (OpenNext) over Cloudflare Pages

1. **Native Node.js Compatibility**: The Workers runtime provides `nodejs_compat` with support for Web Streams, Crypto, and AsyncLocalStorage.
2. **Next.js 16 Support**: OpenNext adapts Next.js App Router directly into `.open-next/worker.js`, providing streaming Server-Side Rendering (SSR), Server Actions, and incremental caching.
3. **Unified Bindings**: Environment bindings (`env.DB`, `env.MEDIA_BUCKET`) are directly accessible via `getCloudflareContext()` with zero overhead.

---

## 3. Concrete Optimization Decisions in CloudBlog

### A. View Counter Deduplication
Instead of incrementing a database counter on every page visit (which could exhaust 100k daily writes under a spike or bot crawl), CloudBlog hashes the visitor's IP and User Agent per 24-hour window:
```typescript
// Only 1 view record is written per visitor per post per 24 hours
const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
const existing = await db
  .select({ id: postViews.id })
  .from(postViews)
  .where(
    and(
      eq(postViews.postId, postId),
      eq(postViews.visitorHash, visitorHash),
      sql`${postViews.viewedAt} > ${twentyFourHoursAgo.getTime()}`
    )
  )
  .limit(1);
```

### B. Prevention of N+1 Queries
When querying posts on the homepage or blog list, tags for all visible posts are retrieved in a single batched query using `inArray(postTags.postId, postIds)` rather than executing a separate SQL query per card.

### C. Zero Base64 In-Database Images
Uploaded cover images and article illustrations are uploaded directly to **Cloudflare R2**. Only the lightweight object key (e.g. `media/2026/09/uuid.webp`) and public URL are stored in D1, keeping the SQLite database files lean and well under the 5 GB free limit.
