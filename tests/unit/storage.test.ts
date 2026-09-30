import { describe, it, expect } from "vitest";
import {
  validateFile,
  generateSafeObjectKey,
  sanitizeExtension,
  MemoryStorageService,
} from "@/lib/storage";

describe("Storage Validation & Security", () => {
  it("should validate and allow allowed image types", () => {
    const pngBytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
    const res = validateFile(pngBytes, "avatar.png", "image/png");
    expect(res.valid).toBe(true);
    expect(res.extension).toBe(".png");
  });

  it("should reject disallowed mime types such as executables or html", () => {
    const fakeHtml = new TextEncoder().encode("<h1>Hello</h1>");
    const res = validateFile(fakeHtml, "index.html", "text/html");
    expect(res.valid).toBe(false);
    expect(res.error).toContain("not supported");
  });

  it("should reject files larger than maximum size", () => {
    const large = new Uint8Array(6 * 1024 * 1024); // 6MB
    const res = validateFile(large, "big.jpg", "image/jpeg", 5 * 1024 * 1024);
    expect(res.valid).toBe(false);
    expect(res.error).toContain("exceeds maximum allowed size");
  });

  it("should sanitize malicious extensions", () => {
    expect(sanitizeExtension("malicious.php.png")).toBe(".png");
    expect(sanitizeExtension("photo")).toBe("");
  });

  it("should generate random, safe keys in the expected media/year/month/uuid format", () => {
    const key = generateSafeObjectKey(".webp");
    expect(key).toMatch(/^media\/\d{4}\/\d{2}\/[0-9a-f-]{36}\.webp$/);
  });

  it("should reject SVGs containing embedded script tags", () => {
    const dangerousSvg = new TextEncoder().encode("<svg><script>alert(1)</script></svg>");
    const res = validateFile(dangerousSvg, "vector.svg", "image/svg+xml");
    expect(res.valid).toBe(false);
    expect(res.error).toContain("dangerous executable scripts");
  });

  it("should upload and retrieve files in MemoryStorageService", async () => {
    const storage = new MemoryStorageService();
    const data = new TextEncoder().encode("fake-image-bytes");
    const upload = await storage.uploadFile(data, "test.png", { contentType: "image/png" });

    expect(upload.key).toBeDefined();
    expect(upload.url).toBe(`/api/media/${upload.key}`);

    const file = await storage.getFile(upload.key);
    expect(file).not.toBeNull();
    expect(file?.contentType).toBe("image/png");

    await storage.deleteFile(upload.key);
    expect(await storage.getFile(upload.key)).toBeNull();
  });
});
