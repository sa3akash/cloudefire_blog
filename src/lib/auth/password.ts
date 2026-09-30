/**
 * Workers-compatible cryptographic password hashing using standard Web Crypto API.
 * Uses PBKDF2 with SHA-256, 100,000 iterations, and a 16-byte random salt.
 */

const ITERATIONS = 100000;
const KEY_LEN_BYTES = 32;

function bufToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

function hexToBuf(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Constant-time comparison to prevent timing attacks.
 */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

/**
 * Hashes a plaintext password using PBKDF2-SHA256.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as unknown as BufferSource,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    KEY_LEN_BYTES * 8
  );

  const saltHex = bufToHex(salt.buffer as ArrayBuffer);
  const hashHex = bufToHex(derivedBits);

  return `pbkdf2:sha256:${ITERATIONS}:${saltHex}:${hashHex}`;
}

/**
 * Verifies a password against a stored PBKDF2 hash.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    const parts = storedHash.split(":");
    if (parts.length !== 5 || parts[0] !== "pbkdf2" || parts[1] !== "sha256") {
      return false;
    }

    const iterations = parseInt(parts[2], 10);
    const salt = hexToBuf(parts[3]);
    const expectedHash = hexToBuf(parts[4]);

    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt as unknown as BufferSource,
        iterations,
        hash: "SHA-256",
      },
      keyMaterial,
      expectedHash.length * 8
    );

    const actualHash = new Uint8Array(derivedBits);
    return constantTimeEqual(actualHash, expectedHash);
  } catch {
    return false;
  }
}
