import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import OpenAI from "openai";
import { isAuthorized } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { safeJson, reqString, badRequest } from "@/lib/validation";

export const dynamic = "force-dynamic";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  // Maliyet suistimaline karşı: IP başına 20 üretim / saat.
  const ip = getClientIp(req);
  const limit = rateLimit(`blog-generate:${ip}`, 20, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Üretim limiti aşıldı. Lütfen sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OpenAI yapılandırılmamış." }, { status: 503 });
  }

  const body = await safeJson<Record<string, unknown>>(req);
  if (!body) return badRequest("Geçersiz istek.");

  const title = reqString(body.title, "title", 200);
  if (!title.ok) return badRequest(title.error);
  const category = reqString(body.category, "category", 100, { required: false });
  const excerpt = reqString(body.excerpt, "excerpt", 500, { required: false });
  if (!category.ok) return badRequest(category.error);
  if (!excerpt.ok) return badRequest(excerpt.error);

  const prompt = `Sen Türkiye'nin en kapsamlı hırdavat ve alet rehber sitesinin teknik editörüsün.

Aşağıdaki blog yazısı için SEO uyumlu, teknik detaylı Türkçe içerik yaz.

Başlık: ${title.value}
Kategori: ${category.value || "Genel"}
${excerpt.value ? `Özet: ${excerpt.value}` : ""}

Markdown formatında yaz:
- ## ile ana başlıklar (4-6 tane)
- ### ile alt başlıklar
- Tablo varsa markdown tablo formatında
- **kalın** ile önemli kavramlar
- Madde listeleri - ile
- 600-900 kelime arası
- Türkçe, sade, pratik dil
- Sonunda "## Sonuç" bölümü olsun

Yalnızca markdown içeriği döndür, başka açıklama ekleme.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content ?? "";
    const readTime = `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} dk`;

    return NextResponse.json({ content, readTime });
  } catch (err) {
    console.error("blog/generate OpenAI error:", err);
    return NextResponse.json({ error: "İçerik üretilemedi. Lütfen tekrar deneyin." }, { status: 502 });
  }
}
