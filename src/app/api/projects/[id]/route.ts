import { NextRequest, NextResponse } from "next/server";
import { getProject, deleteProject } from "@/lib/project/store";

export const dynamic = "force-dynamic";

function ownerKeyOf(req: NextRequest): string | null {
  const header = req.headers.get("x-owner-key");
  const url = new URL(req.url);
  const q = url.searchParams.get("ownerKey");
  const key = (header || q || "").trim();
  if (!key || !/^[A-Za-z0-9_-]{8,64}$/.test(key)) return null;
  return key;
}

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const ownerKey = ownerKeyOf(req);
  if (!ownerKey) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const project = await getProject(id, ownerKey);
  if (!project) return NextResponse.json({ error: "Proje bulunamadı." }, { status: 404 });
  return NextResponse.json({ project });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const ownerKey = ownerKeyOf(req);
  if (!ownerKey) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const ok = await deleteProject(id, ownerKey);
  if (!ok) return NextResponse.json({ error: "Proje bulunamadı." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
