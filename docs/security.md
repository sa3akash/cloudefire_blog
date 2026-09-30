# Security Architecture & Best Practices

CloudBlog was designed with defense-in-depth principles across authentication, session handling, file uploads, and database interactions.

---

## 1. Authentication & Hashing

- **Workers-Compatible Password Hashing**: Utilizes the native W3C **Web Crypto API** (`crypto.subtle`) implementing **PBKDF2 with SHA-256**, 100,000 iterations, and a 16-byte random salt. It contains zero native C++ bindings, guaranteeing 100% isomorphic execution in Cloudflare Workers and Node.js.
- **Timing-Attack Resistance**: Password verification and token comparisons use XOR reduction `constantTimeEqual()` to prevent micro-architectural timing side-channel attacks.
- **No Hardcoded Passwords**: Initial root administrator setup is either performed through `/admin/setup` (which locks permanently once a user exists) or via environment variables/seed scripts.

---

## 2. Session Management & Cookies

- **Session Tokens**: 32-byte cryptographically secure random values generated with `crypto.getRandomValues()`.
- **HttpOnly & Secure Cookies**:
  - `HttpOnly: true` (prevents JavaScript access and mitigates XSS session hijacking).
  - `Secure: true` in production environments.
  - `SameSite: "lax"` (mitigates Cross-Site Request Forgery).
  - `Path: "/"`
- **Server-Side Validation**: All administrative mutations and server actions strictly invoke `requireAuth()` server-side. Frontend state is never trusted for authorization.

---

## 3. Media Upload & R2 Protection

- **MIME & Extension Whitelisting**: Restricts uploads strictly to `image/jpeg`, `image/png`, `image/webp`, `image/avif`, and sanitized `image/svg+xml`.
- **Strict Size Limits**: Files exceeding 5 MB are rejected before storage allocation.
- **Safe Object Key Generation**: Files are saved under `media/{YYYY}/{MM}/{UUID}.{ext}`. Original client filenames are never used in storage keys to prevent path traversal (`../`) attacks.
- **SVG Sanitization**: SVG uploads are parsed and verified to ensure no `<script>` tags, inline `javascript:` handlers, or executable event listeners are present.

---

## 4. Anti-Spam & Comment Moderation

- **Honeypot Trap**: Comment submission forms include a hidden `website` field that is invisible to human users but filled by automated web crawlers. Submissions with a populated honeypot are silently dropped.
- **Pre-Publication Moderation**: Comments default to `status = 'pending'` and must be explicitly approved by an administrator before appearing on public article pages.
- **Email Privacy**: User email addresses are stored only for administrative moderation and are never rendered in client HTML or public API endpoints.
