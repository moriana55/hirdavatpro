import Link from "next/link";
import { getProducts, getComparisons } from "@/lib/products/store";
import { LogoutButton } from "./LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const products = await getProducts();
  const comparisons = await getComparisons();

  // Hesaplamalar
  const totalProducts = products.length;
  const totalComparisons = comparisons.length;
  
  const categoriesInUse = new Set(products.map(p => p.category));
  const totalCategories = categoriesInUse.size;

  return (
    <main className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-12 border-b border-border-subtle pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="font-label-caps text-[11px] font-bold text-primary tracking-wider bg-primary/10 px-2 py-0.5 rounded">
            YÖNETİCİ KONTROL ODASI
          </span>
          <h1 className="font-headline-lg text-headline-lg font-bold mt-2">HırdavatPro Yönetim Paneli</h1>
          <p className="text-secondary text-body-md mt-1">
            İçerik kataloğunu, AI spesifikasyon çekimlerini ve toplu analiz üretimini yönetin.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-xs bg-slate-gray text-white px-4 py-2 font-bold rounded font-label-caps text-label-caps hover:bg-primary transition-all decoration-none flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            SİTEYE DÖN
          </Link>
          <LogoutButton />
        </div>
      </header>

      {/* Database Quick Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-gutter mb-12">
        {/* Stat 1 */}
        <div className="bg-surface-container-low border border-border-subtle p-6 rounded-2xl">
          <span className="material-symbols-outlined text-primary text-[32px] mb-2">package</span>
          <p className="font-label-caps text-[10px] text-slate-gray font-bold uppercase tracking-wider">Kataloğundaki Ürünler</p>
          <p className="text-3xl font-bold mt-1 text-on-surface">{totalProducts}</p>
        </div>
        {/* Stat 2 */}
        <div className="bg-surface-container-low border border-border-subtle p-6 rounded-2xl">
          <span className="material-symbols-outlined text-primary text-[32px] mb-2">compare_arrows</span>
          <p className="font-label-caps text-[10px] text-slate-gray font-bold uppercase tracking-wider">Üretilen Karşılaştırmalar</p>
          <p className="text-3xl font-bold mt-1 text-on-surface">{totalComparisons}</p>
        </div>
        {/* Stat 3 */}
        <div className="bg-surface-container-low border border-border-subtle p-6 rounded-2xl">
          <span className="material-symbols-outlined text-primary text-[32px] mb-2">category</span>
          <p className="font-label-caps text-[10px] text-slate-gray font-bold uppercase tracking-wider">Aktif Ürün Kategorileri</p>
          <p className="text-3xl font-bold mt-1 text-on-surface">{totalCategories}</p>
        </div>
      </section>

      {/* Admin Modules */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {/* Module 1: Product Management */}
        <div className="bg-white border border-border-subtle rounded-2xl p-6 hover:border-primary transition-all duration-300 group flex flex-col justify-between shadow-sm">
          <div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">build</span>
            </div>
            <h3 className="font-title-lg text-title-lg font-bold mb-2">Ürün Yönetimi & AI Spec Çekimi</h3>
            <p className="text-secondary text-body-sm leading-relaxed mb-6">
              Yeni aletleri markalarına ve modellerine göre tekli veya toplu olarak ekleyin. Teknik spesifikasyonları AI yardımıyla resmi kataloglardan saniyeler içinde çekin.
            </p>
          </div>
          <Link
            href="/x9k4-sys/urunler"
            className="w-full bg-slate-gray text-white py-3 text-center rounded font-label-caps text-[11px] font-bold group-hover:bg-primary transition-colors decoration-none"
          >
            ÜRETMEYE BAŞLA →
          </Link>
        </div>

        {/* Module 2: Bulk AI content generator */}
        <div className="bg-white border border-border-subtle rounded-2xl p-6 hover:border-primary transition-all duration-300 group flex flex-col justify-between shadow-sm">
          <div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">terminal</span>
            </div>
            <h3 className="font-title-lg text-title-lg font-bold mb-2">Toplu AI Analiz Konsolu</h3>
            <p className="text-secondary text-body-sm leading-relaxed mb-6">
              Kategorileri toplu olarak seçerek ikili karşılaştırma analizlerini otomatik oluşturun. Terminal ekranından üretimi canlı log kayıtlarıyla izleyin.
            </p>
          </div>
          <Link
            href="/x9k4-sys/toplu-uretim"
            className="w-full bg-slate-gray text-white py-3 text-center rounded font-label-caps text-[11px] font-bold group-hover:bg-primary transition-colors decoration-none"
          >
            KONSOLU AÇ →
          </Link>
        </div>
        {/* Module 3: Blog Management */}
        <div className="bg-white border border-border-subtle rounded-2xl p-6 hover:border-primary transition-all duration-300 group flex flex-col justify-between shadow-sm">
          <div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">article</span>
            </div>
            <h3 className="font-title-lg text-title-lg font-bold mb-2">Blog & Rehber Yönetimi</h3>
            <p className="text-secondary text-body-sm leading-relaxed mb-6">
              Blog yazısı oluşturun, düzenleyin ve yayınlayın. OpenAI ile otomatik içerik üretin, kapak görseli ekleyin.
            </p>
          </div>
          <Link
            href="/x9k4-sys/blog"
            className="w-full bg-slate-gray text-white py-3 text-center rounded font-label-caps text-[11px] font-bold group-hover:bg-primary transition-colors decoration-none"
          >
            BLOG YÖNETİMİ →
          </Link>
        </div>
        {/* Module 4: Analytics */}
        <div className="bg-white border border-border-subtle rounded-2xl p-6 hover:border-primary transition-all duration-300 group flex flex-col justify-between shadow-sm">
          <div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">monitoring</span>
            </div>
            <h3 className="font-title-lg text-title-lg font-bold mb-2">Affiliate & Lead Analitiği</h3>
            <p className="text-secondary text-body-sm leading-relaxed mb-6">
              &quot;Nereden alınır&quot; çıkış tıklamalarını mağaza ve ürün bazında izleyin. B2B teklif, kayıtlı proje ve lead sinyallerini tek ekranda görün.
            </p>
          </div>
          <Link
            href="/x9k4-sys/analiz"
            className="w-full bg-slate-gray text-white py-3 text-center rounded font-label-caps text-[11px] font-bold group-hover:bg-primary transition-colors decoration-none"
          >
            ANALİTİĞİ AÇ →
          </Link>
        </div>
        {/* Module 5: B2B Teklifler */}
        <div className="bg-white border border-border-subtle rounded-2xl p-6 hover:border-primary transition-all duration-300 group flex flex-col justify-between shadow-sm">
          <div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">request_quote</span>
            </div>
            <h3 className="font-title-lg text-title-lg font-bold mb-2">B2B Teklif Talepleri</h3>
            <p className="text-secondary text-body-sm leading-relaxed mb-6">
              Gelen B2B teklif satırlarını görüntüleyin. Satırlar otomatik olarak katalog ürünleriyle eşleştirilir; eşleşmeyen veya belirsiz SKU&apos;lar işaretlenir.
            </p>
          </div>
          <Link
            href="/x9k4-sys/teklifler"
            className="w-full bg-slate-gray text-white py-3 text-center rounded font-label-caps text-[11px] font-bold group-hover:bg-primary transition-colors decoration-none"
          >
            TEKLİFLERİ AÇ →
          </Link>
        </div>
      </section>

      {/* Info Warning */}
      <footer className="mt-12 bg-[#FFF8E1] border border-[#FFE082] rounded-xl p-4 flex gap-3 items-start">
        <span className="material-symbols-outlined text-warning-amber text-[20px] shrink-0">warning</span>
        <p className="text-secondary text-[12px] leading-relaxed">
          <strong>Uyarı:</strong> Toplu üretim modülü çok sayıda AI çağrısı yapar ve maliyet doğurur. Üretim veritabanını bozmamak için aşırı eşleştirme limitlerine dikkat edin.
        </p>
      </footer>
    </main>
  );
}
