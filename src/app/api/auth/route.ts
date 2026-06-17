import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  verifyPassword,
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { safeJson } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // Brute-force koruması: IP başına 5 deneme / 15 dk.
  const ip = getClientIp(request);
  const limit = rateLimit(`auth:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Çok fazla deneme. Lütfen sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await safeJson<{ password?: unknown }>(request);
  if (!body) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const password = body.password;
  if (typeof password !== "string" || password.length === 0 || password.length > 200) {
    return NextResponse.json({ error: "Geçersiz şifre!" }, { status: 401 });
  }

  let valid = false;
  try {
    valid = await verifyPassword(password);
  } catch {
    return NextResponse.json({ error: "Sunucu yapılandırma hatası." }, { status: 500 });
  }

  if (!valid) {
    return NextResponse.json({ error: "Geçersiz şifre!" }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  return response;
}

// Çıkış: oturum cookie'sini sil.
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", { ...SESSION_COOKIE_OPTIONS, maxAge: 0 });
  return response;
}
