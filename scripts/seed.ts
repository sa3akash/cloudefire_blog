import { hashPassword } from "../src/lib/auth/password";
import fs from "fs";
import path from "path";

async function generateSeed() {
  const adminId = "u_admin_root_001";
  const authorId = "a_shakil_author_001";
  const passwordHash = await hashPassword("CloudBlogDev2026!");
  const now = Date.now();

  const categories = [
    {
      id: "cat_tech_001",
      name: "Technology",
      slug: "technology",
      description: "Cutting-edge software engineering, edge runtimes, and developer tooling.",
    },
    {
      id: "cat_cloud_002",
      name: "Cloud Architecture",
      slug: "cloud-architecture",
      description: "Serverless systems, edge databases, and global network performance.",
    },
    {
      id: "cat_perf_003",
      name: "Web Performance",
      slug: "performance",
      description: "Core Web Vitals, streaming SSR, zero-bundle tricks, and asset caching.",
    },
  ];

  const tags = [
    { id: "tag_cf_01", name: "Cloudflare", slug: "cloudflare" },
    { id: "tag_next_02", name: "Next.js", slug: "nextjs" },
    { id: "tag_d1_03", name: "D1 Database", slug: "d1-database" },
    { id: "tag_r2_04", name: "R2 Storage", slug: "r2-storage" },
    { id: "tag_ts_05", name: "TypeScript", slug: "typescript" },
    { id: "tag_perf_06", name: "Performance", slug: "performance" },
  ];

  const posts = [
    {
      id: "post_cf_mastery_001",
      authorId,
      categoryId: "cat_cloud_002",
      title: "Building Production-Grade Next.js on Cloudflare Free Tier",
      slug: "building-production-nextjs-cloudflare-free-tier",
      excerpt:
        "How we architected a high-performance, full-stack editorial platform entirely within Cloudflare's generous free tier using D1, R2, and OpenNext.",
      content: `## The Modern Edge Architecture

Building web applications on serverless infrastructure has evolved rapidly. With Cloudflare Workers, **Cloudflare D1**, and **Cloudflare R2**, it is now possible to run an entire full-stack Next.js application at the global edge without incurring monthly hosting bills.

### Why Cloudflare Free Tier?

Cloudflare's free tier provides generous allowances that are more than sufficient for personal blogs, developer portfolios, and small-to-medium publication sites:

* **Cloudflare Workers**: 100,000 requests per day at zero cost.
* **Cloudflare D1**: 5 million row reads and 100,000 row writes per day.
* **Cloudflare R2**: 10 GB of storage and zero egress bandwidth fees.

### Database Query Optimization with Drizzle ORM

To operate comfortably within D1 free tier limits, we must avoid expensive scans and N+1 queries. Here is how we structure efficient index-backed queries:

\`\`\`typescript
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
\`\`\`

> "Simplicity and caching are the ultimate safeguards against resource exhaustion."

### Media Storage with Zero Egress Fees

Unlike AWS S3 which charges steep data transfer fees when your visitors load high-resolution images, Cloudflare R2 has **zero egress charges**. When paired with immutable caching headers, every image request is served directly from the nearest Cloudflare point of presence.

### Conclusion

By combining Next.js App Router with Cloudflare's native primitives, you get instant global distribution, sub-50ms latency, and rock-solid reliability.`,
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
      status: "published",
      featured: 1,
      seoTitle: "Building Next.js on Cloudflare Free Tier | CloudBlog",
      seoDescription: "Learn how to architect, optimize, and deploy a full-stack Next.js App Router blog on Cloudflare Workers, D1, and R2.",
      canonicalUrl: "http://localhost:3000/blog/building-production-nextjs-cloudflare-free-tier",
      readingTime: 4,
      publishedAt: now - 86400000 * 2, // 2 days ago
      tags: ["tag_cf_01", "tag_next_02", "tag_d1_03"],
    },
    {
      id: "post_web_vitals_002",
      authorId,
      categoryId: "cat_perf_003",
      title: "Mastering Core Web Vitals: Achieving 100/100 Lighthouse at the Edge",
      slug: "mastering-core-web-vitals-edge",
      excerpt:
        "A deep dive into optimizing Cumulative Layout Shift, Largest Contentful Paint, and Interaction to Next Paint with zero runtime bloat.",
      content: `## The Quest for Pure Performance

Performance is not merely an engineering vanity metric; it directly correlates with search engine ranking, reader retention, and mobile conversion rates.

### The Three Pillars of Modern Web Vitals

1. **Largest Contentful Paint (LCP)**: Measures perceived loading speed. Target: < 2.5 seconds.
2. **Interaction to Next Paint (INP)**: Assesses page responsiveness during user interaction. Target: < 200 ms.
3. **Cumulative Layout Shift (CLS)**: Quantifies visual stability. Target: < 0.1.

### Zero-CLS Image Strategy

Always declare aspect ratio or explicit dimension attributes on images before they load:

\`\`\`css
.article-cover {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 0.75rem;
}
\`\`\`

By ensuring that the browser calculates layout bounds prior to downloading network image streams, layout shifts are reduced to zero.`,
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
      status: "published",
      featured: 1,
      seoTitle: "Mastering Core Web Vitals at the Edge | CloudBlog",
      seoDescription: "Step-by-step techniques to achieve perfect Lighthouse scores on Cloudflare Workers.",
      canonicalUrl: "http://localhost:3000/blog/mastering-core-web-vitals-edge",
      readingTime: 3,
      publishedAt: now - 86400000 * 5, // 5 days ago
      tags: ["tag_perf_06", "tag_next_02"],
    },
    {
      id: "post_d1_guide_003",
      authorId,
      categoryId: "cat_cloud_002",
      title: "Cloudflare D1: SQLite Dialect Tricks and Indexing Strategies",
      slug: "cloudflare-d1-sqlite-dialect-tricks",
      excerpt:
        "Essential architectural patterns for querying serverless SQLite across Cloudflare's distributed edge nodes with sub-millisecond overhead.",
      content: `## Under the Hood of Cloudflare D1

Cloudflare D1 is built on top of SQLite, one of the most reliable and battle-tested database engines in computer science history.

### Query Batching

Because round-trips over edge networks incur marginal overhead, batching statements with D1 allows executing multiple queries in a single execution pipeline:

\`\`\`typescript
const [postsResult, tagsResult] = await db.batch([
  db.select().from(posts).limit(5),
  db.select().from(tags).limit(10),
]);
\`\`\`

### Indexing What Matters

Avoid over-indexing write-heavy columns while indexing every column used in \`WHERE\` clauses or \`ORDER BY\` expressions.

\`\`\`sql
CREATE INDEX posts_status_published_at_idx ON posts (status, published_at DESC);
\`\`\`

With compound indexing, the SQLite query planner performs a direct index seek rather than scanning the table rows.`,
      coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=80",
      status: "published",
      featured: 0,
      seoTitle: "Cloudflare D1 SQLite Tips and Tricks | CloudBlog",
      seoDescription: "Learn how to optimize Cloudflare D1 queries using compound indexes and batching.",
      canonicalUrl: "http://localhost:3000/blog/cloudflare-d1-sqlite-dialect-tricks",
      readingTime: 5,
      publishedAt: now - 86400000 * 8,
      tags: ["tag_d1_03", "tag_cf_01"],
    },
  ];

  const comments = [
    {
      id: "comm_001",
      postId: "post_cf_mastery_001",
      authorName: "Sarah Chen",
      authorEmail: "sarah.chen@example.com",
      content: "This guide is exceptionally well-written. The breakdown of D1 query limits and Drizzle ORM integration cleared up several hurdles for our team!",
      status: "approved",
      createdAt: now - 86400000 * 1,
    },
    {
      id: "comm_002",
      postId: "post_cf_mastery_001",
      authorName: "Marcus Vance",
      authorEmail: "marcus.v@example.com",
      content: "Great breakdown! Are you planning to add a section on Cloudflare Queues for background image processing?",
      status: "pending",
      createdAt: now - 3600000 * 4,
    },
  ];

  const siteSettings = [
    { key: "siteName", value: "CloudBlog" },
    { key: "siteDescription", value: "A high-performance editorial publication built on Cloudflare Workers, D1, and R2." },
    { key: "postsPerPage", value: "6" },
    { key: "allowComments", value: "true" },
    { key: "autoApproveComments", value: "false" },
    { key: "aboutText", value: "CloudBlog is an open-source, edge-native blogging platform engineered specifically for Cloudflare's free tier. It demonstrates how to achieve 100/100 Lighthouse performance with modern full-stack Next.js, SQLite, and R2 media storage." },
    { key: "contactEmail", value: "contact@cloudblog.local" },
  ];

  let sql = `-- CloudBlog Initial Seed Data
-- Admin Login: admin@cloudblog.local / CloudBlogDev2026!
-- Generated at: ${new Date().toISOString()}

`;

  // Users
  sql += `INSERT OR REPLACE INTO users (id, email, password_hash, name, role, avatar_url, bio, created_at, updated_at) VALUES ('${adminId}', 'admin@cloudblog.local', '${passwordHash}', 'CloudBlog Admin', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'Senior Full-Stack Engineer and Cloudflare Architect.', ${now}, ${now});\n\n`;

  // Authors
  sql += `INSERT OR REPLACE INTO authors (id, user_id, name, slug, bio, avatar_url, social_links, created_at, updated_at) VALUES ('${authorId}', '${adminId}', 'Alex Mercer', 'alex-mercer', 'Cloud architecture specialist, systems programmer, and technical author.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', '{"twitter":"https://x.com","github":"https://github.com"}', ${now}, ${now});\n\n`;

  // Categories
  for (const cat of categories) {
    sql += `INSERT OR REPLACE INTO categories (id, name, slug, description, created_at, updated_at) VALUES ('${cat.id}', '${cat.name.replace(/'/g, "''")}', '${cat.slug}', '${cat.description.replace(/'/g, "''")}', ${now}, ${now});\n`;
  }
  sql += "\n";

  // Tags
  for (const t of tags) {
    sql += `INSERT OR REPLACE INTO tags (id, name, slug, created_at, updated_at) VALUES ('${t.id}', '${t.name.replace(/'/g, "''")}', '${t.slug}', ${now}, ${now});\n`;
  }
  sql += "\n";

  // Posts
  for (const p of posts) {
    sql += `INSERT OR REPLACE INTO posts (id, author_id, category_id, title, slug, excerpt, content, cover_image, status, featured, seo_title, seo_description, canonical_url, reading_time, published_at, created_at, updated_at) VALUES ('${p.id}', '${p.authorId}', '${p.categoryId}', '${p.title.replace(/'/g, "''")}', '${p.slug}', '${p.excerpt.replace(/'/g, "''")}', '${p.content.replace(/'/g, "''")}', '${p.coverImage}', '${p.status}', ${p.featured}, '${p.seoTitle.replace(/'/g, "''")}', '${p.seoDescription.replace(/'/g, "''")}', '${p.canonicalUrl}', ${p.readingTime}, ${p.publishedAt}, ${now}, ${now});\n`;

    // Post tags
    for (const tagId of p.tags) {
      const ptId = `pt_${p.id}_${tagId}`;
      sql += `INSERT OR REPLACE INTO post_tags (id, post_id, tag_id) VALUES ('${ptId}', '${p.id}', '${tagId}');\n`;
    }
  }
  sql += "\n";

  // Comments
  for (const c of comments) {
    sql += `INSERT OR REPLACE INTO comments (id, post_id, author_name, author_email, content, status, ip_hash, created_at, updated_at) VALUES ('${c.id}', '${c.postId}', '${c.authorName.replace(/'/g, "''")}', '${c.authorEmail}', '${c.content.replace(/'/g, "''")}', '${c.status}', 'seed_hash', ${c.createdAt}, ${c.createdAt});\n`;
  }
  sql += "\n";

  // Site Settings
  for (const s of siteSettings) {
    sql += `INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES ('${s.key}', '${s.value.replace(/'/g, "''")}', ${now});\n`;
  }

  const outPath = path.resolve(__dirname, "seed.sql");
  fs.writeFileSync(outPath, sql, "utf-8");
  console.log(`Seed script successfully written to: ${outPath}`);
}

generateSeed().catch(console.error);
