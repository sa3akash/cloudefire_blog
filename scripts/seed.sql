-- CloudBlog Initial Seed Data
-- Admin Login: admin@cloudblog.local / CloudBlogDev2026!
-- Generated at: 2026-09-30T13:46:09.450Z

INSERT OR REPLACE INTO users (id, email, password_hash, name, role, avatar_url, bio, created_at, updated_at) VALUES ('u_admin_root_001', 'admin@cloudblog.local', 'pbkdf2:sha256:100000:276b7edc3bc8559cef83f8edc7cbfbc9:5e365c76ba573bed542ae31f7d4898d352133d5ea7f0e1aa6e42135d26d7f2ea', 'CloudBlog Admin', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'Senior Full-Stack Engineer and Cloudflare Architect.', 1790775969450, 1790775969450);

INSERT OR REPLACE INTO authors (id, user_id, name, slug, bio, avatar_url, social_links, created_at, updated_at) VALUES ('a_shakil_author_001', 'u_admin_root_001', 'Alex Mercer', 'alex-mercer', 'Cloud architecture specialist, systems programmer, and technical author.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', '{"twitter":"https://x.com","github":"https://github.com"}', 1790775969450, 1790775969450);

INSERT OR REPLACE INTO categories (id, name, slug, description, created_at, updated_at) VALUES ('cat_tech_001', 'Technology', 'technology', 'Cutting-edge software engineering, edge runtimes, and developer tooling.', 1790775969450, 1790775969450);
INSERT OR REPLACE INTO categories (id, name, slug, description, created_at, updated_at) VALUES ('cat_cloud_002', 'Cloud Architecture', 'cloud-architecture', 'Serverless systems, edge databases, and global network performance.', 1790775969450, 1790775969450);
INSERT OR REPLACE INTO categories (id, name, slug, description, created_at, updated_at) VALUES ('cat_perf_003', 'Web Performance', 'performance', 'Core Web Vitals, streaming SSR, zero-bundle tricks, and asset caching.', 1790775969450, 1790775969450);

INSERT OR REPLACE INTO tags (id, name, slug, created_at, updated_at) VALUES ('tag_cf_01', 'Cloudflare', 'cloudflare', 1790775969450, 1790775969450);
INSERT OR REPLACE INTO tags (id, name, slug, created_at, updated_at) VALUES ('tag_next_02', 'Next.js', 'nextjs', 1790775969450, 1790775969450);
INSERT OR REPLACE INTO tags (id, name, slug, created_at, updated_at) VALUES ('tag_d1_03', 'D1 Database', 'd1-database', 1790775969450, 1790775969450);
INSERT OR REPLACE INTO tags (id, name, slug, created_at, updated_at) VALUES ('tag_r2_04', 'R2 Storage', 'r2-storage', 1790775969450, 1790775969450);
INSERT OR REPLACE INTO tags (id, name, slug, created_at, updated_at) VALUES ('tag_ts_05', 'TypeScript', 'typescript', 1790775969450, 1790775969450);
INSERT OR REPLACE INTO tags (id, name, slug, created_at, updated_at) VALUES ('tag_perf_06', 'Performance', 'performance', 1790775969450, 1790775969450);

