export type YuzeyTipi =
  | "duz-siva"
  | "kaba-siva"
  | "alcipan"
  | "ahsap"
  | "metal"
  | "tugla";

export type BoyaTuru = "ic-cephe" | "dis-cephe" | "tavan";

export interface BoyaGirdi {
  en: number;        // metre
  boy: number;       // metre
  yukseklik: number; // metre
  katSayisi: 1 | 2 | 3;
  yuzeyTipi: YuzeyTipi;
  boyaTuru: BoyaTuru;
  tavanDahil: boolean;
  kapiSayisi: number;
  pencereSayisi: number;
}

export interface KutuOneri {
  boyut: string;
  adet: number;
  toplamLitre: number;
}

export interface BoyaSonuc {
  brutAlan: number;        // m²
  dusumAlan: number;       // m² (kapı+pencere)
  netAlan: number;         // m²
  teorikMiktar: number;    // litre
  onerilenMiktar: number;  // litre (israf payı dahil)
  kutular: KutuOneri[];
  yaymaSurati: number;     // m²/L
  uygulamaNotu: string;
  dikkat: string[];
}

const YAYMA_SURATI: Record<YuzeyTipi, number> = {
  "duz-siva": 11,
  "kaba-siva": 7,
  "alcipan": 10,
  "ahsap": 10,
  "metal": 13,
  "tugla": 6,
};

const YUZEY_LABEL: Record<YuzeyTipi, string> = {
  "duz-siva": "Düz sıva",
  "kaba-siva": "Kaba / pürüzlü sıva",
  "alcipan": "Alçıpan",
  "ahsap": "Ahşap",
  "metal": "Metal",
  "tugla": "Tuğla / briket",
};

const KAPI_ALAN = 1.8;    // m² per door
const PENCERE_ALAN = 1.5; // m² per window

const CAN_SIZES = [15, 10, 5, 2.5, 0.75];

function optimalKutular(litre: number): KutuOneri[] {
  const result: KutuOneri[] = [];
  let remaining = litre;

  for (const boyut of CAN_SIZES) {
    if (remaining <= 0) break;
    const adet = Math.floor(remaining / boyut);
    if (adet > 0) {
      result.push({ boyut: `${boyut} L`, adet, toplamLitre: adet * boyut });
      remaining -= adet * boyut;
    }
  }
  // Round up remainder to smallest can
  if (remaining > 0.01) {
    const smallest = CAN_SIZES[CAN_SIZES.length - 1];
    result.push({ boyut: `${smallest} L`, adet: 1, toplamLitre: smallest });
  }
  return result;
}

export function boyaHesapla(girdi: BoyaGirdi): BoyaSonuc {
  const { en, boy, yukseklik, katSayisi, yuzeyTipi, boyaTuru, tavanDahil, kapiSayisi, pencereSayisi } = girdi;

  const cevreBoyasi = 2 * (en + boy) * yukseklik;
  const tavanAlani = tavanDahil ? en * boy : 0;
  const brutAlan = cevreBoyasi + tavanAlani;

  const dusumAlan = kapiSayisi * KAPI_ALAN + pencereSayisi * PENCERE_ALAN;
  const netAlan = Math.max(0, brutAlan - dusumAlan) * katSayisi;

  const yaymaSurati = YAYMA_SURATI[yuzeyTipi];
  const teorikMiktar = netAlan / yaymaSurati;

  // 15% waste margin
  const onerilenMiktar = Math.ceil(teorikMiktar * 1.15 * 10) / 10;
  const kutular = optimalKutular(onerilenMiktar);

  const yuzeyLabel = YUZEY_LABEL[yuzeyTipi];
  const uygulamaNotu =
    boyaTuru === "dis-cephe"
      ? `${yuzeyLabel} yüzey için dış cephe boyası kullanın. Uygulama öncesi yüzeyi temizleyin ve astar sürün. Sıcaklık +5°C ile +35°C arasındayken uygulayın.`
      : boyaTuru === "tavan"
      ? `Tavan boyasında ${yuzeyLabel} yüzey için rulo yeterlidir. Başlamadan önce bir kat tavan astara sürin.`
      : `${yuzeyLabel} yüzey için iç cephe boyası veya silikonlu boya tercih edin. Nemli ortamlarda su bazlı silikonlu boya seçin.`;

  const dikkat: string[] = [
    "Teorik miktar hesaplamadır; gerçek tüketim yüzey koşuluna ve uygulama tekniğine göre değişir.",
  ];

  if (yuzeyTipi === "tugla" || yuzeyTipi === "kaba-siva") {
    dikkat.push("Pürüzlü yüzeyler daha fazla boya çeker. Astar katı fazla miktarı düşürür.");
  }
  if (katSayisi >= 2) {
    dikkat.push("Katlar arası kuruma süresine (min. 4 saat) dikkat edin.");
  }
  if (boyaTuru === "dis-cephe") {
    dikkat.push("Yağmur ve don beklenen günlerde uygulama yapmayın.");
  }

  return {
    brutAlan: Math.round(brutAlan * 10) / 10,
    dusumAlan: Math.round(dusumAlan * 10) / 10,
    netAlan: Math.round(netAlan * 10) / 10,
    teorikMiktar: Math.round(teorikMiktar * 10) / 10,
    onerilenMiktar,
    kutular,
    yaymaSurati,
    uygulamaNotu,
    dikkat,
  };
}
