# Production Deployment Guide: Next.js on Cloudflare Workers

This guide walks you through deploying CloudBlog entirely on Cloudflare's **Free Tier** using **OpenNext** and **Cloudflare Workers**.

---

## 1. Prerequisites

1. A **Cloudflare Account** (Free tier is sufficient).
2. **Node.js 20+** or **Bun 1.2+** installed on your workstation.
3. Authenticated **Wrangler CLI**:
   ```bash
   bun x wrangler login
   ```

---

## 2. Step-by-Step Provisioning

### Step 1: Create the Cloudflare D1 Database
Run the following command to provision your production SQLite database:

```bash
bun x wrangler d1 create cloudblog-d1
```

Wrangler will output:
```
✅ Successfully created DB 'cloudblog-d1'!
database_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### Step 2: Create the Cloudflare R2 Media Bucket
Create the object storage bucket for uploaded images:

```bash
bun x wrangler r2 bucket create cloudblog-media
```

### Step 3: Update `wrangler.jsonc`
Open `wrangler.jsonc` in the root of your project and paste your `database_id`:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "cloudblog-d1",
      "database_id": "YOUR_ACTUAL_D1_DATABASE_ID",
      "migrations_dir": "drizzle"
    }
  ],
  "r2_buckets": [
    {
      "binding": "MEDIA_BUCKET",
      "bucket_name": "cloudblog-media"
    }
  ]
}
```

### Step 4: Apply Database Migrations to Production D1
Execute the SQL migrations on your remote Cloudflare database:

```bash
bun run db:migrate:remote
```

### Step 5: (Optional) Seed Initial Demonstration Data
If you would like sample categories, tags, and articles populated:

```bash
bun run db:seed:remote
```

### Step 6: Build & Deploy
Build the Next.js bundle and adapt it into a Cloudflare Worker:

```bash
# 1. Build and adapt
bun run cf:build

# 2. Deploy worker to Cloudflare's global edge
bun x wrangler deploy
```

---

## 3. Custom Domain Setup

1. In the Cloudflare Dashboard, navigate to **Compute (Workers) > Workers & Pages > cloudblog**.
2. Go to **Settings > Domains & Routes**.
3. Click **Add Custom Domain** (e.g. `blog.yourdomain.com`).
4. Cloudflare automatically generates SSL/TLS certificates and updates DNS records within seconds.
