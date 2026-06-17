import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Exclude the auth page from redirects to prevent loops
  if (pathname.startsWith("/x9k4-sys/auth")) {
    return NextResponse.next();
  }

  // 2. Read the admin token cookie
  const adminToken = request.cookies.get("hirdavatpro_admin_token")?.value;
  const isAuthorized = adminToken === ADMIN_PASSWORD;

  // 3. Handle Page Routes
  if (pathname.startsWith("/x9k4-sys")) {
    if (!isAuthorized) {
      const loginUrl = new URL("/x9k4-sys/auth", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 4. Handle API Routes (Only restrict mutations POST/DELETE, let GET requests through)
  const isApiMutation =
    (pathname === "/api/products" && ["POST", "DELETE"].includes(request.method)) ||
    (pathname === "/api/compare" && request.method === "POST") ||
    pathname.startsWith("/api/bulk-generate") ||
    (pathname.startsWith("/api/blog") && ["POST", "PATCH", "DELETE"].includes(request.method));

  if (isApiMutation) {
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Yetkisiz Erişim! Yönetici girişi yapmalısınız." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/x9k4-sys/:path*",
    "/api/bulk-generate/:path*",
    "/api/products/:path*",
    "/api/compare/:path*",
    "/api/blog/:path*",
  ],
};
