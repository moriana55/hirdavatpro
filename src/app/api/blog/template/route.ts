import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { safeJson, badRequest } from "@/lib/validation";
import { generateBlogTemplate, TEMPLATE_KINDS, type TemplateKind } from "@/lib/blog/templates";
import { CATEGORY_LABELS, type ProductCategory } from "@/lib/products/types";

export const dynamic = "force-dynamic";

const VALID_KINDS = TEMPLATE_KINDS.map((k) => k.value);

// Admin-only: kategoriye duyarlı blog taslağı üretir (şablon tabanlı, harici API gerekmez).
// `enrich: true` + OPENAI_API_KEY varsa metni LLM ile cilalar; yoksa şablon döner.
export async function POST(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  // Hafif rate-limit (enrich AI çağrısı maliyetli olabilir).
  const ip = getClientIp(req);
  const limit = rateLimit(`blog-template:${ip}`, 40, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Üretim limiti aşıldı." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await safeJson<Record<string, unknown>>(req);
  if (!body) return badRequest("Geçersiz istek.");

  const category = typeof body.category === "string" ? body.category : "";
  if (!(category in CATEGORY_LABELS)) return badRequest("Geçersiz kategori.");

  const kind = typeof body.kind === "string" ? body.kind : "best-of";
  if (!VALID_KINDS.includes(kind as TemplateKind)) return badRequest("Geçersiz şablon tipi.");

  const count = typeof body.count === "number" ? body.count : 5;
  const enrich = body.enrich === true;

  try {
    const template = await generateBlogTemplate({
      category: category as ProductCategory,
      kind: kind as TemplateKind,
      count,
    });

    // Opsiyonel AI cilalama — anahtar yoksa sessizce şablonu döndür.
    if (enrich && process.env.OPENAI_API_KEY) {
      try {
        const OpenAI = (await import("openai")).default;
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const prompt = `Aşağıdaki Türkçe blog taslağını SEO uyumlu, akıcı ve teknik olarak doğru biçimde geliştir. Markdown başlık yapısını, ürün linklerini (/urun/...) ve dahili rehber linklerini KORU. Yalnızca markdown içeriği döndür.\n\n${template.content}`;
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.6,
          max_tokens: 1800,
        });
        const enriched = response.choices[0]?.message?.content;
        if (enriched && enriched.trim().length > 100) {
          template.content = enriched.trim();
          template.readTime = `${Math.max(3, Math.ceil(template.content.split(/\s+/).length / 200))} dk`;
        }
      } catch (e) {
        console.error("blog/template enrich error:", e);
        // Cilalama başarısız olursa şablon yine de döner.
      }
    }

    return NextResponse.json({ success: true, template });
  } catch (err) {
    console.error("blog/template error:", err);
    return NextResponse.json({ error: "Şablon üretilemedi." }, { status: 500 });
  }
}
