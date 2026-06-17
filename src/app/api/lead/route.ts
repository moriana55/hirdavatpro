import { NextRequest, NextResponse } from "next/server";
import { createLead, isValidEmail } from "@/lib/lead/store";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { safeJson, reqString } from "@/lib/validation";

export const dynamic = "force-dynamic";

// POST /api/lead — karşılaştırma akışından OPSİYONEL lead (e-posta) yakalama.
// KVKK: yalnızca açık rıza (consent=true) ile kaydedilir.
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`lead:${ip}`, 15, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Çok fazla deneme. Lütfen sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await safeJson<Record<string, unknown>>(req);
  if (!body) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

  const email = reqString(body.email, "E-posta", 120);
  if (!email.ok) return NextResponse.json({ error: email.error }, { status: 400 });
  if (!isValidEmail(email.value)) {
    return NextResponse.json({ error: "Geçerli bir e-posta girin." }, { status: 400 });
  }

  // Açık rıza zorunlu — işaretlenmemişse kayıt yapılmaz.
  if (body.consent !== true) {
    return NextResponse.json({ error: "Kayıt için onay gerekli." }, { status: 400 });
  }

  const source = reqString(body.source, "Kaynak", 40, { required: false });
  const context = reqString(body.context, "Bağlam", 300, { required: false });

  try {
    await createLead({
      email: email.value,
      consent: true,
      source: source.ok ? source.value || undefined : undefined,
      context: context.ok ? context.value : "",
    });
    return NextResponse.json({
      success: true,
      message: "Teşekkürler! Güncellemeleri e-postanıza göndereceğiz.",
    });
  } catch (err) {
    console.error("lead kaydı hatası:", err);
    return NextResponse.json({ error: "Kayıt yapılamadı." }, { status: 500 });
  }
}
