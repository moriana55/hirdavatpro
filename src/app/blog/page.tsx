import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hırdavat Rehberleri — Alet Seçim & Kullanım Kılavuzları",
  description: "Matkap nasıl seçilir, avuç taşlama alırken dikkat edilmesi gerekenler, kaynak makinesi rehberi ve daha fazlası. Atölye ve şantiye için pratik bilgiler.",
  alternates: { canonical: "https://hirdavatpro.com/blog" },
};

const guides = [
  {
    slug: "matkap-nasil-secilir",
    title: "Matkap Nasıl Seçilir?",
    excerpt: "Darbeli mi darbesiz mi? Akülü mü kablolu mu? Watt, devir ve tork değerleri ne anlama gelir? Adım adım matkap seçim rehberi.",
    category: "Delme & Vidalama",
    readTime: "8 dk",
  },
  {
    slug: "avuc-taslama-rehberi",
    title: "Avuç Taşlama Alırken Dikkat Edilecekler",
    excerpt: "115mm mi 125mm mi? Devir ayarı neden önemli? Taşlama diski tipleri ve güvenlik ipuçları.",
    category: "Taşlama & Zımparalama",
    readTime: "6 dk",
  },
  {
    slug: "kaynak-makinesi-secim-rehberi",
    title: "Kaynak Makinesi Seçim Rehberi",
    excerpt: "İnverter, gazaltı (MIG/MAG) ve argon (TIG) kaynak arasındaki farklar. Hangi kaynak hangi işe uygun?",
    category: "Kaynak",
    readTime: "10 dk",
  },
  {
    slug: "kompresor-secimi",
    title: "Kompresör Nasıl Seçilir?",
    excerpt: "Litre, PSI, CFM ne demek? Yağlı mı yağsız mı? Atölye ve şantiye için doğru kompresör seçimi.",
    category: "Kompresör & Havalı Alet",
    readTime: "7 dk",
  },
  {
    slug: "el-aleti-seti-rehberi",
    title: "İlk Takım Çantası: Temel El Aletleri",
    excerpt: "Evde ve atölyede olmazsa olmaz el aletleri. Pense, tornavida, anahtar, çekiç — hangisinden kaç tane lazım?",
    category: "El Aletleri",
    readTime: "5 dk",
  },
  {
    slug: "is-guvenligi-ekipmanlari",
    title: "İş Güvenliği Ekipmanları Rehberi",
    excerpt: "Baret, gözlük, eldiven, kulak koruyucu, iş ayakkabısı — atölye ve şantiyede zorunlu koruyucu ekipmanlar.",
    category: "İş Güvenliği",
    readTime: "6 dk",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-20">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
        Rehber<span className="text-orange-600">ler</span>
      </h1>
      <p className="mt-3 text-sm text-zinc-500 max-w-xl">
        Alet seçimi, kullanım ipuçları ve teknik bilgiler. Atölye ve şantiye kararlarını kolaylaştıran pratik rehberler.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {guides.map(g => (
          <div
            key={g.slug}
            className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 transition hover:border-zinc-300 hover:bg-zinc-100"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-600">
                {g.category}
              </span>
              <span className="text-[10px] text-zinc-400">{g.readTime}</span>
            </div>
            <h2 className="text-base font-semibold text-zinc-800">{g.title}</h2>
            <p className="mt-2 text-xs text-zinc-500 leading-relaxed">{g.excerpt}</p>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-zinc-300">
              Yakında
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center">
        <p className="text-sm text-zinc-500">
          Yeni rehberler ekleniyor. Karşılaştırmalar için{" "}
          <Link href="/karsilastirma" className="text-orange-600 font-medium hover:text-orange-500">
            buraya göz atın →
          </Link>
        </p>
      </div>
    </div>
  );
}
