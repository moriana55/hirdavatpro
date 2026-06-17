/**
 * "İşi tarif et, sepet çıkar" (Feature 2) — kural tabanlı eşleştirme.
 *
 * Kullanıcının serbest metin iş tarifini ("banyo fayansı değiştireceğim")
 * alır, anahtar kelime eşleştirmesiyle gereken alet + sarf KATEGORİLERİNE
 * çevirir. OpenAI anahtarı yoksa bu motor tek başına çalışır (graceful).
 * AI mevcutsa API route bu sonucu zenginleştirebilir.
 */

import type { ProductCategory } from "@/lib/products/types";

export interface KitLine {
  // Katalog kategorisi — eşleştirme bununla yapılır.
  category: ProductCategory;
  // Kullanıcıya gösterilecek rol (ör. "Ana alet", "Sarf").
  rol: "alet" | "sarf" | "guvenlik";
  // Kısa gerekçe.
  neden: string;
}

export interface ProjectKit {
  baslik: string;
  ozet: string;
  lines: KitLine[];
}

interface Rule {
  keywords: string[];
  baslik: string;
  ozet: string;
  lines: KitLine[];
}

// Belgeli kural seti — her senaryo için tipik alet+sarf+güvenlik listesi.
const RULES: Rule[] = [
  {
    keywords: ["fayans", "seramik", "karo", "banyo zemin", "duvar karo"],
    baslik: "Fayans / Seramik Değişimi",
    ozet: "Eski fayansların sökülmesi, zemin hazırlığı ve yeni fayans döşeme için temel set.",
    lines: [
      { category: "avuc-taslama", rol: "alet", neden: "Eski derz/fayans kesimi ve düzeltme" },
      { category: "kesme-diski", rol: "sarf", neden: "Seramik/granit kesme diski" },
      { category: "matkap-ucu", rol: "sarf", neden: "Seramik delme için elmas uç" },
      { category: "darbeli-matkap", rol: "alet", neden: "Yapıştırıcı karıştırma + delme" },
      { category: "su-terazisi", rol: "alet", neden: "Düz ve teraziye döşeme" },
      { category: "lazer-terazisi", rol: "alet", neden: "Hizalama ve referans çizgisi" },
      { category: "derz-dolgu", rol: "sarf", neden: "Fayans aralarının doldurulması" },
      { category: "silikon", rol: "sarf", neden: "Köşe ve birleşim su yalıtımı" },
      { category: "is-eldiveni", rol: "guvenlik", neden: "Kesim ve kimyasal koruması" },
      { category: "koruyucu-gozluk", rol: "guvenlik", neden: "Kesim sırasında göz koruması" },
      { category: "toz-maskesi", rol: "guvenlik", neden: "Söküm tozuna karşı solunum koruması" },
    ],
  },
  {
    keywords: ["boya", "badana", "duvar boya", "iç cephe", "dış cephe"],
    baslik: "Duvar Boyama / Badana",
    ozet: "Yüzey hazırlığı, macunlama ve boyama için araç-sarf seti.",
    lines: [
      { category: "boya-rulosu", rol: "sarf", neden: "Geniş yüzey boyama" },
      { category: "macun", rol: "sarf", neden: "Çatlak ve delik dolgusu" },
      { category: "eksantrik-zimpara", rol: "alet", neden: "Macun ve eski boya zımparalama" },
      { category: "merdiven", rol: "alet", neden: "Tavan ve üst bölge erişimi" },
      { category: "toz-maskesi", rol: "guvenlik", neden: "Zımpara tozu koruması" },
      { category: "is-tulumu", rol: "guvenlik", neden: "Kıyafet koruması" },
    ],
  },
  {
    keywords: ["elektrik", "priz", "anahtar", "kablo", "tesisat çek", "sigorta"],
    baslik: "Elektrik Tesisat İşi",
    ozet: "Priz/anahtar montajı, kablolama ve ölçüm için temel elektrik seti.",
    lines: [
      { category: "kanal-acma", rol: "alet", neden: "Duvarda kablo kanalı açma" },
      { category: "multimetre", rol: "alet", neden: "Voltaj/süreklilik ölçümü" },
      { category: "faz-algilayici", rol: "alet", neden: "Enerji kontrolü (güvenlik)" },
      { category: "kablo-soyucu", rol: "alet", neden: "Kablo uçlarının hazırlanması" },
      { category: "tornavida-seti", rol: "alet", neden: "VDE izoleli montaj" },
      { category: "priz-anahtar", rol: "sarf", neden: "Montaj malzemesi" },
      { category: "is-eldiveni", rol: "guvenlik", neden: "İzolasyon ve koruma" },
    ],
  },
  {
    keywords: ["su tesisat", "musluk", "batarya", "boru", "sızıntı", "lavabo", "sifon"],
    baslik: "Su Tesisatı / Musluk Değişimi",
    ozet: "Boru bağlantısı, musluk montajı ve sızdırmazlık için tesisat seti.",
    lines: [
      { category: "boru-anahtari", rol: "alet", neden: "Boru ve rakor sıkma" },
      { category: "tesisat-pense", rol: "alet", neden: "Su pompası pensesi ile kavrama" },
      { category: "boru-kesici", rol: "alet", neden: "PPRC/bakır boru kesimi" },
      { category: "lehim-makinesi", rol: "alet", neden: "PPRC boru kaynağı" },
      { category: "silikon", rol: "sarf", neden: "Birleşim su yalıtımı" },
      { category: "musluk-batarya", rol: "sarf", neden: "Yeni armatür" },
    ],
  },
  {
    keywords: ["mobilya", "dolap", "raf", "ahşap", "montaj", "ikea", "vida"],
    baslik: "Mobilya / Raf Montajı",
    ozet: "Ahşap montaj, delme ve sabitleme için pratik set.",
    lines: [
      { category: "vidalama", rol: "alet", neden: "Vida sıkma/sökme" },
      { category: "matkap-ucu", rol: "sarf", neden: "Pilot delik açma" },
      { category: "vida-seti", rol: "sarf", neden: "Ahşap/sunta vidaları" },
      { category: "dubel-seti", rol: "sarf", neden: "Duvara sabitleme" },
      { category: "su-terazisi", rol: "alet", neden: "Düz montaj" },
      { category: "lazer-metre", rol: "alet", neden: "Hızlı ölçü alma" },
    ],
  },
  {
    keywords: ["kaynak", "demir", "ferforje", "metal birleştir", "korkuluk"],
    baslik: "Kaynak / Metal İşi",
    ozet: "Metal kesim, kaynak ve temizlik için set.",
    lines: [
      { category: "inverter-kaynak", rol: "alet", neden: "MMA elektrot kaynağı" },
      { category: "kaynak-elektrodu", rol: "sarf", neden: "Dolgu malzemesi" },
      { category: "avuc-taslama", rol: "alet", neden: "Kesim ve çapak alma" },
      { category: "kesme-diski", rol: "sarf", neden: "Metal kesme diski" },
      { category: "kaynak-maskesi", rol: "guvenlik", neden: "Ark ışığı koruması" },
      { category: "is-eldiveni", rol: "guvenlik", neden: "Isı ve kıvılcım koruması" },
    ],
  },
  {
    keywords: ["bahçe", "çim", "budama", "ağaç", "ot biç", "peyzaj"],
    baslik: "Bahçe / Peyzaj Bakımı",
    ozet: "Çim, çalı ve ağaç bakımı için bahçe seti.",
    lines: [
      { category: "motorlu-tirpan", rol: "alet", neden: "Ot ve yüksek çim biçme" },
      { category: "cim-bicme", rol: "alet", neden: "Düzenli çim biçimi" },
      { category: "budama-makasi", rol: "alet", neden: "Çalı ve dal budama" },
      { category: "koruyucu-gozluk", rol: "guvenlik", neden: "Uçan parça koruması" },
      { category: "kulak-koruyucu", rol: "guvenlik", neden: "Motor gürültüsü koruması" },
    ],
  },
  {
    keywords: ["beton", "delik", "kırıcı", "duvar yık", "hilti", "kanal"],
    baslik: "Beton / Kırım İşi",
    ozet: "Beton delme, kırma ve sökme için ağır iş seti.",
    lines: [
      { category: "hilti", rol: "alet", neden: "Beton delme/kırma" },
      { category: "sds-uc", rol: "sarf", neden: "SDS-Plus uç ve keski" },
      { category: "toz-maskesi", rol: "guvenlik", neden: "Beton tozu koruması" },
      { category: "koruyucu-gozluk", rol: "guvenlik", neden: "Çapak koruması" },
      { category: "kulak-koruyucu", rol: "guvenlik", neden: "Yüksek ses koruması" },
    ],
  },
];

