"use client";

import { useState, useEffect } from "react";
import { Zap, Thermometer, Cable, ShieldAlert, Sparkles, Activity } from "lucide-react";

type Props = {
  category: string;
  specs: Record<string, any>;
  brand: string;
  model: string;
};

export function AletAkuSimulasyonClient({ category, specs, brand, model }: Props) {
  // Besleme tipini belirleyelim
  const voltajStr = String(specs["Voltaj"] || specs["Giriş Voltajı"] || "");
  const gucStr = String(specs["Giriş Gücü"] || specs["Motor Gücü"] || specs["Güç"] || "");
  
  const isCordless = 
    voltajStr.toLowerCase().includes("v") && 
    (voltajStr.includes("12") || voltajStr.includes("18") || voltajStr.includes("20") || voltajStr.includes("36") || voltajStr.includes("54") || voltajStr.includes("flexvolt")) &&
    !voltajStr.includes("220") && !voltajStr.includes("230");

  const nominalVoltage = parseFloat(voltajStr.replace(/[^0-9.]/g, "")) || 18;
  const nominalPower = parseFloat(gucStr.replace(/[^0-9.]/g, "")) || 850;

  // --- AKÜLÜ APARAT STATELERİ ---
  const [batteryCapacity, setBatteryCapacity] = useState<number>(5.0); // Ah
  const [batteryType, setBatteryType] = useState<"standard" | "high-output">("standard");
  const [loadLevel, setLoadLevel] = useState<"light" | "medium" | "heavy">("medium");

  // --- KABLOLU APARAT STATELERİ ---
  const [cableLength, setCableLength] = useState<number>(25); // metre
  const [cableGauge, setCableGauge] = useState<number>(1.5); // mm²
  const [powerSource, setPowerSource] = useState<"grid" | "generator">("grid");

  // --- HESAPLANAN DEĞERLER (AKÜLÜ) ---
  const [calculatedRuntime, setCalculatedRuntime] = useState<number>(0);
  const [calculatedWeight, setCalculatedWeight] = useState<number>(0);
  const [thermalLimit, setThermalLimit] = useState<number>(0);
  const [operationCount, setOperationCount] = useState<{ label: string; count: number }>({ label: "", count: 0 });

  // --- HESAPLANAN DEĞERLER (KABLOLU) ---
  const [voltageDrop, setVoltageDrop] = useState<number>(0);
  const [voltageDropPct, setVoltageDropPct] = useState<number>(0);
  const [powerLoss, setPowerLoss] = useState<number>(0);
  const [actualPower, setActualPower] = useState<number>(0);
  const [recGenerator, setRecGenerator] = useState<number>(0);

  // Alet çıplak ağırlığını parse et
  const parseToolWeight = () => {
    const agirlikStr = String(specs["Ağırlık"] || specs["Net Ağırlık"] || "");
    const parsed = parseFloat(agirlikStr.replace(/,/g, ".").replace(/[^0-9.]/g, ""));
    if (!isNaN(parsed) && parsed > 0) return parsed;
    // Fallback based on category
    if (category.includes("testere") || category.includes("kesme")) return 3.2;
    if (category.includes("taslama")) return 2.1;
    return 1.6; // drills / drivers
  };

  useEffect(() => {
    if (isCordless) {
      // 1. Akü Ağırlığı Hesaplama
      let batteryWeight = 0.35; // 2.0 Ah
      if (batteryCapacity === 4.0) batteryWeight = 0.60;
      else if (batteryCapacity === 5.0) batteryWeight = 0.65;
      else if (batteryCapacity === 8.0) batteryWeight = 0.95;
      else if (batteryCapacity === 12.0) batteryWeight = 1.40;
      
      if (batteryType === "high-output") batteryWeight += 0.05; // CoolPack metal soğutucu farkı
      
      const toolWeight = parseToolWeight();
      setCalculatedWeight(parseFloat((toolWeight + batteryWeight).toFixed(2)));

      // 2. Tüketim Gücü & Çalışma Süresi (Runtime)
      // Alet sınıfına göre güç tüketimi tahmini
      let baseWatt = 300;
      if (category.includes("testere") || category.includes("kesme")) baseWatt = 550;
      else if (category.includes("taslama")) baseWatt = 450;
      else if (category.includes("vidalama") || category.includes("somun")) baseWatt = 200;

      let loadMultiplier = 1.0;
      if (loadLevel === "light") loadMultiplier = 0.55;
      else if (loadLevel === "heavy") loadMultiplier = 1.85;

      const avgPowerConsumption = baseWatt * loadMultiplier;
      const batteryWh = batteryCapacity * nominalVoltage;
      
      // High output bataryalar daha az iç dirence sahip olduğu için verimlilik artar (+%12)
      const efficiency = batteryType === "high-output" ? 0.92 : 0.82;
      const runtimeMinutes = (batteryWh * efficiency) / avgPowerConsumption * 60;
      setCalculatedRuntime(Math.round(runtimeMinutes));

      // 3. Yapılabilecek İş Miktarı
      if (category.includes("testere") || category.includes("kesme")) {
        setOperationCount({
          label: "Kesim Mesafesi (18mm MDF)",
          count: Math.round(runtimeMinutes * 1.4)
        });
      } else if (category.includes("taslama")) {
        setOperationCount({
          label: "İnşaat Demiri Kesimi (Ø12mm)",
          count: Math.round(runtimeMinutes * 1.1)
        });
      } else {
        setOperationCount({
          label: "Ağaç Vidası Sıkma (5x50mm)",
          count: Math.round(runtimeMinutes * 16)
        });
      }

      // 4. Termal Verimlilik / Isınma Süresi
      let baseThermalMinutes = 20;
      if (batteryType === "high-output") baseThermalMinutes = 45; // CoolPack teknolojisi
      if (loadLevel === "light") baseThermalMinutes *= 2.0;
      else if (loadLevel === "heavy") baseThermalMinutes *= 0.6;
      
      setThermalLimit(Math.round(baseThermalMinutes));

    } else {
      // --- KABLOLU HESAPLAMA MOTORU ---
      // Alet akımı (Amper) = Güç / Voltaj (220V)
      const current = nominalPower / 220;
      
      // Bakır özgül direnci (ohm * mm2 / m)
      const copperResistivity = 0.0178;
      
      // Toplam hat direnci R = (2 * Uzunluk * Direnç) / Kesit
      let lineResistance = (2 * cableLength * copperResistivity) / cableGauge;
      
      // Jeneratör dalgalanma empedansı (+%10 direnç artışı)
      if (powerSource === "generator") {
        lineResistance *= 1.1;
      }

      // Voltaj Düşümü dV = I * R
      const dV = current * lineResistance;
      const dVPct = (dV / 220) * 100;
      
      setVoltageDrop(parseFloat(dV.toFixed(1)));
      setVoltageDropPct(parseFloat(dVPct.toFixed(1)));

      // Hat Güç Kaybı P_loss = I^2 * R
      const pLoss = Math.pow(current, 2) * lineResistance;
      setPowerLoss(Math.round(pLoss));

      // Alete ulaşan net aktif güç
      setActualPower(Math.round(nominalPower - pLoss));

      // Önerilen asgari jeneratör kapasitesi (kVA)
      // Demeraj akımı (kalkış akımı) için elektrikli aletlerde 1.6x tolerans eklenir
      const recGenKva = (nominalPower * 1.6) / 1000;
      setRecGenerator(parseFloat(recGenKva.toFixed(2)));
    }
  }, [
    isCordless,
    batteryCapacity,
    batteryType,
    loadLevel,
    cableLength,
    cableGauge,
    powerSource,
    nominalVoltage,
    nominalPower,
    category
  ]);

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mt-12 relative">
      {/* Decorative top strip */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-primary to-blue-500"></div>

      {/* Header */}
      <div className="p-6 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
            {isCordless ? <Zap className="w-5 h-5 animate-pulse" /> : <Cable className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-title-md text-title-md font-bold text-white">
              Endüstriyel Güç & Performans Simülatörü
            </h3>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5 uppercase tracking-wider">
              {brand} {model} • Fiziksel Şantiye Simülasyonu
            </p>
          </div>
        </div>
        <span className="font-mono text-[10px] bg-primary/10 text-primary border border-primary/30 px-2 py-0.5 rounded font-bold uppercase">
          {isCordless ? "AKÜLÜ SIM" : "ŞEBEKE / AC SIM"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        
        {/* LEFT COLUMN: CONTROLS */}
        <div className="lg:col-span-6 p-6 space-y-6 bg-slate-900/50">
          <h4 className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <Activity className="w-4 h-4 text-primary" /> ŞANTİYE KOŞULLARINI AYARLA
          </h4>

          {isCordless ? (
            // --- AKÜLÜ SİMÜLATÖR PANELİ ---
            <div className="space-y-6">
              {/* Battery Capacity Selection */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold font-mono text-slate-300">BATARYA KAPASİTESİ (Ah)</label>
                  <span className="text-xs font-mono font-bold text-primary">{batteryCapacity} Ah</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[2.0, 4.0, 5.0, 8.0, 12.0].map((cap) => (
                    <button
                      key={cap}
                      onClick={() => setBatteryCapacity(cap)}
                      className={`py-2 px-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                        batteryCapacity === cap
                          ? "bg-primary border-primary text-on-primary shadow-lg shadow-primary/20"
                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      {cap}A
                    </button>
                  ))}
                </div>
              </div>

              {/* Battery Cell Tech */}
              <div className="space-y-3">
                <label className="block text-xs font-bold font-mono text-slate-300">PİL HÜCRE TEKNOLOJİSİ</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setBatteryType("standard")}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      batteryType === "standard"
                        ? "bg-slate-950 border-primary text-white shadow-lg shadow-primary/5"
                        : "bg-slate-950/20 border-slate-800 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <span className="text-xs font-bold">Standard Li-Ion</span>
                    <span className="text-[10px] text-slate-500 mt-1 font-sans leading-snug">
                      Standart iç direnç, klasik plastik hücre yataklama.
                    </span>
                  </button>

                  <button
                    onClick={() => setBatteryType("high-output")}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      batteryType === "high-output"
                        ? "bg-slate-950 border-primary text-white shadow-lg shadow-primary/5"
                        : "bg-slate-950/20 border-slate-800 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      <span className="text-xs font-bold text-amber-400">High-Output / ProCORE</span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 font-sans leading-snug">
                      Bakır hücre köprüleri, CoolPack termal zırh, +%15 ekstra tork.
                    </span>
                  </button>
                </div>
              </div>

              {/* Load Level Selection */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold font-mono text-slate-300">UYGULANAN YÜK ŞİDDETİ</label>
                  <span className="text-xs font-mono font-bold text-primary uppercase">
                    {loadLevel === "light" ? "Hafif İş" : loadLevel === "medium" ? "Orta Direnç" : "Ağır / Sürekli Yük"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["light", "medium", "heavy"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setLoadLevel(level)}
                      className={`py-2 px-2 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer capitalize ${
                        loadLevel === level
                          ? "bg-primary border-primary text-on-primary shadow-lg shadow-primary/20"
                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      {level === "light" ? "Hafif" : level === "medium" ? "Orta" : "Ağır"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // --- KABLOLU SİMÜLATÖR PANELİ ---
            <div className="space-y-6">
              {/* Cable Length Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold font-mono text-slate-300">UZATMA KABLO UZUNLUĞU</label>
                  <span className="text-xs font-mono font-bold text-primary">{cableLength} Metre</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={cableLength}
                  onChange={(e) => setCableLength(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>10m</span>
                  <span>25m</span>
                  <span>50m</span>
                  <span>100m</span>
                </div>
              </div>

              {/* Cable Gauge selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold font-mono text-slate-300">KABLO BAKIR KESİTİ (İLETKEN KALINLIĞI)</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCableGauge(1.5)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      cableGauge === 1.5
                        ? "bg-slate-950 border-primary text-white shadow-lg shadow-primary/5"
                        : "bg-slate-950/20 border-slate-800 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <span className="text-xs font-bold">1.5 mm² Kesit</span>
                    <span className="text-[10px] text-slate-500 mt-1 font-sans leading-snug">
                      Standart ev/atölye uzatmaları. Kolay taşınır, yüksek direnç.
                    </span>
                  </button>

                  <button
                    onClick={() => setCableGauge(2.5)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      cableGauge === 2.5
                        ? "bg-slate-950 border-primary text-white shadow-lg shadow-primary/5"
                        : "bg-slate-950/20 border-slate-800 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <span className="text-xs font-bold text-blue-400">2.5 mm² Kesit</span>
                    <span className="text-[10px] text-slate-500 mt-1 font-sans leading-snug">
                      Endüstriyel şantiye hatları. Düşük gerilim düşümü, yüksek akım.
                    </span>
                  </button>
                </div>
              </div>

              {/* Power Source */}
              <div className="space-y-3">
                <label className="block text-xs font-bold font-mono text-slate-300">GÜÇ KAYNAĞI TİPİ</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "grid", label: "Şebeke Elektriği", desc: "220V Sabit Frekans" },
                    { key: "generator", label: "Şantiye Jeneratörü", desc: "Dalgalı Akım (+%10 empedans)" }
                  ].map((src) => (
                    <button
                      key={src.key}
                      onClick={() => setPowerSource(src.key as any)}
                      className={`p-2.5 rounded-lg text-xs font-mono font-bold border text-center transition-all cursor-pointer ${
                        powerSource === src.key
                          ? "bg-primary border-primary text-on-primary shadow-lg shadow-primary/20"
                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <div>{src.label}</div>
                      <div className="text-[9px] opacity-70 font-sans mt-0.5">{src.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SIMULATION RESULTS */}
        <div className="lg:col-span-6 p-6 space-y-6 flex flex-col justify-between">
          <div>
            <h4 className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800 pb-2 mb-6">
              <Zap className="w-4 h-4 text-amber-500" /> SİMÜLASYON ANALİZ RAPORU
            </h4>

            {isCordless ? (
              // --- AKÜLÜ ANALİZ SONUÇLARI ---
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Runtime Gauge */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 flex gap-4 items-center">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center font-mono text-lg font-bold shrink-0">
                    {calculatedRuntime}
                    <span className="text-[9px] font-normal ml-0.5">dk</span>
                  </div>
                  <div>
                    <h5 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Kesintisiz Tetik Süresi</h5>
                    <p className="text-xs text-slate-300 mt-0.5">Sürekli kullanımda net pil ömrü.</p>
                  </div>
                </div>

                {/* Total Weight */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 flex gap-4 items-center">
                  <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center font-mono text-lg font-bold shrink-0">
                    {calculatedWeight}
                    <span className="text-[9px] font-normal ml-0.5">kg</span>
                  </div>
                  <div>
                    <h5 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Toplam Çalışma Ağırlığı</h5>
                    <p className="text-xs text-slate-300 mt-0.5">Alet + Batarya dahil toplam ağırlık.</p>
                  </div>
                </div>

                {/* Operation Counts */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 flex gap-4 items-center sm:col-span-2">
                  <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg flex items-center justify-center font-mono text-lg font-bold shrink-0">
                    {operationCount.count}
                    <span className="text-[9px] font-normal ml-0.5">adet</span>
                  </div>
                  <div>
                    <h5 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">{operationCount.label}</h5>
                    <p className="text-xs text-slate-300 mt-0.5">Tek şarj döngüsünde şantiyede yapılabilecek maksimum iş.</p>
                  </div>
                </div>

                {/* Thermal Efficiency Gauge */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 sm:col-span-2 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <h5 className="font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Thermometer className="w-4 h-4 text-red-500" /> TERMAL GÜVENLİK SÜRESİ
                    </h5>
                    <span className="font-mono font-bold text-red-400">{thermalLimit} Dakika</span>
                  </div>
                  <div className="h-2 bg-slate-900 border border-slate-850 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        thermalLimit < 15 ? "bg-red-500" : thermalLimit < 30 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min((thermalLimit / 60) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    {batteryType === "high-output" 
                      ? "✓ ProCORE bakır soğutucular ısıyı dağıtır; hücreler aşırı ısınmadan sürekli yük altında kesintisiz çalışabilir."
                      : "⚠ Standart batarya ağır yük altında hızlı ısınır. 15-20 dakikada bir dinlendirmeniz önerilir."}
                  </p>
                </div>

              </div>
            ) : (
              // --- KABLOLU ANALİZ SONUÇLARI ---
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Voltage Drop Percentage */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 flex gap-4 items-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-mono text-lg font-bold shrink-0 ${
                    voltageDropPct > 5.0 
                      ? "bg-red-500/10 border border-red-500/20 text-red-400" 
                      : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  }`}>
                    {voltageDropPct}%
                  </div>
                  <div>
                    <h5 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Gerilim Düşümü</h5>
                    <p className="text-xs text-slate-300 mt-0.5">Uzatma hattındaki kayıp voltaj oranı.</p>
                  </div>
                </div>

                {/* Line Power Loss */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 flex gap-4 items-center">
                  <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center font-mono text-lg font-bold shrink-0">
                    -{powerLoss}W
                  </div>
                  <div>
                    <h5 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Kablo Isı Güç Kaybı</h5>
                    <p className="text-xs text-slate-300 mt-0.5">Kablonun dirençle ısıya dönüştürdüğü kayıp güç.</p>
                  </div>
                </div>

                {/* Actual Delivered Power */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 flex gap-4 items-center sm:col-span-2">
                  <div className="w-14 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center font-mono text-lg font-bold shrink-0">
                    {actualPower}W
                  </div>
                  <div>
                    <h5 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Alete Ulaşan Net Güç</h5>
                    <p className="text-xs text-slate-300 mt-0.5">Uzatmanın ucundaki aletin verebileceği efektif maksimum motor gücü.</p>
                  </div>
                </div>

                {/* Recommended Generator */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 flex gap-4 items-center sm:col-span-2">
                  <div className="w-14 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg flex items-center justify-center font-mono text-sm font-bold shrink-0">
                    {recGenerator} kVA
                  </div>
                  <div>
                    <h5 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Asgari Jeneratör Kapasitesi</h5>
                    <p className="text-xs text-slate-300 mt-0.5">Demeraj (kalkış) yükünü kaldıracak önerilen minimum jeneratör gücü.</p>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Safety Warnings banner */}
          <div className={`mt-6 rounded-xl border p-4 flex gap-3 items-start ${
            isCordless 
              ? "bg-slate-950/50 border-slate-850 text-slate-400"
              : voltageDropPct > 5.0
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-slate-950/50 border-slate-850 text-slate-400"
          }`}>
            <ShieldAlert className={`w-5 h-5 shrink-0 mt-0.5 ${
              !isCordless && voltageDropPct > 5.0 ? "text-red-400 animate-pulse" : "text-primary"
            }`} />
            <div className="text-[11px] leading-relaxed">
              {isCordless ? (
                <span>
                  <strong>Pil Hücre Sağlığı Koruma Direktifi:</strong> Akünüzün ömrünü korumak için 45°C üstü şantiye sıcaklıklarında doğrudan güneş altında şarj etmeyin. Orijinal üretici şarj cihazları ve termal korumalı yuvalar kullanılması mecburidir.
                </span>
              ) : voltageDropPct > 5.0 ? (
                <span>
                  <strong>Kritik Uyarı:</strong> Gerilim düşümü şantiye standardı olan <strong>%5 limitini aşmıştır ({voltageDropPct}%)</strong>. Aletin motorunda tork kaybı ve aşırı ısınma meydana gelecektir. İletken kalınlığını <strong>2.5 mm²</strong> seviyesine yükseltmeniz veya kablo boyunu kısaltmanız şarttır!
                </span>
              ) : (
                <span>
                  <strong>Şantiye Elektrik Regülasyonu:</strong> Belirtilen kombinasyon güvenli sınırlar içerisindedir. Kablo üzerindeki bobinleşmeyi (makara) tamamen çözerek kullanın; aksi halde kablo iç indüksiyon nedeniyle eriyebilir.
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
