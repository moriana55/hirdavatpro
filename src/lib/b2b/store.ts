import { prisma } from "@/lib/db";
import { getProducts } from "@/lib/products/store";
import { productSlug } from "@/lib/products/store";
import type { Product } from "@/lib/products/types";
import { similarity, tokenOverlap, normalize } from "@/lib/fuzzy";

export interface B2BQuoteItem {
  query: string; // kullanıcının girdiği SKU/isim
  productId?: string;
  brand?: string;
  model?: string;
  qty: number;
}

export async function createQuote(data: {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  taxNumber?: string;
  items: B2BQuoteItem[];
  note?: string;
}) {
  return prisma.b2BQuote.create({
    data: {
      companyName: data.companyName,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      taxNumber: data.taxNumber,
      items: data.items as any,
      note: data.note ?? "",
    },
  });
}

// ── Teklif satırı → katalog ürün otomatik eşleştirme (heuristik) ──

export type MatchStatus = "exact" | "fuzzy" | "ambiguous" | "unmatched";

export interface ItemMatch {
  item: B2BQuoteItem;
  status: MatchStatus;
  // En iyi aday (varsa)
  product?: {
    id: string;
    brand: string;
    model: string;
    category: string;
    slug: string;
  };
  score: number; // 0..1 güven skoru
  // Diğer yakın adaylar (ambiguous durumunda manuel seçim için)
  alternatives: { id: string; brand: string; model: string; slug: string; score: number }[];
}

export interface QuoteMatchSummary {
  total: number;
  matched: number; // exact + fuzzy
  ambiguous: number;
  unmatched: number;
}

const EXACT_THRESHOLD = 0.92;
const FUZZY_THRESHOLD = 0.62;
// İkinci adayla fark bu kadar yakınsa "belirsiz" say (manuel onay gerekir).
const AMBIGUOUS_GAP = 0.08;

function searchText(p: Product): string {
  return `${p.brand} ${p.model}`;
}

// Tek bir teklif satırını ürün listesine karşı skorlar.
function scoreItem(item: B2BQuoteItem, products: Product[]): ItemMatch {
  // 1) productId zaten gönderilmişse doğrudan exact (istemci seçmiş).
  if (item.productId) {
    const direct = products.find((p) => p.id === item.productId);
    if (direct) {
      return {
        item,
        status: "exact",
        product: { id: direct.id, brand: direct.brand, model: direct.model, category: direct.category, slug: productSlug(direct) },
        score: 1,
        alternatives: [],
      };
    }
  }

  // 2) Sorgu metni: brand+model varsa onları, yoksa serbest query'yi kullan.
  const queryText = [item.brand, item.model].filter(Boolean).join(" ").trim() || item.query;
  if (!normalize(queryText)) {
    return { item, status: "unmatched", score: 0, alternatives: [] };
  }

  const scored = products
    .map((p) => {
      const text = searchText(p);
      // Levenshtein benzerliği ile token örtüşmesinin ağırlıklı bileşimi.
      const sim = similarity(queryText, text);
      const tok = tokenOverlap(queryText, text);
      const score = Math.max(sim, 0.5 * sim + 0.5 * tok);
      return { p, score };
    })
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best || best.score < FUZZY_THRESHOLD) {
    return {
      item,
      status: "unmatched",
      score: best?.score ?? 0,
      alternatives: scored.slice(0, 3).filter((s) => s.score > 0.3).map((s) => ({
        id: s.p.id, brand: s.p.brand, model: s.p.model, slug: productSlug(s.p), score: round(s.score),
      })),
    };
  }

  const second = scored[1];
  const ambiguous =
    best.score < EXACT_THRESHOLD && second && best.score - second.score < AMBIGUOUS_GAP;

  const product = {
    id: best.p.id,
    brand: best.p.brand,
    model: best.p.model,
    category: best.p.category,
    slug: productSlug(best.p),
  };
  const alternatives = scored.slice(1, 4).filter((s) => s.score >= FUZZY_THRESHOLD).map((s) => ({
    id: s.p.id, brand: s.p.brand, model: s.p.model, slug: productSlug(s.p), score: round(s.score),
  }));

  return {
    item,
    status: ambiguous ? "ambiguous" : best.score >= EXACT_THRESHOLD ? "exact" : "fuzzy",
    product,
    score: round(best.score),
    alternatives,
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

// Bir teklifin tüm satırlarını eşleştirir + özet üretir.
export async function matchQuoteItems(items: B2BQuoteItem[]): Promise<{ matches: ItemMatch[]; summary: QuoteMatchSummary }> {
  const products = await getProducts();
  const matches = items.map((it) => scoreItem(it, products));
  const summary: QuoteMatchSummary = {
    total: matches.length,
    matched: matches.filter((m) => m.status === "exact" || m.status === "fuzzy").length,
    ambiguous: matches.filter((m) => m.status === "ambiguous").length,
    unmatched: matches.filter((m) => m.status === "unmatched").length,
  };
  return { matches, summary };
}

// Bozuk/eksik JSON'dan güvenli B2BQuoteItem[] çıkarımı (admin tarafı tolerant).
export function parseQuoteItems(raw: unknown): B2BQuoteItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((it: any) => {
      if (!it || typeof it !== "object") return null;
      const query = typeof it.query === "string" ? it.query : "";
      const qty = Math.max(1, parseInt(String(it.qty), 10) || 1);
      const brand = typeof it.brand === "string" ? it.brand : undefined;
      const model = typeof it.model === "string" ? it.model : undefined;
      const productId = typeof it.productId === "string" ? it.productId : undefined;
      if (!query && !brand && !model) return null;
      return { query, qty, brand, model, productId } as B2BQuoteItem;
    })
    .filter((x): x is B2BQuoteItem => !!x);
}

export async function getQuotes() {
  return prisma.b2BQuote.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
}

export async function getQuoteById(id: string) {
  return prisma.b2BQuote.findUnique({ where: { id } });
}

export async function updateQuoteStatus(id: string, status: string) {
  return prisma.b2BQuote.update({ where: { id }, data: { status } });
}
