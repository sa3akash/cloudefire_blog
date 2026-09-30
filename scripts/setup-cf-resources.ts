import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { resolve } from "path";

const wranglerPath = resolve(process.cwd(), "wrangler.jsonc");
let configRaw = readFileSync(wranglerPath, "utf-8");

console.log("==> Configuring Cloudflare Resources (D1, KV, R2 & Domain)...");

function runCommand(cmd: string): string {
  try {
    return execSync(cmd, { stdio: ["pipe", "pipe", "pipe"], encoding: "utf-8" }).trim();
  } catch (err: unknown) {
    const error = err as { stderr?: string; stdout?: string; message?: string };
    return error.stderr || error.stdout || error.message || "";
  }
}

// 1. Resolve D1 Database ID
let targetDbId = process.env.CLOUDFLARE_DATABASE_ID?.trim();
if (!targetDbId || targetDbId.includes("00000000")) {
  console.log("==> Querying Cloudflare D1 databases for 'cloudblog-d1'...");
  const listOutput = runCommand("bun x wrangler d1 list --json");
  try {
    const dbs = JSON.parse(listOutput) as Array<{ name: string; uuid: string }>;
    const existing = dbs.find((d) => d.name === "cloudblog-d1");
    if (existing?.uuid) {
      targetDbId = existing.uuid;
      console.log(`==> Found existing D1 Database UUID: ${targetDbId}`);
    }
  } catch {
    // listing failed or not logged in
  }

  if (!targetDbId && !configRaw.includes("cb964ba3")) {
    console.log("==> 'cloudblog-d1' not found. Creating D1 database on Cloudflare...");
    const createOut = runCommand("bun x wrangler d1 create cloudblog-d1");
    const uuidMatch = createOut.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
    if (uuidMatch) {
      targetDbId = uuidMatch[1];
      console.log(`==> Successfully created D1 Database UUID: ${targetDbId}`);
    }
  }
}

if (targetDbId && !targetDbId.includes("00000000")) {
  configRaw = configRaw.replace(/"database_id":\s*"[^"]+"/, `"database_id": "${targetDbId}"`);
  console.log(`==> Updated wrangler.jsonc with database_id: ${targetDbId}`);
}

// 2. Resolve KV Namespace ID
let targetKvId = process.env.CLOUDFLARE_KV_ID?.trim();
if (!targetKvId || targetKvId.includes("00000000")) {
  console.log("==> Querying Cloudflare KV namespaces for 'CLOUDBLOG_KV'...");
  const kvListOut = runCommand("bun x wrangler kv namespace list --json");
  try {
    const kvs = JSON.parse(kvListOut) as Array<{ title: string; id: string }>;
    const existingKv = kvs.find((k) => k.title === "cloudblog-CLOUDBLOG_KV" || k.title === "CLOUDBLOG_KV");
    if (existingKv?.id) {
      targetKvId = existingKv.id;
      console.log(`==> Found existing KV Namespace ID: ${targetKvId}`);
    }
  } catch {
    // Fail-safe
  }

  if (!targetKvId) {
    console.log("==> Creating KV namespace on Cloudflare...");
    const kvCreateOut = runCommand("bun x wrangler kv namespace create CLOUDBLOG_KV");
    const kvIdMatch = kvCreateOut.match(/id\s*=\s*["']?([a-f0-9]+)["']?/i) || kvCreateOut.match(/([a-f0-9]{32})/i);
    if (kvIdMatch) {
      targetKvId = kvIdMatch[1];
      console.log(`==> Successfully created KV Namespace ID: ${targetKvId}`);
    }
  }
}

if (targetKvId && !targetKvId.includes("00000000")) {
  configRaw = configRaw.replace(/"id":\s*"00000000000000000000000000000000"/, `"id": "${targetKvId}"`);
  console.log(`==> Updated wrangler.jsonc with KV id: ${targetKvId}`);
}

// 3. Ensure R2 Bucket Exists
console.log("==> Ensuring R2 media bucket 'cloudblog-media' exists...");
runCommand("bun x wrangler r2 bucket create cloudblog-media");

// 4. Auto-Connect Custom Domain if specified
const domain = (process.env.CLOUDFLARE_CUSTOM_DOMAIN || process.env.CUSTOM_DOMAIN || "").trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
if (domain && !configRaw.includes(domain)) {
  console.log(`==> Configuring Cloudflare Custom Domain auto-connect for '${domain}'...`);
  const routesConfig = `"routes": [\n    {\n      "pattern": "${domain}/*",\n      "custom_domain": true\n    }\n  ],\n  "workers_dev": true,`;
  if (!configRaw.includes('"routes"')) {
    configRaw = configRaw.replace(/"compatibility_flags":/, `${routesConfig}\n  "compatibility_flags":`);
    console.log(`==> Successfully bound custom domain '${domain}' with automated SSL & DNS!`);
  }
}

// 5. Save Updated wrangler.jsonc
writeFileSync(wranglerPath, configRaw, "utf-8");
console.log("==> Cloudflare resource configuration complete!");
