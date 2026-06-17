/**
 * AI adım-adım rehber + maliyet tahmini (Feature 6).
 *
 * proje-sihirbazi kategorilerinden (project-kit/rules) hangi senaryoya
 * girdiğini saptar ve kural tabanlı, belgeli bir "nasıl yapılır" rehberi üretir.
 * OpenAI anahtarı yoksa bu motor tek başına çalışır; API route AI ile zenginleştirebilir.
 */

import { ruleScenarios } from "@/lib/project-kit/rules";
import { parsePriceRange } from "@/lib/pricing";
import type { SavedProjectItem } from "./store";

export interface GuideStep {
  baslik: string;
  detay: string;
}

export interface ProjectGuide {
  baslik: string;
  ozet: string;
  adimlar: GuideStep[];
  ipuclari: string[];
  // Maliyet tahmini (katalog fiyatlarından).
  maliyet: {
    altLimit: number;
    ustLimit: number;
    orta: number;
    kalemSayisi: number;
    fiyatliKalem: number; // fiyatı bilinen kalem sayısı
  };
}

// Senaryo başlığına göre adım şablonu (kural tabanlı).
const STEP_TEMPLATES: Record<string, { adimlar: GuideStep[]; ipuclari: string[] }> = {
  "Fayans / Seramik Değişimi": {
    adimlar: [
      { baslik: "Hazırlık ve söküm", detay: "Su ve elektriği kapatın. Eski fayans/derzleri avuç taşlama ve keski ile sökün; zemini macun/harç kalıntılarından temizleyin." },
      { baslik: "Zemin hazırlığı", detay: "Yüzeyi düzleştirin, gerekiyorsa tesviye şapı çekin. Su terazisi/lazer terazisi ile referans çizgisi alın." },
      { baslik: "Yapıştırıcı ve döşeme", detay: "Seramik yapıştırıcısını darbeli matkap + karıştırıcı ile hazırlayın, tarakla sürün. Fayansları çıtalarla aralıklı döşeyin." },
      { baslik: "Kesim ve köşeler", detay: "Kenar ve köşelerde fayansları elmas disk/su soğutmalı kesici ile boyutlandırın." },
      { baslik: "Derz ve bitiş", detay: "24 saat sonra derz dolgusunu uygulayın, fazlasını silin. Köşe ve birleşimleri silikonla yalıtın." },
    ],
    ipuclari: [
      "Aynı lot numaralı fayans alın; ton farkı olmaması için.",
      "İlk sıra teraziyi tutmazsa tüm döşeme kayar — referansa zaman ayırın.",
    ],
  },
  "Duvar Boyama / Badana": {
    adimlar: [
      { baslik: "Yüzey hazırlığı", detay: "Eski dökük boyayı kazıyın, çatlak ve delikleri macunla doldurun. Kuruyunca eksantrik zımpara ile düzleştirin." },
      { baslik: "Maskeleme ve koruma", detay: "Priz, süpürgelik ve pencere kenarlarını maskeleme bandıyla koruyun; zemini örtün." },
      { baslik: "Astar", detay: "Emici yüzeylerde bir kat astar sürün; boya tüketimini düşürür ve tutunmayı artırır." },
      { baslik: "Boyama", detay: "Rulo ile en az iki kat uygulayın. Katlar arası min. 4 saat kuruma bekleyin." },
      { baslik: "Bitiş kontrolü", detay: "Kenar geçişlerini fırça ile düzeltin, maskeleme bandını boya yaşken sökün." },
    ],
    ipuclari: [
      "Tavandan başlayıp duvara inin; damlamalar üst üste gelmez.",
      "Pürüzlü yüzey daha çok boya çeker — astar bunu azaltır.",
    ],
  },
  "Elektrik Tesisat İşi": {
    adimlar: [
      { baslik: "Enerjiyi kesin", detay: "İlgili sigortayı kapatın ve faz algılayıcı ile hattın ölü olduğunu DOĞRULAYIN. Bu adım atlanamaz." },
      { baslik: "Kanal açma", detay: "Kablo güzergâhını işaretleyin, kanal açma makinesiyle duvarda yiv açın." },
      { baslik: "Kablolama", detay: "Uygun kesitte kabloyu çekin, uçları kablo soyucu ile hazırlayın." },
      { baslik: "Montaj", detay: "Priz/anahtar kasalarını yerleştirin, bağlantıları VDE izoleli tornavida ile yapın." },
      { baslik: "Test ve kapatma", detay: "Multimetre ile süreklilik/voltaj ölçün, kanalları sıva ile kapatın, enerji verip test edin." },
    ],
    ipuclari: [
      "Tereddütteyseniz yetkili elektrik ustasıyla çalışın; elektrik işi hayati risk taşır.",
      "Faz-nötr-toprak renk standardına uyun (kahve/mavi/sarı-yeşil).",
    ],
  },
  "Su Tesisatı / Musluk Değişimi": {
    adimlar: [
      { baslik: "Suyu kapatın", detay: "Ana vanayı veya ilgili ara musluğu kapatın; hattaki basıncı musluğu açarak boşaltın." },
      { baslik: "Söküm", detay: "Eski bataryayı/musluğu boru anahtarı ve tesisat pensesi ile sökün; eski conta ve teflonu temizleyin." },
      { baslik: "Hazırlık", detay: "Gerekirse boruyu boru kesici ile boyutlandırın; PPRC ise lehim makinesiyle ekleme yapın." },
      { baslik: "Montaj", detay: "Diş bağlantılara teflon/keten sarın, yeni armatürü sıkın (aşırı sıkmayın, conta ezilir)." },
      { baslik: "Sızdırmazlık testi", detay: "Suyu yavaşça açın, tüm birleşimleri kontrol edin; gerekirse köşeleri silikonla yalıtın." },
    ],
    ipuclari: [
      "Plastik gövdeli armatürlerde metal anahtarı zorlamayın; çatlatır.",
      "Sızıntı varsa contayı kontrol edin, daha çok sıkmak çoğu zaman çözmez.",
    ],
  },
  "Mobilya / Raf Montajı": {
    adimlar: [
      { baslik: "Ölçü ve işaretleme", detay: "Montaj yüksekliğini belirleyin, su terazisi ile yatay çizgi çekin, delik noktalarını işaretleyin." },
      { baslik: "Duvar tipini saptayın", detay: "Beton, gazbeton veya alçıpan oluşuna göre dübel seçin (vida-dübel aracımıza bakın)." },
      { baslik: "Delme", detay: "Doğru matkap ucuyla pilot/dübel deliği açın; alçıpanda kelebek dübel kullanın." },
      { baslik: "Montaj", detay: "Dübelleri çakın, parçayı vidalama ile sabitleyin. Çok ağır raflarda iki kişi çalışın." },
      { baslik: "Kontrol", detay: "Terazi ve sağlamlığı kontrol edin; yük bindirmeden önce vidaları bir tur daha sıkın." },
    ],
    ipuclari: [
      "Alçıpanda ağır yük için profil/kadronun yerini bulun; düz alçıya ağır raf asılmaz.",
      "Pilot delik vidanın çatlatmasını önler, özellikle sunta/MDF'de.",
    ],
  },
  "Kaynak / Metal İşi": {
    adimlar: [
      { baslik: "Hazırlık ve güvenlik", detay: "Çalışma alanını yanıcılardan arındırın. Kaynak maskesi, eldiven ve deri önlük giyin." },
      { baslik: "Kesim ve uyum", detay: "Profilleri avuç taşlama + kesme diski ile boyutlandırın, birleşim yüzeylerini temizleyin." },
      { baslik: "Puntalama", detay: "Parçaları gönyesinde sabitleyip birkaç noktadan puntalayın; gönyeyi kontrol edin." },
      { baslik: "Dikiş çekme", detay: "Uygun amperde elektrotla dikişi tamamlayın; cürufu temizleyin." },
      { baslik: "Çapak alma ve bitiş", detay: "Taşlama ile çapakları alın, gerekiyorsa astar/boya uygulayın." },
    ],
    ipuclari: [
      "Elektrot kalınlığı ve amperi malzeme kalınlığına göre seçin (1 mm ≈ 40 A).",
      "Ark ışığı cilde de zarar verir; kolları kapalı tutun.",
    ],
  },
  "Bahçe / Peyzaj Bakımı": {
    adimlar: [
      { baslik: "Alan kontrolü", detay: "Taş, tel ve gizli engelleri temizleyin; uçan parça riskini azaltın." },
      { baslik: "Koruyucu ekipman", detay: "Koruyucu gözlük ve kulak koruyucu takın; uzun pantolon/bot giyin." },
      { baslik: "Biçme/budama", detay: "Motorlu tırpan veya çim biçme ile kademeli ilerleyin; çalıları budama makasıyla şekillendirin." },
      { baslik: "Toplama", detay: "Kesilen otları toplayın; kompost veya atık olarak ayırın." },
      { baslik: "Bakım", detay: "Makine bıçaklarını temizleyin, yağ/yakıt seviyesini kontrol edin." },
    ],
    ipuclari: [
      "Çimi çok kısa biçmeyin; kök stresi sararmaya yol açar.",
      "Sabah çiy kalkınca biçin; ıslak çim makineyi tıkar.",
    ],
  },
  "Beton / Kırım İşi": {
    adimlar: [
      { baslik: "Güvenlik ve tespit", detay: "Kırılacak bölgede elektrik/su hattı OLMADIĞINI doğrulayın (kablo bulucu). Toz maskesi, gözlük, kulak koruyucu takın." },
      { baslik: "İşaretleme", detay: "Kesilecek/kırılacak hattı işaretleyin; taşıyıcı duvarlara dokunmayın." },
      { baslik: "Delme/kırma", detay: "Hilti (kırıcı-delici) ve uygun SDS uç/keski ile kademeli ilerleyin; aleti zorlamayın." },
      { baslik: "Moloz yönetimi", detay: "Molozu güvenli şekilde toplayın; ağır parçaları tek başınıza kaldırmayın." },
      { baslik: "Bitiş", detay: "Yüzeyi temizleyin, gerekiyorsa tamir harcı ile düzeltin." },
    ],
    ipuclari: [
      "Taşıyıcı kolon/kiriş kesinlikle kırılmaz — emin değilseniz mühendise sorun.",
      "Sürekli kırımda aleti dinlendirin; aşırı ısınma motoru yakar.",
    ],
  },
};

