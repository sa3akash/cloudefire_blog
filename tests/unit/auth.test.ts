import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("Password Hashing & Verification (Web Crypto)", () => {
  it("should hash a password and verify it successfully", async () => {
    const password = "CloudBlogSuperSecurePassword2026!";
    const hash = await hashPassword(password);

    expect(hash).toMatch(/^pbkdf2:sha256:100000:[0-9a-f]{32}:[0-9a-f]{64}$/);

    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it("should reject an incorrect password", async () => {
    const password = "OriginalPassword";
    const hash = await hashPassword(password);

    const isValid = await verifyPassword("WrongPassword", hash);
    expect(isValid).toBe(false);
  });

  it("should reject malformed hashes safely without throwing", async () => {
    expect(await verifyPassword("password", "invalid-hash")).toBe(false);
    expect(await verifyPassword("password", "")).toBe(false);
    expect(await verifyPassword("password", "pbkdf2:md5:10:abc:def")).toBe(false);
  });
});
