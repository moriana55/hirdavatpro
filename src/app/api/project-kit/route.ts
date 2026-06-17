import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getProducts } from "@/lib/products/store";
import { CATEGORY_LABELS } from "@/lib/products/types";
import type { ProductCategory } from "@/lib/products/types";
import { buildKitRuleBased, type ProjectKit } from "@/lib/project-kit/rules";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { safeJson, reqString } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`project-kit:${ip}`, 40, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "İstek limiti aşıldı." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await safeJson<{ description?: unknown }>(req);
  if (!body) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  const desc = reqString(body.description, "İş tarifi", 500);
  if (!desc.ok) return NextResponse.json({ error: desc.error }, { status: 400 });

  // 1) Her zaman kural tabanlı temel — AI başarısız olursa fallback.
  let kit: ProjectKit = buildKitRuleBased(desc.value);
  let mode: "ai" | "kural" = "kural";

  // 2) AI varsa kategori seçimini zenginleştir.
  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const validCats = Object.keys(CATEGORY_LABELS);
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Sen bir hırdavat danışmanısın. Kullanıcının iş tarifine göre gereken alet ve " +
              "sarf malzemelerini öner. SADECE JSON döndür (markdown yok). Format: " +
              '{"baslik":"...","ozet":"...","lines":[{"category":"<geçerli kategori anahtarı>","rol":"alet|sarf|guvenlik","neden":"..."}]}. ' +
              "Yalnızca şu kategori anahtarlarını kullan: " +
              validCats.join(", "),
          },
          { role: "user", content: `İş tarifi: ${desc.value}` },
        ],
        temperature: 0.4,
        max_tokens: 700,
      });
      const raw = completion.choices[0]?.message?.content || "{}";
      const clean = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const parsed = JSON.parse(clean) as ProjectKit;
      // Geçersiz kategorileri ele.
      const lines = (parsed.lines || []).filter((l) =>
        validCats.includes(l.category as string)
      );
      if (lines.length > 0) {
        kit = {
          baslik: parsed.baslik || kit.baslik,
          ozet: parsed.ozet || kit.ozet,
          lines,
        };
        mode = "ai";
      }
    } catch (err) {
      console.error("project-kit AI error (fallback to rules):", err);
    }
  }

  // 3) Kit satırlarını gerçek katalog ürünleriyle eşleştir.
  const products = await getProducts();
  const result = kit.lines.map((line) => {
    const candidates = products.filter((p) => p.category === line.category);
    return {
      category: line.category,
      categoryLabel: CATEGORY_LABELS[line.category as ProductCategory] || line.category,
      rol: line.rol,
      neden: line.neden,
      // Eşleşen ürünler (sepete/karşılaştırmaya eklenebilir).
      products: candidates.slice(0, 3).map((p) => ({
        id: p.id,
        brand: p.brand,
        model: p.model,
        priceRange: p.priceRange,
      })),
    };
  });

  return NextResponse.json({
    mode,
    baslik: kit.baslik,
    ozet: kit.ozet,
    lines: result,
  });
}
