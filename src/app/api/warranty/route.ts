import { NextRequest, NextResponse } from "next/server";
import { listWarranties, createWarranty } from "@/lib/warranty/store";
import { findServiceCenters } from "@/lib/warranty/service-centers";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { safeJson, reqString } from "@/lib/validation";
import { notifyAdmin } from "@/lib/notify";

export const dynamic = "force-dynamic";

function getOwnerKey(req: NextRequest, fromBody?: unknown): string | null {
  const header = req.headers.get("x-owner-key");
  const url = new URL(req.url);
  const q = url.searchParams.get("ownerKey");
  const b = typeof fromBody === "string" ? fromBody : undefined;
  const key = (header || q || b || "").trim();
  if (!key || !/^[A-Za-z0-9_-]{8,64}$/.test(key)) return null;
  return key;
}

export async function GET(req: NextRequest) {
  const ownerKey = getOwnerKey(req);
  if (!ownerKey) return NextResponse.json({ records: [] });
  const records = await listWarranties(ownerKey);
  return NextResponse.json({ records });
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`warranty:${ip}`, 30, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "İstek limiti aşıldı." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await safeJson<{
    ownerKey?: unknown; productLabel?: unknown; brand?: unknown;
    serial?: unknown; purchaseDate?: unknown; months?: unknown; note?: unknown;
  }>(req);
  if (!body) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

  const ownerKey = getOwnerKey(req, body.ownerKey);
  if (!ownerKey) return NextResponse.json({ error: "Geçersiz sahip anahtarı." }, { status: 400 });

  const productLabel = reqString(body.productLabel, "Ürün adı", 160);
  if (!productLabel.ok) return NextResponse.json({ error: productLabel.error }, { status: 400 });

  const brand = reqString(body.brand, "Marka", 80, { required: false });
  const serial = reqString(body.serial, "Seri no", 80, { required: false });
  const note = reqString(body.note, "Not", 500, { required: false });

  // Tarih doğrulama.
  const dateStr = typeof body.purchaseDate === "string" ? body.purchaseDate : "";
  const purchaseDate = new Date(dateStr);
  if (!dateStr || isNaN(purchaseDate.getTime())) {
    return NextResponse.json({ error: "Geçerli bir satın alma tarihi girin." }, { status: 400 });
  }
  if (purchaseDate.getTime() > Date.now() + 24 * 60 * 60 * 1000) {
    return NextResponse.json({ error: "Satın alma tarihi gelecekte olamaz." }, { status: 400 });
  }

  // Garanti süresi (ay): 1–120 arası.
  const monthsRaw = Number(body.months);
  const months = Number.isFinite(monthsRaw) ? Math.min(120, Math.max(1, Math.round(monthsRaw))) : 24;

  const record = await createWarranty({
    ownerKey,
    productLabel: productLabel.value,
    brand: brand.ok ? brand.value : "",
    serial: serial.ok ? serial.value : "",
    purchaseDate,
    months,
    note: note.ok ? note.value : "",
  });

  // Hatırlatma STUB'ı: garanti bitişi yaklaşıyorsa admin/log bildirimi.
  // TODO(owner): kullanıcıya e-posta hatırlatma için zamanlanmış görev (cron) + notify sağlayıcı.
  if (record.status !== "expired") {
    try {
      await notifyAdmin({
        subject: `Garanti kaydı oluşturuldu: ${record.productLabel}`,
        body: `Garanti bitiş: ${new Date(record.endDate).toLocaleDateString("tr-TR")} (${record.daysLeft} gün). Hatırlatma planlanmalı.`,
        meta: { recordId: record.id, brand: record.brand, months: record.months },
      });
    } catch {
      /* notify stub asla akışı bozmaz */
    }
  }

  const services = findServiceCenters({ brand: record.brand });
  return NextResponse.json({ record, services: services.slice(0, 5) }, { status: 201 });
}
