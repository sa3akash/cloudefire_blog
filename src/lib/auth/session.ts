import { getDb, sessions, users, type User, type Session } from "@/lib/db";
import { eq, and, gt } from "drizzle-orm";

export const SESSION_COOKIE_NAME = "cloudblog_session";
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function generateSecureToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const db = getDb();
  const token = generateSecureToken();
  const now = Date.now();
  const expiresAt = new Date(now + SESSION_DURATION_MS);

  await db.insert(sessions).values({
    id: crypto.randomUUID(),
    userId,
    token,
    expiresAt,
    createdAt: new Date(now),
  });

  return { token, expiresAt };
}

export async function validateSession(
  token: string
): Promise<{ user: User; session: Session } | null> {
  if (!token || typeof token !== "string" || token.length < 32) {
    return null;
  }

  const db = getDb();
  const now = new Date();

  // Single join query: avoids N+1, only selects needed columns
  const result = await db
    .select({
      user: users,
      session: sessions,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, now)))
    .limit(1);

  if (!result || result.length === 0) {
    return null;
  }

  return result[0];
}

export async function invalidateSession(token: string): Promise<void> {
  if (!token) return;
  const db = getDb();
  await db.delete(sessions).where(eq(sessions.token, token));
}

export async function invalidateUserSessions(userId: string): Promise<void> {
  if (!userId) return;
  const db = getDb();
  await db.delete(sessions).where(eq(sessions.userId, userId));
}
