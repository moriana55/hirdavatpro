"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import mapboxgl from "mapbox-gl";

interface ColorTheme {
  name: string;
  bg: string;
  text: string;
  border: string;
  styleUrl: string;
}

const THEMES: Record<string, ColorTheme> = {
  sand: {
    name: "Scandinavian Sand",
    bg: "#F4EFE6",
    text: "#2B2D2F",
    border: "#2B2D2F",
    styleUrl: "mapbox://styles/mapbox/light-v11",
  },
  charcoal: {
    name: "Nordic Charcoal",
    bg: "#1E2022",
    text: "#ECEFF4",
    border: "#ECEFF4",
    styleUrl: "mapbox://styles/mapbox/dark-v11",
  },
  minimalist: {
    name: "Pure Minimalist",
    bg: "#FFFFFF",
    text: "#000000",
    border: "#000000",
    styleUrl: "mapbox://styles/mapbox/light-v11",
  },
  satellite: {
    name: "Satellite Art",
    bg: "#0B0B0C",
    text: "#FFFFFF",
    border: "#FFFFFF",
    styleUrl: "mapbox://styles/mapbox/satellite-streets-v12",
  },
};

// Default Mapbox token comes from env (NEXT_PUBLIC_MAPBOX_TOKEN); users can also
// paste their own token via the UI, which is persisted to localStorage.
const DEFAULT_MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