const FALLBACK_GUIDE = {
  adimlar: [
    { baslik: "Planlama", detay: "Yapılacak işi adımlara bölün, gerekli alet ve malzemeleri önceden hazırlayın." },
    { baslik: "Güvenlik", detay: "İşe uygun koruyucu ekipmanı (gözlük, eldiven, maske) kullanın; çalışma alanını düzenleyin." },
    { baslik: "Uygulama", detay: "İşi kademeli ve ölçülü ilerletin; ölçüm aletleriyle kontrol ederek devam edin." },
    { baslik: "Kontrol ve bitiş", detay: "Sonucu kontrol edin, artıkları temizleyin, aletleri bakımlı şekilde kaldırın." },
  ],
  ipuclari: [
    "İş tarifini detaylandırırsanız daha isabetli adımlar üretilir.",
    "Emin olmadığınız teknik işlerde uzman desteği alın.",
  ],
};

function normalize(s: string): string {
  return s.toLocaleLowerCase("tr").trim();
}

/** İş tarifi + kit başlığından senaryo şablonunu seçer. */
function matchScenario(description: string, baslik?: string): string | null {
  if (baslik && STEP_TEMPLATES[baslik]) return baslik;
  const text = normalize(description);
  let best: { title: string; hits: number } | null = null;
  for (const sc of ruleScenarios()) {
    const hits = sc.keywords.filter((k) => text.includes(normalize(k))).length;
    if (hits > 0 && (!best || hits > best.hits)) best = { title: sc.baslik, hits };
  }
  return best?.title || null;
}

