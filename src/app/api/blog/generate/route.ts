import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { title, category, excerpt } = await req.json();
  if (!title) return NextResponse.json({ error: "title gerekli" }, { status: 400 });

  const prompt = `Sen Türkiye'nin en kapsamlı hırdavat ve alet rehber sitesinin teknik editörüsün.

Aşağıdaki blog yazısı için SEO uyumlu, teknik detaylı Türkçe içerik yaz.

Başlık: ${title}
Kategori: ${category || "Genel"}
${excerpt ? `Özet: ${excerpt}` : ""}

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

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1500,
  });

  const content = response.choices[0].message.content ?? "";
  const readTime = `${Math.ceil(content.split(" ").length / 200)} dk`;

  return NextResponse.json({ content, readTime });
}
