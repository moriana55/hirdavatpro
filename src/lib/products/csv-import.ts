/**
 * CSV toplu ürün içe aktarma (Feature: CSV bulk product import).
 * Harici bağımlılık yok — RFC4180 alt kümesi destekleyen küçük bir parser.
 * Beklenen başlıklar (büyük/küçük harf duyarsız, sıra bağımsız):
 *   Brand, Model, Category, Specs (JSON), Image URL, SourceUrl
 */

import type { ProductCategory } from "@/lib/products/types";
import { CATEGORY_LABELS } from "@/lib/products/types";

export interface ParsedRow {
  brand: string;
  model: string;
  category: string;
  specs: Record<string, string | number>;
  imageUrl?: string;
  sourceUrl?: string;
}

export interface RowError {
  line: number; // 1 tabanlı (başlık hariç)
  message: string;
  raw?: string;
}

export interface ParseResult {
  rows: ParsedRow[];
  errors: RowError[];
  total: number;
}

// Başlık adı eşanlamlıları → normalize edilmiş anahtar.
const HEADER_ALIASES: Record<string, "brand" | "model" | "category" | "specs" | "imageUrl" | "sourceUrl"> = {
  brand: "brand",
  marka: "brand",
  model: "model",
  category: "category",
  kategori: "category",
  specs: "specs",
  "specs json": "specs",
  "specs (json)": "specs",
  ozellikler: "specs",
  "image url": "imageUrl",
  imageurl: "imageUrl",
  image: "imageUrl",
  gorsel: "imageUrl",
  "gorsel url": "imageUrl",
  sourceurl: "sourceUrl",
  "source url": "sourceUrl",
  kaynak: "sourceUrl",
};

const VALID_CATEGORIES = new Set(Object.keys(CATEGORY_LABELS));
const MAX_ROWS = 2000;

// RFC4180 alt kümesi: tırnaklı alanlar, kaçışlı çift tırnak, gömülü virgül/satır sonu.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  const src = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") { row.push(field); field = ""; }
      else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else field += ch;
    }
  }
  // Son alan/satır
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function isHttpUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseProductCsv(text: string): ParseResult {
  const errors: RowError[] = [];
  const rows: ParsedRow[] = [];

  if (!text || !text.trim()) {
    return { rows, errors: [{ line: 0, message: "Dosya boş." }], total: 0 };
  }

  const grid = parseCsv(text).filter((r) => r.some((c) => c.trim() !== ""));
  if (grid.length < 2) {
    return { rows, errors: [{ line: 0, message: "Başlık satırı + en az bir veri satırı gerekir." }], total: 0 };
  }

  // Başlık eşleme.
  const headerCells = grid[0].map((h) => h.trim().toLowerCase());
  const colIndex: Partial<Record<"brand" | "model" | "category" | "specs" | "imageUrl" | "sourceUrl", number>> = {};
  headerCells.forEach((h, idx) => {
    const key = HEADER_ALIASES[h];
    if (key && colIndex[key] === undefined) colIndex[key] = idx;
  });

  if (colIndex.brand === undefined || colIndex.model === undefined || colIndex.category === undefined) {
    return {
      rows,
      errors: [{ line: 0, message: "Zorunlu sütunlar eksik: Brand, Model, Category." }],
      total: 0,
    };
  }

  const dataRows = grid.slice(1);
  if (dataRows.length > MAX_ROWS) {
    errors.push({ line: 0, message: `En fazla ${MAX_ROWS} satır işlenebilir; fazlası atlandı.` });
  }

  const seen = new Set<string>();

  dataRows.slice(0, MAX_ROWS).forEach((cells, i) => {
    const line = i + 1;
    const get = (k: keyof typeof colIndex) => {
      const idx = colIndex[k];
      return idx === undefined ? "" : (cells[idx] ?? "").trim();
    };

    const brand = get("brand");
    const model = get("model");
    const category = get("category");

    if (!brand || !model || !category) {
      errors.push({ line, message: "Brand, Model ve Category zorunludur." });
      return;
    }
    if (brand.length > 100 || model.length > 100) {
      errors.push({ line, message: "Brand/Model en fazla 100 karakter olabilir." });
      return;
    }
    if (!VALID_CATEGORIES.has(category)) {
      errors.push({ line, message: `Geçersiz kategori slug: "${category}".` });
      return;
    }

    const dupKey = `${brand.toLowerCase()}::${model.toLowerCase()}`;
    if (seen.has(dupKey)) {
      errors.push({ line, message: `Dosya içinde yinelenen ürün: ${brand} ${model} (atlandı).` });
      return;
    }
    seen.add(dupKey);

    // Specs JSON (opsiyonel).
    const specs: Record<string, string | number> = {};
    const specsRaw = get("specs");
    if (specsRaw) {
      try {
        const parsed = JSON.parse(specsRaw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          for (const [k, v] of Object.entries(parsed)) {
            if (typeof v === "string" || typeof v === "number") specs[k] = v;
            else specs[k] = String(v);
          }
        } else {
          errors.push({ line, message: "Specs JSON bir nesne olmalı (atlandı; ürün yine de eklenecek)." });
        }
      } catch {
        errors.push({ line, message: "Specs JSON geçersiz (boş bırakıldı; ürün yine de eklenecek)." });
      }
    }

    // URL'ler (opsiyonel, doğrula).
    let imageUrl: string | undefined;
    const imageRaw = get("imageUrl");
    if (imageRaw) {
      if (isHttpUrl(imageRaw)) imageUrl = imageRaw.slice(0, 2000);
      else errors.push({ line, message: "Image URL geçersiz (yok sayıldı)." });
    }

    let sourceUrl: string | undefined;
    const sourceRaw = get("sourceUrl");
    if (sourceRaw) {
      if (isHttpUrl(sourceRaw)) sourceUrl = sourceRaw.slice(0, 2000);
      else errors.push({ line, message: "SourceUrl geçersiz (yok sayıldı)." });
    }

    rows.push({ brand, model, category: category as ProductCategory, specs, imageUrl, sourceUrl });
  });

  return { rows, errors, total: dataRows.length };
}
