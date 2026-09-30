"use server";

import { getDb, users, authors } from "@/lib/db";
import { eq } from "drizzle-orm";
import { hashPassword, createSession, setSessionCookie } from "@/lib/auth";
import { registerSchema, generateSlug } from "@/lib/validation";
import type { ActionResult } from "./types";

export async function registerUserAction(formData: FormData): Promise<ActionResult> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  const parsed = registerSchema.safeParse({ name, email, password });
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const db = getDb();
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    return { success: false, message: "An account with this email address already exists." };
  }

  const passwordHash = await hashPassword(password);
  const userId = crypto.randomUUID();
  const authorId = crypto.randomUUID();
  const now = new Date();

  // Create base slug
  let slug = generateSlug(name) || "user";
  const existingAuthor = await db.select().from(authors).where(eq(authors.slug, slug)).limit(1);
  if (existingAuthor.length > 0) {
    slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  await db.insert(users).values({
    id: userId,
    email,
    passwordHash,
    name,
    role: "author",
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(authors).values({
    id: authorId,
    userId,
    name,
    slug,
    bio: `Author at CloudBlog`,
    createdAt: now,
    updatedAt: now,
  });

  const session = await createSession(userId);
  await setSessionCookie(session.token, session.expiresAt);

  return { success: true, message: "Registration successful! Welcome to CloudBlog." };
}
