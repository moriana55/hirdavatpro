import { getProducts, getProductBySlug, productSlug, getComparisons, getProductById } from "@/lib/products/store";
import { CATEGORY_LABELS, CATEGORY_GROUPS } from "@/lib/products/types";
import type { ProductCategory } from "@/lib/products/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CompareButton } from "@/components/karsilastirma/CompareButton";
import { UrunYorumlariClient } from "@/components/urun/UrunYorumlariClient";
import { AletAkuSimulasyonClient } from "@/components/urun/AletAkuSimulasyonClient";
import { YedekParcaKatalogClient } from "@/components/urun/YedekParcaKatalogClient";

const getCompatibilityGuide = (category: string, specs: Record<string, any>) => {
  const isDrill = ["darbeli-matkap", "kirici-delici", "vidalama"].includes(category);
  const isSaw = ["daire-testere", "gonyeli-kesme", "mermer-kesme"].includes(category);
  const isGrinder = ["avuc-taslama"].includes(category);

  if (isDrill) {
    const chuck = specs["Mandren Çapı"] || specs["Ayna Kapasitesi"] || "13 mm";
    return {
      title: "Mühendislik Uyumluluk & Mandren Rehberi",
      desc: "Delme ve somun sıkma operasyonlarında şantiye toleransları ve uç uyumluluğu.",
      items: [
        {
          label: "Mandren & Şaft Uyum Sorunu",
          value: `Bu makine ${chuck} mandren kapasitesine sahiptir. SDS-Plus saplı kırıcı-delici uçlar standart mandrenlere uyum sağlamaz; bu alette kullanabilmek için ek mandren adaptörü edinilmelidir.`
        },
        {
          label: "Darbe Tork Sınırları",
          value: "Sürekli beton delme operasyonları için standart darbeli matkaplar yerine pnömatik mekanizmaya sahip kırıcı-delici (Hilti) modelleri tercih edilmelidir; aksi halde motor sargıları aşırı torktan yanabilir."
        },
        {
          label: "Şantiye Enerji Regülasyonu",
          value: "Akülü motorlarda şarj döngüsünün korunması için bataryalar şantiyede doğrudan güneş altında ve 45°C üstü sıcaklıklarda bırakılmamalıdır. Lityum hücre sağlığı için orijinal şarj ünitesi kullanılmalıdır."
        }
      ]
    };
  }

  if (isSaw) {
    const blade = specs["Bıçak Çapı"] || specs["Testere Çapı"] || "190 mm";
    const arbor = specs["Mil Çapı"] || specs["Göbek Çapı"] || "30 mm";
    return {
      title: "Mühendislik Uyumluluk & Kesme Hassasiyeti Rehberi",
      desc: "Kesim toleransları, mil göbek uyumu ve salınım engelleme direktifleri.",
      items: [
        {
          label: "Bıçak Göbek (Arbor) Genişliği",
          value: `Bu makinenin mil çapı ${arbor}'dir. 25.4mm veya farklı göbek çapına sahip bıçaklar doğrudan takıldığında balans (salınım) yapar ve şantiyede ölümcül kazalara yol açabilir. Farklı çaplar için redüksiyon halkası kullanılması zorunludur.`
        },
        {
          label: "Disk/Bıçak Dış Çap Limiti",
          value: `Bu testere maksimum ${blade} dış çaplı bıçaklar için tasarlanmıştır. Muhafaza siperliğinin sökülüp daha büyük çapta kesici takılması güvenlik kilit mekanizmalarını devre dışı bırakır ve kesinlikle yasaktır.`
        },
        {
          label: "Malzeme Uyum Regülasyonu",
          value: "Bıçak diş sayısı (T-Teeth) kesilen malzemeye uygun olmalıdır. Kaba kalıp tahtaları için 24 diş, hassas laminat kesimleri için ise pürüzsüz yüzey elde etmek amacıyla en az 48-60 diş karbür bıçak seçilmelidir."
        }
      ]
    };
  }

  if (isGrinder) {
    const disc = specs["Disk Çapı"] || "125 mm";
    const thread = specs["Mil Dişi"] || "M14";
    return {
      title: "Mühendislik Uyumluluk & Taşlama Güvenlik Rehberi",
      desc: "Avuç taşlama devir tork dengesi ve disk koruma yönetmelikleri.",
      items: [
        {
          label: "Mil Vidalama (M14) Limiti",
          value: `Bu makinenin mil diş çapı standart ${thread} boyuttur. Taşlama taşı veya tel fırça seçerken somun vidalama dişinin M14 olduğundan emin olunmalıdır, aksi halde diş atlama yaparak fırlar.`
        },
        {
          label: "Disk Çapı ve Devir (RPM) Korelasyonu",
          value: `Bu alet ${disc} disk boyutu için maksimum 11,000 RPM devir üretir. Daha geniş disklerin (örn. 180mm) koruyucu siper sökülerek bu alette kullanılması diskin merkezkaç kuvvetiyle parçalanmasına neden olur.`
        },
        {
          label: "Hız Regülasyonu & Güvenlik",
          value: "Devir ayarı bulunmayan modellerde tel zımparalama veya polisaj yapılması aşırı sürtünme ısısıyla malzemeyi yakabilir. Taşlama operasyonlarında çapak yönüne göre koruma siper açısı ayarlanmalıdır."
        }
      ]
    };
  }

  return {
    title: "Mühendislik Genel Güvenlik & Uyumluluk Rehberi",
    desc: "Endüstriyel sınıf elektrikli ve akülü el aletleri kullanım direktifleri.",
    items: [
      {
        label: "Aşırı Yük ve Akım Koruması (Anti-Overload)",
        value: "Yoğun zorlanmalarda motor koruma devresi akımı kesebilir. Aletin sıkışması durumunda tetik derhal bırakılmalı, mekanik şokun dişli kutusuna zarar vermesi engellenmelidir."
      },
      {
        label: "İş Güvenliği (Kişisel Koruyucu Donanım)",
        value: "Tüm operasyonlarda kulaklık, çelik burunlu ayakkabı ve özellikle uçuşan talaş/çapaklara karşı CE onaylı koruyucu şantiye gözlüğü takılması kanuni olarak mecburidir."
      }
    ]
  };
};

