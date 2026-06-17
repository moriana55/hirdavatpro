/**
 * Kategoriye duyarlı blog şablonları (Feature: category-specific blog templates).
 *
 * Admin tarafında, harici API gerektirmeden tam bir markdown taslağı üretir:
 *  - "X için en iyi N" liste yazıları
 *  - spec/seçim rehberleri
 * Otomatik olarak ilgili katalog ürünlerini önerir ve dahili linkler (ürün + blog) ekler.
 *
 * OpenAI anahtarı varsa çağıran taraf bunu zenginleştirebilir; yoksa şablon tek başına
 * yayımlanabilir içerik döndürür.
 */

import { getProductsByCategory } from "@/lib/products/store";
import { productSlug } from "@/lib/products/store";
import { CATEGORY_LABELS, type ProductCategory } from "@/lib/products/types";
import { getAllPosts } from "@/lib/blog/posts";

export type TemplateKind = "best-of" | "spec-guide" | "buyers-guide";

export const TEMPLATE_KINDS: { value: TemplateKind; label: string; desc: string }[] = [
  { value: "best-of", label: "En İyi N Listesi", desc: "“X için en iyi 5 ürün” formatında karşılaştırmalı liste." },
  { value: "spec-guide", label: "Teknik Spec Rehberi", desc: "Kategoriye özgü teknik terimleri açıklayan rehber." },
  { value: "buyers-guide", label: "Satın Alma Rehberi", desc: "“Nasıl seçilir?” formatında adım adım rehber." },
];

// Kategoriye özgü spesifikasyon ipuçları (içerik iskeleti için).
const SPEC_HINTS: Partial<Record<ProductCategory, string[]>> = {
  "darbeli-matkap": ["Güç (Watt)", "Devir (rpm)", "Tork (Nm)", "Darbe sayısı (bpm)", "Mandren tipi", "Akülü / kablolu"],
  vidalama: ["Tork (Nm)", "Devir kademeleri", "Akü voltajı (V)", "Çene tipi", "Tork ayar kademesi"],
  "avuc-taslama": ["Disk çapı (mm)", "Güç (Watt)", "Devir (rpm)", "Yumuşak başlatma", "Titreşim sönümleme"],
  "daire-testere": ["Disk çapı (mm)", "Kesim derinliği (mm)", "Eğim açısı", "Devir (rpm)", "Güç (Watt)"],
  dekupaj: ["Vuruş sayısı (SPM)", "Salınım kademesi", "Bıçak tipi (T-sap)", "Eğim açısı", "Güç (Watt)"],
  "inverter-kaynak": ["Amper aralığı (A)", "Görev döngüsü (%)", "Elektrot çapı", "Hot-start / Anti-stick", "Giriş voltajı"],
  kompresor: ["Hazne (litre)", "Basınç (bar/PSI)", "Hava debisi (lt/dak)", "Yağlı / yağsız", "Gürültü (dB)"],
  "eksantrik-zimpara": ["Taban boyutu", "OPM (salınım/dk)", "Toz toplama", "Değişken hız", "Güç (Watt)"],
  jenerator: ["Güç (kVA/kW)", "Yakıt tipi", "Depo hacmi", "Çalışma süresi", "AVR / inverter"],
  "lazer-metre": ["Menzil (m)", "Hassasiyet (mm)", "Pisagor ölçümü", "Bluetooth", "IP koruma"],
};

const GENERIC_SPECS = ["Güç ve performans", "Boyut ve ağırlık", "Marka servis ağı", "Garanti süresi", "Fiyat / performans dengesi"];

const TR = (s: string) => s.toLocaleLowerCase("tr");

export interface TemplateProduct {
  id: string;
  brand: string;
  model: string;
  slug: string;
  priceRange?: string;
  specs: Record<string, string | number>;
}

export interface GeneratedTemplate {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  content: string; // markdown
  readTime: string;
  suggestedProducts: TemplateProduct[];
  internalLinks: { label: string; href: string }[];
}