export function HaritaTasarimClient() {
  const [city, setCity] = useState("ROMA");
  const [subtitle, setSubtitle] = useState("ITALY");
  const [coords, setCoords] = useState("41.9028° N, 12.4964° E");
  const [themeName, setThemeName] = useState("sand");
  const [styleType, setStyleType] = useState<"classic" | "circle">("circle");
  const [searchQuery, setSearchQuery] = useState("");
  const [customStyleUrl, setCustomStyleUrl] = useState("");
  
  // Mapbox Token State
  const [mapboxToken, setMapboxToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Initialize Mapbox CSS dynamically and load token
  useEffect(() => {
    // Inject Mapbox CSS CDN
    const link = document.createElement("link");
    link.href = "https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Load token from localStorage
    const savedToken = localStorage.getItem("hirdavatpro_mapbox_token");
    
    // Auto-wipe the old expired test token if it's saved in their localStorage
    const isOldToken = savedToken && savedToken.includes("tJIdE633Mw9-3th55wDn4w");
    if (isOldToken) {
      localStorage.removeItem("hirdavatpro_mapbox_token");
    }

    const activeToken = (savedToken && !isOldToken) ? savedToken : DEFAULT_MAPBOX_TOKEN;
    setMapboxToken(activeToken);
    setTokenInput((savedToken && !isOldToken) ? savedToken : "");

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Initialize and update the Mapbox GL JS map
  useEffect(() => {
    if (!mapContainerRef.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    const theme = THEMES[themeName];
    const activeStyleUrl = customStyleUrl || theme.styleUrl;

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: activeStyleUrl,
        center: [12.4964, 41.9028], // Rome coordinates
        zoom: 12.5,
        pitch: 0,
        bearing: 0,
        attributionControl: false,
      });

      mapRef.current = map;

      // Track map movement to update coordinates automatically
      map.on("move", () => {
        const center = map.getCenter();
        const latStr = `${Math.abs(center.lat).toFixed(4)}° ${center.lat >= 0 ? "N" : "S"}`;
        const lngStr = `${Math.abs(center.lng).toFixed(4)}° ${center.lng >= 0 ? "E" : "W"}`;
        setCoords(`${latStr}, ${lngStr}`);
      });
    } catch (err) {
      console.error("Mapbox init error:", err);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapboxToken, themeName, customStyleUrl]);

  // Handle Location Search via OpenStreetMap Nominatim Geocoding API (100% Free & No Tokens Required!)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapRef.current) return;

    try {
      // Nominatim search request (OpenStreetMap)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&limit=1`,
        {
          headers: {
            "Accept-Language": "tr,en",
            "User-Agent": "HirdavatPro-Map-Designer/1.0"
          }
        }
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);

        // Fly smoothly to searched location
        mapRef.current.flyTo({
          center: [lon, lat],
          zoom: 12.5,
          essential: true,
        });

        // Parse place name
        const displayName = result.display_name || searchQuery;
        const parts = displayName.split(",");
        const placeName = result.name || parts[0];
        setCity(placeName.toUpperCase().trim());

        const countryName = parts[parts.length - 1].trim();
        setSubtitle(countryName.toUpperCase());
      } else {
        // Fallback to Mapbox geocoding if Nominatim failed for some reason
        const resMapbox = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            searchQuery
          )}.json?access_token=${mapboxToken}&limit=1`
        );
        const dataMapbox = await resMapbox.json();
        if (dataMapbox.features && dataMapbox.features.length > 0) {
          const feature = dataMapbox.features[0];
          const [lng, lat] = feature.center;
          mapRef.current.flyTo({ center: [lng, lat], zoom: 12.5 });
          setCity(feature.text.toUpperCase());
          let countryName = "GEOGRAPHIC MAP";
          if (feature.context) {
            const countryContext = feature.context.find((c: any) => c.id.startsWith("country"));
            if (countryContext) countryName = countryContext.text;
          }
          setSubtitle(countryName.toUpperCase());
        } else {
          alert("Konum bulunamadı. Lütfen daha belirgin bir isim deneyin.");
        }
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      // Try mapbox geocoding as final fallback
      try {
        const resMapbox = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            searchQuery
          )}.json?access_token=${mapboxToken}&limit=1`
        );
        const dataMapbox = await resMapbox.json();
        if (dataMapbox.features && dataMapbox.features.length > 0) {
          const feature = dataMapbox.features[0];
          const [lng, lat] = feature.center;
          mapRef.current.flyTo({ center: [lng, lat], zoom: 12.5 });
          setCity(feature.text.toUpperCase());
        } else {
          alert("Arama servisine erişilemedi. Lütfen daha sonra tekrar deneyin.");
        }
      } catch (e) {
        alert("Arama servisine erişilemedi. Lütfen daha sonra tekrar deneyin.");
      }
    }
  };

  // Save developer's custom Mapbox access token
  const handleSaveToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      localStorage.setItem("hirdavatpro_mapbox_token", tokenInput.trim());
      setMapboxToken(tokenInput.trim());
      alert("Mapbox Access Token başarıyla kaydedildi! Harita yükleniyor...");
    } else {
      localStorage.removeItem("hirdavatpro_mapbox_token");
      setMapboxToken(DEFAULT_MAPBOX_TOKEN);
      alert("Token temizlendi. Varsayılan lisans anahtarınız kullanılacak.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const theme = THEMES[themeName];

  return (
    <main className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto print:p-0 print:pt-0">
      
      {/* Breadcrumb - Print esnasında gizlenecek */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-[13px] text-secondary font-body-sm print:hidden">
        <Link href="/" className="hover:text-primary transition-colors decoration-none font-bold">Ana Sayfa</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link href="/araclar" className="hover:text-primary transition-colors decoration-none font-bold">Araçlar</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-semibold">Premium Coğrafi Harita Tasarımcısı</span>
      </nav>

      {/* Header - Print esnasında gizlenecek */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 print:hidden">
        <div>
          <span className="badge badge-accent mb-2">PROFESYONEL VEKTÖR HARİTA SERVİSİ</span>
          <h1 className="font-headline-lg text-headline-lg md:text-display-lg font-bold mb-2">Premium Harita Tasarımcısı</h1>
          <p className="text-secondary font-body-lg max-w-2xl">
            Dünyanın en prestijli harita şirketi **Mapbox** altyapısıyla çalışan, tamamen özelleştirilebilir ve gerçek vektör verileri kullanan profesyonel poster tasarım stüdyosu.
          </p>
        </div>
      </header>

      {/* Main Designer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        
        {/* Left Sidebar: Controls - Print esnasında gizlenecek */}
        <aside className="lg:col-span-4 bg-surface-container-low border border-border-subtle p-6 rounded-2xl space-y-6 print:hidden">
          
          {/* Location Search Input */}
          <div className="space-y-2">
            <label className="font-label-caps text-[10px] text-slate-gray font-bold block border-b border-border-subtle pb-1">DÜNYAYI ARAYIN</label>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Şehir, ülke veya adres arayın..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-border-subtle rounded text-body-sm focus:outline-none focus:border-primary text-on-background font-medium"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-white px-4 rounded font-bold cursor-pointer transition-all flex items-center justify-center text-xs"
              >
                ARA
              </button>
            </form>
            <p className="text-[10px] text-secondary font-medium">
              *Arama yapmak için OpenStreetMap altyapısı devrededir, token gerektirmeden **%100 çalışır**. Arama sonrası haritayı dilediğiniz gibi konumlandırabilirsiniz.
            </p>
          </div>

          {/* Location Text inputs */}
          <div className="space-y-4">
            <label className="font-label-caps text-[10px] text-slate-gray font-bold block border-b border-border-subtle pb-1">POSTER METİNLERİ</label>
            
            <div>
              <label className="text-[11px] font-semibold text-secondary block mb-1">Şehir İsmi (Ana Başlık)</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value.toUpperCase())}
                placeholder="Örn: ROMA"
                className="w-full px-3 py-2 bg-white border border-border-subtle rounded text-body-sm focus:outline-none focus:border-primary text-on-background font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-secondary block mb-1">Alt Başlık (Ülke / Özel Açıklama)</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value.toUpperCase())}
                placeholder="Örn: ITALY"
                className="w-full px-3 py-2 bg-white border border-border-subtle rounded text-body-sm focus:outline-none focus:border-primary text-on-background font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-secondary block mb-1">Teknik GPS Koordinatları (Otomatik Güncellenir)</label>
              <input
                type="text"
                value={coords}
                onChange={(e) => setCoords(e.target.value)}
                placeholder="Örn: 41.9028° N, 12.4964° E"
                className="w-full px-3 py-2 bg-white border border-border-subtle rounded text-xs font-mono focus:outline-none focus:border-primary text-on-background font-semibold"
              />
            </div>
          </div>

          {/* Style Controls */}
          <div className="space-y-4">
            <label className="font-label-caps text-[10px] text-slate-gray font-bold block border-b border-border-subtle pb-1">TASARIM VE STİL</label>

            {/* Themes */}
            <div>
              <label className="text-[11px] font-semibold text-secondary block mb-2">Harita Stili ve Teması</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(THEMES).map(([key, value]) => {
                  const isActive = themeName === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setThemeName(key);
                        setCustomStyleUrl("");
                      }}
                      className={`flex items-center gap-2 px-3 py-2 bg-white rounded border transition-all cursor-pointer text-[12px] font-semibold text-left ${
                        isActive && !customStyleUrl ? "border-primary font-bold shadow-sm" : "border-border-subtle hover:border-primary"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-border-subtle/50 shrink-0"
                        style={{ background: value.bg }}
                      ></span>
                      <span className="line-clamp-1">{value.name.replace("Scandinavian ", "").replace("Nordic ", "").replace("Pure ", "")}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Mapbox Style URL */}
            <div>
              <label className="text-[11px] font-semibold text-secondary block mb-1">Özel Mapbox Studio Stil URL&apos;i (Opsiyonel)</label>
              <input
                type="text"
                value={customStyleUrl}
                onChange={(e) => setCustomStyleUrl(e.target.value)}
                placeholder="mapbox://styles/username/styleid"
                className="w-full px-3 py-2 bg-white border border-border-subtle rounded text-xs font-mono focus:outline-none focus:border-primary text-on-background"
              />
              <p className="text-[9px] text-slate-gray mt-1">
                *Mapbox Studio&apos;da tasarladığınız tamamen kişiselleştirilmiş harita stillerini buraya yapıştırıp yükleyebilirsiniz.
              </p>
            </div>

            {/* Layout types */}
            <div>
              <label className="text-[11px] font-semibold text-secondary block mb-2">Harita Çerçeve Tipi</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setStyleType("classic")}
                  className={`py-2 rounded border transition-all cursor-pointer text-xs font-bold ${
                    styleType === "classic" ? "bg-primary border-primary text-white" : "bg-white text-secondary border-border-subtle"
                  }`}
                >
                  Klasik Dikdörtgen
                </button>
                <button
                  onClick={() => setStyleType("circle")}
                  className={`py-2 rounded border transition-all cursor-pointer text-xs font-bold ${
                    styleType === "circle" ? "bg-primary border-primary text-white" : "bg-white text-secondary border-border-subtle"
                  }`}
                >
                  Minimalist Daire
                </button>
              </div>
            </div>
          </div>

          {/* Mapbox Token Customizer */}
          <div className="pt-4 border-t border-border-subtle space-y-2">
            <label className="font-label-caps text-[10px] text-slate-gray font-bold block">MAPBOX ACCESS TOKEN GÜNCELLE</label>
            <form onSubmit={handleSaveToken} className="space-y-2">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="pk.eyJ1Ijo..."
                className="w-full px-3 py-2 bg-white border border-border-subtle focus:border-primary rounded text-xs font-mono focus:outline-none text-on-background shadow-sm"
              />
              <button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/95 text-white py-2 rounded text-[11px] font-bold cursor-pointer transition-all shadow"
              >
                GÜNCELLE VE KAYDET
              </button>
            </form>
            <p className="text-[9px] text-secondary leading-relaxed">
              *Varsayılan olarak hesabınızın sınırsız test lisansı devrededir. Başka bir Mapbox hesabının stilini veya limitlerini kullanmak isterseniz yeni **Access Token**&apos;ı buraya kaydedebilirsiniz.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-border-subtle space-y-3">
            <button
              onClick={handlePrint}
              className="w-full bg-primary hover:bg-primary/95 text-white py-3.5 rounded-xl font-label-caps text-label-caps font-bold transition-all shadow cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
              POSTER BASKI PDF AL
            </button>
            <p className="text-secondary text-[10px] leading-relaxed text-center font-medium">
              *PDF basılırken sistem tüm arayüz butonlarını temizler ve yüksek çözünürlüklü vektör posterinizi kağıda tam oturacak şekilde saklar.
            </p>
          </div>

        </aside>

        {/* Right Panel: Poster Live Canvas Preview */}
        <section className="lg:col-span-8 flex flex-col items-center justify-center print:w-full print:p-0 print:m-0 print:border-none">
          
          {/* Framed Canvas Mockup */}
          <div className="bg-[#DFD8CB]/30 p-8 md:p-12 border border-border-subtle rounded-3xl shadow-lg flex items-center justify-center max-w-[540px] w-full aspect-[3/4] print:p-0 print:m-0 print:border-none print:shadow-none print:max-w-none print:rounded-none">
            
            {/* Gallery Poster Frame */}
            <div 
              className="border-[16px] border-[#1E2022] rounded shadow-2xl overflow-hidden aspect-[3/4] w-full relative flex flex-col items-center p-8 md:p-10 print:border-none print:shadow-none print:rounded-none print:p-0 print:m-0"
              style={{ background: theme.bg }}
            >
              
              {/* Map Holder Wrapper (keeps styling constraints) */}
              <div className="w-full flex-1 relative flex items-center justify-center min-h-0">
                <div 
                  className={`w-full h-full border border-solid overflow-hidden relative ${
                    styleType === "circle" 
                      ? "rounded-full aspect-square max-h-[85%] max-w-[85%] mx-auto shadow-inner" 
                      : "rounded-none h-full w-full"
                  }`}
                  style={{ borderColor: theme.border }}
                >
                  {/* Mapbox container div */}
                  <div 
                    ref={mapContainerRef} 
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>

              {/* Poster Typography labels at bottom */}
              <div className="w-full text-center mt-6 shrink-0 print:mt-12">
                {/* City name */}
                <h2 
                  className="font-bold tracking-wider mb-2"
                  style={{ 
                    color: theme.text,
                    fontFamily: "'Outfit', 'Inter', sans-serif",
                    fontSize: city.length > 12 ? "32px" : "48px"
                  }}
                >
                  {city}
                </h2>
                
                {/* Subtitle / country */}
                <p 
                  className="font-medium tracking-widest uppercase text-xs mb-3.5"
                  style={{ color: theme.text, fontFamily: "'Inter', sans-serif" }}
                >
                  {subtitle}
                </p>

                {/* Divider Line */}
                <div 
                  className="w-16 h-[1.5px] mx-auto mb-3.5"
                  style={{ background: theme.border }}
                />

                {/* Technical GPS Coordinates */}
                <p 
                  className="font-semibold text-[10px] tracking-wide font-mono"
                  style={{ color: theme.text, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {coords}
                </p>
              </div>
              
            </div>
          </div>

          {/* Tips under poster - Print esnasında gizlenecek */}
          <div className="mt-8 text-center text-secondary text-xs max-w-md leading-relaxed print:hidden">
            <span className="material-symbols-outlined text-primary text-[20px] align-middle mr-1.5">local_printshop</span>
            Yüksek çözünürlüklü sanatsal çıktı alabilmek için PDF kaydedici ekranında <strong>Kağıt Boyutu: A4 / A3</strong> ve <strong>Arka Plan Grafikleri: Açık</strong> olarak işaretlemeyi unutmayın.
          </div>
        </section>

      </div>

      {/* Global CSS block for Print Optimization (Zero-margin, hides anything except the canvas container) */}
      <style jsx global>{`
        /* Hide all Mapbox UI controls, logos, and copyright watermarks for a pure artistic print look */
        .mapboxgl-ctrl,
        .mapboxgl-ctrl-group,
        .mapboxgl-ctrl-attrib {
          display: none !important;
        }
        @media print {
          /* Hides all default Next.js header, footers, breadcrumbs, sidebar */
          header, footer, nav, aside, div.print\\:hidden, button, form {
            display: none !important;
          }
          body, main, html {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            width: 100% !important;
            height: 100% !important;
          }
          /* Center the canvas and print it edge to edge */
          main {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            min-height: 100vh !important;
          }
          section {
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /* Remove frame borders when printing the poster itself */
          .bg-\\[\\#DFD8CB\\]\\/30 {
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
            max-width: 100% !important;
          }
          .border-\\[16px\\] {
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </main>
  );
}
