/**
 * Muadil / uyumluluk motoru (Feature 4).
 *
 * Ürün spec'lerinden sezgisel (heuristic) uyumluluk çıkarımı yapar.
 * Gerçek bir parça-uyumluluk veritabanı bağlanana kadar (TODO) belgeli
 * heuristic'ler ile çalışır ve bilinmeyen durumlarda zarifçe boş döner.
 *
 * İki ana çıktı:
 *  1) Uyumlu aksesuar/sarf önerileri (ör. SDS uç, disk, batarya platformu)
 *  2) Aynı kategorideki "muadil" (alternatif marka/model) ürünler
 *
 * NOT: Burada katalog ürünleri tipini `import type` ile alıyoruz; runtime'da
 * sadece saf fonksiyonlar var (server/client her ikisinde de güvenli).
 */

import type { Product, ProductCategory } from "@/lib/products/types";

export interface CompatItem {
  baslik: string;
  aciklama: string;
  // İlgili katalog kategorisi (varsa, kataloga link verilebilir).
  kategori?: ProductCategory;
}

export interface CompatResult {
  // Aksesuar / sarf uyumluluğu (heuristic).
  aksesuarlar: CompatItem[];
  // Batarya / platform notu (akülü aletler için).
  bataryaNotu?: string;
  // Belirleyici teknik anahtarlar (kullanıcıya gösterilen "neden").
  belirleyiciler: { etiket: string; deger: string }[];
}

// ── Yardımcılar: spec'lerden değer çekme (esnek anahtar eşleştirme) ──

function pickSpec(
  specs: Record<string, string | number>,
  keys: string[]
): string | undefined {
  const entries = Object.entries(specs);
  for (const key of keys) {
    const found = entries.find(([k]) =>
      k.toLocaleLowerCase("tr").includes(key.toLocaleLowerCase("tr"))
    );
    if (found && found[1] != null && String(found[1]).trim() !== "") {
      return String(found[1]);
    }
  }
  return undefined;
}

function detectVoltage(specs: Record<string, string | number>): string | undefined {
  const v = pickSpec(specs, ["voltaj", "volt", "akü"]);
  if (!v) return undefined;
  const m = String(v).match(/(\d{1,3})\s*v/i);
  return m ? `${m[1]}V` : (/v/i.test(v) ? v : undefined);
}

const ACCESSORY_CATEGORIES: Record<string, ProductCategory> = {
  matkapUcu: "matkap-ucu",
  sdsUc: "sds-uc",
  taslamaDiski: "taslama-diski",
  kesmeDiski: "kesme-diski",
  daireBicagi: "daire-testere-bicagi",
  dekupajBicagi: "dekupaj-bicagi",
  tilkiBicagi: "tilki-kuyrugu-bicagi",
  zincir: "zincirli-testere-zinciri",
  kaynakElektrot: "kaynak-elektrodu",
  kaynakTel: "kaynak-teli",
};

/**
 * Bir ürün için uyumlu aksesuar/sarf ve belirleyici teknik anahtarları üretir.
 * Tamamen saf — DB/AI gerektirmez.
 */
