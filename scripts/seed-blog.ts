import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });
neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

const posts = [
  {
    title: "Matkap Nasıl Seçilir?",
    slug: "matkap-nasil-secilir",
    excerpt: "Darbeli mi darbesiz mi? Akülü mü kablolu mu? Watt, devir ve tork değerleri ne anlama gelir? Adım adım matkap seçim rehberi.",
    category: "Delme & Vidalama",
    readTime: "8 dk",
    published: true,
    content: `## Darbeli mi, Darbesiz mi?

Beton, tuğla veya taş delecekseniz **darbeli matkap** şart. Ahşap ve metal için darbesiz yeterli. Çoğu darbeli matkap darbeyi kapatabildiğinden tek alet iki işi görür.

## Kablolu mu, Akülü mu?

**Kablolu:** Kesintisiz güç, daha ucuz, ağır. Sabit bir atölye için ideal.

**Akülü:** Özgürlük ve taşınabilirlik. 18V sistemler artık kabloluyla yarışıyor. Aynı markanın akü platformuna bağlı kalmak uzun vadede uygun maliyetli.

## Watt, Devir, Tork Ne Anlama Gelir?

- **Watt:** Ham güç. 600W ev kullanımı, 900W+ profesyonel işler için.
- **Devir (rpm):** Yüksek devir metal delme, düşük devir vidalama için iyi.
- **Tork (Nm):** Vidalamanın ne kadar güçlü yapıldığı. Kavanozu sökmek gibi düşün.

## Mandren Kapasitesi

Çoğu ev matkapları **10 mm**, profesyonel modeller **13 mm** mandrene sahip. Büyük uç kullanacaksanız 13 mm şart.

## Hangi Markayı Almalı?

| Bütçe | Öneri |
|-------|-------|
| Ekonomik | Bosch GSB 13 RE, Black+Decker |
| Orta | Makita HP1631, DeWalt DWD024 |
| Profesyonel | Milwaukee M18 FPD2, Metabo SBE 650 |

## Sonuç

Ev kullanımı için 600-750W darbeli kablolu bir matkap (Bosch GSB 13 RE gibi) yıllarca sorunsuz çalışır. Şantiye için akülü 18V sisteme geçin, aynı platformda başka aletler de alabilirsiniz.`,
  },
  {
    title: "Avuç Taşlama Alırken Dikkat Edilecekler",
    slug: "avuc-taslama-rehberi",
    excerpt: "115mm mi 125mm mi? Devir ayarı neden önemli? Taşlama diski tipleri ve güvenlik ipuçları.",
    category: "Taşlama & Zımparalama",
    readTime: "6 dk",
    published: true,
    content: `## 115mm mi, 125mm mi?

**115mm:** Hafif, manevra kabiliyeti yüksek, dar köşelerde çalışmak için iyi.

**125mm:** En yaygın boyut, disk çeşidi en fazla bu boyutta. Ev ve atölye için standart tercih.

**180mm ve üzeri:** Ağır işler, büyük metal yüzeyler. Ağır ve tehlikeli, deneyimsiz kullanıcılar için önerilmez.

## Devir (RPM) Neden Önemli?

125mm diskler genellikle **11.000 RPM** için tasarlanmıştır. Daha büyük disk takmak veya daha yüksek devirde kullanmak diskin merkezkaç kuvvetiyle parçalanmasına yol açar. **Her zaman disk üzerindeki max RPM değerini kontrol edin.**

## Disk Tipleri

- **Taşlama diski:** Metal çapaklama ve düzeltme
- **Kesme diski:** İnce (1-2mm), metal ve paslanmaz kesimi
- **Elmas kesme diski:** Seramik, beton, mermer
- **Zımpara diski:** Yüzey düzeltme
- **Tel fırça:** Pas ve boya sökme

## Güvenlik

Avuç taşlama en tehlikeli el aletlerinden biridir. **Koruyucu siper asla sökülmez.** Gözlük ve yüz maskesi şart.

## Öneri

| Kullanım | Model |
|----------|-------|
| Ev & hobi | Bosch GWS 750-125 |
| Yoğun atölye | Makita GA5030, DeWalt DWE4057 |
| Profesyonel | Milwaukee M18 CAG125X |`,
  },
  {
    title: "Kaynak Makinesi Seçim Rehberi",
    slug: "kaynak-makinesi-secim-rehberi",
    excerpt: "İnverter, gazaltı (MIG/MAG) ve argon (TIG) kaynak arasındaki farklar. Hangi kaynak hangi işe uygun?",
    category: "Kaynak",
    readTime: "10 dk",
    published: true,
    content: `## Kaynak Türleri

### İnverter (Elektrik Ark) Kaynak
En basit yöntem. Elektrot (çubuk) tutuşturulur, ark oluşur. Kurulum kolay, taşınabilir. Kalın metal birleştirme için ideal. İnce malzemelerde yanma riski.

### MIG/MAG (Gazaltı) Kaynak
Tel beslemeli, gaz korumalı. Daha temiz kaynak, daha az curuf. İnce saclar için mükemmel. Gaz tüpü gerektirir.

### TIG (Argon) Kaynak
En hassas yöntem. Paslanmaz ve alüminyum için. Yüksek beceri gerektirir, yavaş ama kusursuz sonuç.

## Amper Seçimi

| Metal Kalınlığı | Gereken Amper |
|-----------------|---------------|
| 1-2mm | 40-80A |
| 3-4mm | 80-130A |
| 5-8mm | 130-180A |
| 8mm+ | 180A+ |

## Görev Döngüsü (Duty Cycle)

"200A @ %60" demek: 10 dakikada 6 dakika kaynak yapabilir, 4 dakika soğutma. Sürekli kullanım için yüksek duty cycle arayın.

## Öneri

| İhtiyaç | Model |
|---------|-------|
| Hobi / hafif onarım | Askaynak Inverter 185 Super |
| Orta düzey atölye | Magmaweld Monostick 200i |
| MIG sistemi | Askaynak MIG 250, Lincoln Speedtec 200C |
| Profesyonel | Fronius TransPocket 180, Kemppi Minarc 150 |`,
  },
  {
    title: "Kompresör Nasıl Seçilir?",
    slug: "kompresor-secimi",
    excerpt: "Litre, PSI, CFM ne demek? Yağlı mı yağsız mı? Atölye ve şantiye için doğru kompresör seçimi.",
    category: "Kompresör & Havalı Alet",
    readTime: "7 dk",
    published: true,
    content: `## Temel Kavramlar

- **Litre (L):** Tank kapasitesi. Büyük tank = daha uzun süre kesintisiz çalışma
- **Bar:** Basınç. Çoğu havalı alet 6-8 bar ister
- **l/dk (FAD):** Dakikada üretilen hava miktarı. En önemli değer bu

## Hangi İş İçin Ne Kadar?

| Kullanım | Gereken Debi |
|----------|-------------|
| Lastik şişirme | 50-100 l/dk |
| Çivi tabancası | 100-150 l/dk |
| Taşlama / zımpara | 150-300 l/dk |
| Boya tabancası | 200-400 l/dk |
| Sürekli üretim | 400l/dk+ |

## Yağlı mı, Yağsız mı?

**Yağsız:** Sessiz, bakım az, taşınabilir. Ev ve hobi kullanımı için ideal. Ömrü daha kısa.

**Yağlı:** Uzun ömür, yüksek debi, sürekli çalışma. Atölye ve profesyonel kullanım için.

## Öneri

| Kullanım | Model |
|----------|-------|
| Ev / lastik | Einhell TC-AC 190/24/8 |
| Atölye | Michelin MBV 50-3, Abac Montecarlo 241 |
| Profesyonel | Fiac Cosmos 225 |`,
  },
  {
    title: "İlk Takım Çantası: Temel El Aletleri",
    slug: "el-aleti-seti-rehberi",
    excerpt: "Evde ve atölyede olmazsa olmaz el aletleri. Pense, tornavida, anahtar, çekiç — hangisinden kaç tane lazım?",
    category: "El Aletleri",
    readTime: "5 dk",
    published: true,
    content: `## Olmazsa Olmaz Listesi

### Tornavidalar
En az 3 boy düz, 3 boy yıldız. **Wera** veya **Wiha** yatırım yapmaya değer — kaliteli tornavida başlık aşındırmaz.

### Pense Seti

- **Kombine pense:** Genel amaçlı
- **Sivri uçlu pense:** İnce tel, küçük parçalar
- **Kablo sıyırıcı:** Elektrik işleri için

**Knipex** bu kategorinin tartışmasız lideri.

### Anahtar Seti
Kombine (açık+yıldız) 8-19mm arası. Alyan (altıgen) takım da ekleyin.

### Çekiç
500g çekiç ev için yeterli. Lastik tokmak da bulundurun.

### Metre ve Ruhani
2m veya 5m şerit metre. Küçük boncuk terazisi köşe işleri için.

### Maket Bıçağı
Geniş ağızlı, kırılabilir kenarlı. Ambalaj açmaktan duvar kağıdı kesmesine kadar her şey.

## Takım Çantası Önerisi

| Bütçe | Öneri |
|-------|-------|
| Başlangıç | Stanley STST1-80151 (142 parça) |
| Orta | Bosch Professional 108 parça |
| Kalıcı yatırım | Wera + Knipex + Gedore ayrı ayrı |`,
  },
  {
    title: "İş Güvenliği Ekipmanları Rehberi",
    slug: "is-guvenligi-ekipmanlari",
    excerpt: "Baret, gözlük, eldiven, kulak koruyucu, iş ayakkabısı — atölye ve şantiyede zorunlu koruyucu ekipmanlar.",
    category: "İş Güvenliği",
    readTime: "6 dk",
    published: true,
    content: `## Göz Koruması

Taşlama, kesme, kaynak — gözler her zaman risk altında. **EN 166** sertifikalı gözlük şart. Kaynak için özel filtreli maske.

Öneriler: Uvex i-3, 3M SecureFit 400, Bolle Rush+

## Kulak Koruması

Sürekli 85dB üzeri ses işitme kaybına yol açar. Taşlama ve kompresör bu sınırı aşar.

- **SNR 30+** derecelendirmeli kulaklık veya tıkaç
- Öneriler: 3M Peltor X4A, Uvex K4

## Toz Maskesi

Taşlama ve zımpara tozu akciğerlere zarar verir. Kağıt maske yetmez.

- **P2/FFP2:** Genel toz ve partikül
- **P3/FFP3:** İnce toz, kimyasal buhar

Öneriler: 3M 6200 + filtre, GVS Elipse P3

## İş Ayakkabısı

**S1P** veya **S3** sertifikalı çelik burunlu ayakkabı. Elektrik çalışmalarında **ESD** özellikli.

Öneriler: Caterpillar Holton S3, Uvex 1 x-tended

## Eldiven

- Kesmeye karşı: EN 388 sertifikalı
- Kaynak: Deri kaynak eldiveni
- Kimyasal: Nitril veya neopren

## Sonuç

En pahalı ekipman hastane faturasından ucuzdur. Kişisel koruyucu ekipman asla tasarruf yapılacak alan değildir.`,
  },
];

async function main() {
  console.log("Blog yazıları ekleniyor...");
  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: { ...post },
      create: { ...post },
    });
    console.log(`✓ ${post.title}`);
  }
  console.log("Tamamlandı.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
