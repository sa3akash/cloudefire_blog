"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, users, authors, media } from "@/lib/db";
import { eq, count } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  createSession,
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
  checkRateLimit,
} from "@/lib/auth";
import {
  postSchema,
  categorySchema,
  tagSchema,
  loginSchema,
  setupAdminSchema,
  generateSlug,
} from "@/lib/validation";
import {
  createPost,
  updatePost,
  deletePost,
  duplicatePost,
} from "@/lib/services/posts";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/services/categories";
import { createTag, deleteTag } from "@/lib/services/tags";
import {
  updateCommentStatus,
  deleteComment,
} from "@/lib/services/comments";
import { updateSettings } from "@/lib/services/settings";
import { getStorageService } from "@/lib/storage";

export interface ActionResult {
  success: boolean;
  message: string;
  data?: unknown;
}

/**
 * Admin Login Action with Rate Limiting and Secure PBKDF2 Password Verification
 */
export async function loginAction(formData: FormData): Promise<ActionResult> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Invalid input" };
  }

  // Rate limiting by email (max 5 attempts per 15 minutes)
  const rateLimitKey = `login_${email}`;
  const rateLimit = checkRateLimit({
    key: rateLimitKey,
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    const minutesLeft = Math.ceil((rateLimit.resetAt - Date.now()) / 60000);
    return {
      success: false,
      message: `Too many failed login attempts. Please try again in ${minutesLeft} minute(s).`,
    };
  }

  const db = getDb();
  const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (userResult.length === 0) {
    return { success: false, message: "Invalid email or password." };
  }

  const user = userResult[0];
  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    return { success: false, message: "Invalid email or password." };
  }

  // Create secure session
  const { token, expiresAt } = await createSession(user.id);
  await setSessionCookie(token, expiresAt);

  return { success: true, message: "Login successful!" };
}

/**
 * Logout Action
 */
export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}

/**
 * One-time Root Admin Setup Action
 */
