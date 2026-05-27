export interface Product {
  id: string;
  brand: string;
  model: string;
  category: ProductCategory;
  specs: Record<string, string | number>;
  priceRange?: string;
  imageUrl?: string;
  sourceUrl?: string;
  createdAt: string;
}

export type ProductCategory =
  // ── Delme & Vidalama ──
  | "darbeli-matkap"
  | "vidalama"
  | "hilti"
  | "matkap-ucu"
  | "sds-uc"
  | "sutun-matkap"
  | "magkap" // manyetik matkap
  // ── Kesme & Testere ──
  | "daire-testere"
  | "daire-testere-bicagi"
  | "serit-testere"
  | "serit-testere-bicagi"
  | "dekupaj"
  | "dekupaj-bicagi"
  | "tilki-kuyrugu"
  | "tilki-kuyrugu-bicagi"
  | "zincirli-testere"
  | "zincirli-testere-zinciri"
  | "el-testeresi"
  | "gonyeli-kesme" // gönye kesme makinesi
  | "mermer-kesme"
  | "kanal-acma" // duvar kanal açma
  | "sac-kesme-makasi"
  // ── Taşlama & Zımparalama ──
  | "avuc-taslama"
  | "taslama-diski"
  | "kesme-diski"
  | "eksantrik-zimpara"
  | "titresimli-zimpara"
  | "bant-zimpara"
  | "tezgah-taslama"
  // ── Freze & Planya & Ahşap ──
  | "freze-makinesi"
  | "el-planyasi"
  | "lamba-makinesi" // bisküvi / lamba birleştirme
  | "ahsap-torna"
  | "cnc-router"
  // ── Vidalama & Bağlantı ──
  | "darbe-somun-sikma" // impact wrench
  | "vida-seti"
  | "dubel-seti"
  | "civata-somun"
  | "percinleme-aleti" // pop perçin
  | "zimba-tabancasi" // zımba/çivi tabancası
  // ── Isı & Yapıştırma ──
  | "sicak-hava-tabancasi"
  | "sicak-silikon-tabancasi"
  | "plastik-kaynak"
  // ── Kaynak ──
  | "inverter-kaynak"
  | "gazalti-kaynak"
  | "argon-kaynak"
  | "punta-kaynak"
  | "kaynak-maskesi"
  | "kaynak-teli"
  | "kaynak-elektrodu"
  // ── Kompresör & Basınç ──
  | "kompresor"
  | "basincli-yikama"
  | "havalı-zimba" // havalı zımba/çivi tabancası
  | "havali-taslama"
  | "havali-somun"
  // ── Jeneratör & Enerji ──
  | "jenerator"
  | "ups"
  | "stabilizator"
  | "solar-panel"
  | "invertör" // solar inverter
  // ── Pompa & Su ──
  | "dalgic-pompa"
  | "santrifuj-pompa"
  | "hidrafor"
  | "tahliye-pompasi"
  | "havuz-pompasi"
  // ── Isıtma & Soğutma ──
  | "kombi"
  | "klima"
  | "elektrikli-isitici"
  | "soba" // odun/pellet soba
  | "siklon-aspirator" // toz emici
  | "endustriyel-fan"
  // ── Tesisat ──
  | "boru-kesici"
  | "pafta-seti"
  | "lehim-makinesi"
  | "boru-bükme"
  | "tesisat-pense" // su pompası pensesi
  | "kanal-acma-spirali"
  | "test-pompasi"
  | "musluk-batarya"
  | "su-aritma"
  // ── Elektrik & Elektronik ──
  | "kablo-soyucu"
  | "krimpleme-aleti"
  | "multimetre"
  | "pensampermetre"
  | "termal-kamera"
  | "kablo-bulucu"
  | "faz-algilayici"
  | "toprak-test"
  | "elektrik-panosu"
  | "salter-sigorta"
  | "priz-anahtar"
  | "kablo-kanal"
  // ── Ölçüm & Hizalama ──
  | "lazer-metre"
  | "lazer-terazisi"
  | "su-terazisi"
  | "celik-metre"
  | "kumpas"
  | "mikrometre"
  | "gonye"
  | "profil-sablonu"
  | "nem-olcer"
  | "ses-olcer"
  | "endoskop-kamera"
  // ── El Aletleri ──
  | "cekic"
  | "pense-seti"
  | "tornavida-seti"
  | "anahtar-seti"
  | "lokma-takimi"
  | "maket-bicagi"
  | "kerpeten"
  | "mengene"
  | "allen-anahtar"
  | "tork-anahtari"
  | "boru-anahtari"
  | "yankes"
  | "el-makasi" // sac makası
  | "keskı"
  | "raspa-ege"
  | "cırcır-anahtar"
  | "takim-cantasi" // set çanta
  // ── Kaldırma & Taşıma ──
  | "caraskal"
  | "zincirli-vinc"
  | "transpalet"
  | "araba-kriko"
  | "ceki-halati"
  // ── Merdiven & İskele ──
  | "merdiven"
  | "iskele"
  | "platform-merdiven"
  // ── Boya & Kaplama ──
  | "boya-tabancasi"
  | "boya-kompresoru"
  | "boya-rulosu"
  | "airless-boya"
  | "vernik-tabancasi"
  // ── Bahçe & Dış Mekan ──
  | "motorlu-tirpan"
  | "cim-bicme"
  | "budama-makasi"
  | "yaprak-ufleyici"
  | "dal-ogutme"
  | "motorlu-capa"
  | "bahce-pompasi"
  | "damlama-sulama"
  | "hortum-seti"
  | "bahce-makasi" // çit biçme
  // ── Temizlik ──
  | "endustriyel-supurge"
  | "zemin-temizleme"
  | "halı-yikama"
  // ── Güvenlik & Kamera ──
  | "guvenlik-kamerasi"
  | "nvr-dvr"
  | "akilli-kilit"
  | "alarm-sistemi"
  | "yangin-sondurme"
  // ── İş Güvenliği ──
  | "baret"
  | "koruyucu-gozluk"
  | "is-eldiveni"
  | "kulak-koruyucu"
  | "toz-maskesi"
  | "is-ayakkabisi"
  | "emniyet-kemeri" // yüksekte çalışma
  | "is-tulumu"
  // ── Yapı Kimyasalları ──
  | "silikon"
  | "montaj-kopugu"
  | "yapistirici"
  | "derz-dolgu"
  | "su-yalitim"
  | "beton-kimyasali"
  | "epoksi"
  | "macun" // dolgu macunu
  // ── Çatı & İzolasyon ──
  | "cati-membran"
  | "yalitim-malzemesi" // taş yünü, xps, eps
  | "oluk-sistemi"
  // ── Havalandırma ──
  | "aspirator"
  | "havalandirma-fani"
  | "kanal-tipi-fan"
  // ── 3D Printer & Hobi ──
  | "3d-printer"
  | "3d-filament"
  | "lazer-kaziyici" // laser engraver
  | "havya-istasyonu"
  // ── Aydınlatma ──
  | "kafa-lambasi"
  | "santi-projektoru"
  | "led-panel"
  | "santi-lambasi"
  // ── Oto Ekipman ──
  | "oto-lift"
  | "lastik-sokme"
  | "balans-makinesi"
  | "oto-boya-kabini"
  | "oto-yikama"
  // ── Diğer ──
  | "diger";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  // Delme & Vidalama
  "darbeli-matkap": "Darbeli Matkap",
  vidalama: "Akülü Vidalama",
  hilti: "Hilti / Kırıcı Delici",
  "matkap-ucu": "Matkap Ucu Seti",
  "sds-uc": "SDS Uç Seti",
  "sutun-matkap": "Sütun Matkap",
  magkap: "Manyetik Matkap",
  // Kesme & Testere
  "daire-testere": "Daire Testere",
  "daire-testere-bicagi": "Daire Testere Bıçağı",
  "serit-testere": "Şerit Testere",
  "serit-testere-bicagi": "Şerit Testere Bıçağı",
  dekupaj: "Dekupaj Testere",
  "dekupaj-bicagi": "Dekupaj Bıçağı",
  "tilki-kuyrugu": "Tilki Kuyruğu",
  "tilki-kuyrugu-bicagi": "Tilki Kuyruğu Bıçağı",
  "zincirli-testere": "Zincirli Testere",
  "zincirli-testere-zinciri": "Zincirli Testere Zinciri",
  "el-testeresi": "El Testeresi",
  "gonyeli-kesme": "Gönye Kesme Makinesi",
  "mermer-kesme": "Mermer Kesme Makinesi",
  "kanal-acma": "Duvar Kanal Açma",
  "sac-kesme-makasi": "Sac Kesme Makası",
  // Taşlama & Zımparalama
  "avuc-taslama": "Avuç Taşlama",
  "taslama-diski": "Taşlama Diski",
  "kesme-diski": "Kesme Diski",
  "eksantrik-zimpara": "Eksantrik Zımpara",
  "titresimli-zimpara": "Titreşimli Zımpara",
  "bant-zimpara": "Bant Zımpara",
  "tezgah-taslama": "Tezgah Taşlama",
  // Freze & Planya & Ahşap
  "freze-makinesi": "El Freze Makinesi",
  "el-planyasi": "El Planyası",
  "lamba-makinesi": "Lamba Birleştirme Makinesi",
  "ahsap-torna": "Ahşap Torna Tezgahı",
  "cnc-router": "CNC Router",
  // Vidalama & Bağlantı
  "darbe-somun-sikma": "Darbe Somun Sıkma",
  "vida-seti": "Vida Seti",
  "dubel-seti": "Dübel Seti",
  "civata-somun": "Cıvata & Somun",
  "percinleme-aleti": "Perçinleme Aleti",
  "zimba-tabancasi": "Zımba / Çivi Tabancası",
  // Isı & Yapıştırma
  "sicak-hava-tabancasi": "Sıcak Hava Tabancası",
  "sicak-silikon-tabancasi": "Sıcak Silikon Tabancası",
  "plastik-kaynak": "Plastik Kaynak Makinesi",
  // Kaynak
  "inverter-kaynak": "İnverter Kaynak Makinesi",
  "gazalti-kaynak": "Gazaltı MIG/MAG Kaynak",
  "argon-kaynak": "Argon TIG Kaynak",
  "punta-kaynak": "Punta Kaynak",
  "kaynak-maskesi": "Kaynak Maskesi / Baş Siperi",
  "kaynak-teli": "Kaynak Teli",
  "kaynak-elektrodu": "Kaynak Elektrodu",
  // Kompresör & Basınç
  kompresor: "Hava Kompresörü",
  "basincli-yikama": "Basınçlı Yıkama Makinesi",
  "havalı-zimba": "Havalı Zımba / Çivi Tabancası",
  "havali-taslama": "Havalı Taşlama",
  "havali-somun": "Havalı Somun Sıkma",
  // Jeneratör & Enerji
  jenerator: "Jeneratör",
  ups: "UPS / Kesintisiz Güç Kaynağı",
  stabilizator: "Voltaj Regülatörü / Stabilizatör",
  "solar-panel": "Güneş Paneli",
  invertör: "Solar İnvertör",
  // Pompa & Su
  "dalgic-pompa": "Dalgıç Pompa",
  "santrifuj-pompa": "Santrifüj Pompa",
  hidrafor: "Hidrofor",
  "tahliye-pompasi": "Tahliye / Pis Su Pompası",
  "havuz-pompasi": "Havuz Pompası",
  // Isıtma & Soğutma
  kombi: "Kombi",
  klima: "Klima (Split)",
  "elektrikli-isitici": "Elektrikli Isıtıcı",
  soba: "Soba (Odun/Pellet)",
  "siklon-aspirator": "Endüstriyel Toz Emici",
  "endustriyel-fan": "Endüstriyel Fan",
  // Tesisat
  "boru-kesici": "Boru Kesici",
  "pafta-seti": "Pafta Seti",
  "lehim-makinesi": "Lehim / Kaynak Makinesi (Tesisat)",
  "boru-bükme": "Boru Bükme Aleti",
  "tesisat-pense": "Tesisat Pensesi",
  "kanal-acma-spirali": "Kanal Açma Spirali",
  "test-pompasi": "Test Pompası",
  "musluk-batarya": "Musluk Batarya",
  "su-aritma": "Su Arıtma Cihazı",
  // Elektrik & Elektronik
  "kablo-soyucu": "Kablo Soyucu",
  "krimpleme-aleti": "Krimpleme Aleti",
  multimetre: "Multimetre",
  pensampermetre: "Pensampermetre",
  "termal-kamera": "Termal Kamera",
  "kablo-bulucu": "Kablo / Metal Bulucu",
  "faz-algilayici": "Faz Algılayıcı",
  "toprak-test": "Topraklama Test Cihazı",
  "elektrik-panosu": "Elektrik Panosu",
  "salter-sigorta": "Şalter / Sigorta",
  "priz-anahtar": "Priz / Anahtar Serisi",
  "kablo-kanal": "Kablo Kanalı",
  // Ölçüm & Hizalama
  "lazer-metre": "Lazer Metre",
  "lazer-terazisi": "Lazer Terazisi",
  "su-terazisi": "Su Terazisi",
  "celik-metre": "Çelik Şerit Metre",
  kumpas: "Kumpas",
  mikrometre: "Mikrometre",
  gonye: "Gönye",
  "profil-sablonu": "Profil Şablonu",
  "nem-olcer": "Nem Ölçer",
  "ses-olcer": "Ses Ölçer / Desibelmetre",
  "endoskop-kamera": "Endoskop / Borescope Kamera",
  // El Aletleri
  cekic: "Çekiç",
  "pense-seti": "Pense Seti",
  "tornavida-seti": "Tornavida Seti",
  "anahtar-seti": "Anahtar Seti",
  "lokma-takimi": "Lokma Takımı",
  "maket-bicagi": "Maket Bıçağı",
  kerpeten: "Kerpeten",
  mengene: "Mengene / Işkına",
  "allen-anahtar": "Allen Anahtar Seti",
  "tork-anahtari": "Tork Anahtarı",
  "boru-anahtari": "Boru Anahtarı",
  yankes: "Yan Keski",
  "el-makasi": "Sac / El Makası",
  keskı: "Keski",
  "raspa-ege": "Raspa / Eğe Seti",
  "cırcır-anahtar": "Cırcır Anahtar",
  "takim-cantasi": "Takım Çantası / Set",
  // Kaldırma & Taşıma
  caraskal: "Caraskal / Zincirli Palanga",
  "zincirli-vinc": "Zincirli Vinç / Ceraskal",
  transpalet: "Transpalet",
  "araba-kriko": "Araba Krikosu",
  "ceki-halati": "Çeki Halatı / Sapan",
  // Merdiven & İskele
  merdiven: "Merdiven",
  iskele: "İskele",
  "platform-merdiven": "Platform Merdiven",
  // Boya & Kaplama
  "boya-tabancasi": "Boya Tabancası (HVLP)",
  "boya-kompresoru": "Boya Kompresörü",
  "boya-rulosu": "Boya Rulosu",
  "airless-boya": "Airless Boya Makinesi",
  "vernik-tabancasi": "Vernik Tabancası",
  // Bahçe & Dış Mekan
  "motorlu-tirpan": "Motorlu Tırpan",
  "cim-bicme": "Çim Biçme Makinesi",
  "budama-makasi": "Budama Makası / Testere",
  "yaprak-ufleyici": "Yaprak Üfleyici",
  "dal-ogutme": "Dal Öğütme Makinesi",
  "motorlu-capa": "Motorlu Çapa Makinesi",
  "bahce-pompasi": "Bahçe Pompası",
  "damlama-sulama": "Damlama Sulama Sistemi",
  "hortum-seti": "Hortum Seti",
  "bahce-makasi": "Çit Biçme Makası",
  // Temizlik
  "endustriyel-supurge": "Endüstriyel Süpürge",
  "zemin-temizleme": "Zemin Temizleme Makinesi",
  "halı-yikama": "Halı Yıkama Makinesi",
  // Güvenlik & Kamera
  "guvenlik-kamerasi": "Güvenlik Kamerası",
  "nvr-dvr": "NVR / DVR Kayıt Cihazı",
  "akilli-kilit": "Akıllı Kilit",
  "alarm-sistemi": "Alarm Sistemi",
  "yangin-sondurme": "Yangın Söndürücü",
  // İş Güvenliği
  baret: "Baret",
  "koruyucu-gozluk": "Koruyucu Gözlük",
  "is-eldiveni": "İş Eldiveni",
  "kulak-koruyucu": "Kulak Koruyucu",
  "toz-maskesi": "Toz Maskesi / Yarım Yüz",
  "is-ayakkabisi": "İş Ayakkabısı",
  "emniyet-kemeri": "Emniyet Kemeri (Yüksekte)",
  "is-tulumu": "İş Tulumu / Önlük",
  // Yapı Kimyasalları
  silikon: "Silikon",
  "montaj-kopugu": "Montaj Köpüğü",
  yapistirici: "Yapıştırıcı",
  "derz-dolgu": "Derz Dolgu",
  "su-yalitim": "Su Yalıtım Malzemesi",
  "beton-kimyasali": "Beton Kimyasalı / Katkı",
  epoksi: "Epoksi",
  macun: "Dolgu Macunu",
  // Çatı & İzolasyon
  "cati-membran": "Çatı Membranı",
  "yalitim-malzemesi": "Yalıtım Malzemesi (XPS/EPS/Taşyünü)",
  "oluk-sistemi": "Yağmur Oluğu Sistemi",
  // Havalandırma
  aspirator: "Mutfak Aspiratörü",
  "havalandirma-fani": "Havalandırma Fanı",
  "kanal-tipi-fan": "Kanal Tipi Fan",
  // 3D Printer & Hobi
  "3d-printer": "3D Yazıcı",
  "3d-filament": "3D Filament",
  "lazer-kaziyici": "Lazer Kazıyıcı / Engraver",
  "havya-istasyonu": "Havya İstasyonu",
  // Aydınlatma
  "kafa-lambasi": "Kafa Lambası",
  "santi-projektoru": "Şantiye Projektörü",
  "led-panel": "LED Panel / Armatür",
  "santi-lambasi": "Şantiye / Atölye Lambası",
  // Oto Ekipman
  "oto-lift": "Oto Lift",
  "lastik-sokme": "Lastik Sökme Makinesi",
  "balans-makinesi": "Balans Makinesi",
  "oto-boya-kabini": "Oto Boya Kabini",
  "oto-yikama": "Oto Yıkama Makinesi",
  // Diğer
  diger: "Diğer",
};

