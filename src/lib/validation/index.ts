import { z } from "zod";

/**
 * Transforms any string into a clean, URL-safe slug.
 */
export function generateSlug(input: string): string {
  return input
    .normalize("NFKD") // normalize unicode
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .toLowerCase()
    .trim()
    .replace(/_/g, "-") // replace underscores with hyphens
    .replace(/[^a-z0-9\s-]/g, "") // remove invalid characters
    .replace(/[\s-]+/g, "-") // replace spaces and repeated hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // trim leading and trailing hyphens
}

export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug is too long")
    .regex(
      slugRegex,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  excerpt: z.string().max(500, "Excerpt is too long").optional().default(""),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional().default(""),
  categoryId: z.string().nullable().optional(),
  tagIds: z.array(z.string()).default([]),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  featured: z.boolean().default(false),
  seoTitle: z.string().max(70, "SEO title should be under 70 characters").optional().default(""),
  seoDescription: z
    .string()
    .max(160, "SEO description should be under 160 characters")
    .optional()
    .default(""),
  canonicalUrl: z.string().optional().default(""),
  publishedAt: z.union([z.string(), z.number(), z.date()]).optional(),
});

export type PostInput = z.infer<typeof postSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(50)
    .regex(slugRegex, "Invalid slug format"),
  description: z.string().max(250).optional().default(""),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const tagSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(50),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(50)
    .regex(slugRegex, "Invalid slug format"),
});

export type TagInput = z.infer<typeof tagSchema>;

export const commentSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  parentId: z.string().optional().nullable(),
  authorName: z.string().min(1, "Your name is required").max(80),
  authorEmail: z.string().email("A valid email address is required"),
  content: z
    .string()
    .min(3, "Comment must be at least 3 characters")
    .max(2000, "Comment is too long"),
  // Honeypot field for bots - must be empty
  website: z.string().max(0, "Spam detected").optional().default(""),
});

export type CommentInput = z.infer<typeof commentSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const setupAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  setupSecret: z.string().optional(),
});

export type SetupAdminInput = z.infer<typeof setupAdminSchema>;

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string().default(""),
  postsPerPage: z.coerce.number().min(1).max(50).default(10),
  allowComments: z.boolean().default(true),
  autoApproveComments: z.boolean().default(false),
  cloudflareAnalyticsToken: z.string().optional().default(""),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
