export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/avif": [".avif"],
  "image/svg+xml": [".svg"],
};

export const EXTENSION_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

export function sanitizeExtension(filename: string): string {
  const parts = filename.split(".");
  if (parts.length < 2) return "";
  const ext = "." + parts.pop()!.toLowerCase().replace(/[^a-z0-9]/g, "");
  return ext;
}

export function validateFile(
  data: Uint8Array | ArrayBuffer,
  originalFilename: string,
  declaredMimeType: string,
  maxSize: number = MAX_FILE_SIZE_BYTES
): { valid: boolean; error?: string; extension: string; mimeType: string } {
  const byteLength = data.byteLength;

  if (byteLength === 0) {
    return { valid: false, error: "File is empty", extension: "", mimeType: "" };
  }

  if (byteLength > maxSize) {
    const maxMb = (maxSize / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${(byteLength / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed size of ${maxMb} MB`,
      extension: "",
      mimeType: "",
    };
  }

  const ext = sanitizeExtension(originalFilename);
  let mime = (declaredMimeType || "").toLowerCase().trim();

  // If MIME is generic, empty, or not in allowed list, check extension
  if (!mime || mime === "application/octet-stream" || !ALLOWED_MIME_TYPES[mime]) {
    if (ext && EXTENSION_TO_MIME[ext]) {
      mime = EXTENSION_TO_MIME[ext];
    }
  }

  const allowedExtensions = ALLOWED_MIME_TYPES[mime];

  if (!allowedExtensions) {
    return {
      valid: false,
      error: `File type "${declaredMimeType || "unknown"}" is not supported. Allowed formats: JPEG, PNG, WebP, AVIF, SVG.`,
      extension: "",
      mimeType: "",
    };
  }

  const finalExt = ext && allowedExtensions.includes(ext) ? ext : allowedExtensions[0];

  if (mime === "image/svg+xml") {
    const text = new TextDecoder().decode(data);
    if (/<script[\s>]/i.test(text) || /javascript:/i.test(text) || /onload=/i.test(text)) {
      return {
        valid: false,
        error: "SVG file contains dangerous executable scripts or event handlers",
        extension: ".svg",
        mimeType: "image/svg+xml",
      };
    }
  }

  return { valid: true, extension: finalExt, mimeType: mime };
}

export function generateSafeKey(extension: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const uuid = crypto.randomUUID();
  const cleanExt = extension.startsWith(".") ? extension : `.${extension}`;

  return `media/${year}/${month}/${uuid}${cleanExt}`;
}

export const generateSafeObjectKey = generateSafeKey;
