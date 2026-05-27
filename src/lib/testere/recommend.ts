export type KesimMalzemesi = "ahsap-yumusak" | "ahsap-sert" | "mdf-sunta" | "metal-yumusak" | "metal-sert" | "plastik" | "beton-tugla";
export type TestereAmaci = "duz-kesim" | "egri-kesim" | "budama" | "yikim" | "hassas-marangoz";
export type OrtamTipi = "atolye" | "santiye" | "hobi";

export interface TestereGirdi {
  malzeme: KesimMalzemesi;
  amac: TestereAmaci;
  ortam: OrtamTipi;
  kablosuz: boolean;
}

export interface TestereSonuc {
  baslik: string;
  makineTipi: string;
  bicakOnerisi: string;
  disDetayi: string;
  malzemeNotu: string;
  ipucu: string[];
}

const MALZEME_LABEL: Record<KesimMalzemesi, string> = {
  "ahsap-yumusak": "Yumuşak ahşap (çam, ladin)",
  "ahsap-sert": "Sert ahşap (meşe, kayın, ceviz)",
  "mdf-sunta": "MDF / Sunta / Laminat",
  "metal-yumusak": "Metal (alüminyum, bakır)",
  "metal-sert": "Metal (çelik, paslanmaz)",
  plastik: "Plastik / PVC",
  "beton-tugla": "Beton / Tuğla (elmas disk)",
};

const AMAC_LABEL: Record<TestereAmaci, string> = {
  "duz-kesim": "Düz kesim",
  "egri-kesim": "Eğri / profil kesim",
  budama: "Budama / dal kesim",
  yikim: "Yıkım / söküm",
  "hassas-marangoz": "Hassas marangoz kesimi",
};

