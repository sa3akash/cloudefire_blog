import { describe, it, expect } from "vitest";
import { generateSlug, postSchema, commentSchema } from "@/lib/validation";

describe("Validation and Slug Generation", () => {
  it("should generate clean url-safe slugs", () => {
    expect(generateSlug("Hello World! This is CloudBlog")).toBe("hello-world-this-is-cloudblog");
    expect(generateSlug("  Accents & Diacritics: é, à, ç, ñ  ")).toBe("accents-diacritics-e-a-c-n");
    expect(generateSlug("Multiple---Dashes___And Spaces")).toBe("multiple-dashes-and-spaces");
  });

  it("should validate valid post schema", () => {
    const valid = postSchema.safeParse({
      title: "My First Cloudflare Post",
      slug: "my-first-cloudflare-post",
      content: "# Hello Cloudflare\n\nThis is content.",
      status: "published",
    });
    expect(valid.success).toBe(true);
  });

  it("should reject invalid slug in post schema", () => {
    const invalid = postSchema.safeParse({
      title: "Bad Slug",
      slug: "Bad Slug With Spaces & Special",
      content: "Content",
    });
    expect(invalid.success).toBe(false);
  });

  it("should detect bot honeypot in comments", () => {
    const spam = commentSchema.safeParse({
      postId: "123",
      authorName: "Spammer",
      authorEmail: "spam@example.com",
      content: "Buy crypto now!",
      website: "http://spam.com", // filled honeypot
    });
    expect(spam.success).toBe(false);
  });
});
