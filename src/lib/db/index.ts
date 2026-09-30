import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./schema";

let mockDb: DrizzleD1Database<typeof schema> | null = null;

/**
 * Set a mock or test database instance (used for testing without Cloudflare environment)
 */
export function setTestDb(db: DrizzleD1Database<typeof schema> | null) {
  mockDb = db;
}

function createStubD1Database(): D1Database {
  const statement = {
    bind: () => statement,
    first: async <T = unknown>() => null as T | null,
    all: async <T = unknown>() => ({
      results: [] as T[],
      success: true,
      meta: {
        duration: 0,
        changes: 0,
        last_row_id: 0,
        served_by: "build-stub",
        rows_read: 0,
        rows_written: 0,
        size_after: 0,
        changed_db: false,
      },
    }),
    run: async () => ({
      results: [],
      success: true,
      meta: {
        duration: 0,
        changes: 0,
        last_row_id: 0,
        served_by: "build-stub",
        rows_read: 0,
        rows_written: 0,
        size_after: 0,
        changed_db: false,
      },
    }),
    raw: async () => [],
  } as unknown as D1PreparedStatement;

  return {
    prepare: () => statement,
    dump: async () => new ArrayBuffer(0),
    batch: async <T = unknown>() => [] as D1Result<T>[],
    exec: async () => ({ count: 0, duration: 0 }),
  } as unknown as D1Database;
}

/**
 * Get the Drizzle database instance connected to Cloudflare D1.
 * Supports Cloudflare Workers/Pages runtime, OpenNext dev server, and build/test fallbacks.
 */
export function getDb(): DrizzleD1Database<typeof schema> {
  if (mockDb) {
    return mockDb;
  }

  try {
    // Dynamic import style to prevent bundler errors when opennextjs is evaluated
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const ctx = getCloudflareContext();
    if (ctx?.env?.DB) {
      return drizzle(ctx.env.DB, { schema });
    }
  } catch {
    // Not running inside Cloudflare context or getCloudflareContext not initialized
  }

  // Fallback for edge cases where global env is set
  if (typeof (globalThis as unknown as { DB?: D1Database }).DB !== "undefined") {
    const globalDb = (globalThis as unknown as { DB: D1Database }).DB;
    return drizzle(globalDb, { schema });
  }

  // Build-time / static analysis fallback stub so `next build` never crashes
  const stub = createStubD1Database();
  return drizzle(stub, { schema });
}

export * from "./schema";