export function getCompatibility(
  category: ProductCategory,
  specs: Record<string, string | number>,
  brand?: string
): CompatResult {
  const aksesuarlar: CompatItem[] = [];
  const belirleyiciler: { etiket: string; deger: string }[] = [];

  const voltage = detectVoltage(specs);
  let bataryaNotu: string | undefined;
  if (voltage) {
    belirleyiciler.push({ etiket: "Akü Voltajı", deger: voltage });
    bataryaNotu =
      `Bu alet ${voltage} platformundadır. ${brand ?? "Aynı marka"} ${voltage} ` +
      `serisindeki bataryalar ve şarj cihazları (aynı tip kızak/yuva) bu aletle ` +
      `uyumludur. Farklı voltajdaki (ör. 12V↔18V) bataryalar fiziksel olarak ` +
      `uymaz; çapraz-marka adaptörler garanti kapsamı dışındadır.`;
  }

  switch (category) {
    case "darbeli-matkap":
    case "vidalama":
    case "sutun-matkap": {
      const chuck = pickSpec(specs, ["mandren", "ayna", "chuck"]);
      if (chuck) belirleyiciler.push({ etiket: "Mandren", deger: chuck });
      aksesuarlar.push({
        baslik: "HSS / Brad Point Matkap Uçları",
        aciklama: `${chuck ?? "Standart"} mandren kapasitesine kadar düz saplı uçlar uyumludur.`,
        kategori: ACCESSORY_CATEGORIES.matkapUcu,
      });
      aksesuarlar.push({
        baslik: "Tornavida Uç (Bits) Setleri",
        aciklama: "1/4\" altıgen saplı standart vidalama uçları bu alette kullanılabilir.",
        kategori: "vida-seti",
      });
      break;
    }
    case "hilti": {
      const maxBeton = pickSpec(specs, ["delme çapı", "beton"]);
      belirleyiciler.push({ etiket: "Bağlantı", deger: "SDS-Plus" });
      if (maxBeton) belirleyiciler.push({ etiket: "Maks. Beton Çapı", deger: maxBeton });
      aksesuarlar.push({
        baslik: "SDS-Plus Beton Uçları",
        aciklama: "SDS-Plus saplı uçlar doğrudan kilitlenir. SDS-Max uçlar uymaz (farklı sap).",
        kategori: ACCESSORY_CATEGORIES.sdsUc,
      });
      aksesuarlar.push({
        baslik: "SDS-Plus Keski / Murç",
        aciklama: "Sıyırma ve kırma işleri için düz/sivri SDS-Plus keskiler uyumludur.",
        kategori: ACCESSORY_CATEGORIES.sdsUc,
      });
      break;
    }
    case "avuc-taslama": {
      const disc = pickSpec(specs, ["disk çapı", "disk"]) ?? "115/125 mm";
      const thread = pickSpec(specs, ["mil dişi", "mil", "thread"]) ?? "M14";
      belirleyiciler.push({ etiket: "Disk Çapı", deger: disc });
      belirleyiciler.push({ etiket: "Mil Dişi", deger: thread });
      aksesuarlar.push({
        baslik: "Taşlama Diskleri",
        aciklama: `${disc} ve ${thread} mil dişine uygun taşlama taşları uyumludur.`,
        kategori: ACCESSORY_CATEGORIES.taslamaDiski,
      });
      aksesuarlar.push({
        baslik: "Kesme Diskleri (İnce)",
        aciklama: `${disc} metal/inox kesme diskleri uyumludur. Çapı aşan disk takmayın.`,
        kategori: ACCESSORY_CATEGORIES.kesmeDiski,
      });
      break;
    }
    case "daire-testere":
    case "gonyeli-kesme":
    case "mermer-kesme": {
      const blade = pickSpec(specs, ["bıçak çapı", "testere çapı", "disk çapı"]) ?? "190 mm";
      const arbor = pickSpec(specs, ["mil çapı", "göbek", "arbor"]) ?? "30 mm";
      belirleyiciler.push({ etiket: "Bıçak Çapı", deger: blade });
      belirleyiciler.push({ etiket: "Göbek (Arbor)", deger: arbor });
      aksesuarlar.push({
        baslik: "Daire Testere Bıçakları",
        aciklama: `${blade} dış çap ve ${arbor} göbek çapına sahip bıçaklar uyumludur. Farklı göbek için redüksiyon halkası gerekir.`,
        kategori: ACCESSORY_CATEGORIES.daireBicagi,
      });
      break;
    }
    case "dekupaj": {
      belirleyiciler.push({ etiket: "Bıçak Bağlantısı", deger: "T-Shank (T saplı)" });
      aksesuarlar.push({
        baslik: "T-Saplı Dekupaj Bıçakları",
        aciklama: "T-shank (T saplı) bıçaklar standarttır; U-shank bıçaklar modern aletlere uymaz.",
        kategori: ACCESSORY_CATEGORIES.dekupajBicagi,
      });
      break;
    }
    case "tilki-kuyrugu": {
      belirleyiciler.push({ etiket: "Bıçak Bağlantısı", deger: "Universal (tek tırnak)" });
      aksesuarlar.push({
        baslik: "Tilki Kuyruğu Bıçakları",
        aciklama: "Üniversal tek-tırnaklı bıçaklar uyumludur; ahşap/metal için diş sayısını seçin.",
        kategori: ACCESSORY_CATEGORIES.tilkiBicagi,
      });
      break;
    }
    case "zincirli-testere": {
      const kilavuz = pickSpec(specs, ["kılavuz", "pala"]);
      if (kilavuz) belirleyiciler.push({ etiket: "Kılavuz Uzunluğu", deger: kilavuz });
      aksesuarlar.push({
        baslik: "Yedek Zincir",
        aciklama: `Kılavuz (pala) uzunluğu ve diş aralığına uygun zincir seçilmelidir.`,
        kategori: ACCESSORY_CATEGORIES.zincir,
      });
      break;
    }
    case "inverter-kaynak":
    case "argon-kaynak": {
      const akim = pickSpec(specs, ["kaynak akımı", "akım"]);
      if (akim) belirleyiciler.push({ etiket: "Kaynak Akımı", deger: akim });
      aksesuarlar.push({
        baslik: "Kaynak Elektrodu (Rutil/Bazik)",
        aciklama: "MMA modunda 2.5–3.25 mm rutil elektrotlar genel amaçlı uyumludur.",
        kategori: ACCESSORY_CATEGORIES.kaynakElektrot,
      });
      break;
    }
    case "gazalti-kaynak": {
      aksesuarlar.push({
        baslik: "Gazaltı Kaynak Teli (SG2)",
        aciklama: "0.8–1.0 mm SG2/SG3 dolu tel veya özlü (gazsız) tel uyumludur.",
        kategori: ACCESSORY_CATEGORIES.kaynakTel,
      });
      break;
    }
    default:
      // Bilinmeyen kategori: zarif boş çıktı.
      break;
  }

  return { aksesuarlar, bataryaNotu, belirleyiciler };
}

/**
 * Aynı kategorideki "muadil" (alternatif) ürünleri bulur.
 * Aynı kategori + benzer fiyat segmenti + farklı marka önceliklendirilir.
 */
export function findEquivalents(
  product: Pick<Product, "id" | "brand" | "category" | "priceRange">,
  all: Product[],
  limit = 4
): Product[] {
  const priceNum = parsePrice(product.priceRange);
  const sameCat = all.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  return sameCat
    .map((p) => {
      const otherPrice = parsePrice(p.priceRange);
      const priceDiff =
        priceNum != null && otherPrice != null
          ? Math.abs(priceNum - otherPrice) / Math.max(priceNum, 1)
          : 1;
      // Farklı marka + yakın fiyat = daha iyi muadil.
      const brandBonus = p.brand !== product.brand ? 0 : 0.3;
      return { p, score: priceDiff + brandBonus };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((x) => x.p);
}

function parsePrice(range?: string): number | null {
  if (!range) return null;
  // "₺1500-2500" veya "₺12.900" → ortalama / tek değer.
  const nums = range
    .replace(/\./g, "")
    .match(/\d+/g)
    ?.map(Number)
    .filter((n) => n > 0);
  if (!nums || nums.length === 0) return null;
  if (nums.length === 1) return nums[0];
  return (nums[0] + nums[1]) / 2;
}
