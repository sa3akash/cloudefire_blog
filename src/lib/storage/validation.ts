export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/avif": [".avif"],
  "image/svg+xml": [".svg"],
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
): { valid: boolean; error?: string; extension: string } {
  const byteLength = data.byteLength;

  if (byteLength === 0) {
    return { valid: false, error: "File is empty", extension: "" };
  }

  if (byteLength > maxSize) {
    const maxMb = (maxSize / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${(byteLength / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed size of ${maxMb} MB`,
      extension: "",
    };
  }

  const mime = declaredMimeType.toLowerCase().trim();
  const allowedExtensions = ALLOWED_MIME_TYPES[mime];

  if (!allowedExtensions) {
    return {
      valid: false,
      error: `File type "${declaredMimeType}" is not supported. Allowed types: JPEG, PNG, WebP, AVIF, SVG.`,
      extension: "",
    };
  }

  const ext = sanitizeExtension(originalFilename);
  if (!allowedExtensions.includes(ext) && ext !== "") {
    return { valid: true, extension: allowedExtensions[0] };
  }

  if (mime === "image/svg+xml") {
    const text = new TextDecoder().decode(data);
    if (/<script[\s>]/i.test(text) || /javascript:/i.test(text) || /onload=/i.test(text)) {
      return {
        valid: false,
        error: "SVG file contains dangerous executable scripts or event handlers",
        extension: ".svg",
      };
    }
  }

  return { valid: true, extension: ext || allowedExtensions[0] };
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
