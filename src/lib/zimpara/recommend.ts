export type IslemTipi =
  | "kaba-zimpara"
  | "pürüz-giderme"
  | "boya-oncesi"
  | "cila-oncesi"
  | "pas-giderme"
  | "kaynak-temizlik";

export type ZimparaMalzeme =
  | "ahsap-ham"
  | "ahsap-boyali"
  | "metal-celik"
  | "metal-aluminyum"
  | "boya-astar"
  | "plastik"
  | "beton-sivi";

export type ZimparaArac = "el" | "titresimli" | "disk" | "bant";

export interface ZimparaGirdi {
  malzeme: ZimparaMalzeme;
  islem: IslemTipi;
  arac: ZimparaArac;
}

export interface ZimparaSonuc {
  baslik: string;
  gritSirasi: string[];
  zimparaCinsi: string;
  baslangicGrit: string;
  bitirisGrit: string;
  uygulama: string;
  dikkat: string[];
}

const MALZEME_LABEL: Record<ZimparaMalzeme, string> = {
  "ahsap-ham": "Ham ahşap",
  "ahsap-boyali": "Boyalı / lakeli ahşap",
  "metal-celik": "Çelik / demir",
  "metal-aluminyum": "Alüminyum",
  "boya-astar": "Boya / astar katı",
  plastik: "Plastik / ABS",
  "beton-sivi": "Beton / şap (ıslak/kuru)",
};

const ISLEM_LABEL: Record<IslemTipi, string> = {
  "kaba-zimpara": "Kaba zımpara (malzeme alma)",
  "pürüz-giderme": "Pürüz giderme / düzeltme",
  "boya-oncesi": "Boya öncesi hazırlık",
  "cila-oncesi": "Cila / vernik öncesi",
  "pas-giderme": "Pas / korozyon temizliği",
  "kaynak-temizlik": "Kaynak izi / çapak temizliği",
};

