/**
 * Lightweight rate limiter to protect authentication endpoints from brute-force attacks.
 * Uses an in-memory sliding window cache with automatic cleanup, safe for Edge & Workers isolates.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function purgeStale(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, record] of memoryStore.entries()) {
    if (record.resetAt <= now) {
      memoryStore.delete(key);
    }
  }
}

export interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  purgeStale(now);

  const existing = memoryStore.get(options.key);

  if (!existing || existing.resetAt <= now) {
    const record: RateLimitRecord = {
      count: 1,
      resetAt: now + options.windowMs,
    };
    memoryStore.set(options.key, record);
    return {
      allowed: true,
      remaining: options.limit - 1,
      resetAt: record.resetAt,
    };
  }

  if (existing.count >= options.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: options.limit - existing.count,
    resetAt: existing.resetAt,
  };
}

export function resetRateLimit(key: string): void {
  memoryStore.delete(key);
}
