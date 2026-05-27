"use server";

import OpenAI from "openai";
import type { Product, ProductCategory } from "./types";
import { randomUUID } from "crypto";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function fetchProductSpecsWithAI(
  brand: string,
  model: string,
  category: ProductCategory
): Promise<Product> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Sen bir endüstriyel alet uzmanısın. Verilen marka ve model için HALKA AÇIK teknik spesifikasyonları döndür.

KURALLAR:
- Sadece üretici web sitesinde veya resmi katalogda yayınlanan bilgileri kullan
- Emin olmadığın değerleri "Belirtilmemiş" yaz
- Fiyat tahmini için Türkiye piyasası aralığı ver
- JSON formatında döndür, markdown code block KULLANMA

Format:
{"specs":{"Watt":"750W","Devir":"0-3000 rpm","Tork":"...","Ağırlık":"...","Mandren":"...","Özellikler":"..."},"priceRange":"₺2000-3000","sourceNote":"Üretici kataloğundan alınmıştır"}

Kategoriye göre uygun spec alanları seç:
- Matkap: Watt, Devir, Tork, Mandren, Ağırlık, Darbe sayısı
- Vidalama: Voltaj, Tork (yumuşak/sert), Devir, Mandren, Ağırlık, Akü kapasitesi
- Hilti/Kırıcı: Watt, Darbe gücü (J), Devir, Darbe sayısı, Maks delme çapı, Ağırlık
- Daire testere: Watt, Devir, Bıçak çapı, Kesim derinliği (90°/45°), Ağırlık
- Dekupaj: Watt, Strok, Devir, Ağırlık
- Tilki kuyruğu: Watt, Strok, Devir, Ağırlık
- Zincirli testere: Watt/cc, Kılavuz uzunluğu, Zincir hızı, Ağırlık, Yakıt tipi
- Taşlama: Watt, Devir, Disk çapı, Ağırlık
- Zımpara (eksantrik/titreşimli/bant): Watt, Devir/Titreşim, Zımpara boyutu, Ağırlık
- Freze: Watt, Devir, Pens çapı, Kesim derinliği, Ağırlık
- Planya: Watt, Devir, Planya genişliği, Talaş derinliği, Ağırlık
- Sıcak hava tabancası: Watt, Sıcaklık aralığı, Hava debisi, Ağırlık
- Kaynak (inverter): Kaynak akımı, Görev döngüsü, Elektrot aralığı, Ağırlık, Voltaj
- Kaynak (MIG/MAG): Kaynak akımı, Tel besleme hızı, Görev döngüsü, Gaz tipi, Ağırlık
- Kompresör: Güç (HP), Tank kapasitesi, Hava debisi (l/dk), Basınç (bar), Ağırlık
- Basınçlı yıkama: Basınç (bar), Debi (l/saat), Watt, Ağırlık
- Jeneratör: Güç (kW/kVA), Yakıt tipi, Tank kapasitesi, Çalışma süresi, Ağırlık, Çıkış tipi
- Lazer metre: Menzil, Doğruluk, Bluetooth, Ekran, IP koruma
- Lazer terazisi: Çizgi sayısı, Menzil, Doğruluk, Renk (kırmızı/yeşil), IP koruma
- Multimetre: DC/AC voltaj, Akım, Direnç, True RMS, CAT sınıfı
- Tornavida seti: Parça sayısı, Uç tipleri, Sap malzemesi, VDE izolasyon
- Pense/Kerpeten: Boy, Çene kapasitesi, Malzeme, VDE izolasyon
- Anahtar seti: Parça sayısı, Numara aralığı, Tip (kombine/açık/yıldız)
- Lokma takımı: Parça sayısı, Geçme kare, Numara aralığı
- Tırpan: Motor gücü (cc/Watt), Kesim genişliği, Yakıt tipi, Ağırlık
- Çim biçme: Kesim genişliği, Güç, Çim toplama kapasitesi, Ağırlık
- Budama makası: Kesim çapı, Tip (bypass/anvil), Malzeme, Ağırlık
- Merdiven: Yükseklik, Basamak sayısı, Malzeme, Maks yük, Ağırlık
- Boru kesici: Kesim kapasitesi, Malzeme uyumu, Ağırlık
- Kulak koruyucu: NRR/SNR değeri, Ağırlık, Elektronik özellik
- Koruyucu gözlük: UV koruma, Buğu önleme, EN sertifika
- Silikon: Tip (asetik/nötr), Renk, Isı dayanımı, Esneklik
- Montaj köpüğü: Verim (litre), Genleşme oranı, Yangın sınıfı
- Yapıştırıcı: Tip (PU/MS/akril), Yapışma kuvveti, İç/dış mekan
Genel: en az 5 teknik özellik döndür.`,
      },
      {
        role: "user",
        content: `Marka: ${brand}\nModel: ${model}\nKategori: ${category}\n\nBu ürünün teknik spec'lerini döndür.`,
      },
    ],
    temperature: 0.3,
  });

  const text = completion.choices[0].message.content || "{}";
  const clean = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

  let parsed: any = {};
  try {
    parsed = JSON.parse(clean);
  } catch {
    parsed = { specs: {} };
  }

  return {
    id: randomUUID(),
    brand,
    model,
    category,
    specs: parsed.specs || {},
    priceRange: parsed.priceRange || undefined,
    createdAt: new Date().toISOString(),
  };
}

export async function generateComparisonContent(a: Product, b: Product): Promise<{ content: string; verdict: string }> {
  const specsA = Object.entries(a.specs).map(([k, v]) => `${k}: ${v}`).join("\n");
  const specsB = Object.entries(b.specs).map(([k, v]) => `${k}: ${v}`).join("\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Sen hirdavatpro.com'un editörüsün. İki endüstriyel alet/ürünü karşılaştıran SEO-uyumlu, tarafsız ve teknik bir yazı yaz.

KURALLAR:
- Türkçe yaz
- 600-800 kelime
- ## alt başlıklar kullan
- Spec tablosu ekle (markdown table)
- Hangi kullanıcıya hangisi uygun, net söyle
- "Bu bağımsız bir karşılaştırmadır" disclaimer'ı ekle
- Tarafsız ol — birini karalama, ikisinin de güçlü/zayıf yanlarını belirt
- Son paragrafta kısa bir "Sonuç" ver

Ayrıca 1 cümlelik bir "verdict" (karar özeti) döndür.

JSON formatında döndür (markdown code block KULLANMA):
{"content":"...markdown article...","verdict":"...1 cümle..."}`,
      },
      {
        role: "user",
        content: `ÜRÜN A: ${a.brand} ${a.model} (${a.category})\nSpecs:\n${specsA}\nFiyat: ${a.priceRange || "Belirtilmemiş"}\n\nÜRÜN B: ${b.brand} ${b.model} (${b.category})\nSpecs:\n${specsB}\nFiyat: ${b.priceRange || "Belirtilmemiş"}`,
      },
    ],
    temperature: 0.6,
  });

  const text = completion.choices[0].message.content || "{}";
  const clean = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

  try {
    const parsed = JSON.parse(clean);
    return { content: parsed.content || "", verdict: parsed.verdict || "" };
  } catch {
    return { content: text, verdict: "" };
  }
}

export async function bulkFetchProducts(
  items: { brand: string; model: string; category: ProductCategory }[]
): Promise<Product[]> {
  const results: Product[] = [];
  for (const item of items) {
    const product = await fetchProductSpecsWithAI(item.brand, item.model, item.category);
    results.push(product);
  }
  return results;
}
