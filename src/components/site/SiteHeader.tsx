"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";

const navItems = [
  { href: "/karsilastirma", label: "Karşılaştırmalar" },
  { href: "/araclar", label: "Seçim Araçları" },
  { href: "/blog", label: "Rehberler" },
  { href: "/arama", label: "Ara" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [basketCount, setBasketCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      try {
        const basket = JSON.parse(localStorage.getItem("hirdavatpro_basket") || "[]");
        setBasketCount(basket.length);
      } catch { setBasketCount(0); }
    };
    update();
    window.addEventListener("hirdavatpro_basket_change", update);
    return () => window.removeEventListener("hirdavatpro_basket_change", update);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <header className="bg-surface/85 backdrop-blur-md border-b border-border-subtle fixed top-0 left-0 right-0 w-full z-50">
        <nav aria-label="Ana menü" className="flex items-center justify-between px-margin-desktop py-4 w-full max-w-max-width mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group decoration-none shrink-0">
            <span className="text-2xl font-bold text-primary group-hover:opacity-90 transition-opacity">
              Hırdavat<span className="text-secondary">Pro</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-gutter">
            {navItems.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link key={item.href} href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`font-label-caps text-label-caps transition-all pb-1 decoration-none ${
                    isActive ? "text-primary border-b-2 border-primary" : "text-secondary hover:text-primary"
                  }`}>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-gutter">
            <form role="search" onSubmit={e => { e.preventDefault(); if (searchQuery.trim()) window.location.href = `/arama?q=${encodeURIComponent(searchQuery)}`; }}
              className="relative">
              <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-secondary" />
              <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                aria-label="Sitede teknik analiz ara"
                placeholder="Teknik analiz ara..."
                className="pl-9 pr-4 py-2 bg-surface-container-low border border-border-subtle rounded text-body-sm focus:outline-none focus:border-primary w-56 transition-colors" />
            </form>
            {basketCount > 0 && (
              <Link href="/karsilastirma/sepet"
                className="flex items-center gap-1.5 bg-primary text-white hover:bg-primary/90 px-3 py-1.5 rounded transition-all font-bold shadow-sm decoration-none active:scale-95">
                <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
                <span className="font-label-caps text-[11px] tracking-wider">KARŞILAŞTIR ({basketCount})</span>
              </Link>
            )}
          </div>

          {/* Mobile: basket + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            {basketCount > 0 && (
              <Link href="/karsilastirma/sepet"
                className="flex items-center gap-1 bg-primary text-white px-2.5 py-1.5 rounded text-[11px] font-bold decoration-none">
                <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                {basketCount}
              </Link>
            )}
            <button onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="p-2 rounded-lg border border-border-subtle text-secondary hover:text-primary hover:bg-surface-container transition-colors">
              {mobileOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div id="mobile-menu" className="fixed top-[65px] left-0 right-0 z-40 bg-surface border-b border-border-subtle shadow-lg md:hidden">
          <div className="px-6 py-4 space-y-1">
            {navItems.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link key={item.href} href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`block py-3 font-label-caps text-label-caps border-b border-border-subtle/50 last:border-0 decoration-none ${
                    isActive ? "text-primary" : "text-secondary"
                  }`}>
                  {item.label}
                </Link>
              );
            })}
            <form role="search" onSubmit={e => { e.preventDefault(); if (searchQuery.trim()) { window.location.href = `/arama?q=${encodeURIComponent(searchQuery)}`; setMobileOpen(false); } }}
              className="relative pt-3">
              <Search aria-hidden="true" className="absolute left-3 top-1/2 translate-y-[-25%] size-4 text-secondary" />
              <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                aria-label="Sitede ara"
                placeholder="Ara..."
                className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low border border-border-subtle rounded text-sm focus:outline-none focus:border-primary" />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