export function zimparaOner(girdi: ZimparaGirdi): ZimparaSonuc {
  const { malzeme, islem, arac } = girdi;

  const baslik = `${MALZEME_LABEL[malzeme]} · ${ISLEM_LABEL[islem]}`;
  let gritSirasi: string[] = [];
  let zimparaCinsi = "Alüminyum oksit";
  let baslangicGrit = "80";
  let bitirisGrit = "220";
  let uygulama = "";
  const dikkat: string[] = [
    "Her aşamada önceki grit'in izlerini tamamen kaldırdıktan sonra bir üst grit'e geçin.",
    "Zımparalama sonrası yüzeyi temizleyin (basınçlı hava veya toz bezi).",
  ];

  // Ahşap
  if (malzeme === "ahsap-ham") {
    if (islem === "kaba-zimpara") {
      gritSirasi = ["40", "60", "80"];
      baslangicGrit = "40"; bitirisGrit = "80";
      uygulama = "Düzeltme ve malzeme alma işleminde ilerleme yönünde (liflere paralel) çalışın.";
    } else if (islem === "pürüz-giderme") {
      gritSirasi = ["80", "120", "180"];
      baslangicGrit = "80"; bitirisGrit = "180";
      uygulama = "Her aşamada önceki çizikleri tamamen giderin.";
    } else if (islem === "boya-oncesi") {
      gritSirasi = ["120", "180", "220"];
      baslangicGrit = "120"; bitirisGrit = "220";
      uygulama = "220 grit sonrası yüzeyi ıslak bezle silin; şişen lifleri çektikten sonra 280 ile hafifçe tekrarlayın.";
    } else {
      gritSirasi = ["180", "220", "320", "400"];
      baslangicGrit = "180"; bitirisGrit = "400";
      uygulama = "Cila/vernik öncesi yüzey pürüzsüzlüğü için 400'e kadar çıkın. Liflere paralel zımparalayın.";
    }
    zimparaCinsi = "Alüminyum oksit (ahşap için)";
    dikkat.push("Ahşapta çapraz çizik bırakmamak için daima lif yönünde zımparalayın.");
  }

  // Boyalı ahşap
  else if (malzeme === "ahsap-boyali") {
    gritSirasi = ["180", "240", "320"];
    baslangicGrit = "180"; bitirisGrit = "320";
    zimparaCinsi = "Silikon karbür (ıslak-kuru)";
    if (islem === "boya-oncesi") {
      uygulama = "Mevcut boyayı matlaştırın, kaldırmayın. 240 grit yeterlidir çoğu durumda.";
    } else {
      uygulama = "Eski boya katmanları arasını matlaştırarak yeni katın tutunmasını sağlayın.";
    }
    dikkat.push("Boyayı tamamen kaldırmak istemiyorsanız 180'den başlamayın.");
  }

  // Çelik
  else if (malzeme === "metal-celik") {
    zimparaCinsi = "Alüminyum oksit veya zirkonyum (metal için)";
    if (islem === "pas-giderme" || islem === "kaynak-temizlik") {
      gritSirasi = ["40", "60", "80", "120"];
      baslangicGrit = "40"; bitirisGrit = "120";
      uygulama = "Disk zımpara veya bant zımpara için zirkonyum tercih edin; daha uzun ömürlüdür.";
      dikkat.push("Derin pas varsa tel fırça veya taşlama diski ile başlayın; zımpara tıkanabilir.");
    } else if (islem === "boya-oncesi") {
      gritSirasi = ["80", "120", "180"];
      baslangicGrit = "80"; bitirisGrit = "180";
      uygulama = "Boya astarı öncesi 120 grit yeterli; mat yüzey tutunmayı artırır.";
    } else {
      gritSirasi = ["120", "240", "400"];
      baslangicGrit = "120"; bitirisGrit = "400";
      uygulama = "Parlatma için 400 sonrası polisaj macunu ile devam edin.";
    }
    if (arac === "disk") {
      dikkat.push("Disk zımparada yüzeye basıncı hafif tutun; aşırı ısı metalin rengini değiştirir.");
    }
  }

  // Alüminyum
  else if (malzeme === "metal-aluminyum") {
    zimparaCinsi = "Silikon karbür (alüminyum için)";
    gritSirasi = ["80", "120", "240", "400"];
    baslangicGrit = "80"; bitirisGrit = "400";
    uygulama = "Alüminyum zımpara şeridine yapışır; ıslak zımpara veya sık temizleme zorunludur.";
    dikkat.push("Alüminyum talaşı yangın riski taşır; kıvılcım çıkaran ekipmanlardan uzak tutun.");
    dikkat.push("Zımpara'ya yağ/su (ıslak) kullanmak tıkanmayı önemli ölçüde azaltır.");
  }

  // Boya/astar
  else if (malzeme === "boya-astar") {
    zimparaCinsi = "Silikon karbür (ıslak-kuru)";
    gritSirasi = ["320", "400", "600"];
    baslangicGrit = "320"; bitirisGrit = "600";
    uygulama = "Katlar arası ıslak zımpara tercih edin. 400 ile ikinci kat arası, 600 ile son kat öncesi.";
    dikkat.push("Kat arası zımparada yüzeyi delmemek için hafif basınç uygulayın.");
  }

  // Plastik
  else if (malzeme === "plastik") {
    zimparaCinsi = "Silikon karbür";
    gritSirasi = ["120", "240", "400", "800"];
    baslangicGrit = "120"; bitirisGrit = "400";
    uygulama = "Plastik ısıya duyarlıdır; el ile veya düşük hızda zımparalayın. Eriyen plastik zımpara'ya yapışır.";
    dikkat.push("Plastik talaşı statik elektrik üretir; tozu aspiratörle alın.");
  }

  // Beton
  else if (malzeme === "beton-sivi") {
    zimparaCinsi = "Elmas zımpara / silikon karbür (kaba)";
    gritSirasi = ["30", "60", "120"];
    baslangicGrit = "30"; bitirisGrit = "120";
    uygulama = "Beton için disk veya bant zımpara zorunludur; el ile çalışılmaz. Nemli ortamda ıslak zımpara tercih edin.";
    dikkat.push("Beton tozu silika içerir; FFP2/P3 toz maskesi zorunludur.");
    dikkat.push("Islak yöntem toz miktarını %90 azaltır, disk ömrünü uzatır.");
  }

  // Araç bazlı notlar
  if (arac === "titresimli") {
    dikkat.push("Titreşimli zımparada kağıdı doğru boyda kesin; kayma olursa iş kalitesi düşer.");
  } else if (arac === "bant") {
    dikkat.push("Bant zımparada takibi güçtür; kılavuz kullanın, kenar yakınında dikkatli olun.");
  } else if (arac === "disk") {
    dikkat.push("Disk zımparada tek bir noktada uzun süre durmayın — çukur oluşur.");
  }

  return { baslik, gritSirasi, zimparaCinsi, baslangicGrit, bitirisGrit, uygulama, dikkat };
}
