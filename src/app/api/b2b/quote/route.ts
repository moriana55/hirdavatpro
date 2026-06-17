import { NextRequest, NextResponse } from "next/server";
import { createQuote, type B2BQuoteItem } from "@/lib/b2b/store";
import { notifyAdmin } from "@/lib/notify";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { safeJson, reqString } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`b2b-quote:${ip}`, 10, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Çok fazla teklif talebi gönderdiniz. Lütfen sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await safeJson<Record<string, unknown>>(req);
  if (!body) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

  const companyName = reqString(body.companyName, "Firma adı", 120);
  const contactName = reqString(body.contactName, "Yetkili adı", 80);
  const email = reqString(body.email, "E-posta", 120);
  const phone = reqString(body.phone, "Telefon", 30);
  if (!companyName.ok) return NextResponse.json({ error: companyName.error }, { status: 400 });
  if (!contactName.ok) return NextResponse.json({ error: contactName.error }, { status: 400 });
  if (!email.ok) return NextResponse.json({ error: email.error }, { status: 400 });
  if (!phone.ok) return NextResponse.json({ error: phone.error }, { status: 400 });

  const taxNumber = reqString(body.taxNumber, "Vergi no", 20, { required: false });
  const note = reqString(body.note, "Not", 600, { required: false });

  const itemsRaw = Array.isArray(body.items) ? body.items : [];
  const items: B2BQuoteItem[] = itemsRaw
    .map((it: any) => {
      const q = typeof it?.query === "string" ? it.query.trim().slice(0, 160) : "";
      const qty = Math.max(1, Math.min(100000, parseInt(String(it?.qty), 10) || 1));
      if (!q) return null;
      return {
        query: q,
        qty,
        productId: typeof it?.productId === "string" ? it.productId : undefined,
        brand: typeof it?.brand === "string" ? it.brand.slice(0, 80) : undefined,
        model: typeof it?.model === "string" ? it.model.slice(0, 80) : undefined,
      } as B2BQuoteItem;
    })
    .filter((x): x is B2BQuoteItem => !!x)
    .slice(0, 200);

  if (items.length === 0) {
    return NextResponse.json({ error: "En az bir ürün satırı ekleyin." }, { status: 400 });
  }

  try {
    const quote = await createQuote({
      companyName: companyName.value,
      contactName: contactName.value,
      email: email.value,
      phone: phone.value,
      taxNumber: taxNumber.ok ? taxNumber.value || undefined : undefined,
      note: note.ok ? note.value : "",
      items,
    });

    await notifyAdmin({
      subject: `Yeni B2B teklif talebi: ${companyName.value} (${items.length} kalem)`,
      body: `Yetkili: ${contactName.value}\nE-posta: ${email.value}\nTelefon: ${phone.value}`,
      meta: { quoteId: quote.id },
    });

    return NextResponse.json({
      success: true,
      quoteId: quote.id,
      message:
        "Teklif talebiniz alındı. Satış ekibimiz 1 iş günü içinde fiyat teklifi ile dönecektir.",
    });
  } catch (err) {
    console.error("b2b quote error:", err);
    return NextResponse.json({ error: "Teklif talebi kaydedilemedi." }, { status: 500 });
  }
}
