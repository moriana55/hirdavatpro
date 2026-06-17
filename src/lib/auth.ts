// Admin session auth — signed, httpOnly cookie (HMAC-SHA256 via Web Crypto).
// Works in both Node and Edge runtimes (proxy + route handlers + server components).

import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE = "hirdavatpro_admin_token";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 gün

function getSecret(): string {
  // Oturum imza anahtarı: ADMIN_PASSWORD'a bağlı türetilmiş bir secret.
  // ADMIN_PASSWORD değişirse mevcut tüm oturumlar geçersiz olur.
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) {
    throw new Error("ADMIN_PASSWORD env tanımlı değil — admin auth devre dışı.");
  }
  return `hirdavatpro::${pw}`;
}

function base64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let str = "";
  for (const b of arr) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return base64url(sig);
}

// Sabit zamanlı string karşılaştırma (timing attack koruması).
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Token formatı: "<expiresEpochSeconds>.<hmac(expires)>"
export async function createSessionToken(): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = String(expires);
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot < 1) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expires = Number(payload);
  if (!Number.isFinite(expires) || expires < Math.floor(Date.now() / 1000)) return false;
  let expected: string;
  try {
    expected = await hmac(payload);
  } catch {
    return false;
  }
  return timingSafeEqual(sig, expected);
}

// Şifre doğrulama — sabit zamanlı karşılaştırma.
export async function verifyPassword(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (typeof password !== "string" || password.length === 0) return false;
  // Uzunluk farkını gizlemek için ikisini de hash'leyip karşılaştır.
  const [a, b] = await Promise.all([hmac(password), hmac(expected)]);
  return timingSafeEqual(a, b);
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: SESSION_TTL_SECONDS,
  path: "/",
};

// Server Component / layout içinde oturum kontrolü.
export async function isAuthenticated(): Promise<boolean> {
  try {
    const store = await cookies();
    return verifySessionToken(store.get(SESSION_COOKIE)?.value);
  } catch {
    return false;
  }
}

// Route handler içinde request'ten oturum kontrolü.
export async function isAuthorized(request: NextRequest): Promise<boolean> {
  return verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
}
