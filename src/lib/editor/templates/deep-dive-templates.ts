import type { ArticleTemplate } from "./types";

export const architectureDeepDiveTemplate: ArticleTemplate = {
  id: "architecture-deep-dive",
  name: "System Architecture Deep Dive",
  category: "Engineering",
  description: "Systems design with Mermaid diagram, file tree, database schema, and latency metrics.",
  defaultTitle: "Architecting a [System Name]: Design, Tradeoffs, and Benchmarks",
  content: `## High-Level Architecture

An in-depth breakdown of how our globally distributed edge architecture functions:

\`\`\`mermaid
graph TD
  User([Global User]) --> PoP[Cloudflare Anycast PoP]
  PoP --> Worker[Next.js App Worker]
  Worker --> Cache[(KV / Cache API)]
  Worker --> D1[(Cloudflare D1 SQLite)]
  Worker --> R2[(Cloudflare R2 Storage)]
\`\`\`

---

## Edge Service Structure

\`\`\`filetree
edge-service/
├── src/
│   ├── routes/
│   │   └── posts.ts      # Cloudflare D1 query router
│   ├── cache/
│   │   └── edge-kv.ts    # KV lookup layer
│   └── index.ts          # Anycast entrypoint
├── wrangler.toml
└── package.json
\`\`\`

---

## Key Design Principles

1. **Sub-millisecond Edge Lookups**: Keep hot read models directly in memory or local edge cache.
2. **Zero Egress Data Flow**: Assets and media streams never leave Cloudflare's internal network.
3. **Optimistic UI Consistency**: State mutations happen instantly on client devices before server round-trips.

---

## Database Design & Indexing

\`\`\`sql:schema.sql
-- Efficient compound index for high-cardinality queries
CREATE INDEX posts_status_published_at_idx ON posts (status, published_at DESC);
\`\`\`

---

## Latency & Performance Benchmarks

| Metric | Target | Actual (p95) |
| :--- | :--- | :--- |
| Time to First Byte (TTFB) | < 80ms | 32ms |
| First Contentful Paint (FCP) | < 1.0s | 0.4s |
| Largest Contentful Paint (LCP)| < 2.5s | 1.1s |

---

## Summary & Next Steps

Wrap up the primary engineering conclusions and future scaling milestones.
`,
};

export const apiDocTemplate: ArticleTemplate = {
  id: "api-reference",
  name: "API Reference & Documentation",
  category: "Reference",
  description: "Standard developer API guide with endpoints, request parameters, cURL, and JSON responses.",
  defaultTitle: "API Reference: [Service Name] REST & RPC Endpoints",
  content: `## Overview

This API allows programmatic creation, retrieval, and management of resources.

- **Base URL**: \`https://api.cloudblog.local/v1\`
- **Authentication**: Bearer Token or Session Cookie

---

### POST /api/posts

Create a new article draft or publish immediately.

#### Request Headers

| Header | Type | Description |
| :--- | :--- | :--- |
| \`Authorization\` | \`string\` | \`Bearer <your_token>\` |
| \`Content-Type\` | \`string\` | \`application/json\` |

#### Request Body

\`\`\`json
{
  "title": "Getting Started with Edge Databases",
  "slug": "getting-started-edge-databases",
  "content": "Full markdown content goes here...",
  "status": "published"
}
\`\`\`

#### Success Response (\`200 OK\`)

\`\`\`json
{
  "success": true,
  "data": {
    "id": "post_9921_abc",
    "slug": "getting-started-edge-databases",
    "publishedAt": "2026-10-01T00:00:00Z"
  }
}
\`\`\`

#### Example cURL

\`\`\`bash
curl -X POST https://api.cloudblog.local/v1/posts \\
  -H "Authorization: Bearer dev_token_123" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Hello Edge","content":"Welcome"}'
\`\`\`
`,
};
