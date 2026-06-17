import { NextRequest, NextResponse } from "next/server";
import { listProjects, createProject, type SavedProjectItem } from "@/lib/project/store";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { safeJson, reqString } from "@/lib/validation";

export const dynamic = "force-dynamic";

// ownerKey — istemcide üretilen anonim anahtar (header veya query üzerinden).
function getOwnerKey(req: NextRequest, fromBody?: unknown): string | null {
  const header = req.headers.get("x-owner-key");
  const url = new URL(req.url);
  const q = url.searchParams.get("ownerKey");
  const b = typeof fromBody === "string" ? fromBody : undefined;
  const key = (header || q || b || "").trim();
  // Basit format kontrolü: 8-64 karakter, alfanümerik/çizgi.
  if (!key || !/^[A-Za-z0-9_-]{8,64}$/.test(key)) return null;
  return key;
}

export async function GET(req: NextRequest) {
  const ownerKey = getOwnerKey(req);
  if (!ownerKey) return NextResponse.json({ projects: [] });
  const projects = await listProjects(ownerKey);
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`projects:${ip}`, 30, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "İstek limiti aşıldı." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await safeJson<{ ownerKey?: unknown; name?: unknown; desc?: unknown; items?: unknown; notes?: unknown }>(req);
  if (!body) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

  const ownerKey = getOwnerKey(req, body.ownerKey);
  if (!ownerKey) return NextResponse.json({ error: "Geçersiz sahip anahtarı." }, { status: 400 });

  const name = reqString(body.name, "Proje adı", 120);
  if (!name.ok) return NextResponse.json({ error: name.error }, { status: 400 });

  const desc = reqString(body.desc, "İş tarifi", 500, { required: false });
  const notes = reqString(body.notes, "Notlar", 1000, { required: false });

  if (!Array.isArray(body.items)) {
    return NextResponse.json({ error: "Proje öğeleri geçersiz." }, { status: 400 });
  }
  // En fazla 40 kalem; her birini güvenli şekilde normalize et.
  const items: SavedProjectItem[] = (body.items as any[]).slice(0, 40).map((it) => ({
    category: String(it?.category || "").slice(0, 60),
    categoryLabel: String(it?.categoryLabel || "").slice(0, 120),
    rol: (["alet", "sarf", "guvenlik"].includes(it?.rol) ? it.rol : "alet") as SavedProjectItem["rol"],
    neden: String(it?.neden || "").slice(0, 300),
    productId: it?.productId ? String(it.productId).slice(0, 60) : undefined,
    brand: it?.brand ? String(it.brand).slice(0, 80) : undefined,
    model: it?.model ? String(it.model).slice(0, 120) : undefined,
    priceRange: it?.priceRange ? String(it.priceRange).slice(0, 60) : undefined,
  }));

  const project = await createProject({
    ownerKey,
    name: name.value,
    desc: desc.ok ? desc.value : "",
    items,
    notes: notes.ok ? notes.value : "",
  });

  return NextResponse.json({ project }, { status: 201 });
}