function slugify(text: string): string {
  return TR(text)
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Kategoriyle ilgili mevcut blog yazılarını bul (dahili linkleme için).
function relatedBlogLinks(category: ProductCategory, limit = 3): { label: string; href: string }[] {
  const label = TR(CATEGORY_LABELS[category] || "");
  const words = label.split(/\s+/).filter((w) => w.length > 2);
  const scored = getAllPosts()
    .map((p) => {
      const hay = TR(p.title + " " + p.excerpt + " " + p.category);
      const score = words.reduce((acc, w) => acc + (hay.includes(w) ? 1 : 0), 0);
      return { p, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return scored.map((s) => ({ label: s.p.title, href: `/blog/${s.p.slug}` }));
}

function specLines(category: ProductCategory): string[] {
  return SPEC_HINTS[category] ?? GENERIC_SPECS;
}

export interface GenerateOptions {
  category: ProductCategory;
  kind: TemplateKind;
  count?: number; // best-of için ürün sayısı
}

export async function generateBlogTemplate(opts: GenerateOptions): Promise<GeneratedTemplate> {
  const { category, kind } = opts;
  const count = Math.max(3, Math.min(10, opts.count ?? 5));
  const catLabel = CATEGORY_LABELS[category] || category;

  // İlgili ürünleri çek (fiyatı/specsi olanları öne al).
  const raw = await getProductsByCategory(category);
  const products: TemplateProduct[] = raw.slice(0, count).map((p) => ({
    id: p.id,
    brand: p.brand,
    model: p.model,
    slug: productSlug(p),
    priceRange: p.priceRange,
    specs: p.specs || {},
  }));

  const internalLinks = relatedBlogLinks(category);
  const specs = specLines(category);

  let title: string;
  let excerpt: string;
  let content: string;

  if (kind === "best-of") {
    title = `${catLabel} İçin En İyi ${products.length || count} Model`;
    excerpt = `${catLabel} alırken kafanız karıştıysa doğru yerdesiniz. Fiyat, performans ve kullanım senaryosuna göre öne çıkan ${catLabel.toLocaleLowerCase("tr")} modellerini karşılaştırdık.`;
    content = buildBestOf(catLabel, products, specs, internalLinks);
  } else if (kind === "spec-guide") {
    title = `${catLabel} Teknik Özellikleri: Hangi Değer Ne Anlama Gelir?`;
    excerpt = `${catLabel} seçerken karşınıza çıkan teknik terimleri (${specs.slice(0, 3).join(", ")} ...) sade bir dille açıklıyoruz.`;
    content = buildSpecGuide(catLabel, products, specs, internalLinks);
  } else {
    title = `${catLabel} Nasıl Seçilir? Adım Adım Satın Alma Rehberi`;
    excerpt = `İhtiyacınıza en uygun ${catLabel.toLocaleLowerCase("tr")} modelini seçmek için bilmeniz gereken her şey: teknik kriterler, kullanım senaryoları ve öne çıkan modeller.`;
    content = buildBuyersGuide(catLabel, products, specs, internalLinks);
  }

  const readTime = `${Math.max(3, Math.ceil(content.split(/\s+/).length / 200))} dk`;

  return {
    title,
    slug: slugify(title),
    excerpt,
    category: catLabel,
    content,
    readTime,
    suggestedProducts: products,
    internalLinks,
  };
}

// ── Markdown iskeletleri ──

function productListMd(products: TemplateProduct[]): string {
  if (products.length === 0) {
    return "_Bu kategoride henüz katalog ürünü yok; ürün eklendikçe öneriler otomatik güncellenir._\n";
  }
  return products
    .map((p, i) => {
      const price = p.priceRange ? ` — ${p.priceRange}` : "";
      const specEntries = Object.entries(p.specs).slice(0, 3);
      const specStr = specEntries.length
        ? "\n" + specEntries.map(([k, v]) => `  - **${k}:** ${v}`).join("\n")
        : "";
      return `### ${i + 1}. [${p.brand} ${p.model}](/urun/${p.slug})${price}${specStr}`;
    })
    .join("\n\n");
}

function internalLinksMd(links: { label: string; href: string }[]): string {
  if (links.length === 0) return "";
  const items = links.map((l) => `- [${l.label}](${l.href})`).join("\n");
  return `\n## İlgili Rehberler\n\n${items}\n`;
}

function buildBestOf(
  catLabel: string,
  products: TemplateProduct[],
  specs: string[],
  links: { label: string; href: string }[]
): string {
  return `## ${catLabel} Alırken Nelere Dikkat Etmeli?

${catLabel} seçerken bütçe kadar kullanım senaryonuz da belirleyicidir. Aşağıdaki başlıklar tüm modelleri kıyaslarken pusula görevi görür:

${specs.map((s) => `- **${s}**`).join("\n")}

## Öne Çıkan ${products.length || ""} Model

${productListMd(products)}

## Hangi Model Kime Uygun?

- **Ev / hobi kullanımı:** Giriş seviyesi, hafif ve uygun fiyatlı modeller yeterlidir.
- **Yarı profesyonel:** Daha yüksek görev döngüsü ve dayanıklılık arayın.
- **Profesyonel / şantiye:** Servis ağı geniş markalar ve uzun garanti önceliklidir.

## Sonuç

İhtiyacınızı netleştirin: ne sıklıkta, hangi malzemede ve nerede kullanacaksınız? Yukarıdaki modeller farklı bütçe ve senaryolar için derlenmiştir. Karşılaştırma için ürün sayfalarındaki teknik tabloları inceleyin.
${internalLinksMd(links)}`;
}

function buildSpecGuide(
  catLabel: string,
  products: TemplateProduct[],
  specs: string[],
  links: { label: string; href: string }[]
): string {
  const specSections = specs
    .map(
      (s) => `### ${s}

${s} değeri, ${catLabel.toLocaleLowerCase("tr")} performansını doğrudan etkiler. Yüksek değer her zaman daha iyi anlamına gelmez; kullanım senaryonuza göre dengeli bir seçim yapın.`
    )
    .join("\n\n");

  return `## ${catLabel} Teknik Terimleri

${catLabel} kutusunun üzerindeki rakamlar kafa karıştırıcı olabilir. Bu rehberde en önemli teknik değerleri tek tek açıklıyoruz.

${specSections}

## Örnek Modeller Üzerinde Karşılaştırma

${productListMd(products)}

## Sonuç

Teknik değerleri anlamak, pahalı bir modelin gerçekten size uygun olup olmadığını görmenizi sağlar. Ürün sayfalarındaki spesifikasyon tablolarını bu rehberle birlikte okuyun.
${internalLinksMd(links)}`;
}

function buildBuyersGuide(
  catLabel: string,
  products: TemplateProduct[],
  specs: string[],
  links: { label: string; href: string }[]
): string {
  return `## 1. İhtiyacınızı Belirleyin

${catLabel} satın almadan önce kendinize sorun: Ne sıklıkta kullanacağım? Hangi malzemelerle çalışacağım? Taşınabilirlik benim için önemli mi?

## 2. Önemli Teknik Kriterler

Aşağıdaki değerler modeller arası farkı belirler:

${specs.map((s) => `- **${s}**`).join("\n")}

## 3. Bütçe ve Marka Dengesi

Bilinen markalar (servis ağı ve yedek parça avantajı) ile ekonomik alternatifler arasında, kullanım yoğunluğunuza göre karar verin. Az kullanacaksanız ekonomik model; yoğun kullanım için marka ve garanti önceliklidir.

## 4. Öne Çıkan Modeller

${productListMd(products)}

## Sonuç

Doğru ${catLabel.toLocaleLowerCase("tr")}, "en pahalı" değil "ihtiyacınıza en uygun" olandır. Yukarıdaki adımları izleyerek bütçenizi boşa harcamadan doğru modeli seçebilirsiniz.
${internalLinksMd(links)}`;
}
