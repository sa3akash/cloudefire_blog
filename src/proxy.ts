import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "cloudblog_session";

// Public admin routes that don't require an active session
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/setup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

  // 1. Admin route protection
  if (pathname.startsWith("/admin")) {
    const isPublicAdmin = PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p));

    if (!sessionToken && !isPublicAdmin) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (sessionToken && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // 2. User authoring & dashboard route protection
  if (pathname.startsWith("/write") || pathname.startsWith("/dashboard")) {
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Prevent logged-in users from seeing redundant auth pages
  if (sessionToken && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, svgs, etc.)
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
