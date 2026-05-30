export interface BlogSection {
  heading?: string;
  body: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  sections: BlogSection[];
  relatedSlugs?: string[];
}

const posts: BlogPost[] = [
  {
    slug: "matkap-nasil-secilir",
    title: "Matkap Nasıl Seçilir?",
    excerpt:
      "Darbeli mi darbesiz mi? Akülü mü kablolu mu? Watt, devir ve tork değerleri ne anlama gelir? Adım adım matkap seçim rehberi.",
    category: "Delme & Vidalama",
    readTime: "8 dk",
    publishedAt: "2025-12-01",
    relatedSlugs: ["avuc-taslama-rehberi", "el-aleti-seti-rehberi"],
    sections: [
      {
        heading: "Darbeli mi, Darbesiz mi?",
        body: `Matkap seçiminde ilk ve en önemli soru budur. Darbeli matkaplar (İngilizce: hammer drill) hem döner hem de ileri-geri titreşim hareketi yapar. Bu özellik beton, tuğla ve taş gibi sert malzemeleri delmeyi mümkün kılar. Darbesiz matkaplar ise yalnızca döner hareket yapar; ahşap, metal ve plastik için idealdir.

Eğer aynı makineyle hem beton hem ahşap delecekseniz, "darbeli + darbesiz geçiş" modlu bir model tercih edin. Bu sayede tek makineyle her ikisini de yapabilirsiniz.`,
      },
      {
        heading: "Akülü mu, Kablolu mu?",
        body: `Akülü matkaplar şantiye ve saha çalışmaları için birebir; kablo bağımlılığı olmadan istediğiniz noktada çalışırsınız. Ancak aynı watt gücü için kablolu modele göre %20–30 daha pahalıdırlar ve aküyü şarj etmeyi unutmamalısınız.

Kablolu matkaplar sürekli, kesintisiz çalışma gerektiğinde daha avantajlıdır; özellikle uzun süreli atölye işlerinde ya da yoğun beton delinmesinde güç düşüşü yaşatmaz. Evde veya atölyede çalışıyorsanız kablolu, sahada veya yüksekte çalışıyorsanız akülü daha mantıklı olur.`,
      },
      {
        heading: "Watt, Devir ve Tork Ne Anlama Gelir?",
        body: `**Watt (W):** Motorun elektrik gücidir. Evde hafif işler için 500–700 W yeterlidir; ağır beton delme veya profesyonel kullanım için 900 W ve üzeri tercih edin.

**Devir (rpm):** Uç başına düşen dönüş sayısıdır. Yüksek devir ince delme ve metal için, düşük devir ise büyük çaplı delikler ve vidalama için uygundur. İki hızlı modeller esneklik sağlar.

**Tork (Nm):** Döndürme kuvvetidir; özellikle vidalama sırasında önemlidir. Tork ne kadar yüksekse o kadar büyük vida ve dirençli malzemeyle baş edebilirsiniz.`,
      },
      {
        heading: "Mandren Tipi: Anahtarlı mı, Anahtarsız mı?",
        body: `Anahtarsız (keyless) mandrenler ucu elle sıkıştırmanıza izin verir — uç değişimi saniyeler alır, alan çalışmalarında büyük pratiklik sağlar. Anahtarlı mandrenler biraz daha güçlü tutma kuvveti sunar ancak anahtar kaybetme riskini de beraberinde getirir.

Genel kullanım için anahtarsız mandren önerilir. Çok sık uç değiştiriyorsanız kesinlikle tercih edin.`,
      },
      {
        heading: "Alırken Dikkat Edilecekler",
        body: `- **Ağırlık:** Uzun süreli çalışmalarda hafif model yorgunluğu azaltır. 2 kg altı matkaplar tek elle kullanım için rahattır.
- **Ergonomi:** Kavrama genişliği, arka tutma kolu ve titreşim azaltma sistemi uzun mesailer için kritiktir.
- **Marka garantisi:** Bosch, Makita, DeWalt, Milwaukee gibi markaların yedek parça ve servis ağı geniştir.
- **Akü uyumluluğu:** Akülü alet ailesini genişletmek istiyorsanız aynı voltaj grubundaki markayla başlayın; aküleriniz diğer aletlerle uyumlu olur.`,
      },
    ],
  },
  {
    slug: "avuc-taslama-rehberi",
    title: "Avuç Taşlama Alırken Dikkat Edilecekler",
    excerpt:
      "115mm mi 125mm mi? Devir ayarı neden önemli? Taşlama diski tipleri ve güvenlik ipuçları.",
    category: "Taşlama & Zımparalama",
    readTime: "6 dk",
    publishedAt: "2025-12-05",
    relatedSlugs: ["is-guvenligi-ekipmanlari", "matkap-nasil-secilir"],
    sections: [
      {
        heading: "Disk Çapı: 115 mm mi, 125 mm mi?",
        body: `En yaygın iki boyut 115 mm ve 125 mm'dir. 125 mm diskler daha fazla kesim derinliği ve daha uzun disk ömrü sunar; genel kullanım için bu boyut tercih edilir. 115 mm ise dar alanlarda ve ince levhalarda daha manevralı çalışmayı sağlar.

Metal kesimi, pas temizleme ve taşlama işleri için 125 mm yeterlidir. Mermere ya da seramiğe daha hassas çalışacaksanız 115 mm daha iyi kontrol imkânı verir.`,
      },
      {
        heading: "Devir (rpm) ve Elektronik Hız Kontrolü",
        body: `Avuç taşlamalar genellikle 6.000–12.000 rpm arasında çalışır. Her disk tipi için farklı devir önerilir; yanlış devir hem iş kalitesini düşürür hem de disk kırılma riskini artırır.

**Elektronik hız ayarı** (değişken devir) sunan modeller farklı malzemelere uyum sağlar. Paslanmaz çeliği yüksek devirde işlemek renk bozmasına yol açabilir; bu yüzden devir düşürülmelidir. Taşlama şekillendirme veya cilalama disklerinde de düşük devir zorunludur.`,
      },
      {
        heading: "Disk Tipleri",
        body: `- **Taşlama diski:** Metal ve demir yüzey düzeltme, çapak alma.
- **Kesme diski:** Metal, demir boru ve profil kesimi. İnce (1–2 mm) modeller daha temiz keser.
- **Elmas disk:** Beton, seramik ve granit kesimi. Islak ve kuru kesim tipleri ayrıdır.
- **Tel fırça:** Pas, boya ve cüruf temizleme.
- **Flap disk / zımpara diski:** Yüzey zımparalama ve pah kırma. Kum numarası malzeme sertliğine göre seçilir.
- **Cilalama pedi:** Araba boyası veya metal parlatma için.`,
      },
      {
        heading: "Güvenlik: Hiç Taviz Verilmeyecek Maddeler",
        body: `Avuç taşlama en fazla iş kazasına yol açan aletlerin başında gelir. Şu kurallara uyun:

1. Daima yüz siperliği veya koruyucu gözlük takın.
2. Koruyucu kılıfı (muhafazayı) hiçbir zaman çıkarmayın.
3. Diskin maksimum hız sınırını (genellikle üzerinde yazılıdır) aşmayın.
4. Çatlak veya hasarlı disk kullanmayın.
5. İş parçasını sıkıca sabitleyin; el tutarak kesmeye çalışmayın.
6. Alet çalışıyorken diski değiştirmeye kalkışmayın.`,
      },
    ],
  },
  {
    slug: "kaynak-makinesi-secim-rehberi",
    title: "Kaynak Makinesi Seçim Rehberi",
    excerpt:
      "İnverter, gazaltı (MIG/MAG) ve argon (TIG) kaynak arasındaki farklar. Hangi kaynak hangi işe uygun?",
    category: "Kaynak",
    readTime: "10 dk",
    publishedAt: "2025-12-10",
    relatedSlugs: ["is-guvenligi-ekipmanlari", "kompresor-secimi"],
    sections: [
      {
        heading: "Kaynak Yöntemleri Hızlı Özet",
        body: `Piyasada üç temel kaynak yöntemi yaygındır:

- **MMA (Elektrik / Örtülü Elektrot):** En yaygın ve en uygun fiyatlı yöntemdir. Çelik, paslanmaz ve dökme demir için uygundur. Dış mekân ve rüzgarlı ortamlarda da çalışır. Öğrenmesi biraz zaman alır.
- **MIG/MAG (Gazaltı Kaynağı):** Tel elektrot ve koruyucu gaz kullanır. Daha temiz, cüruflu kaynak ve yüksek hız sunar. İnce saclar için idealdir; oto tamircileri ve imalat atölyeleri sıkça kullanır.
- **TIG (Argon Kaynağı):** En hassas ve temiz kaynak türüdür. Paslanmaz çelik, alüminyum ve egzotik metaller için tercih edilir. Öğrenmesi en zordur, her iki elin koordinasyonu gerekir.`,
      },
      {
        heading: "İnverter Kaynak Makinesi Nedir?",
        body: `İnverter teknolojisi, transformatör tabanlı eski nesil makinelere kıyasla çok daha hafif ve taşınabilir cihazlar üretilmesini sağlamıştır. 5–10 kg'lık bir inverter makine, 40–60 kg'lık eski nesil dönüştürücülerle aynı gücü sunar.

Aynı zamanda enerji verimliliği daha yüksektir (%80–90 verimlilik). Güç kaynağı dengesizliklerine daha dayanıklıdırlar. Küçük jeneratörlerle de kullanılabilirler; bu da saha çalışmalarında büyük avantaj sağlar.`,
      },
      {
        heading: "Amper Aralığı Nasıl Seçilir?",
        body: `Amper değeri kaynak nüfuziyetini (derinliğini) belirler. Genel kural:

- **1 mm malzeme kalınlığı ≈ 40 A**

3 mm çelik plaka kaynatacaksanız yaklaşık 120 A yeterlidir. Ortalama bir hobi kullanıcısı için 140–160 A makine çoğu işi halleder. Profesyonel ve ağır imalat için 200–300 A gerekebilir.

Daha yüksek amperli bir makine her zaman daha düşük amperle de çalışabilir; tersi geçerli değildir. Bu yüzden biraz üst aralıktan almak esneklik sağlar.`,
      },
      {
        heading: "Görev Döngüsü (Duty Cycle) Nedir?",
        body: `Görev döngüsü, 10 dakikalık bir sürede makinenin aktif kaynak yapabildiği oranı gösterir. Örneğin "60% @ 160 A" şu demektir: 10 dakikada 6 dakika 160 A'da kaynak yapabilirsiniz, kalan 4 dakika soğuması gerekir.

Profesyonel ve yoğun çalışma için %60 ve üzeri görev döngüsü arayın. Hobi ve ara sıra kullanım için %30–40 da yeterlidir.`,
      },
      {
        heading: "Hangi Yöntemi Seçmeli?",
        body: `| Kullanım Senaryosu | Önerilen Yöntem |
|---|---|
| Ev tamiri, demir bariyer, çit | MMA İnverter |
| Araba gövdesi, ince sac | MIG/MAG |
| Paslanmaz, alüminyum, hassas parça | TIG |
| Mobil saha çalışması | MMA İnverter (küçük jeneratörle uyumlu) |
| Hız önemli, cüruf istemiyorum | MIG/MAG |`,
      },
    ],
  },
  {
    slug: "kompresor-secimi",
    title: "Kompresör Nasıl Seçilir?",
    excerpt:
      "Litre, PSI, CFM ne demek? Yağlı mı yağsız mı? Atölye ve şantiye için doğru kompresör seçimi.",
    category: "Kompresör & Havalı Alet",
    readTime: "7 dk",
    publishedAt: "2025-12-15",
    relatedSlugs: ["el-aleti-seti-rehberi", "kaynak-makinesi-secim-rehberi"],
    sections: [
      {
        heading: "Temel Kavramlar: PSI, bar, CFM, lt/dak",
        body: `Bu terimler kafanızı karıştırmasın:

- **PSI (pound/inç²) veya bar:** Basınç birimidir. 1 bar ≈ 14.5 PSI. Havalı aletler genellikle 6–8 bar (87–116 PSI) basınçla çalışır.
- **lt/dak veya CFM:** Hava debisidir; kompresörün dakikada ürettiği hava miktarını gösterir. Aleti çalıştırabilmek için kompresörün debisi aletin ihtiyacından fazla olmalıdır.
- **Hazne (litre):** Kompresörün hava deposunun hacmidir. Büyük hazne, hava dolum aralarında daha uzun süre çalışmanızı sağlar.`,
      },
      {
        heading: "Yağlı mı, Yağsız mı?",
        body: `**Yağsız kompresörler** bakımı kolaydır; yağ değişimi gerekmez, daha hafiftir. Ancak daha gürültülü çalışır ve ömürleri yağlı modellere göre daha kısadır. Evde, hafif sandblasting veya zımbalama gibi aralıklı kullanımlarda yeterlidir.

**Yağlı kompresörler** daha sessiz, daha uzun ömürlü ve daha verimlidir. Sürekli kullanım gerektiren atölye ortamlarında tercih edilir. Düzenli yağ değişimi gerektirir; pistona gönderilen yağın hava hatlarına karışmaması için yağ tutucular eklenmelidir.`,
      },
      {
        heading: "Haznesi Ne Kadar Olmalı?",
        body: `Hazne büyüklüğünü kullanım senaryonuza göre seçin:

- **Şişirme, zımbalama, boyahane pistole (aralıklı):** 24–50 litre yeterlidir.
- **Havalı somun sökücü, havalı taşlama (orta yoğunluk):** 50–100 litre önerilir.
- **Kumlama (sandblasting), havalı fırçalama, sürekli kullanım:** 100 litre ve üzeri gerekir.

Küçük hazneli kompresörler sık sık motor çalıştırdığı için hem yorulur hem de elektrik tüketimi artar.`,
      },
      {
        heading: "Mono veya Çift Pistonlu?",
        body: `Tek pistonlu kompresörler daha uygun fiyatlıdır ve hafif kullanım için yeterlidir. Çift pistonlu modeller daha yüksek debi sağlar ve aynı basıncı daha az ısınarak üretir; bu da uzun çalışma süreleri için tercih sebebidir.

Değişken hava ihtiyacı olan profesyonel atölyeler için çift pistonlu ve büyük hazneli model en iyi uzun vadeli yatırımdır.`,
      },
      {
        heading: "Alırken Dikkat Edilecekler",
        body: `- Aleti çalıştırmak için gereken CFM değerini kontrol edin; kompresörün debisi en az %20 fazla olsun.
- Gürültü düzeyi (dB): Kapalı atölyede düşük ses önemlidir; 70 dB altı tercih edilir.
- Taşınabilirlik: Yatay tip modeller şantiyede daha kolay taşınır, dikey tipler zemin alanı kazandırır.
- Otomatik basınç kesme (pressostato): Hazne dolarken motoru otomatik durdurur; enerji tasarrufu sağlar.`,
      },
    ],
  },
  {
    slug: "el-aleti-seti-rehberi",
    title: "İlk Takım Çantası: Temel El Aletleri",
    excerpt:
      "Evde ve atölyede olmazsa olmaz el aletleri. Pense, tornavida, anahtar, çekiç — hangisinden kaç tane lazım?",
    category: "El Aletleri",
    readTime: "5 dk",
    publishedAt: "2025-12-18",
    relatedSlugs: ["matkap-nasil-secilir", "is-guvenligi-ekipmanlari"],
    sections: [
      {
        heading: "Tornavidalar",
        body: `İki tip şart: düz uç ve yıldız (Phillips) uç. Her ikisinden de en az S1, S2 ve S3 boyutlarında set bulundurun.

**İyi tornavida kriterleri:**
- Sap ergonomik ve kaymaz olmalı (çift bileşenli kauçuk sap)
- Uç sertleştirilmiş çelik olmalı (S2 çelik standart)
- Manyetik uç vidalama kolaylığı sağlar

Ucuz tornavidaların uçları ilk sıkıştırmada biçimini bozar; bu hem işi mahveder hem de eldiveni yırtar.`,
      },
      {
        heading: "Anahtarlar",
        body: `**Kombine anahtar seti (6–24 mm):** Bir ucu açık, diğer ucu kapalı (halka); en çok kullanılan ev tamiri aletidir.

**Ayarlı İngiliz anahtarı (200–250 mm):** Farklı boyut somun ve cıvatalarda tek aletle çalışmanızı sağlar.

**Lokma seti (1/4" veya 3/8" sürücü):** Elektrik ve otomotiv işlerinde vazgeçilmezdir; küçük başlıklar ile dar alanlara erişim sağlar.`,
      },
      {
        heading: "Pense Çeşitleri",
        body: `- **Kombinasyon pensesi (200 mm):** Kesmek, sıkmak ve bükmek için genel kullanım.
- **Yan keski (bıçak pense):** Tel ve kablo kesimi için.
- **İğne burunlu pense:** Dar alanlara erişmek ve küçük parçaları tutmak için.
- **Su pompası pensesi (Papağan):** Boru ve büyük somun için ayarlanabilir çene.

Her dört tip pense de alet çantasında bulunmalıdır.`,
      },
      {
        heading: "Çekiçler",
        body: `**Çivi çekici (500 g):** Çivi çakma ve sökmede klasik. Fiberglas veya çelik sap, ahşap saptan daha dayanıklıdır.

**Lastik tokmak:** Mobilya montajı, döşeme ve yumuşak vuruş gerektiren yerlerde parçayı zedelemeden yerleştirir.

**Kalemli çekiç (1 kg):** Kama, demir keski veya çivi ile çalışmak için ağır baş gerektiğinde kullanılır.`,
      },
      {
        heading: "Ölçüm Aletleri",
        body: `- **Şerit metre (5 m):** Kilitleme mekanizmalı, manyetik uçlu model tercih edin.
- **Su terazisi (60 cm):** Montaj, raf ve dolap işlerinde yatay-dikey kontrol için şart.
- **Marangoz kalemi / işaret kalemi:** Her ölçümde mutlaka işaret alın; "gözle tahmin" projeler pahalıya mal olur.

Bu üç ölçüm aracı, kötü hesaplama kaynaklı hataları %90 oranında azaltır.`,
      },
    ],
  },
  {
    slug: "is-guvenligi-ekipmanlari",
    title: "İş Güvenliği Ekipmanları Rehberi",
    excerpt:
      "Baret, gözlük, eldiven, kulak koruyucu, iş ayakkabısı — atölye ve şantiyede zorunlu koruyucu ekipmanlar.",
    category: "İş Güvenliği",
    readTime: "6 dk",
    publishedAt: "2025-12-22",
    relatedSlugs: ["avuc-taslama-rehberi", "kaynak-makinesi-secim-rehberi"],
    sections: [
      {
        heading: "Göz Koruması",
        body: `Atölye ve şantiyede göz yaralanmaları en sık karşılaşılan kazaların başında gelir; ancak %90'ı uygun gözlük kullanılsaydı önlenebilirdi.

**Koruyucu gözlük:** Kimyasal sıçrama ve toz için kapalı çerçeveli model. Yüz konturuna oturmalı, kenarı açık olmamalı.

**Yüz siperliği:** Taşlama, fırçalama ve tornalama sırasında kıvılcım ve parça fırlamasına karşı tüm yüzü korur. Gözlük yerine geçmez; ikisi birlikte kullanılabilir.

**Kaynak maskesi / kasklı maske (auto-darkening):** Elektrik kaynağında zorunludur. Otomatik kararanlar tepki süresi < 1/25.000 saniye olmalı.`,
      },
      {
        heading: "Kulak Koruyucu",
        body: `85 dB(A) üzerindeki gürültüye 8 saat ve daha fazla maruz kalmak kalıcı işitme kaybına yol açar. Taşlama makinesı 95–105 dB üretir; bu durumda maruz kalma limiti saatler içinde dolabilir.

- **Kulak tıkaçları (foam earplugs, SNR 30–37 dB):** Ucuz, küçük ve etkili. Uzun süreli gürültülü çalışmada daima kullanın.
- **Kulaklık tipi koruyucu (ear muff):** Takıp çıkarması daha kolay; iş aralarında başa geçirebilirsiniz.

Gürültülü ortamlarda biri diğerinin yerini tutmaz; hangisi uygunsa tutarlı kullanın.`,
      },
      {
        heading: "Eldiven",
        body: `Her iş için aynı eldiven yoktur:

- **Mekanik iş eldiveni (EN 388):** Kesme, yırtılma ve darbe karşı koruma sağlar; genel atölye için standart.
- **Kaynak eldiveni (deri):** Kıvılcım ve ısıya dayanıklı; uzun bilekli model bilekleri de korur.
- **Kimyasal dirençli eldiven (nitril, PVC):** Yağ, asit ve solvent ile çalışırken şarttır.
- **Anti-titreşim eldiven:** Uzun süreli avuç taşlama veya havalı keski kullanımında el-kol titreşim sendromunu azaltır.

Not: Dönen aletler (matkap, torna) çalışırken pamuklu örgü eldiven kesinlikle giyilmemelidir; alet eldiveni çekebilir.`,
      },
      {
        heading: "Ayak Koruyucu",
        body: `İş ayakkabısı standart EN ISO 20345'e göre sınıflandırılır. "S" sınıfı çelik burunlu modeller 200 J darbe dayanımını test eder.

- **S1:** Çelik burun + antistatik.
- **S2:** S1 + su geçirmez deri.
- **S3:** S2 + delinme karşıtı çelik taban (çivi geçirmez).

Şantiyede minimum S3, atölyede S2 önerilir. Düz tabanlı spor ayakkabı veya sandalet iş ortamında kabul edilemez.`,
      },
      {
        heading: "Solunum Koruması",
        body: `Toz, duman ve gaz maruziyet türüne göre koruyucu seçin:

- **FFP1:** Toz (toprak, ağaç, kum). Temel koruma.
- **FFP2:** Metal tozu, seramik, MDF tozu. Atölyede standart.
- **FFP3:** Toksik toz, bazı biyolojik riskler. Asbest ve ağır metal tozu için.
- **Yarı yüz maskesi + filtre:** Kimyasal buhar, boya ve solvent gazları için; doğru filtre kartüşü seçilmelidir.

Kaynak dumanı için en az FFP3 veya kaynak filtreli tam yüz maskesi kullanılmalıdır.`,
      },
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find(p => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  if (!post.relatedSlugs?.length) return [];
  return post.relatedSlugs
    .map(s => posts.find(p => p.slug === s))
    .filter(Boolean) as BlogPost[];
}
