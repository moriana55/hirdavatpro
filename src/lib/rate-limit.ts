// Basit, bağımlılıksız in-memory rate limiter (Redis yoksa yeterli).
// Sunucu instance başına çalışır; brute-force ve maliyet suistimalini sınırlamak için.

import type { NextRequest } from "next/server";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

// Sızıntıyı önlemek için periyodik temizlik.
let lastSweep = 0;
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(key);
  }
}

export function getClientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export type RateLimitResult = { ok: boolean; retryAfter: number };

/**
 * @param key    Benzersiz limit anahtarı (genelde `${routeName}:${ip}`)
 * @param limit  Pencere başına izin verilen istek sayısı
 * @param windowMs  Pencere süresi (ms)
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true, retryAfter: 0 };
}