export function testereOner(girdi: TestereGirdi): TestereSonuc {
  const { malzeme, amac, ortam, kablosuz } = girdi;
  const malzLabel = MALZEME_LABEL[malzeme];
  const amacLabel = AMAC_LABEL[amac];

  let makineTipi = "Daire testere";
  let bicakOnerisi = "Karbür uçlu ATB diş, 24-40 diş";
  let disDetayi = "Genel amaçlı ATB (Alternate Top Bevel) dizilim";
  let malzemeNotu = `${malzLabel} için standart karbür bıçak yeterli.`;
  const ipucu: string[] = [
    "Kesim öncesi iş parçasını sabitleyin.",
    "Koruyucu gözlük ve kulaklık kullanın.",
  ];

  // Makine tipi belirleme
  if (amac === "egri-kesim") {
    makineTipi = "Dekupaj testere";
    bicakOnerisi = "T-sap, ince diş (10+ TPI)";
    disDetayi = "İnce diş aralığı eğri kesimde kontrolü artırır";
  } else if (amac === "budama") {
    makineTipi = kablosuz ? "Akülü zincirli testere (mini)" : "Zincirli testere";
    bicakOnerisi = "Düşük profil zincir, güvenlik freni olan model";
    disDetayi = "3/8\" LP adım, yeşil/taze ağaç için optimum";
    ipucu.push("Zincir gerginliğini her kullanım öncesi kontrol edin.");
  } else if (amac === "yikim") {
    makineTipi = "Tilki kuyruğu (panter testere)";
    bicakOnerisi = "Bi-metal, kaba diş (6-10 TPI), 200mm+ boy";
    disDetayi = "Yıkımda çivi ve ahşap karışık kesilir; bi-metal şart";
    ipucu.push("Tilki kuyruğunda bıçak sıkışmaması için açılı basın.");
  } else if (amac === "hassas-marangoz") {
    makineTipi = ortam === "atolye" ? "Tezgah tipi daire testere (gönye)" : "Daire testere + kılavuz ray";
    bicakOnerisi = "80+ diş, ince kesim karbür (kerf < 2.5mm)";
    disDetayi = "Yüksek diş sayısı = temiz yüzey, yavaş ilerleme";
    ipucu.push("Hassas kesimde ilerleme hızını düşürün, zorlamayın.");
  } else if (amac === "duz-kesim") {
    makineTipi = kablosuz ? "Akülü daire testere (18V/36V)" : "Daire testere";
  }

  // Malzeme bazlı ayar
  if (malzeme === "metal-yumusak") {
    bicakOnerisi = amac === "egri-kesim"
      ? "HSS dekupaj bıçağı, metal için (18-24 TPI)"
      : "Karbür daire bıçak, negatif açı, 48+ diş";
    disDetayi = "Metal kesimde negatif diş açısı yakalama riskini azaltır";
    malzemeNotu = "Alüminyum/bakır: yağlayıcı (WD-40) ile kesim kalitesi artar. Devir düşük tutun.";
    ipucu.push("Metal talaşları sıcaktır, eldiven kullanın.");
  } else if (malzeme === "metal-sert") {
    bicakOnerisi = amac === "yikim"
      ? "Bi-metal tilki kuyruğu bıçağı, 18 TPI"
      : "Karbür veya Cermet daire bıçak, 60+ diş, soğutmalı";
    disDetayi = "Sert metalde düşük devir + soğutma şart; karbür kırılgan, yan kuvvet yok";
    malzemeNotu = "Paslanmaz / sert çelik: iş sertleşmesine karşı durmadan kesin, geri-ileri yapmayın.";
    makineTipi = amac === "egri-kesim" ? "Dekupaj (metal bıçakla, düşük strok)" : makineTipi;
    ipucu.push("İş sertleşmesi: aynı yere tekrar tekrar basmayın.");
  } else if (malzeme === "mdf-sunta") {
    bicakOnerisi = "Karbür ATB, 60+ diş, ince kerf";
    disDetayi = "MDF/laminatta yüksek diş = tırnaksız temiz kenar";
    malzemeNotu = "MDF tozu sağlığa zararlı; toz maskesi + vakumlu kesim sistemi kullanın.";
    ipucu.push("MDF tozunu solumayın — FFP2 maske zorunlu.");
  } else if (malzeme === "plastik") {
    bicakOnerisi = "Sıfır veya negatif açılı, 60+ diş, ince kerf";
    disDetayi = "Plastik erir; yüksek diş + düşük devir = temiz kesim";
    malzemeNotu = "PVC/akrilikte devir düşük, ilerleme sabit olmalı; erime noktasına dikkat.";
  } else if (malzeme === "beton-tugla") {
    makineTipi = "Taş kesme makinesi / büyük avuç taşlama";
    bicakOnerisi = "Elmas segmentli disk (sürekli kenar: fayans / segmentli: beton)";
    disDetayi = "Elmas diskler ıslak veya kuru kesim tipine göre seçilir";
    malzemeNotu = "Beton/tuğlada su ile soğutma disk ömrünü 3-5x uzatır.";
    ipucu.push("Elmas diski yan kuvvetle zorlamayın — çatlayabilir.");
  } else if (malzeme === "ahsap-sert") {
    bicakOnerisi = amac === "hassas-marangoz" ? "80+ diş, ATB/R veya Hi-ATB" : "Karbür ATB, 40-60 diş";
    malzemeNotu = "Sert ahşapta (meşe, ceviz) düşük ilerleme + keskin bıçak = yanık izi yok.";
    ipucu.push("Yanık izi görürseniz bıçak körelmiş veya ilerleme çok yavaş.");
  }

  // Kablosuz not
  if (kablosuz) {
    ipucu.push("Akülü modelde tam şarj ile başlayın; düşük şarjda tork kaybı olur.");
  }

  return {
    baslik: `${malzLabel} · ${amacLabel}`,
    makineTipi,
    bicakOnerisi,
    disDetayi,
    malzemeNotu,
    ipucu,
  };
}
