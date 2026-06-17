import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { safeJson, badRequest } from "@/lib/validation";
import { parseProductCsv } from "@/lib/products/csv-import";
import { saveProduct } from "@/lib/products/store";
import type { ProductCategory } from "@/lib/products/types";

export const dynamic = "force-dynamic";

const MAX_CSV_BYTES = 2_000_000; // ~2 MB

// Admin-only CSV toplu ürün içe aktarma. Fail-closed.
// İki mod:
//   dryRun: true  → yalnızca doğrula, DB'ye yazma (önizleme).
//   dryRun: false → doğrula + batch upsert.
export async function POST(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const ip = getClientIp(req);
  const limit = rateLimit(`product-import:${ip}`, 20, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "İçe aktarma limiti aşıldı." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await safeJson<{ csv?: unknown; dryRun?: unknown }>(req);
  if (!body) return badRequest("Geçersiz istek.");
  if (typeof body.csv !== "string" || !body.csv.trim()) return badRequest("CSV içeriği gerekli.");
  if (body.csv.length > MAX_CSV_BYTES) return badRequest("CSV çok büyük (en fazla ~2 MB).");

  const dryRun = body.dryRun === true;

  const { rows, errors, total } = parseProductCsv(body.csv);

  // Yapısal hata (başlık eksik vb.) → hiç satır yoksa erken dön.
  if (rows.length === 0) {
    return NextResponse.json(
      { success: false, total, validRows: 0, imported: 0, errors, dryRun },
      { status: 400 }
    );
  }

  if (dryRun) {
    return NextResponse.json({
      success: true,
      dryRun: true,
      total,
      validRows: rows.length,
      imported: 0,
      preview: rows.slice(0, 50),
      errors,
    });
  }

  // Batch upsert — satır bazında hata izole edilir; biri patlarsa diğerleri devam eder.
  let imported = 0;
  const importErrors = [...errors];
  for (const row of rows) {
    try {
      await saveProduct({
        brand: row.brand,
        model: row.model,
        category: row.category as ProductCategory,
        specs: row.specs,
        imageUrl: row.imageUrl,
        sourceUrl: row.sourceUrl,
      });
      imported++;
    } catch (e) {
      console.error("CSV import upsert error:", e);
      importErrors.push({ line: 0, message: `${row.brand} ${row.model} kaydedilemedi.` });
    }
  }

  return NextResponse.json({
    success: true,
    dryRun: false,
    total,
    validRows: rows.length,
    imported,
    errors: importErrors,
  });
}