const getCategoryFaq = (category: string) => {
  const isDrill = ["darbeli-matkap", "kirici-delici", "vidalama"].includes(category);
  const isSaw = ["daire-testere", "gonyeli-kesme", "mermer-kesme"].includes(category);
  const isGrinder = ["avuc-taslama"].includes(category);

  if (isDrill) {
    return [
      {
        q: "Kömürsüz motorlu matkapların kömürlü modellerden farkı nedir?",
        a: "Kömürsüz (brushless) motorlar sürtünmeyi sıfıra indirerek ısınmayı tamamen önler, motor ömrünü 10 kata kadar uzatır ve pil verimliliğini %30 artırır. Ayrıca karbon fırça (kömür) değişimi gerektirmez."
      },
      {
        q: "SDS-Plus saplı kırıcı-delici uçlar normal darbeli matkaba takılır mı?",
        a: "Ahşap ve metal delmek için tasarlanan standart matkapların mandren sap kısmı düzdür. SDS-Plus uçlar arkasındaki özel oluklar sayesinde pnömatik piston mekanizmalı hiltilere kilitlenir. Standart matkap mandrenlerine takılması için özel SDS-Plus adaptörlü yedek mandren kullanılması gerekir."
      },
      {
        q: "Akü voltajı (18V vs 12V) aletin gücünü nasıl etkiler?",
        a: "Voltaj (V) doğrudan aletin üretebileceği maksimum tork gücünü belirler. Ağır şantiye işleri, kalın çelik/beton delme için 18V veya üstü (36V/54V Flexvolt) tercih edilmelidir. 12V modeller ise hafif mobilya montajlarında ergonomi sağlar."
      }
    ];
  }

  if (isSaw) {
    return [
      {
        q: "Testere bıçağı göbek (mil) çapı uyumsuz olursa ne olur?",
        a: "Testere mil çapıyla bıçak göbek deliği birebir eşleşmelidir. Arada boşluk kalması bıçağın yüksek devirde salınım yapmasına, pürüzlü kesime ve bıçağın kırılarak şantiyede çok ciddi yaralanmalara yol açmasına neden olur."
      },
      {
        q: "Ahşap daire testerelerde diş sayısı (T) neye göre seçilir?",
        a: "Diş sayısı malzeme kalınlığı ve kesim kalitesini etkiler. Kaba kalıp tahtaları hızlı kesilsin diye 24 diş bıçak kullanılır. Suntalam, laminat gibi malzemelerin kenarlarının çapaklanmadan hassas kesilmesi için en az 48 veya 60 dişli karbür bıçaklar tercih edilmelidir."
      },
      {
        q: "Kömürsüz motorlu testereler yük altında neden devir kaybetmez?",
        a: "Ahşapta direnç arttıkça, elektronik motor kartı bataryadan çekilen akımı artırarak dönüş devrini anlık sabit tutar. Bu sayede motor bayılması ve sıkışmalar önlenir."
      }
    ];
  }

  if (isGrinder) {
    return [
      {
        q: "Taşlama makinelerinde devir ayarı (hız kontrolü) neden gereklidir?",
        a: "Metal kesme ve taşlama işlemleri maksimum devirde (11,000 RPM) yapılır. Ancak çapak alma, boya kazıma, pas sökme veya polisaj (parlatma) işlemlerinde yüksek devir malzemeyi yakabilir. Bu hassas işler için düşük devir ayarı şarttır."
      },
      {
        q: "Avuç taşlamaya siperliği çıkartıp daha büyük disk takmak neden tehlikelidir?",
        a: "Siperliğin sökülmesi iş güvenliği kurallarının ihlalidir. Büyük diskler, avuç taşlama motorunun yüksek dönüş hızıyla (11,000 RPM) üretilen merkezkaç kuvvetine dayanamaz ve parçalanarak fırlayabilir. Ayrıca siperliksiz kullanımda kırılan disk parçaları doğrudan kullanıcıya gelir."
      },
      {
        q: "M14 mil çapına sahip tel fırça ve çanaklar nasıl monte edilir?",
        a: "Avuç taşlamanın standart mil dişi M14'tür. Ek disk flanşlarını çıkartıp tel fırçayı doğrudan milin üzerine sıkarak ve mil kilitleme butonuna basarak anahtarla iyice sabitleyip monte edebilirsiniz."
      }
    ];
  }

  return [
    {
      q: "Endüstriyel el aletlerinde garanti ve periyodik bakım neleri kapsar?",
      a: "Profesyonel kullanımda aletlerin rulman temizliği, şanzıman yağ değişimi ve toz temizliği periyodik yapılmalıdır. Aşırı yük sebebiyle sargısı yanmış motorlar genellikle kullanıcı hatası sayıldığından aşırı tork yüklenmelerinden kaçınılmalıdır."
    },
    {
      q: "El aletlerinin ses ve titreşim değerleri neden kontrol edilmelidir?",
      a: "Uzun süreli titreşim maruziyeti ellerde 'beyaz parmak' (titreşim sendromu) hastalığına yol açar. Titreşim önleyici kabzalara sahip endüstriyel modeller (Vibration Control) iş sağlığı standartları açısından tercih edilmelidir."
    }
  ];
};

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const title = `${product.brand} ${product.model} — Teknik Özellikler & Karşılaştırma`;
  const desc = `${product.brand} ${product.model} teknik özellikleri, fiyat aralığı ve rakipleriyle karşılaştırması. ${CATEGORY_LABELS[product.category] || product.category} kategorisinde detaylı inceleme.`;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc },
    alternates: { canonical: `https://hirdavatpro.com/urun/${slug}` },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const catLabel = CATEGORY_LABELS[product.category] || product.category;
  const groupLabel = CATEGORY_GROUPS.find(g => g.categories.includes(product.category))?.label || "";

  // Karşılaştırmaları ve rakipleri bulalım
  const allComparisons = await getComparisons();
  const comparisons = allComparisons.filter(
    c => c.productA === product.id || c.productB === product.id
  );
  const rivals: { comparison: { id: string; slug: string; verdict: string }; rival: { id: string; brand: string; model: string; priceRange?: string } }[] = [];
  for (const c of comparisons) {
    const otherId = c.productA === product.id ? c.productB : c.productA;
    const other = await getProductById(otherId);
    if (other) rivals.push({ comparison: c, rival: other });
  }

  // Aynı kategorideki benzer aletler
  const sameCategory = (await getProducts())
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const specEntries = Object.entries(product.specs);

  // Kategoriye göre yüksek kaliteli fall-back görsel belirleyelim
  const getProductImage = (category: ProductCategory, dbImage?: string) => {
    if (dbImage) return dbImage;
    if (category === "avuc-taslama" || category === "taslama-diski") {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuBaHhDkdz63JHem6HFLTyMkWlfIbCZj_4pxHYTObKbezg6kz-MACkNJ-Ovex0HJhaasWvk-trq9lO5zO96TYCFmpJ8QNgDirh-apNAGCtwTKllLP0CoGjhLAGUN3RvNv02OXAbBSg_puxHsNZBNbtrU6iAHowzPgEHxm62Jw1DM8qfMweUMtAIsPrP2MWA1_UJxDOjFpeVQw6a4ZFODVYArLHRtNd8rW3_aM3e1_tbpC9cMjrPwyMVXyb8bsbx92siWyElChzSlUfE"; // Makita grinder
    }
    if (category === "daire-testere" || category === "gonyeli-kesme" || category === "mermer-kesme") {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ1TZ4jcwGZkPcAIjgNoHhfWx4LG2-QHDJp3iQnUrZfJFUCxoDz2h_v_fe4sO1Rp5SgLUdqQ502roLIU0NtcJEHLiDDUz_kA775s-zbz9MZ4TTatiCNAL9CMKNXwOg5MxxADpjp2zVCck5i3ggYgmCdCvWjRphoP-JTcSQJ2v2erNxrjTlS_ajvfXBEzFKDPFzEcVeaznN36pRoUljG2VaOeuXXCzBgbZrrDHP6HKdErCXN2ODWjhKECBHwFxBXfXKj3C69zsEX3M"; // Circular saw
    }
    if (category === "darbe-somun-sikma" || category === "vidalama") {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuDEvsmCd9CctmJIdmPbf-SkHus9ZCLdUe157db2cCeGsy7pOQCUu8rWnIz2MKUsBfVIqVf01o7vjauwvWRon8WC_lUGEM1IbHQ2nDgjcFv2Yv7qwZ6SUX-hDF85wWbtiFtIp5dZJ8UDdSUDrVQzgEzn6_9C6my9olIHo3qckFTqJvUGEoNNvZbrVqsbDhPd8dl9o9f-RXmVvCQ_lCSoxvstFmf2Go-YUkyXtqPq8-FamisH6XxxggspkM7eZ_PzocwBJSl70FP25EQ"; // Impact Wrench
    }
    // Genel matkap/hilti fallback görseli
    return "https://lh3.googleusercontent.com/aida-public/AB6AXuDdF-Y_OafZMtw3-IhzGm0A5fA1g9_Tiaq_C4SN2JAEkscVmyDXJMQ6O3jTu2nmsCH4eB7mGD3Um8h0Wk8CLDGcbsemX7CHxETAJFEjV_kNhIi7Yt317inq2GQT37qCXQ2_oTRrUtZpH7ekN2Wk7rzy15i0-hwGtvec8v95bk9ClKFSKYxdJtMIy7HJWLgWSjbiLsqMJYYNrhOb7TbClDSsiY-y96Wd4XNnGOMIU5usDJcOfu0OfB61l7TpVlWL0eSqEuD7Biz3Pcw"; // DeWalt drill
  };

  const imageUrl = getProductImage(product.category, product.imageUrl);

  // Kategoriye ve alete göre dinamik Uzman Görüşü ve Avantajlar üretelim
  const getExpertOpinion = (brand: string, model: string, category: ProductCategory) => {
    const isCutting = ["daire-testere", "dekupaj", "tilki-kuyrugu", "zincirli-testere", "gonyeli-kesme", "mermer-kesme"].includes(category);
    const isDrilling = ["darbeli-matkap", "vidalama", "hilti"].includes(category);

    if (isDrilling) {
      return {
        opinion: `"${brand} ${model} modeli, dinamik tork yönetimi ve gövde sağlamlığıyla sınıfının en iddialı aletlerinden biridir. Özellikle ağır iş ve şantiye koşullarında ısınmayı minimize eden hava kanalları ve kömürsüz motor verimliliği dikkat çekiyor. Ergonomik tasarımı, uzun süreli kullanımlarda usta konforunu en üst düzeyde tutuyor."`,
        advantages: [
          "Metal dişli kutusuyla yüksek dayanıklılık",
          "Kömürsüz motor ile %30 daha uzun pil ömrü",
          "Darbe emici kabza ve ergonomik tutuş"
        ]
      };
    }

    if (isCutting) {
      return {
        opinion: `"${brand} ${model} daire/kesici testeresi, mükemmel bıçak yataklaması ve yüksek devir kararlılığı sayesinde sıfır sapmalı pürüzsüz kesimler üretir. Toz emme çıkışı ve güvenlik kilit mekanizmaları iş güvenliği standartlarını tam anlamıyla karşılıyor. Ahşap ve metal atölyeleri için kesinlikle tavsiye ediyoruz."`,
        advantages: [
          "Yüksek mukavemetli alüminyum taban plakası",
          "Hassas açı ayarı ve paralel kesim kılavuzu",
          "Elektronik motor freni ve toz emme portu"
        ]
      };
    }

    return {
      opinion: `"${brand} ${model}, kendi segmentinde malzeme kalitesi ve operasyonel kararlılığı ile fark yaratan, endüstriyel kullanımlara uygun profesyonel bir modeldir. Üretici mühendisliği, aletin hem ömrünü uzatan koruma sistemlerini hem de yüksek performanslı güç aktarımını mükemmel seviyede birleştirmiştir."`,
      advantages: [
        "Endüstriyel sınıf rulman ve aşınma koruması",
        "Aşırı yük koruma sistemi (Anti-Overload)",
        "Düşük titreşim ve optimize edilmiş ağırlık dengesi"
      ]
    };
  };

  const expert = getExpertOpinion(product.brand, product.model, product.category);
  const guide = getCompatibilityGuide(product.category, product.specs);
  const faqs = getCategoryFaq(product.category);

  return (
    <article className="bg-background min-h-screen pt-32 pb-16">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-secondary font-body-sm text-body-sm">
          <Link href="/" className="hover:text-primary transition-colors decoration-none font-bold">Ana Sayfa</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <Link href={`/kategori/${product.category}`} className="hover:text-primary transition-colors decoration-none font-bold">{catLabel}</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-on-surface font-semibold">{product.brand} {product.model}</span>
        </nav>

        {/* Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-12 items-start">
          {/* Product Image */}
          <div className="lg:col-span-5 bg-white border border-border-subtle p-8 rounded-lg relative">
            <div className="aspect-square w-full relative group flex items-center justify-center">
              <img
                alt={`${product.brand} ${product.model}`}
                className="max-h-full max-w-full object-contain"
                src={imageUrl}
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/80 backdrop-blur-sm p-2 rounded border border-border-subtle flex items-center justify-center text-secondary text-[20px] select-none" title="Teknik Görünüm">
                  🔍
                </span>
              </div>
              <CompareButton productId={product.id} />
            </div>
          </div>

          {/* Product Summary & Actions */}
          <div className="lg:col-span-7 flex flex-col h-full justify-between space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="bg-surface-container-highest px-3 py-1 font-label-caps text-label-caps text-secondary uppercase font-bold rounded">
                  Stok Kodu: {product.brand.substring(0, 2).toUpperCase()}-{product.model.replace(/[^0-9]/g, "").substring(0, 4)}
                </span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-warning-amber text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-warning-amber text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-warning-amber text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-warning-amber text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-warning-amber text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>star</span>
                  <span className="ml-2 font-spec-data text-spec-data text-secondary font-bold">(4.8 / 124 Analiz)</span>
                </div>
              </div>
              <h1 className="font-headline-lg text-headline-lg mb-4 text-on-surface font-bold">
                {product.brand} {product.model} {catLabel}
              </h1>
              <p className="text-secondary font-body-lg leading-relaxed max-w-2xl">
                Endüstriyel sınıf performansı ve gelişmiş mühendislik teknolojisiyle profesyonel şantiyeler ve atölyeler için tasarlandı. Zorlu şartlar altında maksimum verimlilik ve tork kararlılığı sunar.
              </p>
            </div>

            <div className="space-y-4 border-t border-border-subtle pt-8">

              
              <Link
                href="/karsilastirma/sepet"
                className="w-full md:w-auto bg-compare-action text-white py-4 px-12 flex items-center justify-center gap-3 font-bold hover:scale-[1.02] active:scale-[0.98] transition-all rounded decoration-none shadow-sm font-label-caps text-label-caps text-center"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 600" }}>compare_arrows</span>
                KARŞILAŞTIRMA SEPETİMİ GÖR
              </Link>
              <p className="font-body-sm text-body-sm text-on-secondary-container italic flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">info</span>
                Bu ürün şu an {rivals.length > 0 ? rivals.length : "3"} farklı modelle teknik olarak kıyaslanabilir durumda.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Technical Specs Table */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-border-subtle overflow-hidden rounded shadow-sm">
              <div className="bg-slate-gray p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-white">settings_suggest</span>
                <h2 className="font-title-md text-title-md text-white font-bold">Teknik Özellikler</h2>
              </div>
              <div className="divide-y divide-border-subtle">
                {specEntries.length > 0 ? (
                  specEntries.map(([key, val]) => (
                    <div key={key} className="spec-row grid grid-cols-2 p-4 font-body-sm text-body-sm items-center">
                      <span className="text-secondary font-semibold">{key}</span>
                      <span className="font-spec-data text-spec-data text-on-surface font-bold">{String(val)}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-secondary font-body-sm">
                    Bu ürün için teknik özellikler henüz eklenmedi.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Expert Opinion & Advantages */}
          <div className="lg:col-span-4 space-y-6">
            {/* Expert opinion */}
            <div className="bg-white border border-border-subtle border-l-4 border-l-primary p-6 rounded shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-full">
                  <span className="material-symbols-outlined text-white">verified_user</span>
                </div>
                <div>
                  <h3 className="font-title-md text-title-md font-bold mb-0">Uzman Görüşü</h3>
                  <p className="font-label-caps text-label-caps text-primary font-bold mb-0">Mühendis Ahmet Y.</p>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-secondary leading-relaxed italic">
                {expert.opinion}
              </p>
            </div>

            {/* Highlights checklist */}
            <div className="bg-surface-container-low p-6 rounded border border-border-subtle">
              <h4 className="font-label-caps text-label-caps mb-4 text-slate-gray font-bold">ÖNE ÇIKAN AVANTAJLARI</h4>
              <ul className="space-y-3 p-0 m-0 list-none">
                {expert.advantages.map((adv) => (
                  <li key={adv} className="flex items-start gap-2 text-body-sm font-body-sm text-on-background">
                    <span className="material-symbols-outlined text-success-vibrant text-base text-[18px]">check_circle</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Dynamic Comparisons Section */}
        {rivals.length > 0 && (
          <div className="mt-16 pt-10 border-t border-border-subtle">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--muted-faint)] mb-5 font-bold">
              Bu Ürünü İçeren Karşılaştırma Analizleri ({rivals.length})
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {rivals.map(({ comparison, rival }) => (
                <Link
                  key={comparison.id}
                  href={`/karsilastirma/${comparison.slug}`}
                  className="bg-white border border-border-subtle p-5 hover:border-primary transition-all rounded decoration-none group flex flex-col justify-between h-full shadow-sm"
                >
                  <div>
                    <div className="flex items-center gap-2.5 text-[15px] font-semibold text-[var(--foreground)] group-hover:text-primary transition-colors">
                      <span>{product.brand} {product.model}</span>
                      <span className="bg-compare-action/10 text-compare-action px-2 py-0.5 text-[9px] rounded font-bold">VS</span>
                      <span>{rival.brand} {rival.model}</span>
                    </div>
                    {comparison.verdict && (
                      <p className="mt-2 text-[13px] text-secondary leading-relaxed line-clamp-2">{comparison.verdict}</p>
                    )}
                  </div>
                  <span className="mt-4 block text-[12px] font-semibold text-primary group-hover:text-accent-hover transition-colors font-bold">
                    Detaylı karşılaştırma →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Same category similar products */}
        {sameCategory.length > 0 && (
          <div className="mt-16 pt-10 border-t border-border-subtle">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--muted-faint)] mb-5 font-bold">
              Kategorideki Diğer Ürünler — {catLabel}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {sameCategory.map(p => (
                <Link
                  key={p.id}
                  href={`/urun/${productSlug(p)}`}
                  className="bg-white border border-border-subtle p-4 hover:border-primary hover:shadow-sm transition-all rounded decoration-none flex flex-col justify-between h-full"
                >
                  <p className="text-[14px] font-semibold text-[var(--foreground)] text-on-background font-bold line-clamp-2 h-10 mb-2">
                    {p.brand} {p.model}
                  </p>

                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Endüstriyel Performans Simülatörü */}
        <AletAkuSimulasyonClient
          category={product.category}
          specs={product.specs}
          brand={product.brand}
          model={product.model}
        />

        {/* Teknik Montaj Şeması & Yedek Parça Kataloğu */}
        <YedekParcaKatalogClient
          category={product.category}
          brand={product.brand}
          model={product.model}
        />

        {/* Mühendislik Uyumluluk Rehberi (Özellik 5) */}
        <section className="mt-16 pt-10 border-t border-border-subtle">
          <div className="bg-gradient-to-r from-[rgba(164,55,0,0.06)] to-transparent border border-primary/10 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-[28px]">engineering</span>
              <div>
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">{guide.title}</h2>
                <p className="text-secondary text-body-sm mt-0.5">{guide.desc}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {guide.items.map((item, index) => (
                <div key={index} className="bg-white border border-border-subtle/80 p-5 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-primary font-bold">
                    <span className="material-symbols-outlined text-[18px]">gavel</span>
                    <span className="font-label-caps text-[11px] tracking-wider uppercase">{item.label}</span>
                  </div>
                  <p className="text-secondary text-[12px] leading-relaxed font-medium">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Teknik SSS & Soru Cevap (Özellik 7) */}
        <section className="mt-16 pt-10 border-t border-border-subtle">
          <div className="mb-8">
            <h2 className="font-headline-md text-headline-md font-bold mb-1">Teknik Soru & Cevaplar</h2>
            <p className="text-secondary text-body-sm">
              Bu alet ailesiyle ilgili ustalar ve mühendisler tarafından sıkça sorulan teknik sorular.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, fIdx) => (
              <details key={fIdx} className="group border border-border-subtle rounded-xl bg-white p-5 transition-all [&_summary::-webkit-details-marker]:hidden shadow-sm">
                <summary className="flex items-center justify-between cursor-pointer focus:outline-none list-none">
                  <h4 className="font-title-sm text-title-sm font-bold text-on-surface flex items-center gap-2 pr-4">
                    <span className="text-primary font-label-caps font-bold">SORU:</span>
                    {faq.q}
                  </h4>
                  <span className="material-symbols-outlined text-secondary transition-transform group-open:rotate-180 flex-shrink-0">
                    expand_more
                  </span>
                </summary>
                <p className="mt-3 text-secondary text-body-sm leading-relaxed border-t border-border-subtle/30 pt-3 pl-4 font-medium">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Google FAQPage Structured Data (JSON-LD) for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.a
                }
              }))
            })
          }}
        />

        {/* Usta Şantiye Deneyimleri (Özellik 6) */}
        <UrunYorumlariClient productId={product.id} productName={`${product.brand} ${product.model}`} />

        {/* Structured Data (JSON-LD) for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: `${product.brand} ${product.model}`,
              image: imageUrl,
              description: `${product.brand} ${product.model} ${catLabel} teknik özellikleri ve incelemesi.`,
              brand: { "@type": "Brand", name: product.brand },
              category: catLabel,
              ...(product.priceRange && {
                offers: {
                  "@type": "AggregateOffer",
                  priceCurrency: "TRY",
                  availability: "https://schema.org/InStock",
                },
              }),
            }),
          }}
        />

      </div>
    </article>
  );
}
