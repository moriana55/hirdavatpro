/**
 * İçerik → satış (Feature 8): blog yazısının kategorisini/içeriğini katalog
 * ürün kategorilerine eşleyip "bu işte geçen aletler" şeridi için ürün seçer.
 * Eşleşme yoksa graceful (boş) döner.
 */

import { getProductsByCategory } from "@/lib/products/store";
import type { Product, ProductCategory } from "@/lib/products/types";
import type { BlogPost } from "./posts";

// Blog kategori etiketi → katalog kategori anahtarları.
const BLOG_CATEGORY_MAP: Record<string, ProductCategory[]> = {
  "Delme & Vidalama": ["darbeli-matkap", "vidalama", "hilti", "matkap-ucu"],
  "Delme & Kırma": ["hilti", "darbeli-matkap", "sds-uc"],
  "Taşlama & Zımparalama": ["avuc-taslama", "taslama-diski", "kesme-diski", "eksantrik-zimpara"],
  "Zımpara & Perdah": ["eksantrik-zimpara", "titresimli-zimpara", "bant-zimpara"],
  "Kaynak": ["inverter-kaynak", "gazalti-kaynak", "argon-kaynak", "kaynak-maskesi"],
  "Kompresör & Havalı Alet": ["kompresor", "basincli-yikama", "havali-somun"],
  "El Aletleri": ["tornavida-seti", "pense-seti", "anahtar-seti", "cekic"],
  "İş Güvenliği": ["koruyucu-gozluk", "is-eldiveni", "kulak-koruyucu", "toz-maskesi", "baret"],
  "Kesme & Testere": ["daire-testere", "dekupaj", "gonyeli-kesme", "serit-testere", "tilki-kuyrugu"],
  "Kesme & Biçme": ["daire-testere", "zincirli-testere", "motorlu-tirpan"],
  "Seramik & Döşeme": ["mermer-kesme", "avuc-taslama", "kesme-diski", "su-terazisi"],
  "Ölçme & İşaretleme": ["lazer-metre", "lazer-terazisi", "su-terazisi", "celik-metre"],
  "Temizleme & Bakım": ["basincli-yikama", "endustriyel-supurge"],
  "Ahşap İşleme": ["freze-makinesi", "el-planyasi", "daire-testere", "serit-testere"],
};

// İçerik anahtar kelimelerinden ek kategori çıkarımı (kategori eşleşmesi zayıfsa).
const KEYWORD_MAP: { keywords: string[]; categories: ProductCategory[] }[] = [
  { keywords: ["matkap", "darbeli", "delme"], categories: ["darbeli-matkap", "matkap-ucu"] },
  { keywords: ["taşlama", "disk", "kesme diski"], categories: ["avuc-taslama", "kesme-diski"] },
  { keywords: ["kaynak", "elektrot", "inverter"], categories: ["inverter-kaynak", "kaynak-maskesi"] },
  { keywords: ["zımpara", "grit", "perdah"], categories: ["eksantrik-zimpara", "titresimli-zimpara"] },
  { keywords: ["testere", "dekupaj", "gönye"], categories: ["daire-testere", "dekupaj", "gonyeli-kesme"] },
  { keywords: ["kompresör", "havalı", "psi"], categories: ["kompresor"] },
  { keywords: ["fayans", "seramik", "karo"], categories: ["mermer-kesme", "kesme-diski"] },
  { keywords: ["güvenlik", "gözlük", "eldiven", "maske"], categories: ["koruyucu-gozluk", "is-eldiveni", "toz-maskesi"] },
];

const TR = (s: string) => s.toLocaleLowerCase("tr");

export interface ShoppableProduct {
  id: string;
  brand: string;
  model: string;
  category: ProductCategory;
  priceRange?: string;
}

/** Blog yazısı için önerilen ürünleri (en fazla `limit`) döndürür. */
export async function getShoppableProducts(post: BlogPost, limit = 4): Promise<ShoppableProduct[]> {
  const cats = new Set<ProductCategory>();

  // 1) Kategori eşlemesi.
  for (const c of BLOG_CATEGORY_MAP[post.category] || []) cats.add(c);

  // 2) İçerik anahtar kelimeleri (kategori yetersizse zenginleştir).
  if (cats.size < 2) {
    const text = TR(post.title + " " + post.excerpt + " " + post.sections.map((s) => s.heading || "").join(" "));
    for (const k of KEYWORD_MAP) {
      if (k.keywords.some((kw) => text.includes(TR(kw)))) {
        for (const c of k.categories) cats.add(c);
      }
    }
  }

  if (cats.size === 0) return [];

  // Kategorilerden ürün topla (kategori başına en fazla 2, çeşitlilik için).
  const collected: Product[] = [];
  for (const cat of cats) {
    const products = await getProductsByCategory(cat);
    collected.push(...products.slice(0, 2));
    if (collected.length >= limit * 2) break;
  }

  // Tekilleştir + kısıtla.
  const seen = new Set<string>();
  const result: ShoppableProduct[] = [];
  for (const p of collected) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    result.push({ id: p.id, brand: p.brand, model: p.model, category: p.category, priceRange: p.priceRange });
    if (result.length >= limit) break;
  }
  return result;
}
