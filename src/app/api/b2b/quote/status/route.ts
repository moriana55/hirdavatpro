import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { updateQuoteStatus } from "@/lib/b2b/store";
import { safeJson, badRequest } from "@/lib/validation";

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = ["new", "quoted", "won", "lost"];

// Admin-only: bir B2B teklifinin durumunu günceller. Fail-closed.
export async function POST(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const body = await safeJson<{ id?: unknown; status?: unknown }>(req);
  if (!body) return badRequest("Geçersiz istek.");
  if (typeof body.id !== "string" || !body.id) return badRequest("id gerekli");
  if (typeof body.status !== "string" || !ALLOWED_STATUSES.includes(body.status)) {
    return badRequest("Geçersiz durum.");
  }

  try {
    const updated = await updateQuoteStatus(body.id, body.status);
    return NextResponse.json({ success: true, status: updated.status });
  } catch {
    return NextResponse.json({ error: "Durum güncellenemedi." }, { status: 500 });
  }
}
