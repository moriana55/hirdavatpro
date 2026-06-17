import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/db";
import { isAuthorized } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { safeJson, reqString, badRequest } from "@/lib/validation";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  // Görsel üretimi maliyetli — IP başına 30/saat.
  const ip = getClientIp(req);
  const limit = rateLimit(`product-image:${ip}`, 30, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Görsel üretim limiti aşıldı." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OpenAI yapılandırılmamış." }, { status: 503 });
  }

  const body = await safeJson<Record<string, unknown>>(req);
  if (!body) return badRequest("Geçersiz istek.");

  const brand = reqString(body.brand, "brand", 100);
  const model = reqString(body.model, "model", 100);
  if (!brand.ok) return badRequest(brand.error);
  if (!model.ok) return badRequest(model.error);
  const category = reqString(body.category, "category", 100, { required: false });
  const productId = typeof body.productId === "string" ? body.productId : undefined;

  const prompt = `Professional product photography of ${brand.value} ${model.value} power tool, ${
    (category.ok && category.value) || "hardware tool"
  }, clean white background, studio lighting, high detail, industrial equipment photo`;

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data?.[0]?.url;

    if (productId && imageUrl) {
      try {
        await prisma.product.update({ where: { id: productId }, data: { imageUrl } });
      } catch (e) {
        console.error("products/image db update error:", e);
      }
    }

    return NextResponse.json({ imageUrl });
  } catch (err) {
    console.error("products/image OpenAI error:", err);
    return NextResponse.json({ error: "Görsel üretilemedi." }, { status: 502 });
  }
}
