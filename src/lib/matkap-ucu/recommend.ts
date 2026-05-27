/**
 * Matkap ucu önerisi — eğitim / yönlendirme amaçlı MVP mantığı.
 * Gerçek iş güvenliği ve üretici datasheet'leri her zaman önceliklidir.
 */

export type Malzeme = "ahsap" | "metal_yumusak" | "metal_sert" | "beton_tas" | "plastik";
export type Kullanim = "delik_acma" | "sabitleme_ongesi" | "genis_acma";

export interface OneriGirdi {
  malzeme: Malzeme;
  kullanim: Kullanim;
  darbeliMatkap: boolean;
}

export interface OneriSonuc {
  baslik: string;
  ucAilesi: string;
  malzemeUyumu: string;
  darbeNotu: string;
  ipucu: string[];
}

const MALZEME_LABEL: Record<Malzeme, string> = {
  ahsap: "Ahşap",
  metal_yumusak: "Metal (yumuşak)",
  metal_sert: "Metal (sert / paslanmaz)",
  beton_tas: "Beton / taş / duvar",
  plastik: "Plastik",
};

const KULLANIM_LABEL: Record<Kullanim, string> = {
  delik_acma: "Temiz delik",
  sabitleme_ongesi: "Vida / dübel öncesi pilot",
  genis_acma: "Geniş çap / düşük torklu genişletme",
};

export function oneriMetni(girdi: OneriGirdi): OneriSonuc {
  const { malzeme, kullanim, darbeliMatkap } = girdi;
  const malz = MALZEME_LABEL[malzeme];
  const kul = KULLANIM_LABEL[kullanim];

  let ucAilesi = "HSS (yüksek hız çeliği) spiral";
  let malzemeUyumu = `${malz} için genel amaçlı HSS uç; düşük ilerleme, yağlayıcı kullanın (metal).`;
  let darbeNotu = darbeliMatkap
    ? "Darbeli mod: sadece beton/taş ve özel SDS/masonry uçlar için uygundur."
    : "Döner matkap modu ile daha kontrollü delik ve daha az çatlak riski (ahşap/plastik).";

  const ipucu: string[] = [
    "Uygun kişisel koruyucu donanım (göz, işitme) kullanın.",
    "Çap seçiminde vida/ankraj üreticisinin önerdiği pilot çapa uyun.",
  ];

  if (malzeme === "ahsap" || malzeme === "plastik") {
    ucAilesi = malzeme === "plastik" ? "HSS spiral veya plastik için düşük keskinlikli brad point" : "Brad point (merkez uçlu) veya HSS spiral";
    malzemeUyumu =
      malzeme === "plastik"
        ? `${malz}: düşük devir, hızlı ilerleme yok; erime riskine karşı soğutmayı dengeleyin.`
        : `${malz}: tırnaklı/temiz talaş için brad point; derin delikte ara ara talaş boşaltın.`;
    if (darbeliMatkap) {
      darbeNotu = "Ahşap ve plastikte darbe genelde önerilmez; darbe kapalı kullanın.";
    }
    ipucu.push("Ahşap/plastikte sıcaklık birikimine dikkat; gerekirse hızı düşürün.");
  }

  if (malzeme === "metal_yumusak") {
    ucAilesi = kullanim === "genis_acma" ? "HSS M35 / kobalt alaşımlı veya step drill" : "HSS spiral (118° veya 135°)";

    malzemeUyumu = `${malz}: 118° genel; pas ve sert yüzeyde 135° bölünmüş uç daha stabil başlar.`;
    ipucu.push("Matkaba baskı yerine sabit tork ve yağlayıcı (veya uygun kesme sıvısı) tercih edin.");
  }

  if (malzeme === "metal_sert") {
    ucAilesi = "Kobalt alaşımlı HSS veya karbür kaplamalı (TiAlN vb.)";
    malzemeUyumu = `${malz}: düşük RPM, yüksek basınçlı yağlama; pilot delik ve kademeli çap artışı.`;
    ipucu.push("Karbür uçlar kırılga yakındır; yan eğilme ve çarpma yok.");
  }

  if (malzeme === "beton_tas") {
    ucAilesi = darbeliMatkap ? "SDS-Plus / SDS-Max duvar ucu veya crosses keski uç" : "Karbür uçlu masonry spiral (darbesiz, yavaş)";
    malzemeUyumu = darbeliMatkap
      ? `${malz}: darbeli matkap + SDS ailesi uyumu şart.`
      : `${malz}: darbesiz denemelerde ilerleme yavaş olur; sıva/tuğla için yine masonry uç kullanın.`;
    darbeNotu = darbeliMatkap
      ? "Betonda darbe + doğru uç kombinasyonu üretkenliği artırır."
      : "Darbesiz modda taş/beton çok yavaş ilerler; projeye göre darbeli ve SDS düşünün.";
    ipucu.push("Duvarda kablo tespiti yapın; toz için solunum koruması.");
  }

  if (kullanim === "sabitleme_ongesi") {
    ipucu.unshift("Pilot delik, vida çapının gövde çapına (veya üretici tabloya) göre seçilir.");
  }

  if (kullanim === "genis_acma") {
    if (malzeme === "metal_yumusak" || malzeme === "metal_sert") {
      ucAilesi += " — step drill (konik) veya kademeli delme";
    }
    ipucu.push("Geniş çapta ısı yükselir; ara ara soğumaya izin verin.");
  }

  const baslik = `${malz} · ${kul}`;

  return {
    baslik,
    ucAilesi,
    malzemeUyumu,
    darbeNotu,
    ipucu,
  };
}
