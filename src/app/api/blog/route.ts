import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, slug, excerpt, content, category, coverImage, readTime, published } = body;
  if (!title) return NextResponse.json({ error: "title gerekli" }, { status: 400 });

  const finalSlug = slug?.trim() || slugify(title);

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug: finalSlug,
      excerpt: excerpt ?? "",
      content: content ?? "",
      category: category ?? "",
      coverImage: coverImage ?? null,
      readTime: readTime ?? "5 dk",
      published: published ?? false,
    },
  });
  return NextResponse.json(post);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });

  const post = await prisma.blogPost.update({ where: { id }, data });
  return NextResponse.json(post);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });

  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