export async function setupRootAdminAction(formData: FormData): Promise<ActionResult> {
  const db = getDb();
  const existingUsers = await db.select({ count: count() }).from(users);

  if (existingUsers[0]?.count > 0) {
    return { success: false, message: "Admin setup has already been completed." };
  }

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = setupAdminSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const userId = crypto.randomUUID();
  const authorId = crypto.randomUUID();
  const passwordHash = await hashPassword(parsed.data.password);
  const now = new Date();

  await db.insert(users).values({
    id: userId,
    email: parsed.data.email.toLowerCase(),
    passwordHash,
    name: parsed.data.name,
    role: "admin",
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(authors).values({
    id: authorId,
    userId,
    name: parsed.data.name,
    slug: generateSlug(parsed.data.name),
    bio: "Administrator and technical author.",
    createdAt: now,
    updatedAt: now,
  });

  const { token, expiresAt } = await createSession(userId);
  await setSessionCookie(token, expiresAt);

  return { success: true, message: "Root administrator configured successfully!" };
}

/**
 * Save Post Action (Create or Update)
 */
export async function savePostAction(
  postId: string | null,
  postData: {
    title: string;
    slug?: string;
    excerpt?: string;
    content: string;
    coverImage?: string;
    categoryId?: string | null;
    tagIds?: string[];
    status: "draft" | "published" | "scheduled";
    featured?: boolean;
    seoTitle?: string;
    seoDescription?: string;
    canonicalUrl?: string;
    publishedAt?: string | null;
  }
): Promise<ActionResult> {
  const user = await requireAuth();
  const db = getDb();

  // Find author linked to user
  const authorResult = await db
    .select({ id: authors.id })
    .from(authors)
    .where(eq(authors.userId, user.id))
    .limit(1);

  let authorId = authorResult[0]?.id;
  if (!authorId) {
    // Auto-create author if not present
    authorId = crypto.randomUUID();
    await db.insert(authors).values({
      id: authorId,
      userId: user.id,
      name: user.name,
      slug: generateSlug(user.name) || "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  const finalSlug = postData.slug && postData.slug.trim()
    ? generateSlug(postData.slug)
    : generateSlug(postData.title);

  const parsed = postSchema.safeParse({
    ...postData,
    slug: finalSlug,
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Validation failed" };
  }

  try {
    if (postId) {
      // Update existing post
      await updatePost(postId, {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        coverImage: parsed.data.coverImage,
        categoryId: parsed.data.categoryId || null,
        status: parsed.data.status,
        featured: parsed.data.featured,
        seoTitle: parsed.data.seoTitle,
        seoDescription: parsed.data.seoDescription,
        canonicalUrl: parsed.data.canonicalUrl,
        tagIds: parsed.data.tagIds,
        publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : undefined,
      });

      revalidatePath(`/blog/${parsed.data.slug}`);
      revalidatePath("/blog");
      revalidatePath("/");
      return { success: true, message: "Post updated successfully!", data: { id: postId, slug: parsed.data.slug } };
    } else {
      // Create new post
      const newId = await createPost({
        authorId,
        categoryId: parsed.data.categoryId || null,
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        coverImage: parsed.data.coverImage,
        status: parsed.data.status,
        featured: parsed.data.featured,
        seoTitle: parsed.data.seoTitle,
        seoDescription: parsed.data.seoDescription,
        canonicalUrl: parsed.data.canonicalUrl,
        tagIds: parsed.data.tagIds,
        publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : undefined,
      });

      revalidatePath("/blog");
      revalidatePath("/");
      return { success: true, message: "Post created successfully!", data: { id: newId, slug: parsed.data.slug } };
    }
  } catch (error) {
    return { success: false, message: (error as Error).message || "An unexpected error occurred" };
  }
}

/**
 * Delete Post Action
 */
export async function deletePostAction(id: string): Promise<ActionResult> {
  await requireAuth();
  try {
    await deletePost(id);
    revalidatePath("/blog");
    revalidatePath("/");
    return { success: true, message: "Post deleted successfully!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

/**
 * Duplicate Post Action
 */
export async function duplicatePostAction(id: string): Promise<ActionResult> {
  const user = await requireAuth();
  const db = getDb();
  const authorRes = await db.select({ id: authors.id }).from(authors).where(eq(authors.userId, user.id)).limit(1);
  const authorId = authorRes[0]?.id;

  if (!authorId) return { success: false, message: "Author profile not found" };

  try {
    const newId = await duplicatePost(id, authorId);
    revalidatePath("/admin/posts");
    return { success: true, message: "Post duplicated successfully!", data: { id: newId } };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

/**
 * Save Category Action
 */
export async function saveCategoryAction(
  id: string | null,
  data: { name: string; slug?: string; description?: string }
): Promise<ActionResult> {
  await requireAuth();
  const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name);
  const parsed = categorySchema.safeParse({ ...data, slug });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Invalid category" };
  }

  try {
    if (id) {
      await updateCategory(id, parsed.data);
    } else {
      await createCategory(parsed.data);
    }
    revalidatePath("/blog");
    revalidatePath("/");
    return { success: true, message: "Category saved successfully!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

/**
 * Delete Category Action
 */
export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  await requireAuth();
  try {
    await deleteCategory(id);
    revalidatePath("/blog");
    return { success: true, message: "Category deleted!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

/**
 * Save Tag Action
 */
export async function saveTagAction(name: string, rawSlug?: string): Promise<ActionResult> {
  await requireAuth();
  const slug = rawSlug ? generateSlug(rawSlug) : generateSlug(name);
  const parsed = tagSchema.safeParse({ name, slug });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Invalid tag" };
  }

  try {
    const id = await createTag(parsed.data);
    return { success: true, message: "Tag created!", data: { id, name, slug } };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

/**
 * Delete Tag Action
 */
export async function deleteTagAction(id: string): Promise<ActionResult> {
  await requireAuth();
  try {
    await deleteTag(id);
    return { success: true, message: "Tag deleted!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

/**
 * Moderate Comment Action
 */
export async function moderateCommentAction(
  id: string,
  status: "pending" | "approved" | "rejected"
): Promise<ActionResult> {
  await requireAuth();
  try {
    await updateCommentStatus(id, status);
    revalidatePath("/blog");
    return { success: true, message: `Comment marked as ${status}!` };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

/**
 * Delete Comment Action
 */
export async function deleteCommentAction(id: string): Promise<ActionResult> {
  await requireAuth();
  try {
    await deleteComment(id);
    return { success: true, message: "Comment deleted!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

/**
 * Save Site Settings Action
 */
export async function saveSettingsAction(formData: FormData): Promise<ActionResult> {
  await requireAuth("admin");
  const settings: Record<string, string> = {
    siteName: (formData.get("siteName") as string) || "CloudBlog",
    siteDescription: (formData.get("siteDescription") as string) || "",
    postsPerPage: (formData.get("postsPerPage") as string) || "6",
    allowComments: formData.get("allowComments") === "on" ? "true" : "false",
    autoApproveComments: formData.get("autoApproveComments") === "on" ? "true" : "false",
    aboutText: (formData.get("aboutText") as string) || "",
    contactEmail: (formData.get("contactEmail") as string) || "contact@cloudblog.local",
  };

  try {
    await updateSettings(settings);
    revalidatePath("/");
    revalidatePath("/about");
    return { success: true, message: "Site settings updated successfully!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

/**
 * Media Upload Action (R2 Storage + D1 record)
 */
export async function uploadMediaAction(formData: FormData): Promise<ActionResult> {
  await requireAuth();
  const file = formData.get("file") as File | null;
  const altText = (formData.get("altText") as string) || "";

  if (!file || !(file instanceof File)) {
    return { success: false, message: "No file provided" };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const storage = getStorageService();

    const upload = await storage.uploadFile(bytes, file.name, {
      contentType: file.type,
    });

    const db = getDb();
    const mediaId = crypto.randomUUID();
    const now = new Date();

    await db.insert(media).values({
      id: mediaId,
      fileName: file.name,
      objectKey: upload.key,
      mimeType: upload.mimeType,
      sizeBytes: upload.sizeBytes,
      url: upload.url,
      altText,
      createdAt: now,
    });

    return {
      success: true,
      message: "Media uploaded successfully!",
      data: {
        id: mediaId,
        url: upload.url,
        key: upload.key,
        fileName: file.name,
      },
    };
  } catch (error) {
    return { success: false, message: (error as Error).message || "Upload failed" };
  }
}

/**
 * Delete Media Action
 */
export async function deleteMediaAction(id: string): Promise<ActionResult> {
  await requireAuth();
  const db = getDb();
  const mediaRes = await db.select().from(media).where(eq(media.id, id)).limit(1);

  if (mediaRes.length === 0) return { success: false, message: "Media not found" };

  try {
    const storage = getStorageService();
    await storage.deleteFile(mediaRes[0].objectKey);
    await db.delete(media).where(eq(media.id, id));
    return { success: true, message: "Media deleted successfully!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
