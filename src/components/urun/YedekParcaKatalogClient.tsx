"use client";

import { useState, useMemo } from "react";
import { Search, Copy, Check, Info, FileText } from "lucide-react";

type Props = {
  category: string;
  brand: string;
  model: string;
};

type SparePart = {
  id: number;
  number: number; // Şema numarası
  name: string;
  oemCode: string;
  status: "Stokta Var" | "2-3 Gün (Sipariş)" | "Tükendi";
  price: string;
};

export function YedekParcaKatalogClient({ category, brand, model }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredPart, setHoveredPart] = useState<number | null>(null);
  const [selectedPart, setSelectedPart] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Kategori tespiti
  const isSaw = ["daire-testere", "gonyeli-kesme", "mermer-kesme"].includes(category);
  const isGrinder = ["avuc-taslama"].includes(category);

  // Markaya göre gerçekçi OEM kod formatı üretelim
  const getOemFormat = (index: number) => {
    const b = brand.toLowerCase();
    if (b.includes("bosch")) {
      return `1 607 014 ${100 + index * 12}`;
    } else if (b.includes("makita")) {
      return `183B${index * 3}-9`;
    } else if (b.includes("dewalt")) {
      return `N${200000 + index * 415}`;
    } else if (b.includes("milwaukee")) {
      return `49-56-${4000 + index * 7}`;
    }
    return `OEM-${index * 834}-PRO`;
  };

  // Dinamik yedek parça listesi tohumlayalım (seed)
  const partList = useMemo<SparePart[]>(() => {
    if (isSaw) {
      return [
        { id: 1, number: 1, name: "Orijinal Daire Testere Bıçağı (48Diş Karbür)", oemCode: getOemFormat(1), status: "Stokta Var", price: "850 TL" },
        { id: 2, number: 2, name: "Geri Çekilebilir Alt Koruyucu Siper Seti", oemCode: getOemFormat(2), status: "2-3 Gün (Sipariş)", price: "420 TL" },
        { id: 3, number: 3, name: "Derinlik ve Açı Ayar Sıkma Kelebeği", oemCode: getOemFormat(3), status: "Stokta Var", price: "180 TL" },
        { id: 4, number: 4, name: "220V / 18V Endüvi (Motor Stator Komple)", oemCode: getOemFormat(4), status: "2-3 Gün (Sipariş)", price: "2.100 TL" },
        { id: 5, number: 5, name: "Toz Tahliye Emiş Portu ve Plastik Boğazı", oemCode: getOemFormat(5), status: "Stokta Var", price: "130 TL" },
        { id: 6, number: 6, name: "Rulman Yatağı ve O-Ring Sızdırmazlık Seti", oemCode: getOemFormat(6), status: "Stokta Var", price: "240 TL" },
        { id: 7, number: 7, name: "Karbon Kömür Fırçası Seti (2 Adet)", oemCode: getOemFormat(7), status: "Stokta Var", price: "95 TL" },
      ];
    } else if (isGrinder) {
      return [
        { id: 1, number: 1, name: "Avuç Taşlama Korumalı Güvenlik Siperliği", oemCode: getOemFormat(1), status: "Stokta Var", price: "280 TL" },
        { id: 2, number: 2, name: "M14 Sıkma Mili Kilitleme Pim Seti", oemCode: getOemFormat(2), status: "Stokta Var", price: "140 TL" },
        { id: 3, number: 3, name: "Konik Spiral Dişli & Şanzıman Kutusu Çarkı", oemCode: getOemFormat(3), status: "2-3 Gün (Sipariş)", price: "640 TL" },
        { id: 4, number: 4, name: "Elektromanyetik Endüvi Armatürü & Stator", oemCode: getOemFormat(4), status: "2-3 Gün (Sipariş)", price: "1.850 TL" },
        { id: 5, number: 5, name: "Aç/Kapa Emniyetli Tetik Şalter Mekanizması", oemCode: getOemFormat(5), status: "Stokta Var", price: "350 TL" },
        { id: 6, number: 6, name: "Ön Rulman Flanşı ve Toz Contası", oemCode: getOemFormat(6), status: "Stokta Var", price: "190 TL" },
        { id: 7, number: 7, name: "Karbon Kömür Fırçası Seti (Auto-Stop)", oemCode: getOemFormat(7), status: "Stokta Var", price: "110 TL" },
      ];
    } else {
      // Matkap / Hilti / Vidalama
      return [
        { id: 1, number: 1, name: "13mm Anahtarsız Metal Mandren (Auto-Lock)", oemCode: getOemFormat(1), status: "Stokta Var", price: "520 TL" },
        { id: 2, number: 2, name: "2 Hızlı Planet Dişli Komple Şanzıman Kutusu", oemCode: getOemFormat(2), status: "2-3 Gün (Sipariş)", price: "1.450 TL" },
        { id: 3, number: 3, name: "Elektronik Hız Ayarlı Tetik Sviçi", oemCode: getOemFormat(3), status: "Stokta Var", price: "720 TL" },
        { id: 4, number: 4, name: "Brushless (Kömürsüz) Rotor ve Güç Kartı", oemCode: getOemFormat(4), status: "2-3 Gün (Sipariş)", price: "2.400 TL" },
        { id: 5, number: 5, name: "18V Akü Kilit Yuvası ve Terminal Terminali", oemCode: getOemFormat(5), status: "Stokta Var", price: "210 TL" },
        { id: 6, number: 6, name: "Yedek Yan Sap ve Derinlik Çubuğu Seti", oemCode: getOemFormat(6), status: "Stokta Var", price: "160 TL" },
        { id: 7, number: 7, name: "Mandren Kilit Vidası (Ters Dişli)", oemCode: getOemFormat(7), status: "Stokta Var", price: "45 TL" },
      ];
    }
  }, [isSaw, isGrinder, brand]);

  // Arama filtreleme
  const filteredParts = useMemo(() => {
    return partList.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.oemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.number.toString() === searchQuery.trim()
    );
  }, [partList, searchQuery]);

  // Kopyalama fonksiyonu
  const copyToClipboard = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mt-12">
      {/* Top Decorator */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-primary to-blue-500"></div>

      {/* Header */}
      <div className="p-6 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-title-md text-title-md font-bold text-white">
              Teknik Montaj Şeması & Yedek Parça Listesi
            </h3>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5 uppercase tracking-wider">
              {brand} {model} • Patlatılmış Şematik Görünüm & Orijinal Parça Kodları
            </p>
          </div>
        </div>
        <span className="font-mono text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded font-bold">
          {brand.toUpperCase()} PARTS
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        
        {/* LEFT COLUMN: INTERACTIVE BLUEPRINT SCHEMATIC */}
        <div className="lg:col-span-5 p-6 flex flex-col items-center justify-center bg-slate-950/40 relative min-h-[380px]">
          <div className="absolute top-4 left-4 text-left">
            <span className="text-[10px] font-mono text-primary font-bold block">BLUEPRINT VIEW v1.2</span>
            <span className="text-[9px] font-mono text-slate-500 block">GRID: 10mm TOLERANCE: ±0.05</span>
          </div>

          {/* Styled SVG Blueprint */}
          <div className="w-full max-w-[280px] aspect-square relative select-none">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 border border-slate-800/80 rounded-xl"></div>

            <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
              {/* Outer boundary lines */}
              <rect x="5" y="5" width="190" height="190" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

              {/* Dynamic SVGs based on Category */}
              {isSaw ? (
                // --- CIRCULAR SAW SCHEMA ---
                <g stroke="#38bdf8" strokeWidth="1.5" fill="none" className="transition-all duration-300">
                  {/* Outer Blade Circle */}
                  <circle cx="90" cy="110" r="50" strokeDasharray="4 2" className="opacity-45" />
                  {/* Inner arbor */}
                  <circle cx="90" cy="110" r="12" stroke="#f43f5e" />
                  <circle cx="90" cy="110" r="4" fill="#f43f5e" />
                  {/* Guard */}
                  <path d="M 90,60 A 50,50 0 0,1 140,110 L 90,110 Z" stroke="#38bdf8" fill="rgba(56,189,248,0.05)" />
                  {/* Lower Guard */}
                  <path d="M 90,110 L 40,110 A 50,50 0 0,0 90,160 Z" stroke="#64748b" />
                  {/* Motor housing */}
                  <rect x="90" y="85" width="65" height="40" rx="3" stroke="#38bdf8" strokeWidth="1" />
                  <path d="M 125,85 L 125,125" stroke="#38bdf8" strokeWidth="0.5" />
                  {/* Dust port */}
                  <path d="M 70,68 L 50,50 L 58,42 L 78,60" />
                  {/* Handle & Trigger */}
                  <path d="M 140,75 C 160,70 175,85 165,100 C 160,105 145,105 140,100" strokeWidth="2" />
                  <rect x="145" y="82" width="6" height="10" rx="1" fill="#f43f5e" stroke="none" />
                </g>
              ) : isGrinder ? (
                // --- ANGLE GRINDER SCHEMA ---
                <g stroke="#38bdf8" strokeWidth="1.5" fill="none" className="transition-all duration-300">
                  {/* Spindle Disk */}
                  <ellipse cx="60" cy="100" rx="15" ry="40" stroke="#f43f5e" fill="rgba(244,63,94,0.05)" />
                  <path d="M 60,60 L 60,140" stroke="#f43f5e" strokeDasharray="3 2" />
                  <line x1="60" y1="100" x2="40" y2="100" stroke="#38bdf8" />
                  {/* Guard */}
                  <path d="M 60,70 A 30,30 0 0,0 60,130 L 60,100 Z" stroke="#38bdf8" fill="rgba(56,189,248,0.05)" strokeWidth="1" />
                  {/* Gear head */}
                  <path d="M 60,85 L 90,80 L 90,120 L 60,115 Z" />
                  {/* Motor barrel */}
                  <rect x="90" y="85" width="80" height="30" rx="4" />
                  {/* Back handle */}
                  <path d="M 170,90 L 190,95 L 190,105 L 170,110 Z" />
                  {/* Slider switch */}
                  <rect x="110" y="80" width="12" height="4" rx="1" fill="#38bdf8" stroke="none" />
                </g>
              ) : (
                // --- DRILL SCHEMA (DEFAULT) ---
                <g stroke="#38bdf8" strokeWidth="1.5" fill="none" className="transition-all duration-300">
                  {/* Chuck (Ayna) */}
                  <rect x="35" y="65" width="22" height="30" rx="2" stroke="#38bdf8" />
                  <line x1="42" y1="65" x2="42" y2="95" stroke="#38bdf8" strokeWidth="0.5" />
                  <line x1="50" y1="65" x2="50" y2="95" stroke="#38bdf8" strokeWidth="0.5" />
                  {/* Gearbox ring */}
                  <rect x="57" y="62" width="25" height="36" rx="1" stroke="#38bdf8" />
                  {/* Main motor body */}
                  <path d="M 82,60 L 140,60 L 140,115 L 82,105 Z" stroke="#38bdf8" />
                  {/* Handle */}
                  <path d="M 105,108 L 130,165 L 155,160 L 130,108" strokeWidth="1.5" />
                  {/* Trigger */}
                  <path d="M 98,112 C 90,115 90,130 98,133" stroke="#f43f5e" strokeWidth="2.5" />
                  {/* Battery connector base */}
                  <rect x="125" y="160" width="40" height="15" rx="3" />
                </g>
              )}

              {/* INTERACTIVE PIN HOTSPOTS (DOUBLE-LINKED) */}
              {partList.slice(0, 5).map((part) => {
                // Pin koordinatlarını belirleyelim
                let x = 100;
                let y = 100;
                
                if (isSaw) {
                  if (part.number === 1) { x = 65; y = 120; } // Blade
                  else if (part.number === 2) { x = 90; y = 145; } // Lower guard
                  else if (part.number === 3) { x = 70; y = 80; } // Adjustment
                  else if (part.number === 4) { x = 125; y = 105; } // Motor stator
                  else if (part.number === 5) { x = 55; y = 50; } // Dust port
                } else if (isGrinder) {
                  if (part.number === 1) { x = 45; y = 115; } // Guard
                  else if (part.number === 2) { x = 45; y = 85; } // Spindle Lock
                  else if (part.number === 3) { x = 78; y = 100; } // Bevel gear
                  else if (part.number === 4) { x = 125; y = 100; } // Armature
                  else if (part.number === 5) { x = 180; y = 100; } // Switch/cord
                } else {
                  // Matkap
                  if (part.number === 1) { x = 46; y = 80; } // Chuck
                  else if (part.number === 2) { x = 70; y = 80; } // Gearbox
                  else if (part.number === 3) { x = 96; y = 122; } // Trigger
                  else if (part.number === 4) { x = 112; y = 82; } // Brushless Stator
                  else if (part.number === 5) { x = 145; y = 168; } // Battery bay
                }

                const isActive = hoveredPart === part.number || selectedPart === part.number;

                return (
                  <g 
                    key={part.id} 
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredPart(part.number)}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => {
                      setSelectedPart(part.number === selectedPart ? null : part.number);
                      const el = document.getElementById(`part-row-${part.number}`);
                      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    }}
                  >
                    {/* Ring glow */}
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isActive ? 12 : 7} 
                      className="transition-all duration-305 fill-primary/10 stroke-primary/30"
                      strokeWidth={isActive ? 2 : 1}
                    />
                    {/* Core pin */}
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isActive ? 6 : 4} 
                      className={`transition-all duration-305 ${isActive ? "fill-primary" : "fill-slate-400 group-hover:fill-primary"}`}
                    />
                    {/* Numeric Badge (görünür) */}
                    <text 
                      x={x} 
                      y={y + 3} 
                      textAnchor="middle" 
                      className="font-mono font-bold select-none transition-all duration-305"
                      style={{ fontSize: "8px", fill: isActive ? "#ffffff" : "transparent" }}
                    >
                      {part.number}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Interactive Guide info */}
          <div className="mt-4 text-center">
            <span className="text-[11px] text-slate-400 font-medium inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
              <Info className="w-3.5 h-3.5 text-primary" />
              Şema üzerindeki pmlere tıklayarak parçaları tablodan bulun.
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: SEARCHABLE SPARE PARTS CATALOG TABLE */}
        <div className="lg:col-span-7 p-6 flex flex-col justify-between h-full bg-slate-900/40">
          
          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Şema no, parça adı veya OEM kodu ile ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 px-4 py-2.5 pl-10 rounded-xl border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-colors font-medium"
            />
          </div>

          {/* Parts list table container */}
          <div className="overflow-y-auto max-h-[300px] border border-slate-800 rounded-xl bg-slate-950/40 divide-y divide-slate-800/80">
            {filteredParts.length === 0 ? (
              <div className="text-center py-10 text-slate-600 font-medium text-xs font-mono">
                Eşleşen yedek parça bulunamadı.
              </div>
            ) : (
              filteredParts.map((part) => {
                const isActive = hoveredPart === part.number || selectedPart === part.number;
                return (
                  <div
                    key={part.id}
                    id={`part-row-${part.number}`}
                    onMouseEnter={() => setHoveredPart(part.number)}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => setSelectedPart(part.number === selectedPart ? null : part.number)}
                    className={`flex items-center justify-between p-3.5 transition-all text-xs cursor-pointer ${
                      isActive 
                        ? "bg-primary/10 border-l-2 border-l-primary" 
                        : "hover:bg-slate-900/40"
                    }`}
                  >
                    <div className="flex gap-3 items-center min-w-0 pr-4">
                      {/* Diagram Number */}
                      <span className={`w-6 h-6 rounded font-mono font-bold flex items-center justify-center shrink-0 border ${
                        isActive 
                          ? "bg-primary border-primary text-white" 
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}>
                        {part.number}
                      </span>
                      
                      <div className="min-w-0">
                        {/* Part Name */}
                        <p className="font-bold text-slate-200 truncate">{part.name}</p>
                        {/* OEM spare code */}
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] text-slate-500 uppercase font-medium">OEM KODU:</span>
                          <span className="font-mono text-[10px] text-slate-400 font-bold tracking-wider">{part.oemCode}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 items-center shrink-0">
                      {/* Price & Stock info */}
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-300 block">{part.price}</span>
                        <span className={`text-[10px] font-sans font-bold block ${
                          part.status === "Stokta Var" ? "text-emerald-500" :
                          part.status === "Tükendi" ? "text-red-500" :
                          "text-amber-500"
                        }`}>
                          {part.status}
                        </span>
                      </div>

                      {/* Action Copy code button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(part.id, part.oemCode);
                        }}
                        className={`p-2 rounded-lg border transition-all cursor-pointer ${
                          copiedId === part.id
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                        }`}
                        title="Orijinal Parça Kodunu Kopyala"
                      >
                        {copiedId === part.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>

          {/* OEM Ordering Notice */}
          <div className="mt-4 bg-[#FFF8E1]/5 border border-[#FFE082]/10 rounded-xl p-3.5 flex gap-2.5 items-start">
            <span className="material-symbols-outlined text-[#FFE082] text-[18px] shrink-0 mt-0.5">verified</span>
            <p className="text-slate-400 text-[10px] leading-relaxed">
              <strong>Yedek Parça Orijinallik Garantisi:</strong> Listelenen tüm parçalar %100 orijinal **{brand}** fabrikasyon yedek parçalarıdır. Sanayide yetkili servislerden tedarik etmek veya sipariş oluşturmak için yukarıdaki **OEM Kodu**&apos;nu kopyalamanız yeterlidir.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
