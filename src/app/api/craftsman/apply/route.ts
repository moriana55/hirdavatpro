import { NextRequest, NextResponse } from "next/server";
import { createApplication, TRADE_LABELS } from "@/lib/craftsman/store";
import { notifyAdmin } from "@/lib/notify";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { safeJson, reqString } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Spam koruması — IP başına 5/saat.
  const ip = getClientIp(req);
  const limit = rateLimit(`craftsman-apply:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Çok fazla başvuru gönderdiniz. Lütfen sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await safeJson<Record<string, unknown>>(req);
  if (!body) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

  const name = reqString(body.name, "Ad Soyad", 80);
  const city = reqString(body.city, "Şehir", 40);
  const phone = reqString(body.phone, "Telefon", 30);
  if (!name.ok) return NextResponse.json({ error: name.error }, { status: 400 });
  if (!city.ok) return NextResponse.json({ error: city.error }, { status: 400 });
  if (!phone.ok) return NextResponse.json({ error: phone.error }, { status: 400 });

  const email = reqString(body.email, "E-posta", 120, { required: false });
  const about = reqString(body.about, "Açıklama", 600, { required: false });

  const tradesRaw = Array.isArray(body.trades) ? body.trades : [];
  const trades = tradesRaw
    .filter((t): t is string => typeof t === "string")
    .filter((t) => TRADE_LABELS[t]) // sadece bilinen meslekler
    .slice(0, 6);
  if (trades.length === 0) {
    return NextResponse.json({ error: "En az bir meslek seçin." }, { status: 400 });
  }

  try {
    const app = await createApplication({
      name: name.value,
      city: city.value,
      phone: phone.value,
      email: email.ok ? email.value || undefined : undefined,
      about: about.ok ? about.value : "",
      trades,
    });

    // Admin'e bildirim (şimdilik stub: loglar).
    await notifyAdmin({
      subject: `Yeni usta başvurusu: ${name.value} (${city.value})`,
      body: `Meslekler: ${trades.map((t) => TRADE_LABELS[t]).join(", ")}\nTelefon: ${phone.value}`,
      meta: { applicationId: app.id },
    });

    return NextResponse.json({
      success: true,
      message:
        "Başvurunuz alındı. Ekibimiz bilgilerinizi doğruladıktan sonra profiliniz yayına alınacaktır.",
    });
  } catch (err) {
    console.error("craftsman apply error:", err);
    return NextResponse.json({ error: "Başvuru kaydedilemedi." }, { status: 500 });
  }
}