/** Katalog kalemlerinden tahmini maliyet aralığı çıkar. */
export function estimateCost(items: SavedProjectItem[]): ProjectGuide["maliyet"] {
  let altLimit = 0;
  let ustLimit = 0;
  let fiyatliKalem = 0;
  for (const it of items) {
    const p = parsePriceRange(it.priceRange);
    if (p) {
      altLimit += p.min;
      ustLimit += p.max;
      fiyatliKalem++;
    }
  }
  return {
    altLimit,
    ustLimit,
    orta: Math.round((altLimit + ustLimit) / 2),
    kalemSayisi: items.length,
    fiyatliKalem,
  };
}

/** Kural tabanlı rehber üretimi — AI gerektirmez. */
export function buildGuideRuleBased(
  description: string,
  items: SavedProjectItem[],
  baslik?: string
): ProjectGuide {
  const scenarioTitle = matchScenario(description, baslik);
  const tpl = scenarioTitle ? STEP_TEMPLATES[scenarioTitle] : null;
  const title = scenarioTitle || baslik || "Proje Rehberi";
  return {
    baslik: title,
    ozet: tpl
      ? `${title} için adım-adım uygulama rehberi ve katalog fiyatlarına göre tahmini maliyet.`
      : "Genel uygulama rehberi. İş tarifini detaylandırırsanız daha hedefli adımlar üretilir.",
    adimlar: tpl?.adimlar || FALLBACK_GUIDE.adimlar,
    ipuclari: tpl?.ipuclari || FALLBACK_GUIDE.ipuclari,
    maliyet: estimateCost(items),
  };
}
