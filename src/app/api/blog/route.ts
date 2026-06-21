import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthorized } from "@/lib/auth";
import { safeJson, reqString, badRequest, safeHttpUrl } from "@/lib/validation";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Yazılar yüklenemedi." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthorized(req))) return unauthorized();

  const body = await safeJson<Record<string, unknown>>(req);
  if (!body) return badRequest("Geçersiz istek.");

  const title = reqString(body.title, "title", 200);
  if (!title.ok) return badRequest(title.error);

  const excerpt = reqString(body.excerpt, "excerpt", 500, { required: false });
  const content = reqString(body.content, "content", 100_000, { required: false });
  const category = reqString(body.category, "category", 100, { required: false });
  const readTime = reqString(body.readTime, "readTime", 30, { required: false });
  const slugInput = reqString(body.slug, "slug", 200, { required: false });
  if (!excerpt.ok) return badRequest(excerpt.error);
  if (!content.ok) return badRequest(content.error);
  if (!category.ok) return badRequest(category.error);
  if (!readTime.ok) return badRequest(readTime.error);
  if (!slugInput.ok) return badRequest(slugInput.error);

  const coverImage = safeHttpUrl(body.coverImage);

  const finalSlug = slugInput.value || slugify(title.value);

  try {
    const post = await prisma.blogPost.create({
      data: {
        title: title.value,
        slug: finalSlug,
        excerpt: excerpt.value,
        content: content.value,
        category: category.value,
        coverImage,
        readTime: readTime.value || "5 dk",
        published: body.published === true,
      },
    });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Yazı oluşturulamadı (slug benzersiz olmalı)." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthorized(req))) return unauthorized();

  const body = await safeJson<Record<string, unknown>>(req);
  if (!body) return badRequest("Geçersiz istek.");

  const { id, ...rest } = body;
  if (typeof id !== "string" || !id) return badRequest("id gerekli");

  // Sadece izin verilen alanları güncelle.
  const allowed = ["title", "slug", "excerpt", "content", "category", "coverImage", "readTime", "published"];
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in rest) data[key] = rest[key];
  }
  // coverImage güncelleniyorsa http/https URL'e zorla (depo→render güvenliği).
  if ("coverImage" in data) data.coverImage = safeHttpUrl(data.coverImage);

  try {
    const post = await prisma.blogPost.update({ where: { id }, data });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Yazı güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthorized(req))) return unauthorized();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return badRequest("id gerekli");

  try {
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Yazı silinemedi." }, { status: 500 });
  }
}