export const CATEGORY_GROUPS: { label: string; categories: ProductCategory[] }[] = [
  { label: "Delme & Vidalama", categories: ["darbeli-matkap", "vidalama", "hilti", "matkap-ucu", "sds-uc", "sutun-matkap", "magkap", "darbe-somun-sikma"] },
  { label: "Kesme & Testere", categories: ["daire-testere", "daire-testere-bicagi", "serit-testere", "serit-testere-bicagi", "dekupaj", "dekupaj-bicagi", "tilki-kuyrugu", "tilki-kuyrugu-bicagi", "zincirli-testere", "zincirli-testere-zinciri", "el-testeresi", "gonyeli-kesme", "mermer-kesme", "kanal-acma", "sac-kesme-makasi"] },
  { label: "Taşlama & Zımparalama", categories: ["avuc-taslama", "taslama-diski", "kesme-diski", "eksantrik-zimpara", "titresimli-zimpara", "bant-zimpara", "tezgah-taslama"] },
  { label: "Freze & Planya & Ahşap", categories: ["freze-makinesi", "el-planyasi", "lamba-makinesi", "ahsap-torna", "cnc-router"] },
  { label: "Bağlantı Elemanları", categories: ["vida-seti", "dubel-seti", "civata-somun", "percinleme-aleti", "zimba-tabancasi"] },
  { label: "Isı & Yapıştırma", categories: ["sicak-hava-tabancasi", "sicak-silikon-tabancasi", "plastik-kaynak"] },
  { label: "Kaynak", categories: ["inverter-kaynak", "gazalti-kaynak", "argon-kaynak", "punta-kaynak", "kaynak-maskesi", "kaynak-teli", "kaynak-elektrodu"] },
  { label: "Kompresör & Havalı Alet", categories: ["kompresor", "basincli-yikama", "havalı-zimba", "havali-taslama", "havali-somun"] },
  { label: "Jeneratör & Enerji", categories: ["jenerator", "ups", "stabilizator", "solar-panel", "invertör"] },
  { label: "Pompa & Su", categories: ["dalgic-pompa", "santrifuj-pompa", "hidrafor", "tahliye-pompasi", "havuz-pompasi"] },
  { label: "Isıtma & Soğutma", categories: ["kombi", "klima", "elektrikli-isitici", "soba", "siklon-aspirator", "endustriyel-fan"] },
  { label: "Tesisat", categories: ["boru-kesici", "pafta-seti", "lehim-makinesi", "boru-bükme", "tesisat-pense", "kanal-acma-spirali", "test-pompasi", "musluk-batarya", "su-aritma"] },
  { label: "Elektrik & Elektronik", categories: ["kablo-soyucu", "krimpleme-aleti", "multimetre", "pensampermetre", "termal-kamera", "kablo-bulucu", "faz-algilayici", "toprak-test", "elektrik-panosu", "salter-sigorta", "priz-anahtar", "kablo-kanal"] },
  { label: "Ölçüm & Hizalama", categories: ["lazer-metre", "lazer-terazisi", "su-terazisi", "celik-metre", "kumpas", "mikrometre", "gonye", "profil-sablonu", "nem-olcer", "ses-olcer", "endoskop-kamera"] },
  { label: "El Aletleri", categories: ["cekic", "pense-seti", "tornavida-seti", "anahtar-seti", "lokma-takimi", "maket-bicagi", "kerpeten", "mengene", "allen-anahtar", "tork-anahtari", "boru-anahtari", "yankes", "el-makasi", "keskı", "raspa-ege", "cırcır-anahtar", "takim-cantasi"] },
  { label: "Kaldırma & Taşıma", categories: ["caraskal", "zincirli-vinc", "transpalet", "araba-kriko", "ceki-halati"] },
  { label: "Merdiven & İskele", categories: ["merdiven", "iskele", "platform-merdiven"] },
  { label: "Boya & Kaplama", categories: ["boya-tabancasi", "boya-kompresoru", "boya-rulosu", "airless-boya", "vernik-tabancasi"] },
  { label: "Bahçe & Dış Mekan", categories: ["motorlu-tirpan", "cim-bicme", "budama-makasi", "yaprak-ufleyici", "dal-ogutme", "motorlu-capa", "bahce-pompasi", "damlama-sulama", "hortum-seti", "bahce-makasi"] },
  { label: "Temizlik", categories: ["endustriyel-supurge", "zemin-temizleme", "halı-yikama"] },
  { label: "Güvenlik & Kamera", categories: ["guvenlik-kamerasi", "nvr-dvr", "akilli-kilit", "alarm-sistemi", "yangin-sondurme"] },
  { label: "İş Güvenliği", categories: ["baret", "koruyucu-gozluk", "is-eldiveni", "kulak-koruyucu", "toz-maskesi", "is-ayakkabisi", "emniyet-kemeri", "is-tulumu"] },
  { label: "Yapı Kimyasalları", categories: ["silikon", "montaj-kopugu", "yapistirici", "derz-dolgu", "su-yalitim", "beton-kimyasali", "epoksi", "macun"] },
  { label: "Çatı & İzolasyon", categories: ["cati-membran", "yalitim-malzemesi", "oluk-sistemi"] },
  { label: "Havalandırma", categories: ["aspirator", "havalandirma-fani", "kanal-tipi-fan"] },
  { label: "3D Printer & Hobi", categories: ["3d-printer", "3d-filament", "lazer-kaziyici", "havya-istasyonu"] },
  { label: "Aydınlatma", categories: ["kafa-lambasi", "santi-projektoru", "led-panel", "santi-lambasi"] },
  { label: "Oto Ekipman", categories: ["oto-lift", "lastik-sokme", "balans-makinesi", "oto-boya-kabini", "oto-yikama"] },
];

export interface Comparison {
  id: string;
  slug: string;
  productA: string;
  productB: string;
  content: string;
  verdict: string;
  createdAt: string;
}
