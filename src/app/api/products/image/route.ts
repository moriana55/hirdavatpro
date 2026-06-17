import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/db";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { productId, brand, model, category } = await req.json();
  if (!brand || !model) return NextResponse.json({ error: "brand ve model gerekli" }, { status: 400 });

  const prompt = `Professional product photography of ${brand} ${model} power tool, ${category || "hardware tool"}, clean white background, studio lighting, high detail, industrial equipment photo`;

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1024x1024",
    quality: "standard",
  });

  const imageUrl = response.data?.[0]?.url;

  if (productId && imageUrl) {
    await prisma.product.update({ where: { id: productId }, data: { imageUrl } });
  }

  return NextResponse.json({ imageUrl });
}
