import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getProducts } from "@/lib/products/store";
import { CATEGORY_LABELS } from "@/lib/products/types";
import type { ProductCategory } from "@/lib/products/types";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

interface VisionResult {
  parca: string; // tanımlanan parça
  kategori?: string; // tahmini katalog kategorisi (key)
  guven: "yuksek" | "orta" | "dusuk";
  notlar: string;
  anahtarKelimeler: string[];
}

export async function POST(req: NextRequest) {
  // Vision çağrısı maliyetli — IP başına 20/saat.
  const ip = getClientIp(req);
  const limit = rateLimit(`visual-search:${ip}`, 20, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Görsel arama limiti aşıldı. Lütfen biraz sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Geçersiz form verisi." }, { status: 400 });
  }

  const file = form.get("image");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Lütfen bir görsel yükleyin." }, { status: 400 });
  }

  const blob = file as File;
  if (!ALLOWED.includes(blob.type)) {
    return NextResponse.json(
      { error: "Sadece JPEG, PNG veya WEBP görseller desteklenir." },
      { status: 400 }
    );
  }
  if (blob.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Görsel en fazla 5 MB olabilir." },
      { status: 413 }
    );
  }

  const products = await getProducts();

  // ── STUB / fallback: OPENAI_API_KEY yoksa manuel kategori önerisiyle dön ──
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      mode: "stub",
      message:
        "Görsel tanıma şu an yapılandırılmamış (OPENAI_API_KEY eksik). " +
        "Aşağıdan parçanızın kategorisini manuel seçerek eşleşen ürünleri görebilirsiniz.",
      vision: null,
      matches: [],
      // Kullanıcının manuel seçebilmesi için kategori listesi.
      categories: Object.entries(CATEGORY_LABELS).map(([key, label]) => ({ key, label })),
    });
  }

  try {
    const bytes = Buffer.from(await blob.arrayBuffer());
    const dataUrl = `data:${blob.type};base64,${bytes.toString("base64")}`;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const categoryKeys = Object.keys(CATEGORY_LABELS);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Sen bir hırdavat/endüstriyel parça tanıma uzmanısın. Verilen fotoğraftaki " +
            "aleti/parçayı/sarf malzemesini tanı. SADECE JSON döndür (markdown yok). Format: " +
            '{"parca":"...","kategori":"<aşağıdaki anahtarlardan biri veya boş>","guven":"yuksek|orta|dusuk","notlar":"...","anahtarKelimeler":["..."]}. ' +
            "Geçerli kategori anahtarları: " +
            categoryKeys.join(", "),
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Bu fotoğraftaki hırdavat parçasını/aletini tanı." },
            { type: "image_url", image_url: { url: dataUrl } },
          ] as any,
        },
      ],
      temperature: 0.2,
      max_tokens: 400,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const clean = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    let vision: VisionResult;
    try {
      vision = JSON.parse(clean);
    } catch {
      vision = { parca: "Tanımlanamadı", guven: "dusuk", notlar: clean.slice(0, 200), anahtarKelimeler: [] };
    }

    // Katalog eşleştirme: kategori + anahtar kelimeler.
    const kwords = (vision.anahtarKelimeler || []).map((k) => k.toLocaleLowerCase("tr"));
    const matches = products
      .map((p) => {
        let score = 0;
        if (vision.kategori && p.category === vision.kategori) score += 5;
        const hay = `${p.brand} ${p.model} ${CATEGORY_LABELS[p.category as ProductCategory] || ""}`.toLocaleLowerCase("tr");
        for (const k of kwords) if (k && hay.includes(k)) score += 1;
        return { p, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((x) => ({
        id: x.p.id,
        brand: x.p.brand,
        model: x.p.model,
        category: x.p.category,
        categoryLabel: CATEGORY_LABELS[x.p.category as ProductCategory] || x.p.category,
        priceRange: x.p.priceRange,
      }));

    return NextResponse.json({ mode: "ai", vision, matches });
  } catch (err) {
    console.error("visual-search error:", err);
    return NextResponse.json(
      { error: "Görsel analiz edilemedi. Lütfen tekrar deneyin." },
      { status: 502 }
    );
  }
}
