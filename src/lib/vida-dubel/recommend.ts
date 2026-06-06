export type TabanMalzeme =
  | "beton-yogun"
  | "beton-gaz"
  | "tugla-dolu"
  | "tugla-delme"
  | "alcipan"
  | "ahsap"
  | "metal-ince"
  | "metal-kalin";

export type MontajYuku = "hafif" | "orta" | "agir";

export type VidaTipi = "vidali" | "civisiz" | "civata";

export interface VidaDubelGirdi {
  taban: TabanMalzeme;
  yuk: MontajYuku;
  vidaTipi: VidaTipi;
}

export interface VidaDubelSonuc {
  baslik: string;
  dubelTipi: string;
  vidaBoyutu: string;
  delikCapi: string;
  derinlik: string;
  montajNotu: string;
  maxYuk: string;
  ipucu: string[];
}

const TABAN_LABEL: Record<TabanMalzeme, string> = {
  "beton-yogun": "Beton (yoğun/dolu)",
  "beton-gaz": "Gazbeton / Ytong",
  "tugla-dolu": "Tuğla (dolu)",
  "tugla-delme": "Tuğla (delikli / boşluklu)",
  alcipan: "Alçıpan / Rigips",
  ahsap: "Ahşap / OSB",
  "metal-ince": "Metal profil / sac (ince)",
  "metal-kalin": "Metal (kalın / çelik profil)",
};

const YUK_LABEL: Record<MontajYuku, string> = {
  hafif: "Hafif (< 5 kg)",
  orta: "Orta (5–25 kg)",
  agir: "Ağır (25 kg+)",
};

