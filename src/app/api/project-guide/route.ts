import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildGuideRuleBased, estimateCost, type ProjectGuide } from "@/lib/project/guide";
import type { SavedProjectItem } from "@/lib/project/store";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { safeJson, reqString } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`project-guide:${ip}`, 30, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "İstek limiti aşıldı." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await safeJson<{ description?: unknown; baslik?: unknown; items?: unknown }>(req);
  if (!body) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

  const desc = reqString(body.description, "İş tarifi", 500);
  if (!desc.ok) return NextResponse.json({ error: desc.error }, { status: 400 });

  const baslik = reqString(body.baslik, "Başlık", 160, { required: false });
  const items: SavedProjectItem[] = Array.isArray(body.items)
    ? (body.items as any[]).slice(0, 40).map((it) => ({
        category: String(it?.category || ""),
        categoryLabel: String(it?.categoryLabel || ""),
        rol: (["alet", "sarf", "guvenlik"].includes(it?.rol) ? it.rol : "alet") as SavedProjectItem["rol"],
        neden: String(it?.neden || ""),
        productId: it?.productId ? String(it.productId) : undefined,
        brand: it?.brand ? String(it.brand) : undefined,
        model: it?.model ? String(it.model) : undefined,
        priceRange: it?.priceRange ? String(it.priceRange) : undefined,
      }))
    : [];

  // 1) Her zaman kural tabanlı temel.
  let guide: ProjectGuide = buildGuideRuleBased(desc.value, items, baslik.ok ? baslik.value : undefined);
  let mode: "ai" | "kural" = "kural";

  // 2) AI varsa adım/ipuçlarını zenginleştir. Maliyet her zaman katalogdan hesaplanır.
  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Sen deneyimli bir usta ve hırdavat danışmanısın. Kullanıcının iş tarifine göre güvenli, " +
              "uygulanabilir, adım-adım bir 'nasıl yapılır' rehberi üret. İş güvenliğini vurgula. " +
              "SADECE JSON döndür (markdown yok). Format: " +
              '{"baslik":"...","ozet":"...","adimlar":[{"baslik":"...","detay":"..."}],"ipuclari":["...","..."]}. ' +
              "En fazla 7 adım, en fazla 5 ipucu. Türkçe yaz.",
          },
          { role: "user", content: `İş tarifi: ${desc.value}` },
        ],
        temperature: 0.5,
        max_tokens: 900,
      });
      const raw = completion.choices[0]?.message?.content || "{}";
      const clean = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const parsed = JSON.parse(clean) as Partial<ProjectGuide>;
      const adimlar = Array.isArray(parsed.adimlar)
        ? parsed.adimlar
            .filter((a) => a && a.baslik && a.detay)
            .slice(0, 7)
            .map((a) => ({ baslik: String(a.baslik), detay: String(a.detay) }))
        : [];
      if (adimlar.length > 0) {
        guide = {
          baslik: parsed.baslik || guide.baslik,
          ozet: parsed.ozet || guide.ozet,
          adimlar,
          ipuclari: Array.isArray(parsed.ipuclari)
            ? parsed.ipuclari.slice(0, 5).map((x) => String(x))
            : guide.ipuclari,
          maliyet: estimateCost(items),
        };
        mode = "ai";
      }
    } catch (err) {
      console.error("project-guide AI error (fallback to rules):", err);
    }
  }

  return NextResponse.json({ mode, guide });
}
