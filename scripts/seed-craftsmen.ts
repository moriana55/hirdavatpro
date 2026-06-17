// Usta eşleştirme (Feature 3) seed verisi — gerçekçi, doğrulanmış örnek ustalar.
// Çalıştırma (owner): `npx tsx scripts/seed-craftsmen.ts`
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });
neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

const craftsmen = [
  { name: "Mehmet Yılmaz", city: "İstanbul", trades: ["elektrik", "tadilat"], phone: "0532 111 22 33", about: "20 yıllık elektrik tesisat ve genel tadilat deneyimi. Daire ve ofis projeleri.", rating: 4.8, jobsDone: 312 },
  { name: "Ali Demir", city: "İstanbul", trades: ["tesisat"], phone: "0533 222 33 44", about: "Su tesisatı, kombi montajı ve acil su kaçağı onarımı. 7/24 hizmet.", rating: 4.6, jobsDone: 198 },
  { name: "Hasan Kaya", city: "Ankara", trades: ["boya", "alci"], phone: "0535 333 44 55", about: "İç-dış cephe boya, saten alçı ve dekoratif uygulamalar.", rating: 4.9, jobsDone: 421 },
  { name: "Mustafa Çelik", city: "İzmir", trades: ["fayans", "tadilat"], phone: "0536 444 55 66", about: "Banyo-mutfak fayans, seramik ve komple banyo yenileme.", rating: 4.7, jobsDone: 256 },
  { name: "İbrahim Şahin", city: "Bursa", trades: ["marangoz"], phone: "0537 555 66 77", about: "Ölçüye özel mobilya, mutfak dolabı ve ahşap onarım.", rating: 4.8, jobsDone: 167 },
  { name: "Osman Aydın", city: "Ankara", trades: ["kaynak"], phone: "0538 666 77 88", about: "Ferforje, korkuluk ve demir doğrama. Argon ve gazaltı kaynak.", rating: 4.5, jobsDone: 134 },
  { name: "Ahmet Arslan", city: "İstanbul", trades: ["klima"], phone: "0539 777 88 99", about: "Split ve VRF klima montaj, bakım ve gaz dolumu. Yetkili servis.", rating: 4.7, jobsDone: 289 },
  { name: "Yusuf Doğan", city: "Antalya", trades: ["tesisat", "klima"], phone: "0531 888 99 00", about: "Tesisat ve soğutma sistemleri. Otel ve villa projeleri.", rating: 4.6, jobsDone: 145 },
  { name: "Murat Polat", city: "İzmir", trades: ["elektrik"], phone: "0532 999 00 11", about: "Akıllı ev sistemleri, pano montajı ve aydınlatma projeleri.", rating: 4.9, jobsDone: 203 },
  { name: "Kemal Öztürk", city: "Adana", trades: ["boya", "fayans"], phone: "0533 000 11 22", about: "Komple daire tadilatı: boya, fayans, alçı tek elden.", rating: 4.4, jobsDone: 98 },
  { name: "Serkan Yıldız", city: "Bursa", trades: ["cati", "tadilat"], phone: "0535 121 23 45", about: "Çatı onarım, su yalıtımı ve membran uygulama.", rating: 4.6, jobsDone: 76 },
  { name: "Emre Korkmaz", city: "Konya", trades: ["cam", "tadilat"], phone: "0536 232 34 56", about: "PVC pencere, ısıcam değişimi ve doğrama montajı.", rating: 4.5, jobsDone: 112 },
  { name: "Burak Aksoy", city: "İstanbul", trades: ["bahce"], phone: "0537 343 45 67", about: "Bahçe peyzaj, çim ekimi, otomatik sulama ve budama.", rating: 4.7, jobsDone: 88 },
  { name: "Hakan Erdoğan", city: "Ankara", trades: ["tesisat", "elektrik"], phone: "0538 454 56 78", about: "Çok yönlü tesisat ve elektrik. Site ve apartman bakım anlaşmaları.", rating: 4.8, jobsDone: 176 },
  { name: "Tolga Şimşek", city: "Antalya", trades: ["fayans", "boya"], phone: "0539 565 67 89", about: "Turizm tesisleri için hızlı tadilat ve yenileme.", rating: 4.5, jobsDone: 143 },
];

async function main() {
  let created = 0;
  for (const c of craftsmen) {
    await prisma.craftsman.create({ data: { ...c, verified: true } });
    created++;
  }
  console.log(`Seeded ${created} verified craftsmen.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