INSERT OR REPLACE INTO posts (id, author_id, category_id, title, slug, excerpt, content, cover_image, status, featured, seo_title, seo_description, canonical_url, reading_time, published_at, created_at, updated_at) VALUES ('post_cf_mastery_001', 'a_shakil_author_001', 'cat_cloud_002', 'Building Production-Grade Next.js on Cloudflare Free Tier', 'building-production-nextjs-cloudflare-free-tier', 'How we architected a high-performance, full-stack editorial platform entirely within Cloudflare''s generous free tier using D1, R2, and OpenNext.', '## The Modern Edge Architecture

Building web applications on serverless infrastructure has evolved rapidly. With Cloudflare Workers, **Cloudflare D1**, and **Cloudflare R2**, it is now possible to run an entire full-stack Next.js application at the global edge without incurring monthly hosting bills.

### Why Cloudflare Free Tier?

Cloudflare''s free tier provides generous allowances that are more than sufficient for personal blogs, developer portfolios, and small-to-medium publication sites:

* **Cloudflare Workers**: 100,000 requests per day at zero cost.
* **Cloudflare D1**: 5 million row reads and 100,000 row writes per day.
* **Cloudflare R2**: 10 GB of storage and zero egress bandwidth fees.

### Database Query Optimization with Drizzle ORM

To operate comfortably within D1 free tier limits, we must avoid expensive scans and N+1 queries. Here is how we structure efficient index-backed queries:

```typescript
import { getDb, posts, categories } from "@/lib/db";
import { eq, desc } from "drizzle-orm";

export async function getPublishedArticles(page = 1, limit = 10) {
  const db = getDb();
  return await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      publishedAt: posts.publishedAt,
      readingTime: posts.readingTime,
      categoryName: categories.name,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .offset((page - 1) * limit);
}
```

> "Simplicity and caching are the ultimate safeguards against resource exhaustion."

### Media Storage with Zero Egress Fees

Unlike AWS S3 which charges steep data transfer fees when your visitors load high-resolution images, Cloudflare R2 has **zero egress charges**. When paired with immutable caching headers, every image request is served directly from the nearest Cloudflare point of presence.

### Conclusion

By combining Next.js App Router with Cloudflare''s native primitives, you get instant global distribution, sub-50ms latency, and rock-solid reliability.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80', 'published', 1, 'Building Next.js on Cloudflare Free Tier | CloudBlog', 'Learn how to architect, optimize, and deploy a full-stack Next.js App Router blog on Cloudflare Workers, D1, and R2.', 'http://localhost:3000/blog/building-production-nextjs-cloudflare-free-tier', 4, 1790603169450, 1790775969450, 1790775969450);
INSERT OR REPLACE INTO post_tags (id, post_id, tag_id) VALUES ('pt_post_cf_mastery_001_tag_cf_01', 'post_cf_mastery_001', 'tag_cf_01');
INSERT OR REPLACE INTO post_tags (id, post_id, tag_id) VALUES ('pt_post_cf_mastery_001_tag_next_02', 'post_cf_mastery_001', 'tag_next_02');
INSERT OR REPLACE INTO post_tags (id, post_id, tag_id) VALUES ('pt_post_cf_mastery_001_tag_d1_03', 'post_cf_mastery_001', 'tag_d1_03');
INSERT OR REPLACE INTO posts (id, author_id, category_id, title, slug, excerpt, content, cover_image, status, featured, seo_title, seo_description, canonical_url, reading_time, published_at, created_at, updated_at) VALUES ('post_web_vitals_002', 'a_shakil_author_001', 'cat_perf_003', 'Mastering Core Web Vitals: Achieving 100/100 Lighthouse at the Edge', 'mastering-core-web-vitals-edge', 'A deep dive into optimizing Cumulative Layout Shift, Largest Contentful Paint, and Interaction to Next Paint with zero runtime bloat.', '## The Quest for Pure Performance

Performance is not merely an engineering vanity metric; it directly correlates with search engine ranking, reader retention, and mobile conversion rates.

### The Three Pillars of Modern Web Vitals

1. **Largest Contentful Paint (LCP)**: Measures perceived loading speed. Target: < 2.5 seconds.
2. **Interaction to Next Paint (INP)**: Assesses page responsiveness during user interaction. Target: < 200 ms.
3. **Cumulative Layout Shift (CLS)**: Quantifies visual stability. Target: < 0.1.

### Zero-CLS Image Strategy

Always declare aspect ratio or explicit dimension attributes on images before they load:

```css
.article-cover {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 0.75rem;
}
```

By ensuring that the browser calculates layout bounds prior to downloading network image streams, layout shifts are reduced to zero.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80', 'published', 1, 'Mastering Core Web Vitals at the Edge | CloudBlog', 'Step-by-step techniques to achieve perfect Lighthouse scores on Cloudflare Workers.', 'http://localhost:3000/blog/mastering-core-web-vitals-edge', 3, 1790343969450, 1790775969450, 1790775969450);
INSERT OR REPLACE INTO post_tags (id, post_id, tag_id) VALUES ('pt_post_web_vitals_002_tag_perf_06', 'post_web_vitals_002', 'tag_perf_06');
INSERT OR REPLACE INTO post_tags (id, post_id, tag_id) VALUES ('pt_post_web_vitals_002_tag_next_02', 'post_web_vitals_002', 'tag_next_02');
INSERT OR REPLACE INTO posts (id, author_id, category_id, title, slug, excerpt, content, cover_image, status, featured, seo_title, seo_description, canonical_url, reading_time, published_at, created_at, updated_at) VALUES ('post_d1_guide_003', 'a_shakil_author_001', 'cat_cloud_002', 'Cloudflare D1: SQLite Dialect Tricks and Indexing Strategies', 'cloudflare-d1-sqlite-dialect-tricks', 'Essential architectural patterns for querying serverless SQLite across Cloudflare''s distributed edge nodes with sub-millisecond overhead.', '## Under the Hood of Cloudflare D1

Cloudflare D1 is built on top of SQLite, one of the most reliable and battle-tested database engines in computer science history.

### Query Batching

Because round-trips over edge networks incur marginal overhead, batching statements with D1 allows executing multiple queries in a single execution pipeline:

```typescript
const [postsResult, tagsResult] = await db.batch([
  db.select().from(posts).limit(5),
  db.select().from(tags).limit(10),
]);
```

### Indexing What Matters

Avoid over-indexing write-heavy columns while indexing every column used in `WHERE` clauses or `ORDER BY` expressions.

```sql
CREATE INDEX posts_status_published_at_idx ON posts (status, published_at DESC);
```

With compound indexing, the SQLite query planner performs a direct index seek rather than scanning the table rows.', 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=80', 'published', 0, 'Cloudflare D1 SQLite Tips and Tricks | CloudBlog', 'Learn how to optimize Cloudflare D1 queries using compound indexes and batching.', 'http://localhost:3000/blog/cloudflare-d1-sqlite-dialect-tricks', 5, 1790084769450, 1790775969450, 1790775969450);
INSERT OR REPLACE INTO post_tags (id, post_id, tag_id) VALUES ('pt_post_d1_guide_003_tag_d1_03', 'post_d1_guide_003', 'tag_d1_03');
INSERT OR REPLACE INTO post_tags (id, post_id, tag_id) VALUES ('pt_post_d1_guide_003_tag_cf_01', 'post_d1_guide_003', 'tag_cf_01');

INSERT OR REPLACE INTO comments (id, post_id, author_name, author_email, content, status, ip_hash, created_at, updated_at) VALUES ('comm_001', 'post_cf_mastery_001', 'Sarah Chen', 'sarah.chen@example.com', 'This guide is exceptionally well-written. The breakdown of D1 query limits and Drizzle ORM integration cleared up several hurdles for our team!', 'approved', 'seed_hash', 1790689569450, 1790689569450);
INSERT OR REPLACE INTO comments (id, post_id, author_name, author_email, content, status, ip_hash, created_at, updated_at) VALUES ('comm_002', 'post_cf_mastery_001', 'Marcus Vance', 'marcus.v@example.com', 'Great breakdown! Are you planning to add a section on Cloudflare Queues for background image processing?', 'pending', 'seed_hash', 1790761569450, 1790761569450);

INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES ('siteName', 'CloudBlog', 1790775969450);
INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES ('siteDescription', 'A high-performance editorial publication built on Cloudflare Workers, D1, and R2.', 1790775969450);
INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES ('postsPerPage', '6', 1790775969450);
INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES ('allowComments', 'true', 1790775969450);
INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES ('autoApproveComments', 'false', 1790775969450);
INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES ('aboutText', 'CloudBlog is an open-source, edge-native blogging platform engineered specifically for Cloudflare''s free tier. It demonstrates how to achieve 100/100 Lighthouse performance with modern full-stack Next.js, SQLite, and R2 media storage.', 1790775969450);
INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES ('contactEmail', 'contact@cloudblog.local', 1790775969450);