export function vidaDubelOner(girdi: VidaDubelGirdi): VidaDubelSonuc {
  const { taban, yuk, vidaTipi } = girdi;
  const tabanLabel = TABAN_LABEL[taban];
  const yukLabel = YUK_LABEL[yuk];

  let dubelTipi = "Evrensel naylon dübel";
  let vidaBoyutu = "M6 × 50 mm";
  let delikCapi = "6 mm";
  let derinlik = "50 mm";
  let montajNotu = "Standart dübel + vida kombinasyonu.";
  let maxYuk = "30 kg";
  const ipucu: string[] = [
    "Montaj öncesi taban malzemesini test edin.",
    "Dübeli çekiçle değil elle veya plastik tokmakla yerleştirin.",
  ];

  // --- Beton (yoğun) ---
  if (taban === "beton-yogun") {
    if (yuk === "hafif") {
      dubelTipi = "Naylon dübel S6";
      vidaBoyutu = "M5 × 40 mm";
      delikCapi = "6 mm";
      derinlik = "40 mm";
      maxYuk = "15 kg";
      montajNotu = "S6 naylon dübel hafif tablolar ve kablolar için yeterli.";
    } else if (yuk === "orta") {
      dubelTipi = "Naylon dübel S8 veya çelik çivi dübel";
      vidaBoyutu = "M6 × 60 mm";
      delikCapi = "8 mm";
      derinlik = "60 mm";
      maxYuk = "60 kg";
      montajNotu = "Raf veya dolap için darbeli matkapla delin; dübel tamamen girene kadar çekiçleyin.";
      ipucu.push("Çekiçle vururken dübelin döndürmesine izin vermeyin.");
    } else {
      dubelTipi = vidaTipi === "civata" ? "Kimyasal ankraj (epoksi) + çelik buat" : "Ağır hizmet dübeli SX10 veya kimyasal ankraj";
      vidaBoyutu = "M10 × 100 mm";
      delikCapi = "10–12 mm";
      derinlik = "90–120 mm";
      maxYuk = "200+ kg (ankraj ile)";
      montajNotu = "Ağır yüklerde kimyasal ankraj tercih edin; deliği vakumla temizleyin, 24 saat kürleme bekleyin.";
      ipucu.push("Kimyasal ankrajda nem oranı %75 altında olmalı.");
      ipucu.push("Deliği tel fırça + vakumla tamamen temizleyin; toz tutunmayı engeller.");
    }
  }

  // --- Gazbeton ---
  else if (taban === "beton-gaz") {
    dubelTipi = "Gazbeton/Ytong dübeli (GK veya SL tipi)";
    if (yuk === "hafif") {
      vidaBoyutu = "M5 × 50 mm";
      delikCapi = "10 mm";
      derinlik = "50 mm";
      maxYuk = "10 kg";
      montajNotu = "Gazbeton'da standart S6 tutmaz; mutlaka GK veya Ytong-tipi uzun kanat dübel kullanın.";
    } else if (yuk === "orta") {
      vidaBoyutu = "M6 × 80 mm";
      delikCapi = "14 mm";
      derinlik = "80 mm";
      maxYuk = "30 kg";
      montajNotu = "Büyük kanatlı dübel (SL ya da Molly-tipi) yük dağıtımını artırır; aksi hâlde malzeme çöker.";
      ipucu.push("Gazbetonda yavaş, düşük devirli delin — kırılgandır.");
    } else {
      dubelTipi = "Kimyasal ankraj (gazbeton formülü) + buat";
      vidaBoyutu = "M8 × 100 mm";
      delikCapi = "14 mm";
      derinlik = "100 mm";
      maxYuk = "60 kg (yapı uzmanı onayıyla)";
      montajNotu = "Gazbetonda 25 kg+ yük için mühendis görüşü alın; duvar taşıyıcı olup olmadığını kontrol edin.";
      ipucu.push("Gazbetonda ağır yük için duvar taşıyıcılığını kontrol ettirin.");
    }
  }

  // --- Tuğla dolu ---
  else if (taban === "tugla-dolu") {
    if (yuk === "hafif") {
      dubelTipi = "Naylon dübel S6";
      vidaBoyutu = "M5 × 40 mm";
      delikCapi = "6 mm";
      derinlik = "40 mm";
      maxYuk = "15 kg";
      montajNotu = "Sert tuğlada S6 dübel pekişir; darbesiz delik açın.";
    } else if (yuk === "orta") {
      dubelTipi = "Naylon dübel S8";
      vidaBoyutu = "M6 × 60 mm";
      delikCapi = "8 mm";
      derinlik = "60 mm";
      maxYuk = "50 kg";
      montajNotu = "Dolu tuğlada harç derzine denk gelmeye çalışın; tuğla gövdesi daha sağlamdır.";
      ipucu.push("Harç derzine mümkünse montaj yapmayın; zayıf noktadır.");
    } else {
      dubelTipi = "SX10 ağır hizmet dübeli";
      vidaBoyutu = "M10 × 80 mm";
      delikCapi = "10 mm";
      derinlik = "80 mm";
      maxYuk = "120 kg";
      montajNotu = "Birden fazla montaj noktasına yayın; tek dübele 25 kg'dan fazla yük bindirmeyin.";
      ipucu.push("Yükü mümkünse 2-4 noktaya dağıtın.");
    }
  }

  // --- Tuğla delikli ---
  else if (taban === "tugla-delme") {
    dubelTipi = "Toggle bolt (kelebek) veya boşluk dübeli";
    if (yuk === "hafif") {
      vidaBoyutu = "M5 × 50 mm";
      delikCapi = "8 mm";
      derinlik = "—";
      maxYuk = "10 kg";
      montajNotu = "Delikli tuğlada boşluğa geçen kelebek dübel kullanın; standart dübel tutmaz.";
    } else if (yuk === "orta") {
      vidaBoyutu = "M8 kelebek civata";
      delikCapi = "10 mm";
      derinlik = "—";
      maxYuk = "30 kg";
      montajNotu = "Delikli tuğlada kimyasal ankraj da etkili: deliği doldurun, kürsün, vida takın.";
      ipucu.push("Kimyasal ankraj delikli tuğlada boşlukları doldurur — en güvenli yöntem.");
    } else {
      dubelTipi = "Kimyasal ankraj (sievert tipi) veya çelik plaka dağıtımı";
      vidaBoyutu = "M10 × 80 mm";
      delikCapi = "12 mm";
      derinlik = "80 mm";
      maxYuk = "60 kg (dağıtımlı)";
      montajNotu = "Delikli tuğlada ağır yük için yük dağıtıcı çelik plaka + kimyasal ankraj kombinasyonu.";
      ipucu.push("25 kg üstü yüklerde mühendis veya uzman görüşü alın.");
    }
  }

  // --- Alçıpan ---
  else if (taban === "alcipan") {
    if (yuk === "hafif") {
      dubelTipi = "Alçıpan çivi dübeli (metal veya naylon, kendiliğinden delen)";
      vidaBoyutu = "3,5 × 35 mm";
      delikCapi = "Kesici kenarlı — delme gerektirmez";
      derinlik = "—";
      maxYuk = "8 kg";
      montajNotu = "Kendiliğinden delen Molly-tipi veya vida spirali dübeller; matkap gerektirmez.";
    } else if (yuk === "orta") {
      dubelTipi = "Alçıpan kaymalı dübel (Fischer GK veya Molly 5mm)";
      vidaBoyutu = "M5 × 40 mm";
      delikCapi = "5 mm";
      derinlik = "—";
      maxYuk = "20 kg";
      montajNotu = "Arkada duvar profili varsa viday doğrudan profile girin — en güçlü montaj.";
      ipucu.push("Metal profilin yeri için tahta çubuğunu duvara hafifçe vurarak kontrol edin — içi boş ses: alçıpan arası, tok ses: profil.");
    } else {
      dubelTipi = "Doğrudan metal profil montajı (profil bul + vida)";
      vidaBoyutu = "M6 × 50 mm (metal vida)";
      delikCapi = "Profil konumuna göre";
      derinlik = "Profil derinliği";
      maxYuk = "60 kg (profile monte)";
      montajNotu = "Alçıpan ağır yük taşımaz; profili bulun ve vida doğrudan profile gisin. Alternatif: duvara geçen uzun ankraj.";
      ipucu.push("Profil bulunamazsa duvara erişen uzun (150–200 mm) kimyasal ankraj kullanın.");
      ipucu.push("Ağır yüklerde elektrik/tesisat hatlarını kontrol edin.");
    }
  }

  // --- Ahşap ---
  else if (taban === "ahsap") {
    dubelTipi = "Vida (dübel gerekmez)";
    if (yuk === "hafif") {
      vidaBoyutu = "4 × 40 mm sunta vidası";
      delikCapi = "Vida çapının %70'i ön delik";
      derinlik = "35–40 mm";
      maxYuk = "20 kg";
      montajNotu = "Ahşapta dübel gereksiz; ince ön delik açarak vida direkt girer. Çatlama riskini azaltır.";
    } else if (yuk === "orta") {
      vidaBoyutu = "5 × 60 mm sunta vidası veya lag bolt";
      delikCapi = "4 mm ön delik";
      derinlik = "55–60 mm";
      maxYuk = "60 kg";
      montajNotu = "OSB veya sunta için kalın dişli vida tercih edin; MDF'de kavrama zayıf olabilir.";
      ipucu.push("MDF kenara yakın montajda takviyesiz bölünebilir — ortaya doğru kaydırın.");
    } else {
      vidaBoyutu = "6 × 80 mm lag bolt veya yapısal vida";
      delikCapi = "5 mm ön delik";
      derinlik = "75–80 mm";
      maxYuk = "150 kg";
      montajNotu = "Ağır yüklerde ahşap malzemenin kalitesi belirleyici; yırtık, nemli veya MDF için takviyeli plaka kullanın.";
      ipucu.push("Yapısal yüklerde yıllık muayene yapın; vida gevşeyebilir.");
    }
  }

  // --- Metal ince ---
  else if (taban === "metal-ince") {
    dubelTipi = "Pop perçin veya kendinden kılavuzlu vida (thread-forming)";
    if (yuk === "hafif") {
      vidaBoyutu = "M4 × 10 mm kendinden vidalı";
      delikCapi = "3,3 mm ön delik";
      derinlik = "Malzeme kalınlığı";
      maxYuk = "10 kg";
      montajNotu = "İnce sacda kılavuz açmak gerekir; thread-forming vida hem kılavuz hem montaj yapar.";
    } else if (yuk === "orta") {
      vidaBoyutu = "M5 × 12 mm + somun veya pop perçin 4,8 mm";
      delikCapi = "5 mm";
      derinlik = "Malzeme kalınlığı";
      maxYuk = "30 kg";
      montajNotu = "İnce sacda arkaya somun erişim zorsa pop perçin daha hızlı ve güvenli.";
      ipucu.push("Pop perçin için çekme aleti şart; pense ile sıkmayın.");
    } else {
      dubelTipi = "Somun + civata (arkaya erişimle) veya sızdırmaz perçin";
      vidaBoyutu = "M8 civata + flanşlı somun";
      delikCapi = "8,5 mm";
      derinlik = "Malzeme + somun kalınlığı";
      maxYuk = "80 kg";
      montajNotu = "İnce metalde ağır yük için mutlaka arkaya flanşlı somun veya rayba somun kullanın; vida sıyrılır.";
      ipucu.push("Titreşimli ortamlarda kilitli somun (nyloc) kullanın.");
    }
  }

  // --- Metal kalın ---
  else if (taban === "metal-kalin") {
    dubelTipi = "Kılavuz çekilmiş vida (M tipi) veya kaynak";
    if (yuk === "hafif") {
      vidaBoyutu = "M6 × 20 mm makine vidası";
      delikCapi = "5 mm + M6 kılavuz";
      derinlik = "15–20 mm";
      maxYuk = "40 kg";
      montajNotu = "Kalın çelikte kılavuz çekin; vidayı sıkıştırmak parçayı yıpratmaz.";
    } else if (yuk === "orta") {
      vidaBoyutu = "M8 × 25 mm makine vidası";
      delikCapi = "6,8 mm + M8 kılavuz";
      derinlik = "20–25 mm";
      maxYuk = "100 kg";
      montajNotu = "Torku belirtin; çelikte aşırı sıkma dişi patlatır. Tork anahtarı kullanın.";
      ipucu.push("M8 çelikte önerilen tork: 20–25 Nm.");
    } else {
      vidaBoyutu = "M10–M12 civata + sertleştirilmiş somun";
      delikCapi = "10–12 mm";
      derinlik = "Flanş kalınlığına göre";
      maxYuk = "300+ kg";
      montajNotu = "Yapısal yük için makine mühendisliği hesabı şart; bu araç yalnızca yönlendirici bilgi sunar.";
      ipucu.push("Yapısal yük taşıyan bağlantılar için mühendis onayı alın.");
      ipucu.push("Titreşimli ortamlarda kilit rondelası + nyloc somun kombinasyonu kullanın.");
    }
  }

  return {
    baslik: `${tabanLabel} · ${yukLabel}`,
    dubelTipi,
    vidaBoyutu,
    delikCapi,
    derinlik,
    montajNotu,
    maxYuk,
    ipucu,
  };
}
