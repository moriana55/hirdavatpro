import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Giriş sayfasının kendisi serbest (yönlendirme döngüsünü önler).
  if (pathname.startsWith("/x9k4-sys/auth")) {
    const headers = new Headers(request.headers);
    headers.set("x-pathname", pathname);
    return NextResponse.next({ request: { headers } });
  }

  // 2. İmzalı oturum cookie'sini doğrula.
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const isAuthorized = await verifySessionToken(token);

  // 3. Admin sayfaları: oturum yoksa giriş sayfasına yönlendir.
  if (pathname.startsWith("/x9k4-sys")) {
    if (!isAuthorized) {
      const loginUrl = new URL("/x9k4-sys/auth", request.url);
      return NextResponse.redirect(loginUrl);
    }
    // Layout'un server-side guard'ı için pathname'i ilet (savunma derinliği).
    const headers = new Headers(request.headers);
    headers.set("x-pathname", pathname);
    return NextResponse.next({ request: { headers } });
  }

  // 4. Mutating API route'ları (GET serbest; doğrulama route handler'da da tekrar yapılır).
  const isApiMutation =
    (pathname === "/api/products" && ["POST", "DELETE"].includes(request.method)) ||
    (pathname.startsWith("/api/products/image") && request.method === "POST") ||
    (pathname === "/api/compare" && request.method === "POST") ||
    pathname.startsWith("/api/bulk-generate") ||
    (pathname.startsWith("/api/blog") && ["POST", "PATCH", "DELETE"].includes(request.method));

  if (isApiMutation && !isAuthorized) {
    return NextResponse.json(
      { error: "Yetkisiz Erişim! Yönetici girişi yapmalısınız." },
      { status: 401 }
    );
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