// Hiçbir kural eşleşmezse genel başlangıç seti.
const FALLBACK_KIT: ProjectKit = {
  baslik: "Genel Tadilat Başlangıç Seti",
  ozet:
    "İş tarifiniz net bir senaryoyla eşleşmedi; çoğu ev tadilatı için işe yarayan temel bir set önerdik. Tarifi biraz daha detaylandırırsanız (ör. malzeme, yer) daha isabetli öneri çıkar.",
  lines: [
    { category: "darbeli-matkap", rol: "alet", neden: "Çok amaçlı delme/vidalama" },
    { category: "matkap-ucu", rol: "sarf", neden: "Karışık malzeme uçları" },
    { category: "tornavida-seti", rol: "alet", neden: "Genel montaj/söküm" },
    { category: "su-terazisi", rol: "alet", neden: "Hizalama" },
    { category: "is-eldiveni", rol: "guvenlik", neden: "El koruması" },
    { category: "koruyucu-gozluk", rol: "guvenlik", neden: "Göz koruması" },
  ],
};

function normalize(s: string): string {
  return s.toLocaleLowerCase("tr").trim();
}

/** Kural tabanlı kit üretimi — AI gerektirmez. */
export function buildKitRuleBased(description: string): ProjectKit {
  const text = normalize(description);
  let best: { rule: Rule; hits: number } | null = null;
  for (const rule of RULES) {
    const hits = rule.keywords.filter((k) => text.includes(normalize(k))).length;
    if (hits > 0 && (!best || hits > best.hits)) best = { rule, hits };
  }
  if (!best) return FALLBACK_KIT;
  const { rule } = best;
  return { baslik: rule.baslik, ozet: rule.ozet, lines: rule.lines };
}

// AI çıktısını doğrulamak için izin verilen kategori listesi export'u.
export function ruleScenarios(): { baslik: string; keywords: string[] }[] {
  return RULES.map((r) => ({ baslik: r.baslik, keywords: r.keywords }));
}
