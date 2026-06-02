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
