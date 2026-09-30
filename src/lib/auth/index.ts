import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE_NAME,
  createSession,
  validateSession,
  invalidateSession,
} from "./session";
import type { User } from "@/lib/db";

export * from "./password";
export * from "./session";
export * from "./rate-limit";

/**
 * Retrieves the currently authenticated user from the request session cookie.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const validated = await validateSession(token);
    return validated ? validated.user : null;
  } catch {
    return null;
  }
}

/**
 * Enforces that a valid authenticated session exists.
 * If unauthorized or role insufficient, redirects to /admin/login.
 */
export async function requireAuth(
  requiredRole?: "admin" | "editor" | "author"
): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  if (requiredRole && requiredRole === "admin" && user.role !== "admin") {
    redirect("/admin?error=unauthorized");
  }

  return user;
}

/**
 * Sets the secure session cookie on the response.
 */
export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/**
 * Clears the session cookie.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await invalidateSession(token);
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}
