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
  {
    slug: "zimpara-makinesi-rehberi",
    title: "Zımpara Makinesi Nasıl Seçilir?",
    excerpt:
      "Orbital mi, bant mı, delta mı? Kum numarası, toz toplama ve devir sayısı — ahşap, boya ve metal için doğru zımpara makinesi seçim rehberi.",
    category: "Zımpara & Perdah",
    readTime: "7 dk",
    publishedAt: "2026-05-31",
    relatedSlugs: ["avuc-taslama-rehberi", "daire-testere-rehberi", "is-guvenligi-ekipmanlari"],
    sections: [
      {
        heading: "Üç Tip Zımpara: Hangisi Sizin İçin?",
        body: `Zımpara makineleri temelde üç gruba ayrılır; doğru tipi seçmek işin yarısıdır.

**Orbital (eksantrik) zımpara:** En yaygın ev ve atölye makinesidir. Zımpara tabanı hem döner hem de küçük eksantrik bir yörüngede salınım yapar. Bu çift hareket sayesinde ahşap tanesinin yönünden bağımsız, iz bırakmayan pürüzsüz yüzey elde edilir. Geniş düz yüzeyler, mobilya ve zemin perdahı için idealdir.

**Bant zımpara:** Kauçuk tamburların üzerinde dönen zımpara bandı kullanır. Malzeme kaldırma hızı çok yüksektir; boyalı yüzey soyma, eski kaplama temizleme ve büyük ahşap parçaların şekillendirilmesinde kullanılır. Yanlış açıyla tutulursa derin izler bırakır; kontrol güçtür, deneyim gerektirir.

**Delta (üçgen) zımpara:** Sivri üçgen tabanı sayesinde köşelere, oymalara ve dar boşluklara girer. Orbital zincirsiz yerleri bitirmek için orbital ile birlikte kullanılır. Kaldırma kapasitesi düşük; ince perdah ve köşe temizleme işleri için uygundur.

Çoğu kullanıcı için **orbital zımpara** yeterlidir; bant zımparayı yalnızca ağır malzeme kaldırma ihtiyacınız varsa ekleyin.`,
      },
      {
        heading: "Kum Numarası (Grit): İşe Doğru Başlamak",
        body: `Zımpara kağıdının üzerindeki sayı, abrazif taneciklerin inceliğini gösterir. Sayı düştükçe tane kalabalıklaşır, kaldırma gücü artar.

- **40–60 kum:** Eski boya soyma, büyük çaplak ve çürüklerin temizlenmesi. Ham malzeme yüzeyi hızla kaldırılır; ince ahşapta derin çizik bırakır.
- **80–100 kum:** Kaba perdah başlangıcı. Yeni ahşap yüzeyini düzleştirmek, macun sonrası pürüzleri almak.
- **120–150 kum:** Genel amaçlı perdah; boya öncesi en yaygın son adım.
- **180–240 kum:** İnce perdah ve kat arası zımparalama. Boyalı yüzeyin sonraki kat için hazırlanması.
- **320+ kum:** Son perdah, mat bitişin parlatılması, şeffaf vernik yüzey.

**Kural:** Her zaman kaba kumdan başlayın, kademeli olarak inceletin. Kumu atlayarak zaman kazanmaya çalışmak sonuçta daha fazla iş çıkarır.`,
      },
      {
        heading: "Devir Sayısı ve OPM: Hız Ayarı Neden Önemli?",
        body: `Orbital zımparaların hızı **OPM (orbits per minute — dakikadaki salınım)** ile ölçülür. Bant zımparalarda ise bant hızı m/s cinsinden verilir.

Yüksek OPM (12.000–14.000) malzemeyi hızlı kaldırır; kaba işlerde ve sert ahşaplarda zaman kazandırır. Düşük OPM (6.000–8.000) daha kontrollü perdah sağlar; yumuşak ahşap, boyalı yüzey ve ince kaplamalar için uygundur.

**Hız ayarlı (değişken hız)** modeller her iki senaryoya da uyum sağlar. Tek sabit hızlı bütçe modellerinde ince işlerde çok agresif kaldırma yapılabileceğini göz önünde bulundurun.`,
      },
      {
        heading: "Taban Boyutu: 1/4, 1/3 mü, 150 mm mi?",
        body: `Orbital zımparaların tabanı standart zımpara kağıdı ölçülerine göre tasarlanır.

- **1/4 taban (115×115 mm):** Kompakt ve hafif; dar yüzeylere kolay girer. Zımpara kağıdını taban kenarından kesin. Kısa ve orta boylu işlerde yeterlidir.
- **1/3 taban (93×190 mm):** Uzun yüzeyler için daha hızlı ve verimli; kapı, masa üstü gibi dar ama uzun parçalarda avantajlı.
- **150 mm yuvarlak taban:** Geniş yüzey kapsar; zemin ve büyük panel perdahında verimlidir. Özel Velcro diskler kullanır (kağıt kesmeden doğrudan yapıştır).

Küçük taban = daha kolay manevra; büyük taban = daha hızlı bitiş. Çalışma parçalarınızın büyüklüğüne göre karar verin.`,
      },
      {
        heading: "Toz Toplama: Atölyenizin Ciğerleri",
        body: `Zımpara tozu hem sağlığa zararlı hem de çalışma kalitesini düşürür: toz birikintisi zımpara kağıdını tıkar, yüzeyde çizik bırakır.

İyi bir toz toplama sistemi en az **toz poşeti** içermelidir; daha iyisi **vakum hortumu bağlantısı** olan modellerdir. Çoğu kaliteli orbital zımpara tabanında delikler vardır (genellikle 6 veya 8 delik); bu delikler vakumun tozu içine çekmesine olanak tanır. Deliksiz modellerde toz tahliyesi çok daha kötüdür.

Uzun süreli kullanımda FFP2 toz maskesi takın; özellikle MDF, egzotik ahşap ve boyalı/vernikli yüzeylerde.`,
      },
      {
        heading: "Akülü mu, Kablolu mu?",
        body: `Zımpara makinelerinde güç ihtiyacı matkaptan düşüktür; bu nedenle akülü modeller kablolu seçeneklere oldukça yakın performans verir.

**Kablolu modeller** uzun atölye çalışmalarında güç düşüşü olmadan çalışır; hafif ve ucuzdur. Kablo şantiyede kısıtlayıcı olabilir.

**Akülü modeller (18V)** zemin perdahı, mobilya montajı ve saha işleri için özgürlük sağlar. Aynı markanın aküsünü başka aletlerle paylaşıyorsanız ek batarya maliyeti olmaz.

Ev kullanımı ve atölye için kablolu model çoğunlukla daha ekonomik; sahada ve çeşitli noktalarda çalışıyorsanız akülüyü tercih edin.`,
      },
      {
        heading: "Kullanım Güvenliği",
        body: `Zımpara makineleri matkap veya testereden daha güvenli görünse de dikkatsizlik yaralanmaya yol açar.

1. **Toz maskesi:** Ahşap ve boya tozu solunum yolu için zararlıdır; en az FFP2, MDF ve boyalı yüzeylerde FFP3.
2. **Göz koruması:** İnce toz parçacıkları gözü tahriş eder.
3. **İşi sabitlen:** İki elle veya mengeneyle sabitleyin; makinenin titreşimi parçayı kaydırabilir.
4. **Zımpara kağıdını kontrol edin:** Yırtık veya kopuk kağıt makineyi titretir ve düzensiz yüzey bırakır.
5. **Bant zımparada yönü koruyun:** Bant yönünün ahşap taneyle paralel olmasına özen gösterin; çapraz çalışma derin iz bırakır.`,
      },
    ],
  },
  {
    slug: "dekupaj-testere-rehberi",
    title: "Dekupaj Testere Rehberi",
    excerpt:
      "Eğri ve iç kesimler için en esnek alet: dekupaj testere. Bıçak tipi, salınım ayarı, tabla ve devir — ahşap, metal ve seramik için doğru seçim.",
    category: "Kesme & Testere",
    readTime: "7 dk",
    publishedAt: "2026-06-01",
    relatedSlugs: ["daire-testere-rehberi", "avuc-taslama-rehberi", "is-guvenligi-ekipmanlari"],
    sections: [
      {
        heading: "Dekupaj Testere Nedir ve Nerede Kullanılır?",
        body: `Dekupaj testere (jigsaw), ince dişli bir bıçağın yukarı-aşağı hareketi ile malzeme kesen el aletidir. Diğer testerelerden en temel farkı eğri, daire ve iç kesim yapabilmesidir: malzemenin ortasına daldırma kesimi (plunge-cut) yapabilirsiniz; çevre kenarından başlamak zorunda kalmazsınız.

Kullanım alanları:
- Mutfak tezgahı ve lavabo delik açma
- İç köşe ve profil kesimi (şablon ile)
- Laminat zemin ve panel kesimi
- 2–6 mm ince metal levha kesimi
- Seramik ve fiber çimento panel kesimi (özel bıçakla)

Marangoz için daire testereyi tamamlayan bir araçtır; faz araçlarının daire testeresi yapamayacağı her eğri kesimi dekupaj tama alır.`,
      },
      {
        heading: "Bıçak Tipi: T-Saplı mı, U-Saplı mı?",
        body: `Tüm modern dekupaj testereler **T-saplı (T-shank)** sisteme geçmiştir; bıçak anahtar gerektirmeden tek elle değiştirilir. Eski makinelerde görülen **U-saplı (U-shank)** bıçaklar hâlâ piyasada bulunur ancak yeni makine alıyorsanız T-saplı modeli tercih edin; bıçak çeşidi çok daha zengindir.

Bıçak seçimi malzemeye göre:
- **Ahşap, iri diş (TPI 6–8):** Seri kesim; yüzey kalitesi orta. Boyunsuz kesim, ahşap ve OSB.
- **Ahşap, ince diş (TPI 10–14):** Laminat, mobilya plakaları; daha temiz kenar, daha yavaş kesim.
- **Metal bıçağı (TPI 18–24):** 1–6 mm çelik, alüminyum, bakır boru. Yüksek devir istemez; 2.000–2.500 spm yeterli.
- **Elmas/karbür bıçak:** Seramik, fayans, fiber çimento.
- **Bıçaksız tel bıçak:** Cam fiber ve sentetik malzeme için.

TPI (teeth per inch) arttıkça yüzey kalitesi artar ama kesim hızı düşer.`,
      },
      {
        heading: "Salınım (Orbital) Ayarı Nedir?",
        body: `Salınım (orbital action) bıçağın yalnızca dikey değil aynı zamanda ileri-geri de hareket etmesini sağlar. Agresif salınım (3. kademe) çok daha hızlı malzeme kaldırır; düşük veya sıfır salınım daha temiz ve hassas kenar verir.

- **Salınım 0 (kapalı):** Metal, seramik, laminat, ince ahşap. Hassas kesim.
- **Salınım 1:** İnce-orta ahşap ve genel kesim.
- **Salınım 2–3:** Kalın ahşap, OSB, kaba boyuna kesim. En hızlı ilerleme.

Metal ve seramik için salınımı kapatmak zorunludur; aksi halde bıçak malzeme yüzeyini çizip titreşim yaratır ve bıçak ömrü kısalır.`,
      },
      {
        heading: "Devir (SPM) ve Hız Kontrolü",
        body: `Dekupaj testerenin hızı **SPM (strokes per minute — dakikada vuruş)** ile ölçülür. Çoğu kaliteli model 500–3.100 SPM arasında değişken hız sunar.

Yüksek SPM (2.500–3.100) ahşap ve plastik için hız sağlar. Metal için 1.500–2.000 SPM'de çalışmak hem bıçak ömrünü uzatır hem de kesim yüzeyini düzeltir; çok hızlı bıçak metalda ısınarak dişleri körleştirir.

Değişken hız tetiği (ayak basınca orantılı): ince ve kıvrımlı geçişlerde yavaşlama imkânı tanır. Sabit hız mandalı (lock-on) ise uzun düz kesimler için yorgunluğu azaltır.`,
      },
      {
        heading: "Tabla ve Makas Açısı",
        body: `Makine tabanı (tabla), malzeme üzerinde kayarak kesimi yönlendirir. 0°–45° yatırılabilen tablalar pah (bevel) kesimi sağlar; mutfak köşe birleştirme veya trapez kesimler için gereklidir.

**Tablanın kalitesine dikkat edin:** İnce sac taban ucuz modellerde çıkıntılara takılır; döküm alüminyum veya çelik taban daha kaygan ve hassastır.

Tabla kılavuz rayı veya dış destek mesnetleri bulunan modeller uzun düz kesimde marangoz kılavuz cetveli ile birlikte kullanılabilir; böylece daire testere kadar düz hat elde edilir.`,
      },
      {
        heading: "Akülü mu, Kablolu mu?",
        body: `**Kablolu modeller** sürekli ve değişmez güç sunar; uzun veya zor kesimler için daha güvenilirdir. Kablo şantiyede kılavuz düzeni bozabilir; ancak ev ve atölye için sorun değildir.

**Akülü modeller (18V)** büyük mutfak tezgahları ve sahada çalışırken kablo olmaksızın özgürce hareket etmeyi sağlar. Aynı voltaj ailesinin başka aletleriyle akü paylaşılabiliyorsa tercih edilir.

Dekupaj testereler matkaba kıyasla daha az güç çeker; bu nedenle 18V akülü modeller çoğu ev işi için yeterlidir.`,
      },
      {
        heading: "Güvenlik ve Kullanım İpuçları",
        body: `1. **Malzemeyi sıkıştırın:** Masaya mengene veya kıskaç ile sabitleyin. Tek elle malzeme tutarken diğer elde testere tutmak hem tehlikeli hem de kesim kalitesini düşürür.
2. **Bıçağı değiştirmeden önce aletin fişini çekin** (veya aküyü çıkarın).
3. Laminat yüzeyleri **kaplamalı tarafı alta alarak kesin**; bıçak yukarıdan aşağı çıktığı için kaplamalı kısım alta koyulduğunda yüzey temiz kalır.
4. Metal keserken yavaş besleyin ve soğutma yağı (kesme yağı) kullanmayı düşünün; bıçak ısınması hem talaşı pekiştirir hem de malzemeyi çarpar.
5. Toz maskesi ve gözlük takın; ince talaş ve metal kırıntıları göz için tehlikelidir.`,
      },
    ],
  },
  {
    slug: "gonye-kesme-makinesi-rehberi",
    title: "Gönye Kesme Makinesi Rehberi",
    excerpt:
      "Kaydırmalı mı, çift eğimli mi? Disk çapı, gönye ve eğim açısı aralığı, lazer kılavuz — atölye ve şantiye için doğru gönye makinesi seçimi.",
    category: "Kesme & Testere",
    readTime: "8 dk",
    publishedAt: "2026-06-01",
    relatedSlugs: ["daire-testere-rehberi", "dekupaj-testere-rehberi", "is-guvenligi-ekipmanlari"],
    sections: [
      {
        heading: "Gönye Kesme Makinesi Nedir?",
        body: `Gönye kesme makinesi (miter saw / chop saw), sabit bir diskin malzemeyi belirli açılarda kesmesini sağlayan tezgah üstü ya da taşınabilir bir alettir. Klasik dik kesimden 45° köşe birleştirmeye kadar geniş açı aralığında çalışır.

Temel kullanım alanları:
- Ahşap döşeme pervazı ve karkas profil kesimi
- Kapı ve pencere kasası köşe birleştirme
- Alüminyum profil ve PVC kesimi
- Parke/laminat kenar kesimi
- Çelik profil (özel diskle)

Daire testereden farkı: malzeme sabit tutulur, alet aşağı iner. Bu sayede tekrar eden köşe kesimler milimetrik hassasiyetle üretilir; seri marangozluk için vazgeçilmezdir.`,
      },
      {
        heading: "Tek Eğimli mi, Çift Eğimli mi? (Bevel)",
        body: `**Tek eğimli (single bevel):** Tabla sabitken baş yalnızca bir yöne (genellikle sola) yatırılabilir. Karşı taraf için malzemeyi döndürmeniz gerekir.

**Çift eğimli (dual bevel / compound):** Baş hem sola hem sağa yatırılır. Karmaşık bileşik açı (compound) kesimlerinde malzemeyi döndürmeden sağ ve sol pah aynı kurulumda kesilir. Çatı kaplaması, taç pervaz ve özel birleştirmeler için çok pratiktir.

Ev ve basit atölye kullanımı için **tek eğimli** yeterlidir. Profesyonel marangoz ve döşeme ustaları için **çift eğimli** zaman kazandırır.`,
      },
      {
        heading: "Kaydırmalı (Sliding) mi, Sabit mi?",
        body: `**Sabit gönye:** Baş yalnızca aşağı iner. Maksimum kesim genişliği disk çapına bağlıdır; 254 mm disk yaklaşık 100–130 mm kesim genişliği sağlar. Kompakt ve hafif; küçük atölyeler ve taşıma için avantajlı.

**Kaydırmalı gönye (sliding miter saw):** Baş aşağı inerken aynı zamanda ileri-geri kayar. Bu hareket sayesinde küçük bir diskle çok daha geniş tahta kesilebilir; 216 mm diskli kaydırmalı bir model 300–350 mm genişliğinde ahşap kesebilir.

Geniş parçalar, panel kenarı ve büyük profiller için kaydırmalı model şarttır. Kompakt çalışma alanında ise sabit model daha az yer kaplar.`,
      },
      {
        heading: "Disk Çapı Nasıl Seçilir?",
        body: `Yaygın disk çapları:
- **190 mm (7½\"):** Kompakt ve hafif; küçük pervaz ve ince ahşap için yeterli.
- **216 mm (8½\"):** En popüler ev ve küçük atölye boyutu; kesim derinliği ve genişliği dengeli.
- **254 mm (10\"):** Endüstriyel standart; geniş keresteler ve ağır atölye kullanımı.
- **305 mm (12\"):** Çok büyük kesim kapasitesi; profesyonel ve ticari ortamlar.

Disk büyüdükçe makine ağırlaşır ve fiyat artar. **216 mm kaydırmalı** çoğu kullanıcı için mükemmel denge noktasıdır.

Not: Disk çapı arttıkça diş seçim önemi de artar; 48–60 dişli ahşap diskleri temiz kesim sağlar, 80+ diş laminat ve MDF için idealdir.`,
      },
      {
        heading: "Açı Aralıkları: Gönye ve Eğim",
        body: `**Gönye açısı (miter):** Yatay düzlemdeki açıdır. Standart makineler 0°–45° (her iki yönde) sunar; bazı modeller 50°–52° kadar gider. Beşgen veya sekizgen çerçeve gibi alışılmadık açılar için geniş gönye aralıklı model tercih edin.

**Eğim açısı (bevel):** Dikeyde yatırma açısıdır. Çift eğimli modeller genellikle her iki yönde 45°–48° sunar.

**Durdurma noktaları (detent/preset):** Sık kullanılan açılarda (0°, 15°, 22,5°, 30°, 45°) otomatik kilit yapan pozisyonlardır. Kaliteli makinelerde bu kilit sert ve titreşime dayanıklı olmalı; gevşek kilit açı kaymasına yol açar.`,
      },
      {
        heading: "Lazer Kılavuz ve LED Aydınlatma",
        body: `Lazer kılavuz, disk kesim hattını malzeme yüzeyine kırmızı çizgi olarak yansıtır. Kalem işareti olmadan hızlı konumlandırma için faydalıdır; ancak lazer çizgisinin disk kenarının tam olarak neresinde olduğunu kalibre etmek gerekir.

LED çift gölge sistemi daha yeni bir çözümdür: iki küçük LED ışığının gölgesi kesim noktasını gösterir ve gün ışığında lazere göre daha net görünür. Bazı kullanıcılar bu sistemi lazere tercih eder.

Her iki sistemde de ilk kurulumda hurda parçayla test edin; fabrika kalibrasyonu her zaman %100 değildir.`,
      },
      {
        heading: "Toz Toplama ve Atölye Düzeni",
        body: `Gönye makineleri çok miktarda talaş üretir. Entegre toz torbası standart olmakla birlikte tutma oranı %30–50 civarında kalır; iyi bir atölye için endüstriyel vakum sistemi bağlantısı önerilir.

Makineyi duvara yakın konumlandırmayın: kaydırmalı modeller arkaya doğru yer açar. Standart bir 216 mm kaydırmalı model için tabladan duvara en az 30–40 cm boşluk bırakın.

Uzun parça desteği (stand veya mesnet) kesim hassasiyetini artırır: ağır ve uzun tahta makine tablasından düşünce hem kesim kayar hem de malzeme zarar görür.`,
      },
      {
        heading: "Güvenlik",
        body: `1. **Üst koruma kapağı her zaman yerinde olsun;** disk görünür halde bırakmak kabul edilemez.
2. **Malzemeyi tutma kolunuzla sıkıştırın** — disk aşağı inerken malzemenin kayması geri tepmeye neden olur.
3. Kesimden sonra diski **tam durana kadar tablaya sürmeyin;** disk fırlamış talaşı makineye geri taşıyabilir.
4. Gönye açısını değiştirmeden önce makineyi durdurun ve kilidi sıkıştırın.
5. Toz maskesi (FFP2), gözlük ve kulak koruyucu zorunludur; makine 95–100 dB gürültü üretir.`,
      },
    ],
  },
  {
    slug: "daire-testere-rehberi",
    title: "Daire Testere Seçim Rehberi",
    excerpt:
      "Disk çapı, diş sayısı, eğim açısı ve lazer kılavuz — daire testere alırken nelere bakmalısınız? Ahşap, laminat ve metal için doğru seçim.",
    category: "Kesme & Testere",
    readTime: "7 dk",
    publishedAt: "2026-05-30",
    relatedSlugs: ["dekupaj-testere-rehberi", "gonye-kesme-makinesi-rehberi", "is-guvenligi-ekipmanlari"],
    sections: [
      {
        heading: "Disk Çapı: 165 mm mi, 190 mm mi?",
        body: `Daire testerenin en temel parametresi disk çapıdır. **165 mm (6½\")** diskler hafif ve manevralı; çoğu ev ve ince şantiye işi için yeterlidir. Maksimum kesim derinliği yaklaşık 55 mm'dir — standart 50 mm konstrüksiyon tahtasını kolayca keser.

**190 mm (7¼\")** diskler endüstriyel standart kabul edilir. Yaklaşık 65 mm kesim derinliğiyle 2x8 ve çift katman malzemeleri rahatça işler. Ağırlık 165 mm'den 300–500 g daha fazladır; uzun mesailer için bu fark yorgunluk yaratabilir.

Evde marangozluk veya tadilat için 165 mm genellikle fazlasıyla yeterlidir. Çatı kaplaması, döşeme veya yoğun şantiye işi yapıyorsanız 190 mm tercih edin.`,
      },
      {
        heading: "Diş Sayısı: Hız mı, Kalite mi?",
        body: `Disk üzerindeki diş sayısı kesim hızını ve yüzey kalitesini doğrudan etkiler.

- **16–24 diş:** Ahşap ve OSB'nin hızlı boyuna/enine kesimleri için. Yüzey pürüzlü olabilir; görünmeyen kesimler için idealdir.
- **40–48 diş:** Çok amaçlı disk; laminat yüzeyli paneller, ince kontrplak ve mobilya plakaları için daha temiz kenar verir.
- **60–80 diş:** Laminat zemin, melamin kaplı tablalar ve alüminyum için yüksek kalite kesim. Kesim hızı düşer ama çentik ve tüylenmé en az düzeydedir.

**İpucu:** Laminatı ters çevirip kaplamalı yüzeyi alta alarak kesin; diş yukarıdan aşağı çıkarak kaplama yüzeyine zarar vermez.`,
      },
      {
        heading: "Eğim Açısı ve Kesim Derinliği Ayarı",
        body: `Kaliteli daire testereler 0°–45° (bazı modeller 50°–55°) arasında pah kesimi yapabilir. Eğim kilit mekanizmasının sağlamlığına dikkat edin; işlem sırasında kayma yaparsa hem hatalı kesim hem de tehlikeli geri tepme oluşabilir.

Kesim derinliği ayarı da kilit kolunun hassasiyetiyle ilgilidir: malzemenin yalnızca ~3–6 mm altına inmek yeterlidir. Gereksiz yere derin ayar hem kesim kalitesini düşürür hem de sıkışma riskini artırır.

Açılır kollu (plunge-cut) özelliği olan modeller, panel orta noktasından dalmaya izin verir; mutfak tezgahı ve pencere boşluğu gibi kesimler için pratiktir.`,
      },
      {
        heading: "Taban Plakaları: Magnezyum mu, Çelik mi?",
        body: `Taban plakası (taban tablası) testerenin malzeme üzerinde kaydığı kısımdır. **Çelik taban** daha ağır ama dayanıklıdır; uzun ömür ister. **Magnezyum taban** hafif ve pürüzsüzdür; yoğun kullanımda yorgunluğu azaltır ve kaymayı kolaylaştırır.

Alüminyum taban ucuz modellerde yaygındır; düşmelere karşı çelik kadar sağlam değildir. Profesyonel kullanım için magnezyum veya döküm çelik taban tercih edin.`,
      },
      {
        heading: "Lazer Kılavuz ve LED Aydınlatma",
        body: `Lazer kılavuz, kesim hattını malzeme üzerine yansıtarak kalemsiz doğrulama imkânı sunar. Parlak güneş ışığında lazer görünmeyebilir; bu durumda lazer yerine çift LED kılavuz sunan modeller daha pratiktir.

Her iki sistem de tam olarak disk kenarında değil, disk önündeki bir noktada konumlandığından kalibrasyonu başlangıçta doğrulayın. İlk kesimden önce hurda parçada test edin.`,
      },
      {
        heading: "Akülü mu, Kablolu mu?",
        body: `**Kablolu modeller** sürekli, kesintisiz güç sağlar; uzun parçaların seri kesilmesinde ve ağır ahşapta avantajlıdır. 1200–1800 W güç aralığı yoğun kullanım için yeterlidir.

**Akülü modeller** (18V veya 54/60V) mobilite sağlar; şantiye ve dış mekanda kablo çekme derdinden kurtarır. 18V piller çoğu ev işi için yeterli; 54V/60V modeller kabloluya yakın performans sunar ancak çok daha ağır ve pahalıdır.

Aynı markanın akü ailesinde başka aletleriniz varsa akülü tesereyi tercih etmek ekonomiktir.`,
      },
      {
        heading: "Güvenlik: Geri Tepme ve Bıçak Freni",
        body: `Daire testereler yanlış kullanımda **geri tepme (kickback)** yapabilir: disk malzemede sıkışır ve alet geri sıçrar. Önlemler:

1. Malzemenin her iki tarafını serbest bırakın; sıkıştırılmış taraf disk kenarına yapışır.
2. Kesim boyunca el kılavuzunu kullanın, tutun.
3. Disk çapına uygun hızda kesin; çok yavaş besleme sürtünmeyi artırır.
4. **Bıçak freni (electric brake)** özellikli modeller motoru bıraktığınızda diski 1–2 saniyede durdurur; standart modeller 8–10 saniye dönmeye devam eder.

Daima yüz siperliği, toz maskesi ve kesim güzergahının serbest olduğundan emin olun.`,
      },
    ],
  },
  {
    slug: "akulu-tornavida-rehberi",
    title: "Akülü Tornavida Rehberi: Doğru Modeli Nasıl Seçersiniz?",
    excerpt:
      "Tork, hız kademesi, akü kapasitesi ve bit seti — akülü tornavida alırken nelere dikkat etmeli? Hafif kullanıcıdan profesyonele tam rehber.",
    category: "Delme & Vidalama",
    readTime: "7 dk",
    publishedAt: "2026-06-02",
    relatedSlugs: ["matkap-nasil-secilir", "el-aleti-seti-rehberi"],
    sections: [
      {
        heading: "Tornavida mı, Matkap mı?",
        body: `Akülü tornavida (İngilizce: cordless screwdriver / drill-driver) ile akülü matkap sık sık karıştırılır. Temel fark şudur: tornavidalar vida sıkma ve hafif delme için optimize edilmiştir; düşük tork ayarları, hafif gövde ve genellikle daha küçük akü. Matkaplar ise hem delme hem vidalama yapabilir, daha yüksek güç sunar ama daha ağırdır.

Günlük ev tamiratları, mobilya montajı ve elektrik tesisatı işleri için akülü tornavida yeterlidir ve çok daha rahattır. Ancak yoğun beton delme veya uzun süreli ağır vidalama için matkap tercih edilmelidir.`,
      },
      {
        heading: "Tork Değeri Ne Anlama Gelir?",
        body: `Tork (Nm), motorun vida üzerine uyguladığı döndürme kuvvetidir. Ev kullanımı için 15–25 Nm yeterlidir; bu değer IKEA mobilyası, priz montajı ve hafif ahşap işleri için fazlasıyla yeterli güç sağlar.

Ağır ahşap işleri, zemin döşemesi veya metal montaj için 30–50 Nm arayan modellere bakın. 50 Nm üzeri tork genellikle matkap-tornavida (combi drill) kategorisine girer ve daha büyük, daha ağır modellerdir.

**Kavrama (clutch) kademeleri:** İyi bir tornavida 15–24 farklı tork ayarı sunar. Düşük kademeler hassas montajlarda vidayı yakmaz; yüksek kademeler derin, güçlü vidalama sağlar.`,
      },
      {
        heading: "Akü Voltajı ve Kapasitesi",
        body: `- **3.6V – 4V:** Çok hafif, tek elle kullanım. Yalnızca küçük vidalar için.
- **10.8V / 12V:** Ev kullanımı için ideal denge — hafif, yeterli güç. Büyük markaların bu segmentteki modelleri son derece yeteneklidir.
- **18V:** Daha fazla güç ve dayanıklılık; profesyonel kullanıcılar ve yoğun iş yükü için.

**Ah (amper-saat) kapasitesi:** 1.5 Ah kısa işler için yeterli; 2.0–3.0 Ah tam iş günü için güvenli. Kapasitesi yüksek akü hem daha ağır hem de daha pahalıdır, ancak şarj arası süreyi belirgin biçimde uzatır.`,
      },
      {
        heading: "Hız Kademeleri",
        body: `Tek hızlı modeller basit ev işleri için yeterlidir. İki hızlı modeller (1. kademe: yavaş-yüksek tork, 2. kademe: hızlı-düşük tork) çok yönlülük sağlar:

- **1. kademe (düşük hız):** Büyük vida sıkma, yüksek tork gerektiren montaj.
- **2. kademe (yüksek hız):** Küçük vida, hızlı delme.

Düzenli olarak farklı malzemelerle çalışıyorsanız iki kademeli model kesinlikle tercih edin.`,
      },
      {
        heading: "Bit Seti ve Mandren",
        body: `Çoğu akülü tornavida 6.35 mm (¼ inç) altıgen bit tutucu ile gelir. Bu standart sayesinde piyasadaki bit setlerinin tamamı uyumludur.

Kaliteli bir bit seti en az şunları içermelidir: PH1, PH2 (Phillips/yıldız), PZ1, PZ2 (Pozidriv), T20, T25 (Torx), düz uç ve alyan takımı. Manyetik bit tutucu vida düşürmesini önler — özellikle darlarda çalışırken büyük kolaylık sağlar.

Bazı modeller 10 mm anahtarsız mandrene sahiptir; bu sayede hem bit hem de normal matkap ucu kullanabilirsiniz.`,
      },
      {
        heading: "Marka ve Fiyat Rehberi",
        body: `- **Giriş segment (300–600 TL):** Bautec, Powermat — ev içi hafif kullanım için yeterli.
- **Orta segment (700–1.500 TL):** Bosch EasyDrill, Black+Decker BDCDD12 — ev kullanıcısına ideal denge.
- **Üst segment (1.500–3.000 TL):** Bosch Professional GSR, Makita DF333D — yarı-profesyonel veya yoğun ev kullanımı.
- **Profesyonel (3.000 TL+):** Milwaukee M12/M18, Festool, DeWalt — uzun garanti, güçlü servis ağı, sert saha koşulları.

Akülü alet ailesini genişletecekseniz aynı voltaj platformunu seçin: Bosch 18V, Makita 18V veya Milwaukee M18 gibi ekosistemler aküyü diğer aletlerle paylaştırmanızı sağlar.`,
      },
    ],
  },
  {
    slug: "lazer-tesviye-aleti-rehberi",
    title: "Lazer Tesviye Aleti Rehberi: Satın Alma ve Kullanım Kılavuzu",
    excerpt:
      "Çizgi lazer mi, nokta lazer mi, döner lazer mi? Doğruluk sınıfları, kendi kendini tesviye eden modeller ve profesyonel kullanım farkları.",
    category: "Ölçme & İşaretleme",
    readTime: "8 dk",
    publishedAt: "2026-06-02",
    relatedSlugs: ["is-guvenligi-ekipmanlari", "el-aleti-seti-rehberi"],
    sections: [
      {
        heading: "Lazer Tesviye Aleti Türleri",
        body: `Piyasada dört temel lazer tesviye tipi bulunur:

**1. Nokta lazeri:** Tek bir nokta veya birkaç nokta (genellikle 3–5) yansıtır. Zemin-tavan aktarımı ve dikme alımı için kullanılır. En basit ve en ucuz tiptir.

**2. Çizgi lazeri (cross-line):** Yatay ve/veya dikey lazer çizgisi yansıtır. Fayans döşeme, asma tavan, alçıpan montajı ve priz hizalama için yaygındır. Ev ve küçük ticari projelerin çoğu için yeterlidir.

**3. Döner lazer:** 360° dönerek tüm duvarlara ve tavana yatay çizgi çizer. Büyük alan seviyeleme, zemin döşemesi ve çatı işleri için kullanılır; profesyonel inşaat aletidir.

**4. Çok çizgili lazer (multi-line):** 3×360° veya 5 hat gibi gelişmiş modeller; büyük hacimli iç mekan işlerinde tek seferde tam referans sağlar.`,
      },
      {
        heading: "Kendi Kendini Tesviye Eden (Self-Leveling) Özelliği",
        body: `Modern lazer tesviye aletlerinin büyük çoğunluğu otomatik tesviye (self-leveling) özelliğine sahiptir. Alet hafifçe eğik kurulsa bile dahili sarkaç veya servo motor sayesinde ±4° ila ±6° aralığında kendini otomatik olarak dengeler.

Manuel modellerde ise dengelemeyi kendiniz yapmanız ve balonlu tesviye ile kontrol etmeniz gerekir; bu hem zaman alır hem de hata marjını artırır.

**Dikkat:** Eğim açısı self-leveling sınırını aşarsa çoğu alet sesli veya görsel uyarı verir ve ışını yanıp söndürür. Bu uyarıyı görmezden gelen ölçümler kesinlikle güvenilmez olur.`,
      },
      {
        heading: "Doğruluk Sınıfları ve ±mm/m Değeri",
        body: `Lazer tesviye aletleri doğruluklarına göre sınıflandırılır. Kutuda veya teknik tabloda "±X mm/10 m" gibi ifade edilir.

- **±3 mm/10 m:** Giriş seviyesi ev modelleri. Duvar boyama, perde ray montajı gibi hassasiyet gerektirmeyen işler.
- **±1 mm/10 m:** Orta segment. Fayans, laminat döşeme ve asma tavan için yeterli.
- **±0.5 mm/10 m:** Profesyonel inşaat kalitesi. Zemin betonu, kapı ve pencere kasaları, yüksek hassasiyetli montaj.
- **±0.1 mm/10 m:** Döner lazerler ve üst segment modeller. Nivelasyon, topoğrafik çalışmalar.

Ev kullanımı için ±1–2 mm/10 m değerine sahip bir model fazlasıyla yeterlidir.`,
      },
      {
        heading: "Çalışma Menzili ve Dedektör Kullanımı",
        body: `Çizgi lazerlerin görünür çalışma menzili genellikle 10–15 m'dir; parlak güneş ışığında daha kısa, karanlık ortamda daha uzundur. Kapalı mekan çalışmaları için çoğu model yeterlidir.

Açık hava veya büyük alanlarda lazer dedektörü (alıcı) kullanmak gerekir. Dedektör çıplak gözle görünmeyen ışını algılar; çalışma mesafesini 50–100 m'ye kadar çıkarır.

Yeşil lazer ışını kırmızıya göre aynı güçte yaklaşık 4 kat daha görünürdür. Geniş alanlarda veya aydınlık ortamlarda yeşil lazer tercih edin; ancak fiyatı da belirgin biçimde yüksektir.`,
      },
      {
        heading: "Montaj ve Aksesuar",
        body: `Çoğu lazer tesviye aleti standart ¼ inç tripod vidası deliğiyle gelir. Buna uygun bir tripod veya manyetik raf klips kombinasyonu hem elleri serbest bırakır hem de farklı yüksekliklerde çalışmayı kolaylaştırır.

Önemli aksesuarlar:
- **Manyetik duvar klipsi:** Hızlı kurulum, yüzey hasar vermeden tutar.
- **Uzatma tripodu:** Zemin ile tavan arasında herhangi bir yüksekliğe ayarlama.
- **Lazer gözlüğü:** Kırmızı lazer ışınını aydınlık ortamda daha görünür kılar.
- **Taşıma çantası:** Hassas optik için koruma şarttır.`,
      },
      {
        heading: "Hangi Modeli Almalısınız?",
        body: `- **Tek seferlik ev tamiratı (200–500 TL):** Uygun fiyatlı nokta veya tek çizgi lazer — perde ray, tablo asma, basit hizalama işleri.
- **Düzenli DIY ve tadilat (500–1.500 TL):** Çapraz çizgi lazer, self-leveling, ±1 mm/10 m — fayans, laminat, asma tavan.
- **Küçük ölçekli ticari kullanım (1.500–4.000 TL):** Çok çizgili lazer, yeşil ışın, dedektör uyumlu — montaj firmaları, elektrikçiler, sıhhi tesisatçılar.
- **İnşaat ve saha (4.000 TL+):** Döner lazer + dedektör seti — zemin betonu, nivelasyon, büyük alan tesviyesi.

Satın alma öncesi kontrol listesi: self-leveling var mı, doğruluk değeri kaç mm/10 m, akü mi fiş mi, tripod dahil mi, yetkili servis var mı?`,
      },
    ],
  },
  {
    slug: "isi-tabancasi-rehberi",
    title: "Isı Tabancası Rehberi: Hangi Model, Hangi Kullanım?",
    excerpt:
      "Boya soyma, boru bükme, büzme hortum ve ahşap yakma — ısı tabancası çok yönlü bir el aletidir. Watt, sıcaklık aralığı ve nozul seçimi rehberi.",
    category: "El Aletleri",
    readTime: "7 dk",
    publishedAt: "2026-06-03",
    relatedSlugs: ["el-aleti-seti-rehberi", "is-guvenligi-ekipmanlari"],
    sections: [
      {
        heading: "Isı Tabancası Ne İşe Yarar?",
        body: `Isı tabancası (İngilizce: heat gun), elektrik motoruyla ısıtılan havayı yüksek sıcaklıkta üfleyen bir el aletidir. Saç kurutma makinesiyle görsel benzerliğine karşın çok daha yüksek sıcaklıklara (150°C – 700°C) ulaşır ve tamamen farklı amaçlarla kullanılır.

Yaygın kullanım alanları:
- **Boya ve vernik soyma:** Ahşap, metal ve PVC yüzeylerden eski boyayı kabartır, kazımayla kolayca soyulmasını sağlar.
- **Büzme hortum (shrink tube) uygulaması:** Elektrik tesisatında kablo eklerini yalıtmak için kullanılan ısıyla büzüşen boruları aktive eder.
- **PVC boru bükme:** Alçıpan askı rayları, tesisat boruları ve dekoratif profilleri kırmadan bükülebilir hale getirir.
- **Ahşap yakma (Pyrography):** Kontrollü meme uçlarıyla ahşap yüzeyde dekoratif desen yakmak için kullanılır.
- **Yapıştırıcı ve folyo çözme:** Araç kaplama folyolarını, eski çıkartmaları ve etiketleri ısıtarak yapışkanı yumuşatıp temiz kaldırma sağlar.
- **Donmuş boru çözme:** Kışın donmuş metal borulara dikkatli ısı uygulanarak buzun çözülmesi sağlanır (PVC borularda kullanmayın).`,
      },
      {
        heading: "Watt ve Sıcaklık Aralığı",
        body: `Isı tabancaları genellikle **1.500W – 2.000W** güç aralığında üretilir. Watt değeri ne kadar yüksekse alet daha hızlı ısınır ve daha uzun süreli kullanımda stabil sıcaklık korur.

Sıcaklık aralığı kullanım alanına göre seçim yaparken kritiktir:

- **50°C – 300°C:** Büzme hortum, folyo ve etiket kaldırma, hafif yapıştırıcı çözme. Plastikle çalışırken yanmayı önlemek için düşük aralıkta çalışın.
- **300°C – 450°C:** Boya soyma, dolgu macun kurutma, PVC boru bükme. Çoğu genel amaçlı çalışma bu aralıkta gerçekleşir.
- **450°C – 600°C:** Metal yüzeylerde yoğun boya/vernik soyma, lehim eritme, ahşap yakma.
- **600°C+:** Cam şekillendirme, cam elyaf kalıp çalışmaları; profesyonel ve endüstriyel kullanım.

**Dijital vs. analog kontrol:** Dijital sıcaklık göstergesi hassas ayar imkânı sunar; hassas büzme veya folyo çalışmalarında fazladan 50°C'nin zarar verebileceği durumlarda bu özellik değerlidir. Analog modeller (düşük/orta/yüksek kademe) genel boya soyma ve ev tamiratı için yeterlidir.`,
      },
      {
        heading: "Hava Akış Hızı ve Çift Kademe",
        body: `Sıcaklık kadar önemli olan diğer parametre hava akış hızıdır (L/dk veya m/s olarak ifade edilir). Düşük akış hızı belirli bir noktayı yoğun ısıtır; yüksek akış hızı daha geniş alanı eşit ısıtır.

Çoğu orta ve üst segment model en az iki kademeli hava akışı sunar:
- **1. kademe (düşük akış):** Hassas çalışmalar — büzme hortum, küçük etiket, lehim.
- **2. kademe (yüksek akış):** Geniş yüzey boya soyma, boru çözme, büyük folyo kaldırma.

Tek kademeli modeller giriş segment ve yalnızca boya soyma kullanımı için yeterlidir; çok yönlü kullanım planlanıyorsa çift kademeli model tercih edilmelidir.`,
      },
      {
        heading: "Nozul (Meme) Çeşitleri",
        body: `Isı tabancasının asıl çok yönlülüğünü sağlayan aksesuarlar nozullardır. Temel tipler:

- **Düz nozul (standart):** Geniş, yayılmış ısı çıkışı. Boya soyma ve genel amaçlı kullanım.
- **Konsantre nozul:** Küçük noktaya yoğunlaştırılmış ısı. Büzme hortum, lehim ve hassas çalışmalar.
- **Yansıtma nozulu (reflektör):** U şeklinde veya kapalı, boruyu çevresinden eşit ısıtır. PVC boru bükme için zorunludur.
- **Cam nozulu (fish-tail/balık kuyruğu):** Geniş ve ince çıkış; cam yüzeyden folyo kaldırma veya büyük alan boya soyma için.
- **Ahşap yakma ucu:** Yüksek sıcaklıkta ince çizgi veya desen yakmak için.

Nozullar genellikle ¾–1 dakika sonra çok sıkı ısınır; değiştirirken ısıya dayanıklı eldiven kullanın veya aletin soğumasını bekleyin.`,
      },
      {
        heading: "Güvenlik: Yangın ve Yanık Riskleri",
        body: `Isı tabancası 400–600°C çıkış sıcaklığına ulaşabilir; bu nedenle basit bir el aleti olarak hafife alınmamalıdır.

Temel güvenlik kuralları:
1. **Alevi olan yüzeyler yakınında kullanmayın:** Yanıcı solvent, boya thinneri veya gaz kalıntısı bulunan yüzeyler alevin olmadığı durumlarda bile tutuşabilir.
2. **Kurşunlu boya soyarken dikkat:** 1970 öncesi yapılarda kurşunlu boya olabilir; ısıtmak zehirli buhar çıkarır. Maske ve havalandırma zorunludur.
3. **Asla tek yönde tutmayın:** Sürekli aynı noktaya odaklanmak yanmaya yol açar. Daima yavaş ve eşit hareketlerle çalışın.
4. **Çalışmadan sonra soğutun:** Kullanımdan hemen sonra masaya yatırmayın; nozul metal yüzeyleri yakabilir. Aletin ayak üzerinde dik durmasına izin verin ya da askıya asın.
5. **Plastik dumanından uzak durun:** PVC ve benzeri plastiklerin aşırı ısıtılması toksik klor bileşikleri çıkarabilir.`,
      },
      {
        heading: "Hangi Modeli Almalısınız?",
        body: `- **Giriş segment (150–350 TL):** Tek ya da çift kademeli, 1.500W, 2–3 nozul — büzme hortum ve hafif boya soyma için yeterli.
- **Orta segment (350–700 TL):** Dijital sıcaklık ayarı, 2.000W, geniş nozul seti — ev tamiratı ve tadilat projeleri için ideal.
- **Üst segment (700–1.500 TL):** LCD ekran, hassas ±10°C sıcaklık kontrolü, turbo mod, ergonomik gövde — yoğun kullanıcılar ve hobi atölyeleri için.
- **Profesyonel (1.500 TL+):** Bosch GHG 23-66, Steinel, Leister — sürekli endüstriyel kullanım, uzun ömür ve servis garantisi.

Neredeyse tüm kullanım senaryoları için orta segment bir model (400–600 TL) yeterlidir. Eğer büzme hortum ve etiket kaldırma dışında kullanmayacaksanız, giriş segment yeterlidir.`,
      },
    ],
  },
  {
    slug: "yuksek-basinc-yikama-makinesi-rehberi",
    title: "Yüksek Basınçlı Yıkama Makinesi Rehberi: Bar, Litre ve Doğru Seçim",
    excerpt:
      "Araç yıkama, bahçe, teras, çatı ve endüstriyel temizlik için yüksek basınçlı yıkama makinesi seçimi. Bar değeri, L/saat, lans türleri ve güvenlik rehberi.",
    category: "Temizleme & Bakım",
    readTime: "8 dk",
    publishedAt: "2026-06-03",
    relatedSlugs: ["kompresor-secimi", "is-guvenligi-ekipmanlari"],
    sections: [
      {
        heading: "Bar mı, L/saat mi — Hangi Değer Daha Önemli?",
        body: `Yüksek basınçlı yıkama makineleri iki temel parametre ile tanımlanır: **basınç (bar)** ve **su debisi (L/saat veya L/dk)**. İkisi birbirini tamamlar; yalnızca birine bakarak karar vermek yanıltıcı olabilir.

**Basınç (bar):** Su hızını ve delme/koparma gücünü belirler. Yüksek basınç, inatçı kiri, yosunu ve biyolojik birikintileri koparır. Araç yıkama için 100–130 bar yeterlidir; beton zemin ve çatı temizliğinde 150–200+ bar gerekebilir.

**Debi (L/saat):** Birim sürede pompalanan su miktarıdır. Yüksek debi, geniş yüzeyleri daha hızlı temizler ve köpük uygulamalarında daha etkilidir. 300–400 L/saat ev kullanımı için standart; 500–700 L/saat daha hızlı ve verimli temizlik sağlar.

**Temizlik Birimi (TU veya CU):** Bazı markalar bar × L/dk formülüyle hesaplanan birleşik etkinlik değerini kullanır. Bu değer yüksekse hem basınç hem debi dengelidir demektir; yalnızca bar sayısının yüksek olması debinin düşük olduğu modellerde performansı yanıltabilir.`,
      },
      {
        heading: "Motor Türleri: Elektrikli mi, Benzinli mi?",
        body: `**Elektrikli modeller:**
Ev ve bahçe kullanımı için standarttır. Fişe bağlıdır, elektrik kablosu uzunluğuyla sınırlıdır (genellikle 5–10 m). Avantajları: sessiz çalışma, bakımsız motor, hafif gövde, düşük başlangıç maliyeti. Güç kaynağı olmayan alanda kullanılamaz.

**Benzinli modeller:**
Uzak bölgelerde, inşaat alanlarında veya elektrik erişiminin olmadığı yerlerde vazgeçilmezdir. Çok daha yüksek basınç (250+ bar) ve debi üretebilir. Dezavantajları: gürültülü, ağır, yakıt ve yağ bakımı gerektirir, kapalı mekanda egzoz tehlikesi yaratır.

**Akülü modeller:**
Son yıllarda 18V–60V platformlarında ciddi performans gösteren akülü yıkama makineleri çıkmıştır. Araç yıkama ve balkon temizliği için pratiktir; ancak basınç ve debi elektrikli modellerin altında kalır ve akü ömrü genellikle 15–25 dakikadır.

Ev kullanımı için elektrikli model her zaman önerilen seçenektir.`,
      },
      {
        heading: "Lans ve Nozul Seçimi",
        body: `Yıkama makinesinin etkinliği büyük ölçüde kullanılan nozula bağlıdır. Nozuller genellikle renk kodlu açı ile tanımlanır:

- **0° (kırmızı):** Nokta bazlı, maksimum güç. İnatçı pas, beton kireci ve çatlak içi temizliği için. **Araç veya canlı dokular üzerinde KULLANMAYIN** — ciddi hasar verir.
- **15° (sarı):** Dar açılı yoğun jet. Beton, metal yüzey, mermer ve taş temizliği.
- **25° (yeşil):** En çok yönlü nozul. Araç yıkama, teras, ahşap çit, bahçe mobilyası. Başlangıç noktası olarak bu nozul önerilir.
- **40° (beyaz):** Geniş, yumuşak fan. Hassas yüzeyler, camlar, boyalı tahta.
- **65°–siyah (köpük nozulu):** Kimyasal ve şampuan uygulaması; deterjanı geniş alana eşit dağıtır.

Dönen fırça (rotary brush) ve çatı lansı gibi özel aksesuarlar, farklı yüzeyler için hem temizlik kalitesini artırır hem de basınçla zarar verme riskini azaltır.`,
      },
      {
        heading: "Su Girişi ve Depo Modeller",
        body: `Çoğu ev modeli şebeke suyu bağlantısıyla çalışır; makineye bağlanan hortum doğrudan musluğa gider. Minimum giriş basıncı genellikle 0.1–0.3 bar'dır — neredeyse tüm şebeke sistemleri bu koşulu sağlar.

**Depo (tank) modeller:** Şebekeye bağlantı olmayan alanlarda (saha, çiftlik, tekne) kullanım için su tankıyla birlikte gelir veya dışarıdan depodan beslenir. Makine kendi emme pompasıyla çalışır; kuru çalışma koruması olup olmadığını kontrol edin.

**Genişletilmiş hortum:** Standart hortumlar 6–8 m'dir. 15–20 m'ye kadar uzatma hortumları mevcuttur; ancak her ek metre basınç kaybına yol açar. Yüksek veya uzak noktalara çalışacaksanız uzun hortum yerine makinenin kendisini daha yakına taşıyın.`,
      },
      {
        heading: "Güvenlik: Geri Tepme, Cilt Kesikleri ve Yüzey Hasarı",
        body: `Yüksek basınçlı su jeti masum görünse de ciddi yaralanmalara yol açabilir:

1. **Cilt kesikleri:** 100 bar üzeri basınçta su eli veya ayağa yönlendirilirse derinin altına sızabilir ve enfeksiyona neden olabilir. Alet çalışırken lansı asla vücuda yönlendirmeyin.
2. **Gözlere su sıçraması:** Koruyucu gözlük takın; geri çıkıntılı yüzeylerde su geri sıçrar.
3. **Kayma tehlikesi:** Yıkanan zemin ıslanır ve kayganlaşır; kaymaz tabanlı ayakkabı giyin, zemin üzerinde dikkatli hareket edin.
4. **Yüzey hasarı:** 0° nozul ve aşırı yakın mesafe; yumuşak ahşap, boyalı metal, cam yüzey ve otomobil lakesinde hasara yol açar. Mesafeyi artırın veya açı nozulu değiştirin.
5. **Elektrik güvenliği:** Elektrikli modellerin kablosunu suyla temas ettirmeyin; IP sınıfına dikkat edin (IPX5 ve üzeri su sıçramasına karşı güvenli).`,
      },
      {
        heading: "Hangi Modeli Almalısınız?",
        body: `- **Hafif ev kullanımı — araç ve balkon (500–1.000 TL):** 100–120 bar, 300–360 L/saat, 1.400–1.600W — Karcher K2, Bosch EasyAquatak, Bautec serisi.
- **Orta kullanım — teras, çit, bahçe mobilyası (1.000–2.000 TL):** 130–150 bar, 400–450 L/saat, 1.700–1.900W — Karcher K4, Bosch AdvancedAquatak 140, Nilfisk Core 140.
- **Yoğun ev + hafif ticari (2.000–4.000 TL):** 150–180 bar, 500+ L/saat, 2.000–2.400W — Karcher K5/K7, Nilfisk Select 140, Makita HW1300.
- **Ticari ve endüstriyel (4.000 TL+):** 200+ bar, 600+ L/saat, paslanmaz pompa, uzun garanti — Karcher HD serisi, Nilfisk Alto, benzinli Briggs & Stratton motorlu modeller.

**Pratik ipucu:** Karcher K2 ile K7 arası modellerin üst nozul/aksesuar uyumluluğu kısmidir; aksesuar planı varsa aynı seri içinde kalın. Aynı şekilde Bosch ve Nilfisk serilerinde çapraz uyumluluk modele göre değişir, satın almadan kontrol edin.`,
      },
    ],
  },
  {
    slug: "planya-makinesi-rehberi",
    title: "Planya Makinesi Rehberi: Ahşap Yüzey Düzleme ve Model Seçimi",
    excerpt:
      "El planyası mı, masa planyası mı? Bıçak genişliği, talaş derinliği ve devir sayısı nasıl değerlendirilir? Ahşap işçiliği için eksiksiz planya rehberi.",
    category: "Ahşap İşleme",
    readTime: "9 dk",
    publishedAt: "2026-06-04",
    relatedSlugs: ["daire-testere-secim-rehberi", "dekupaj-testere-rehberi", "zimpara-makinesi-nasil-secilir"],
    sections: [
      {
        heading: "Planya Nedir ve Ne İşe Yarar?",
        body: `Planya makinesi, ahşap yüzeyleri belirli bir kalınlık ve düzlükte işleyen elektrikli el aletidir. Ana işlevi şunlardır:

- Eğri veya çarpılmış tahtalarda düz yüzey elde etmek
- Kapı ve çerçevelerden ince talaş alarak tam ölçüye getirmek
- Ahşap kenarlara pah kırmak (genellikle 45°)
- Birleştirme öncesinde yüzeyleri eşitlemek

Planya, zımpara makinesine göre çok daha hızlı ve daha fazla malzeme kaldırır; ancak bıçak izi bırakabileceğinden kaba düzleme sonrasında ince zımparalama tavsiye edilir.`,
      },
      {
        heading: "El Planyası mı, Masa Planyası mı?",
        body: `**El planyası (taşınabilir):**
Aleti ahşabın üzerinde hareket ettirerek çalışırsınız. Sabit olmayan, büyük veya yerinde işlenmesi gereken parçalar için idealdir. Kapı yontmak, duvara monte çerçeveleri düzeltmek gibi işlerde vazgeçilmezdir. 82 mm ile 110 mm arasında değişen bıçak genişliğine sahiptir.

**Masa planyası (kalınlık planyası / thickness planer):**
Ahşabı makinenin altından geçirerek sabit kalınlıkta çıkarmak için kullanılır. Tüm tahtaları aynı kalınlığa getirmek isteyenlerin aracıdır. Hacimli ve ağırdır; atölye kullanımına yönelik, taşınamaz.

**Yüzey planyası (jointer):**
Tahtanın bir yüzeyini tamamen düz hale getirir. Genellikle masa planyasından önce kullanılır: önce jointer ile bir yüz düzlenir, ardından masa planyasıyla karşı yüz o yüzeye paralel yapılır. İkisi birlikte kullanıldığında profesyonel ahşap işçiliğinin temelini oluşturur.

Ev kullanıcısı için taşınabilir el planyası genellikle en pratik başlangıç noktasıdır.`,
      },
      {
        heading: "Bıçak Genişliği ve Talaş Derinliği",
        body: `**Bıçak genişliği:** El planyalarında standart genişlikler 82 mm ve 102–110 mm'dir. 82 mm çoğu ev ve tamir işi için yeterlidir; daha geniş tahtalarda tek geçişte düzleme yapmak istiyorsanız 102+ mm tercih edin. Daha geniş bıçak daha ağır alet anlamına gelir.

**Maksimum talaş derinliği:** Tek geçişte alınabilecek en fazla malzeme miktarıdır. Genellikle 0–3 mm arasında ayarlanabilir. Kaba düzlemede 1–2 mm, ince son geçişte 0.2–0.5 mm önerilir. Derin talaş almak aletinizi yorar, bıçakları erken köreltir.

**Devir sayısı (dev/dk):** Yüksek devir daha pürüzsüz yüzey demektir. Kaliteli el planyaları 15.000–17.000 dev/dk aralığında çalışır. Düşük devirli modeller sert ahşapta bıçak izi bırakabilir.

**Motor gücü:** Ev kullanımı için 600–800 W yeterlidir; meşe, gürgen veya ceviz gibi sert ağaçları düzenli işleyecekseniz 850–1.100 W modelleri tercih edin.`,
      },
      {
        heading: "Bıçak Tipi: HSS mi, Karbür mü?",
        body: `**HSS (Yüksek Hız Çeliği) bıçaklar:**
Standart ve ucuzdur. Kolayca bilenebilir. Yumuşak ahşapta uzun süre keskin kalır; sert ahşapta veya yoğun kullanımda daha çabuk körelebilir. Bileme tecrübeniz varsa uzun vadede ekonomiktir.

**Karbür (widia) bıçaklar:**
Serttir, çok daha uzun ömürlüdür. Sert ağaçlar, MDF ve kontrplak gibi yapıştırıcı içeren malzemelerde HSS bıçaklardan 3–5 kat daha uzun süre keskin kalır. Bilemesi zordur, değiştirilmesi önerilir. İlk alım maliyeti yüksek, uzun vadede avantajlı.

**Çift bıçak vs. tek bıçak:** Çoğu el planyası iki bıçakla çalışır; bazı üst modeller 3 bıçak kullanır. Daha fazla bıçak = daha pürüzsüz yüzey ve daha uzun bıçak ömrü.

**Tek kullan-at bıçaklar:** Bazı markalarda (Bosch, DeWalt) döndürülerek iki keskin kenar sunan tek kullan-at karbon bıçaklar bulunur. Pratiktir ama uzun vadede maliyet hesabı yapın.`,
      },
      {
        heading: "Pah Kırma ve Kanal Açma",
        body: `El planyalarının önemli bir özelliği de **pah kırma** (chamfering) kapasitesidir. Tabanın ön kısmında genellikle 45° V-oyuğu vardır; bu oyuğa tahtanın kenarı yerleştirilerek tek geçişte düzgün pah elde edilir. Bazı modellerde 30°–60° arası ayarlanabilir pah kılavuzu bulunur.

**Kanal açma (rebating/rabbeting):** Bazı planyalarda tabanın bir tarafı tamamen açıktır; bu sayede kanal veya basamak profili oluşturulabilir. Bu özelliğe sahip modeller daha çok ahşap işçileri için avantajlıdır.

**Paralel kılavuz:** Çoğu planyada vida ile kilitlenen yan kılavuz aksesuarı standart olarak gelir. Tahtanın kenarından sabit mesafede düz planyalama yapmanızı sağlar.`,
      },
      {
        heading: "Toz Toplama ve Talaş Yönetimi",
        body: `Planya makineleri son derece fazla talaş üretir. Toz ve talaş yönetimi hem çalışma ortamı hem de sağlık açısından kritiktir.

- **Talaş çıkış yönü:** Çoğu planya sağa talaş atar. Bazı modellerde yön değiştirilebilir veya torba bağlantısı her iki yana da yapılabilir.
- **Toz torbası:** Tüm modellerde standart olarak gelir; ağırlığı ve hacmi kısıtlıdır, sık boşaltılmalıdır.
- **Endüstriyel süpürge bağlantısı:** 36 mm veya 58 mm adaptörle harici toz toplama sistemine bağlanır. Büyük işlerde mutlaka tavsiye edilir.
- **MDF ve kontrplak:** Bu malzemeleri işlerken ince toz yoğun çıkar. Toz maskesi (FFP2/FFP3) ve gözlük şarttır; formaldehit içeren yapıştırıcı gazları tehlikelidir.`,
      },
      {
        heading: "Kullanım Teknikleri ve Yaygın Hatalar",
        body: `**Doğru baskı ve hız:** Planyayı tutarlı hızda ilerletin; çok yavaş hareket yüzeyde yanma izine, çok hızlı hareket dalgalı yüzeye yol açar. Başlangıç ve bitiş noktalarında baskıyı tahtanın diğer ucuna kaydırın — aksi halde "at kafası" (snipe) denen baş ve son kısımda derin iz sorunu oluşur.

**Tahıl yönüne göre çalışın:** Ahşabın tahılıyla (lif yönüyle) aynı yönde planyalayın. Karşı yönde planyalamak parçalanmaya ve yüzey sökülmesine neden olur.

**Bıçak ayarı:** İlk geçişte kalın talaş (1–1.5 mm), son geçişlerde ince talaş (0.3–0.5 mm) alın. Son geçiş ne kadar ince olursa yüzey o kadar düzgün olur.

**Durak tahtası kullanın:** Küçük parçaları çalışma tezgahına vidalanmış durdurucularla sabitleyin; planya hem elinizi hem parçayı yerinden oynatabilir.

**Sert düğümlerden kaçının veya dikkatli geçin:** Budak (düğüm) noktalarında bıçak şoku yaşanabilir ve bıçak körelebilir; o noktalarda talaş derinliğini azaltın.`,
      },
      {
        heading: "Hangi Modeli Almalısınız?",
        body: `- **Giriş seviye — kapı yontma, ara sıra tamir (500–900 TL):** 82 mm bıçak, 600–650 W, 15.000 dev/dk — Bosch PHO 1500, Black+Decker KW750K, Bautec serisi.
- **Orta seviye — düzenli atölye kullanımı (900–1.800 TL):** 82 mm, 800–850 W, HSS veya karbür bıçak seçeneği — Makita KP0800, Bosch PHO 2000, Metabo Ho E 8260.
- **Profesyonel (1.800–3.500 TL):** 102–110 mm geniş bıçak, 900–1.100 W, yüksek devir, karbür bıçak standart — Makita KP0810, DeWalt DW680, Festool HL 850.

**Masa planyası (kalınlık planyası) — atölye için (3.000–8.000 TL):** Makita 2012NB (306 mm), DeWalt DW734, Jet 15G — seri üretim veya eşit kalınlık gerektiren projeler için.

**Pratik ipucu:** El planyası alırken bıçak yedek bulunabilirliğini kontrol edin. Bazı ucuz modellerde bıçak bulmak zorlaşabiliyor; Bosch, Makita ve DeWalt bıçakları her hırdavatçıda bulunur.`,
      },
    ],
  },
  {
    slug: "motorlu-testere-rehberi",
    title: "Motorlu Testere (Zincirli Testere) Rehberi: Doğru Model ve Güvenli Kullanım",
    excerpt:
      "Benzinli mi, elektrikli mi, akülü mü? Kılavuz uzunluğu, zincir adımı ve güvenlik ekipmanları. Ağaç kesme ve odun yarma için eksiksiz chainsaw rehberi.",
    category: "Kesme & Biçme",
    readTime: "10 dk",
    publishedAt: "2026-06-04",
    relatedSlugs: ["daire-testere-secim-rehberi", "dekupaj-testere-rehberi", "is-guvenligi-ekipmanlari-rehberi"],
    sections: [
      {
        heading: "Motorlu Testere Nedir ve Hangi İşlere Yarar?",
        body: `Motorlu testere (zincirli testere veya chainsaw), hareketli çelik zincir üzerindeki kesici dişlerle ağaç ve odun kesen motorlu alettir. Kullanım alanları:

- **Yakacak odun hazırlama:** Kütükleri belirli uzunluklarda kesmek (bucking)
- **Ağaç kesme:** Dal budama ve devrik ağaç temizliği (felling)
- **Bahçe bakımı:** Kuru dal temizliği, çalı kesimi
- **İnşaat/ahşap işçiliği:** Kaba kereste kesimi, tomruk şekillendirme (milling)
- **Acil durum ve temizlik:** Fırtına sonrası yol açma, devrilmiş gövde kaldırma

Yüzey zımparası veya daire testere ile karıştırmayın — motorlu testere çok daha büyük malzeme kaldırır ve orantılı güvenlik gereklilikleri vardır.`,
      },
      {
        heading: "Benzinli mi, Elektrikli mi, Akülü mü?",
        body: `**Benzinli motorlu testere:**
En yüksek gücü ve taşınabilirliği sunar. Elektrik kaynağı olmayan ormanlık alanlarda, büyük gövde kesiminde veya uzun süre kesintisiz çalışmalarda seçilecek seçenektir. Dezavantajları: gürültülü (100+ dB), titreşim yüksek, motor bakımı gerektirir (hava filtresi, buji, karbüratör), soğuk başlatma sorunu yaşanabilir. 30–90+ cc motor hacmi aralığında gelir.

**Elektrikli motorlu testere (kablolu):**
Bahçe ve küçük arazi kullanımı için uygundur. Fiyatı düşüktür, motor bakımı yoktur, her çekişte tam güç verir. Dezavantajı: elektrik kablosuyla sınırlıdır (genellikle 30–40 m). 1.800–2.400 W aralığında güç sunar.

**Akülü motorlu testere (brushless):**
Son yıllarda 18V–40V platformlarında ciddi güç gösteren modeller çıkmıştır. Sese duyarlı alanlarda (şehir bahçeleri), evin yakınında, platformda başka aletiniz varsa ideal seçenektir. Biri diğer aletlerle ortak akü platformuysa ek maliyet düşer. Dezavantajı: büyük gövde kesiminde benzinli modelin gerisinde kalır; akü ömrü 20–45 dakikadır.

**Karar rehberi:** Küçük bahçe ve ev kullanımı → elektrikli veya akülü; orman, büyük arazi, uzak alan → benzinli.`,
      },
      {
        heading: "Kılavuz Uzunluğu (Bar) ve Güç Eşleşmesi",
        body: `Kılavuz (bar), zincirin üzerinde döndüğü çelik levhaya verilen isimdir. Uzunluğu doğrudan kesilebilecek maksimum çap ile ilişkilidir.

| Kılavuz Uzunluğu | Uygun Kullanım | Tipik Güç |
|---|---|---|
| 25–30 cm | Dal kesimi, ince tomruklar (≤20 cm çap) | 30–35 cc / 1.5–1.8 kW |
| 35–40 cm | Orta çaplı gövde (≤35 cm), yakacak odun | 38–45 cc / 1.8–2.2 kW |
| 45–50 cm | Büyük gövde (≤45 cm), sert ağaçlar | 50–60 cc / 2.2–2.8 kW |
| 60+ cm | Profesyonel devrim kesimi | 70+ cc |

**Kılavuzu motora eşleştirme:** Küçük motora büyük kılavuz takılırsa testere güç kaybeder ve ısınır; büyük motora çok kısa kılavuz takmak ise boşa güç harcamasına yol açar. Üretici uyumluluk tablosunu mutlaka kontrol edin.`,
      },
      {
        heading: "Zincir Adımı ve Diş Profili",
        body: `**Zincir adımı (pitch):** Zincirleme art arda üç perçinin ortaları arasındaki mesafenin yarısıdır. En yaygın değerler:
- **1/4":** Çok küçük, hafif testere ve budama uygulamaları
- **3/8" LP (Low Profile):** Hafif ev testiyeleri, elektrikli modeller
- **3/8":** En yaygın evrensel adım; çoğu orta ve büyük testere
- **0.325":** Orta güçlü testere, hız/güç dengesi
- **0.404":** Ağır profesyonel kesim, büyük motor

**Diş profili:**
- **Tam keski (Full chisel):** Kare diş; sert ağaçta hızlı keser ama çabuk körelebilir, bileme için ustalık ister
- **Yarı keski (Semi chisel):** Yuvarlatılmış diş; daha uzun keskin kalır, kirli/kumlu ahşaçta daha toleranslı, bilemesi daha kolay
- **Düşük profil:** Hafif ve az güçlü testiyelerde standart; güvenli kullanım için sınırlı dişlenme

Zinciri satın alırken adım + diş sayısı + zincir kalınlığı (gauge) üçlüsünün kılavuzla uyumlu olmasına dikkat edin. Uyumsuz zincir takılmaz veya çıkar.`,
      },
      {
        heading: "Güvenlik Ekipmanları — Vazgeçilmez",
        body: `Motorlu testere, el aletleri içinde en yüksek yaralanma riskine sahip alet kategorisindedir. Aşağıdaki ekipmanlar zorunludur:

1. **Chainsaw koruyucu pantolon (chaps/trousers):** Ağır kumaş katmanları zincir temasını keserek bacak yaralanmalarını önler. EN 381-5 standardına uygun olmalı.
2. **Koruyucu bot:** Çelik burunlu, anti-kesim koruyuculu chainsaw botu (EN 381-3).
3. **Baret + yüz siperi:** Düşen ağaç parçalarına ve talaşa karşı. Entegre kulak koruyucu tercih edilebilir.
4. **Eldiven:** Titreşim önleyici, anti-kesim korumalı (EN 388).
5. **Kulak koruyucu:** Benzinli testere 100+ dB gürültü üretir; uzun süreli maruziyette işitme kaybı yaratır.

**Testere üzerindeki güvenlik sistemleri:**
- **Ön el koruma kalkanı + atış freni (chain brake):** Testere geri teper (kickback) anında freni devreye sokarak zinciri durdurur — asla devre dışı bırakmayın.
- **Zincirlerin sağ taraf koruyucu:** Zincirin kılavuzu terk etmesi durumunda el temasını önler.
- **Gaz kilidi (throttle interlock):** Yanlışlıkla tam gaz uygulanmasını önler.`,
      },
      {
        heading: "Geri Tepme (Kickback) ve Nasıl Önlenir?",
        body: `**Kickback nedir?** Kılavuzun üst ucu (saat 12 bölgesi, "kickback zone") bir nesneyle temas ettiğinde, testere kontrol dışında yukarı ve geriye doğru fırlar. Saniyenin çok küçük bir diliminde gerçekleşir ve en sık görülen ağır yaralanma sebebidir.

**Önlem adımları:**
- Kılavuzun üst ucunu kullanarak asla kesim yapmayın
- Düşük zincir hızında (rölanti) kesime başlamayın; tam gaz devrine geldikten sonra ahşaba temas ettirin
- Kesim yaparken kılavuzu açılı (paralel değil, hafif eğik) tutun
- Ön el koruma kalkanının temiz ve çalışır olduğundan emin olun
- Yorgunken veya rahatsızken çalışmayın — dikkat dağınıklığı en büyük risk faktörüdür

**Çalışma pozisyonu:** Testereyi daima iki elle tutun. Vücudunuzu kılavuzun hizasından değil, yanından konumlandırın.`,
      },
      {
        heading: "Bakım: Zincir Bileme, Yağlama ve Hava Filtresi",
        body: `**Zincir bileme:** Körleşmiş zincir hem tehlikelidir (daha fazla güç uygulanır, kontrol azalır) hem de motoru zorar. Belirtiler: talaş yerine toz çıkması, testereyi kesmek için baskı yapmak zorunda kalmak. El bileme dosyası veya elektrikli bileme aleti kullanılabilir. Adım ve diş profiline göre doğru dosya çapını seçin; üretici kılavuzunda belirtilmiştir.

**Zincir yağı:** Zincir ve kılavuz, otomatik yağlama pompasıyla yağlanır. Yağ deposu ayrıdır; her yakıt doldurduğunuzda kontrol edin. Düşük yağ = hızlı kılavuz aşınması. Kaliteli chainsaw bar & chain oil kullanın; bitkisel yağ da çevresel seçenek olarak kabul edilir.

**Hava filtresi:** Benzinli modellerde kirli hava filtresi yakıt tüketimini artırır ve motor güçten düşer. Her 5–10 çalışma saatinde kontrol edin, temizleyin; gerekirse değiştirin.

**Buji:** Her sezonda kontrol edin; karbonlanmış buji soğuk başlatma sorununa yol açar.

**Yakıt:** Modern benzinli testere motorları 2 zamanlıdır — yakıta yağ karıştırılır (genellikle 50:1 oranı). Yanlış karışım motoru yakar. Hazır karışım yakıt kullanılabilir.`,
      },
      {
        heading: "Hangi Modeli Almalısınız?",
        body: `- **Hafif bahçe kullanımı — ince dal ve küçük gövde (elektrikli, 800–1.500 TL):** 30–35 cm bar, 1.800–2.000 W — Bosch UniversalChain 35, Black+Decker GK1840T, Einhell serisi.
- **Orta kullanım — yakacak odun, orta gövde (akülü 18V–40V, 1.500–4.000 TL):** 35–40 cm bar — Makita DUC355Z (18V×2), DeWalt DCCS670, Greenworks 60V.
- **Bahçe + orta orman (benzinli giriş, 2.000–3.500 TL):** 35–40 cm bar, 38–42 cc — Husqvarna 135, STIHL MS 170/180, Echo CS-310.
- **Ağır odun ve büyük gövde (benzinli orta, 3.500–6.000 TL):** 45–50 cm bar, 50–55 cc — Husqvarna 450 Rancher, STIHL MS 250/271, Oregon CS1500.
- **Profesyonel (6.000 TL+):** 50+ cm bar, 60+ cc — Husqvarna 572XP, STIHL MS 462, Makita EA6100P.

**Pratik ipucu:** STIHL ve Husqvarna yetkili servis ağı Türkiye'de yaygındır; yedek parça ve zincir bulmak kolaydır. Marka bilinmez ucuz modellerde servis ve yedek parça sıkıntısı yaşanabilir. Güvenlik önlemlerini ve ekipmanlarını almadan testereye başlamayın.`,
      },
    ],
  },
  {
    slug: "fayans-kesici-rehberi",
    title: "Fayans Kesici Seçim Rehberi: Manuel mi, Elektrikli mi?",
    excerpt:
      "Kılavuzlu manuel kesici mi, ıslak testere mi, açılı taşlama mı? Seramik, porselen ve mermer için doğru fayans kesici nasıl seçilir?",
    category: "Seramik & Döşeme",
    readTime: "8 dk",
    publishedAt: "2026-06-05",
    relatedSlugs: ["avuc-taslama-rehberi", "is-guvenligi-ekipmanlari", "matkap-nasil-secilir"],
    sections: [
      {
        heading: "Fayans Kesici Türleri",
        body: `Fayans kesmek için kullanılan üç temel alet tipi vardır:

**1. Manuel kılavuzlu kesici (snap cutter / el kesici):**
Üzerinde sert metal veya elmas çizici tekerleği bulunan raydan oluşur. Fayanstaki çizgiyi takip ederek tek bir kırma hareketiyle kesim yapılır. Elektrik gerektirmez, sessizdir, taşınabilir. Düz ve diyagonal kesimler için idealdir; ancak L şekli, delik veya açılı kesim yapamaz.

**2. Elektrikli ıslak testere (tile wet saw):**
Elmas diskli, soğutma suyu devreye giren masa testere. Porselen, granit, mermer gibi sert ve kalın seramikler için en doğru kesim sunar. Hem düz hem de eğim kesimi (45° pah) yapabilir. Su sıçraması nedeniyle kapalı atölye kullanımına yönelik.

**3. Avuç taşlama + elmas disk:**
Sahada ve dar köşelerde L kesimi, delik kesimi veya düzensiz şekil kesimi için kullanılır. En esnek yöntemdir ama en az hassas olanıdır. Toz ve kesim kalitesi açısından ıslak testereye göre zayıftır.`,
      },
      {
        heading: "Manuel Kesici Nasıl Seçilir?",
        body: `Manuel kesicilerde dikkat edilecek başlıca özellikler:

**Kesim uzunluğu:** Kesici rayının uzunluğu, kesebileceğiniz maksimum fayans boyutunu belirler. 60×60 cm fayans için en az 63–65 cm ray uzunluğu gerekir; 90×90 veya 120×60 formatlar için 95–125 cm modeller bulunur. Kullanacağınız fayans formatına göre seçin.

**Çizici tekerlek kalitesi:** Tungsten karbür veya elmas kaplı tekerlek, sert porselen ve seramiği düzgün çizer. Ucuz modellerdeki düşük kalite tekerlek kayar ve kırma çizgisi eğri olur. Tekerleğin değiştirilebilir olması uzun vadede avantajlıdır.

**Kırma kolu kuvveti ve kaldıraç mesafesi:** Uzun kaldıraç kollu modeller daha az kuvvetle daha temiz kırma yapar; özellikle 10 mm üzeri kalınlıkta porselen için kol gücü kritiktir.

**Baza tablası sağlamlığı:** Alüminyum veya çelik baza, fayansın titremeden sabit durmasını sağlar. Plastik baza ucuz modellerde zamanla bükülür ve doğruluk bozulur.

**Ölçü cetveli ve köşe ayarı:** Tekrarlanan eşit kesimler için ölçü cetveli, diyagonal kesim için 45° açı tutucu şarttır; bu özelliklerin kilit ve ayar kalitesini kontrol edin.`,
      },
      {
        heading: "Elektrikli Islak Testere: Ne Zaman Gerekli?",
        body: `Aşağıdaki durumlarda ıslak testere tercih edin:

- **Porselen ve granit seramik:** 8–12 mm kalınlıkta, çok sert malzemeler. Manuel kesicide kırılma, çatlama ve düzensiz kenar oluşur.
- **L kesimi ve iç köşe:** Tuvalet veya lavabo etrafı gibi şekilli kesimler için.
- **45° pah (bevel) kesimi:** Köşe birleştirme ve süpürgelik bitişlerinde kullanılır.
- **Çok sayıda kesim:** Banyo veya mutfak döşemesinde yüzlerce kesim yapılacaksa ıslak testere hem hız hem de kenar kalitesi açısından avantajlıdır.
- **Kalın taş ve mermer:** 20–30 mm kalınlık manuel kesiciyle işlenemez.

Islak testere seçerken masa genişliği, disk çapı (180–250 mm arası yaygın), motor gücü (600–1.500 W) ve su toplama haznesi kapasitesine dikkat edin. Diskin sürekli ıslak kalması için su akışının düzenli olduğundan emin olun.`,
      },
      {
        heading: "Elmas Disk Seçimi",
        body: `Elmas disk türü, kesim kalitesini ve hızını doğrudan etkiler:

**Sürekli kenarlı (continuous rim):** Kesim kenarı boyunca kesintisiz elmas şerit. Seramik ve cam için en temiz kesim sunar; ancak soğutma için su kullanımı önerilir. Kuru kullanımda aşırı ısınır.

**Segmentli (segmented):** Disk kenarında boşluklar vardır; ısının dağılmasını sağlar. Kuru kesimde beton, tuğla ve granit için uygundur. Seramikte kenar kalitesi sürekli kenarlıya göre daha pürüzlüdür.

**Turbo (hibrit):** Hem hız hem de kenar kalitesi sunar. Çok amaçlı kullanım için tercih edilir; seramik, porselen ve mermer için uygun.

**Disk boyutu:** Avuç taşlama için 115 mm veya 125 mm; ıslak testere için 180–250 mm. Alet üreticisinin önerdiği boyutun dışına çıkmayın.`,
      },
      {
        heading: "Güvenlik: Toz, Kıymık ve Kesik Önlemi",
        body: `Seramik kesimi ince silika tozu üretir; bu toz uzun süre solunduğunda silikozis riskine yol açar. Şu önlemleri mutlaka alın:

1. **Toz maskesi:** En az FFP2 sınıfı maske; ıslak testere bile toz üretir.
2. **Koruyucu gözlük:** Seramik kıymıkları gözü zedeler; tam çevreli gözlük kullanın.
3. **Eldiven:** Manuel kesicide kırma sırasında keskin kenar ellere temas edebilir.
4. **Avuç taşlama ile kesimde:** Diskin gövde hizasından uzak tutulması ve siperliğin takılı olması zorunludur; kuru diskin 3 dakikadan uzun süre kesintisiz kullanılmaması tavsiye edilir.
5. **Islak testerede:** Su sıçramayı önlemek için güç kablosunu su yolundan uzak tutun; elektrik prizinin RCCB/ELCB korumalı olmasına dikkat edin.`,
      },
      {
        heading: "Hangi Modeli Almalısınız?",
        body: `- **Ara sıra ev tamiratı — standart seramik (500–1.000 TL):** Manuel kesici, 60–65 cm ray, tungsten tekerlek — Rubi TX serisi, Sigma Flexy, yerli Özden/Aycan modelleri.
- **Yoğun ev veya usta kullanım — porselen dahil (1.000–2.500 TL):** Manuel kesici, 90+ cm ray, yüksek basınçlı kol, değiştirilebilir tekerlek — Rubi Speed-92 N, Sigma 3B4M, Battipav serisi.
- **Şekilli kesim ve porselen (ıslak testere, 1.500–3.500 TL):** 600–1.000 W, 180–200 mm disk, masa genişliği 40+ cm — Bosch GCT 115, Parkside PWS 550, Kaufmann serisi.
- **Profesyonel döşeme ustası (3.500 TL+):** 1.200–1.500 W, 250 mm disk, paslanmaz su tablası, pah kesim özelliği — Rubi DC-250-1200 Evo, Husqvarna Tilematic, Dewalt D24000.

**Pratik ipucu:** Manuel kesici ve avuç taşlama kombinasyonu küçük bir banyo döşemesi için genellikle yeterlidir ve toplam maliyet 1.500 TL altında kalır. Büyük alanlarda veya porselen seramik ile çalışıyorsanız ıslak testere kiralayabilir ya da satın alabilirsiniz.`,
      },
    ],
  },
  {
    slug: "kirici-delici-rehberi",
    title: "Kırıcı Delici (SDS Matkap) Seçim Rehberi",
    excerpt:
      "SDS-Plus mı, SDS-Max mı? Darbe enerjisi (joule) ne anlama gelir? Beton kırma, karot delme ve çekiç modu için doğru kırıcı delici nasıl seçilir?",
    category: "Delme & Kırma",
    readTime: "9 dk",
    publishedAt: "2026-06-05",
    relatedSlugs: ["matkap-nasil-secilir", "avuc-taslama-rehberi", "is-guvenligi-ekipmanlari"],
    sections: [
      {
        heading: "Kırıcı Delici ile Normal Matkap Arasındaki Fark",
        body: `Normal darbeli matkaplar beton delerken hem döner hem de titreşim hareketi yapar; ancak bu titreşim mekanik dişli sistemiyle üretilir ve görece zayıftır. Kırıcı delici (rotary hammer / SDS matkap) ise pnömatik çekiç mekanizmasıyla çalışır: içindeki piston hava basıncıyla ucu güçlü bir şekilde çarpar.

Sonuç olarak kırıcı delici, aynı motor gücündeki darbeli matkaptan 3–5 kat daha fazla darbe enerjisi üretir. Beton, briket ve taş içinde çok daha hızlı ve az yorularak delik açar. Buna ek olarak, döner hareketi devre dışı bırakarak yalnızca çekiç moduyla kırma işlemi de yapabilir — bu özellik sıva kırma, fayans söküme ve keski çalışmalarında kullanılır.`,
      },
      {
        heading: "SDS-Plus mı, SDS-Max mı?",
        body: `SDS (Slotted Drive System), ucun mandrenle kilitleme sistemidir. İki ana standart mevcuttur:

**SDS-Plus:**
En yaygın standarttır; ev ve hafif ticari kullanımda tercih edilir. Uç çapı 10 mm'ye kadar verimlidir; maksimum karot kapasitesi genellikle 28–32 mm'dir. Hafif ve kompakt makineler bu sistemi kullanır (tipik ağırlık: 2.5–4 kg). Ev tadilatı, priz/boru kanalı açma, 6–16 mm beton delme işleri için yeterlidir.

**SDS-Max:**
Profesyonel ve ağır kullanım için tasarlanmıştır. Uç çapı 16 mm'ye kadar çıkabilir; maksimum karot kapasitesi 68+ mm'dir. Makine ağırlığı genellikle 5–8 kg arasındadır. Karot delme, büyük keski ile sıva/beton kırma, yoğun şantiye kullanımı bu sınıfa girer.

**Spline / Hex:** Eski ve endüstriyel kırıcılarda görülen sistemler; ev/küçük ticari kullanımda SDS-Plus tercih edin.`,
      },
      {
        heading: "Darbe Enerjisi (Joule) Ne Anlama Gelir?",
        body: `Darbe enerjisi, ucun beton yüzeyine her çarpmada aktardığı enerji miktarıdır. Birimi joule (J) veya ft·lbf olarak belirtilir.

| Kullanım | Darbe Enerjisi |
|---|---|
| Hafif ev kullanımı (6–16 mm delik) | 1,5 – 2,5 J |
| Orta kullanım (16–28 mm, sıva kırma) | 2,5 – 4,0 J |
| Yoğun ticari (karot, büyük keski) | 4,0 – 8,0 J |
| Ağır endüstriyel (yol kırma, büyük bina) | 8,0 J+ |

Darbe enerjisi arttıkça makine ağırlaşır ve fiyatı yükselir. Gereksiz yüksek enerji seçmek hem yorucu hem de pahalıdır. Evde priz/boru için kanal açacaksanız 2–3 J aralığı çoğunlukla yeterlidir.`,
      },
      {
        heading: "Çalışma Modları",
        body: `Kırıcı deliciler genellikle üç modda çalışır:

**1. Delme + Kırma (Rotary Hammer Mode):**
Hem döner hem darbe hareketi. Betondan delik açmak için kullanılır. Uç: SDS yivli matkap ucu.

**2. Yalnızca Kırma (Chisel Mode / Hammer Only):**
Döner hareket devre dışı; yalnızca ileri-geri darbe. Keski, spatula veya karot adaptörüyle sıva kırma, karo söküme ve kesme işlemlerinde kullanılır. Keski ucunun 12 farklı pozisyona kilitlenebilmesi uzun çalışmalarda ergonomiyi artırır.

**3. Yalnızca Delme (Rotation Only):**
Darbe devre dışı; ahşap veya metale normal delme için. Her kırıcı delicide bu mod bulunmayabilir; ihtiyacınız varsa satın almadan önce kontrol edin.`,
      },
      {
        heading: "Motor Gücü ve Devir Sayısı",
        body: `**Motor gücü (W):** SDS-Plus aralığında 600–1.200 W yaygındır. Düzenli beton delme ve karot için 800 W ve üzeri önerilir. SDS-Max makinelerde 1.500–2.000 W görülür.

**Devir sayısı (rpm):** Kırıcı delicilerde devir sayısı normal matkaba göre düşüktür (300–1.100 rpm arası), çünkü asıl kesim gücü darbe enerjisinden gelir. Yüksek devir ince metal delme için önemlidir; beton için değil.

**Darbe sayısı (bpm — blow per minute):** Dakikada yapılan darbe sayısıdır. Genellikle 1.900–5.800 bpm arasında değişir. Darbe enerjisi ile çarpıldığında gerçek verimlilik ortaya çıkar; her iki değeri birlikte değerlendirin.

**Elektronik hız kontrolü:** Hassas başlangıç gerektiren işlerde (karot delme başlangıcı, kırılgan yüzey) hız ayarı kritiktir; bu özellik olan modeller tercih edilir.`,
      },
      {
        heading: "Titreşim Azaltma (Anti-Vibration)",
        body: `Kırıcı delicilerin en büyük dezavantajı titreşimdir. Uzun süreli kullanımda el-kol titreşimi (HAV — Hand-Arm Vibration) yorgunluğa, eklem hasarına ve uzun vadede meslek hastalığına yol açabilir.

Modern makinelerde şu önlemler alınır:
- **AVT (Active Vibration Technology) veya muadili:** Karşı ağırlıklı mekanizmayla titreşim sönümlenir; Bosch'ta AVT, Makita'da AVT veya SJS, Milwaukee'de FIXTEC olarak isimlendirilir.
- **Ayrı gövde (floating handle):** Arka tutma kolu, motor gövdesinden izole edilmiştir.
- **Titreşim değeri (m/s²):** Ürün bilgilerinde belirtilen ah,HD değeri ne kadar düşükse o kadar iyidir. AB yönetmeliğine göre 8 saatlik maruz kalma sınırı 5 m/s²'dir; yoğun kullanım planlıyorsanız bu değere dikkat edin.`,
      },
      {
        heading: "Hangi Modeli Almalısınız?",
        body: `- **Hafif ev tadilatı — priz kanalı, dübel (1.000–2.000 TL):** SDS-Plus, 1,7–2,5 J, 720–800 W — Bosch GBH 2-26 DFR, Makita HR2630, DeWalt D25033K.
- **Orta kullanım — karot 28 mm, sıva kırma (2.000–4.000 TL):** SDS-Plus, 3–4 J, 900–1.000 W, AVT — Bosch GBH 3-28 DFR, Makita HR3210C, Milwaukee SDS Plus 800W.
- **Yoğun ticari — büyük karot, yoğun keski (4.000–8.000 TL):** SDS-Max, 5–7 J, 1.300–1.500 W — Bosch GBH 5-40 DCE, Makita HR5212C, DeWalt D25501K.
- **Ağır endüstriyel (8.000 TL+):** SDS-Max, 8+ J, elektropnömatik — Bosch GBH 8-45 DV, Hilti TE 60-ATC, Makita HR4013C.

**Pratik ipucu:** Kırıcı deliciler uzun süre kesmeden çalışmaz; uca baskı yapın ancak alet ağırlığının işi yapmasına izin verin. Aşırı baskı motoru zorlar ve darbe verimliliğini düşürür. Karot deliğinde su soğutması ve yavaş başlangıç devri mutlaka kullanılmalıdır.`,
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
