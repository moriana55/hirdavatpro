/**
 * Fiyat & stok kıyas (Feature 9) — çok kaynaklı fiyat.
 *
 * ⚠️ STUB: Buradaki fiyatlar ve linkler TEMSİLÎDİR. Gerçek fiyatlar
 * scraping/affiliate API gerektirir.
 * TODO(owner): Gerçek entegrasyon:
 *   - Hepsiburada / Trendyol / Koçtaş affiliate (XML feed veya partner API)
 *   - Akakçe/Cimri tarzı fiyat karşılaştırma API'si
 *   - Zamanlanmış scraping (robots.txt + ToS uyumlu)
 * Şimdilik katalog priceRange'inden türetilmiş deterministik tahminler üretilir,
 * böylece UI demo edilebilir ama "stub" olduğu açıkça işaretlenir.
 */

import { parsePriceRange } from "@/lib/pricing";
import type { Product } from "@/lib/products/types";

export interface PriceSource {
  source: string; // mağaza adı
  price: number; // TRY
  inStock: boolean;
  shippingNote: string;
  url: string; // affiliate/ürün linki (STUB)
  stub: boolean; // her zaman true (gerçek veri değil)
}

// Temsilî mağaza profilleri: baz fiyat çarpanı + kargo notu.
const STORE_PROFILES = [
  { name: "Hepsiburada", factor: 1.0, shipping: "Ücretsiz kargo (2-3 gün)" },
  { name: "Trendyol", factor: 0.96, shipping: "Hızlı teslimat" },
  { name: "Koçtaş", factor: 1.08, shipping: "Mağazadan teslim seçeneği" },
  { name: "Amazon TR", factor: 1.02, shipping: "Prime ile ertesi gün" },
  { name: "Yetkili Bayi", factor: 1.12, shipping: "Faturalı, garanti dahil" },
];

// Ürün id'sinden deterministik pseudo-rastgele (0..1) üret — her çağrıda sabit.
function seededUnit(seed: string, salt: number): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // 0..1
  return ((h >>> 0) % 1000) / 1000;
}

/** Bir ürün için temsilî çok kaynaklı fiyat listesi (deterministik). */
export function getPriceSources(product: Pick<Product, "id" | "priceRange">): PriceSource[] {
  const parsed = parsePriceRange(product.priceRange);
  const base = parsed?.mid ?? 0;

  return STORE_PROFILES.map((store, i) => {
    // Mağaza çarpanı + ±%5 deterministik sapma.
    const jitter = 0.95 + seededUnit(product.id, i) * 0.1;
    const price = base > 0 ? Math.round((base * store.factor * jitter) / 10) * 10 : 0;
    const inStock = seededUnit(product.id + store.name, i) > 0.2; // ~%80 stokta
    return {
      source: store.name,
      price,
      inStock,
      shippingNote: store.shipping,
      url: `https://example.com/ara?q=${encodeURIComponent(`${store.name} ${product.id}`)}`,
      stub: true,
    };
  })
    .filter((s) => s.price > 0)
    .sort((a, b) => {
      // Stokta olanlar önce, sonra fiyata göre artan.
      if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
      return a.price - b.price;
    });
}
