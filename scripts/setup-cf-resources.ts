import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { resolve } from "path";

const wranglerPath = resolve(process.cwd(), "wrangler.jsonc");
let configRaw = readFileSync(wranglerPath, "utf-8");

console.log("==> Configuring Cloudflare Resources (D1, R2 & Domain)...");

function runCommand(cmd: string): string {
  try {
    return execSync(cmd, { stdio: ["pipe", "pipe", "pipe"], encoding: "utf-8" }).trim();
  } catch (err: unknown) {
    const error = err as { stderr?: string; stdout?: string; message?: string };
    return error.stderr || error.stdout || error.message || "";
  }
}

async function cfApi(endpoint: string, method = "GET", body?: unknown) {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4${endpoint}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    return (await res.json()) as { success: boolean; result: unknown; errors?: unknown[] };
  } catch {
    return null;
  }
}

// 1. Resolve D1 Database ID
let targetDbId = process.env.CLOUDFLARE_DATABASE_ID?.trim();
if (!targetDbId || targetDbId.includes("00000000")) {
  const listOutput = runCommand("bun x wrangler d1 list --json");
  try {
    const dbs = JSON.parse(listOutput) as Array<{ name: string; uuid: string }>;
    const existing = dbs.find((d) => d.name === "cloudblog-d1");
    if (existing?.uuid) targetDbId = existing.uuid;
  } catch {}
  if (!targetDbId && !configRaw.includes("cb964ba3")) {
    const createOut = runCommand("bun x wrangler d1 create cloudblog-d1");
    const uuidMatch = createOut.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
    if (uuidMatch) targetDbId = uuidMatch[1];
  }
}
if (targetDbId && !targetDbId.includes("00000000")) {
  configRaw = configRaw.replace(/"database_id":\s*"[^"]+"/, `"database_id": "${targetDbId}"`);
  console.log(`==> Configured D1 Database UUID: ${targetDbId}`);
}

// 2. Resolve KV Namespace ID (Optional - only if provided)
const targetKvId = process.env.CLOUDFLARE_KV_ID?.trim();
if (targetKvId && !targetKvId.includes("00000000")) {
  if (!configRaw.includes('"kv_namespaces"')) {
    const kvSnippet = `"kv_namespaces": [\n    {\n      "binding": "KV",\n      "id": "${targetKvId}"\n    }\n  ],`;
    configRaw = configRaw.replace(/"vars":/, `${kvSnippet}\n  "vars":`);
    console.log(`==> Attached optional KV Namespace: ${targetKvId}`);
  }
} else {
  // Strip any dummy KV namespace if present
  configRaw = configRaw.replace(/,\s*"kv_namespaces":\s*\[[^\]]+\]/g, "");
  configRaw = configRaw.replace(/"kv_namespaces":\s*\[[^\]]+\]\s*,?/g, "");
}

// 3. Ensure R2 Bucket Exists
runCommand("bun x wrangler r2 bucket create cloudblog-media");

// 4. Custom Domain & Subdomain Handling
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim() || "";
let domain = (process.env.CLOUDFLARE_CUSTOM_DOMAIN || process.env.CUSTOM_DOMAIN || "")
  .trim()
  .replace(/^https?:\/\//i, "")
  .replace(/\/.*$/, "");

if (!domain && accountId) {
  const zonesRes = await cfApi(`/zones?account.id=${accountId}&status=active&per_page=5`);
  const zonesList = zonesRes?.result as Array<{ name: string }> | undefined;
  if (zonesRes?.success && Array.isArray(zonesList) && zonesList.length === 1) {
    domain = zonesList[0].name;
    console.log(`==> Auto-detected active Cloudflare Domain: ${domain}`);
  }
}

if (domain) {
  console.log(`==> Binding Cloudflare Custom Domain: ${domain}...`);
  configRaw = configRaw.replace(/"workers_dev":\s*true/, `"workers_dev": false`);
  if (!configRaw.includes('"routes"')) {
    const routesSnippet = `"routes": [\n    {\n      "pattern": "${domain}",\n      "custom_domain": true\n    }\n  ],`;
    configRaw = configRaw.replace(/"compatibility_flags":/, `${routesSnippet}\n  "compatibility_flags":`);
  }
  configRaw = configRaw.replace(/"SITE_URL":\s*"[^"]+"/, `"SITE_URL": "https://${domain}"`);
  console.log(`==> Custom domain '${domain}' bound! (Automated SSL & DNS routing enabled)`);
} else if (accountId) {
  const subRes = await cfApi(`/accounts/${accountId}/workers/subdomain`);
  const subData = subRes?.result as { subdomain?: string } | undefined;
  if (subRes?.success && subData?.subdomain) {
    console.log(`==> Deploying to workers.dev subdomain: ${subData.subdomain}.workers.dev`);
  }
}

// 5. Save Updated wrangler.jsonc
writeFileSync(wranglerPath, configRaw, "utf-8");
console.log("==> Cloudflare resource setup finished successfully!");
