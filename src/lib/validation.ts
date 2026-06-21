// Hafif input doğrulama yardımcıları (zod yüklü değil — manuel).

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// req.json() güvenli parse — bozuk JSON'da exception yerine null döner.
export async function safeJson<T = Record<string, unknown>>(
  request: NextRequest
): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

// String alanı doğrula + kırp + uzunluk sınırla.
export function reqString(
  value: unknown,
  field: string,
  maxLen: number,
  { required = true }: { required?: boolean } = {}
): { ok: true; value: string } | { ok: false; error: string } {
  if (value === undefined || value === null || value === "") {
    if (required) return { ok: false, error: `${field} gerekli` };
    return { ok: true, value: "" };
  }
  if (typeof value !== "string") return { ok: false, error: `${field} metin olmalı` };
  const trimmed = value.trim();
  if (required && trimmed.length === 0) return { ok: false, error: `${field} gerekli` };
  if (trimmed.length > maxLen) return { ok: false, error: `${field} en fazla ${maxLen} karakter olabilir` };
  return { ok: true, value: trimmed };
}

// Yalnızca http/https URL'leri kabul et; aksi halde (javascript:, data:, vs) null.
// Depoda saklanıp sonra <img src>/<a href> olarak render edilen alanlar için.
export function safeHttpUrl(value: unknown, maxLen = 2000): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLen) return null;
  try {
    const u = new URL(trimmed);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return trimmed;
  } catch {
    return null;
  }
}
