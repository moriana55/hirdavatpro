"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BetonSinifi = "C10" | "C16" | "C20" | "C25" | "C30";
type KarisimBirimi = "m3" | "torba";

const SINIF_DATA: Record<
  BetonSinifi,
  { cimento: number; kum: number; cakil: number; su: number; kullanim: string; dayanim: string }
> = {
  C10: {
    cimento: 200,
    kum: 700,
    cakil: 1200,
    su: 180,
    kullanim: "Dolgu, tesviye, zemin dolgu",
    dayanim: "10 MPa",
  },
  C16: {
    cimento: 250,
    kum: 680,
    cakil: 1180,
    su: 175,
    kullanim: "Yol altı, hafif yük taşıyan temeller",
    dayanim: "16 MPa",
  },
  C20: {
    cimento: 300,
    kum: 650,
    cakil: 1150,
    su: 170,
    kullanim: "Konut temeli, döşeme, bodrum duvarı",
    dayanim: "20 MPa",
  },
  C25: {
    cimento: 350,
    kum: 620,
    cakil: 1100,
    su: 165,
    kullanim: "Kolon, kiriş, perde, endüstriyel döşeme",
    dayanim: "25 MPa",
  },
  C30: {
    cimento: 400,
    kum: 590,
    cakil: 1050,
    su: 160,
    kullanim: "Köprü, yüksek yapı taşıyıcı elemanlar",
    dayanim: "30 MPa",
  },
};

const SINIFLAR: BetonSinifi[] = ["C10", "C16", "C20", "C25", "C30"];

// Torba başına standart değerler (50 kg çimento torbası)
const TORBA_KG = 50;

function NumInput({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit: string;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-zinc-600">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Math.max(min, parseFloat(e.target.value) || min))}
          className="w-full bg-transparent text-sm font-medium text-zinc-900 outline-none tabular-nums"
        />
        <span className="shrink-0 text-xs text-zinc-400">{unit}</span>
      </div>
    </label>
  );
}

function ResultCard({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        highlight
          ? "border-orange-200 bg-orange-50"
          : "border-zinc-200 bg-white",
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
      <p className={cn("mt-1 text-xl font-bold tabular-nums", highlight ? "text-orange-700" : "text-zinc-900")}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-[11px] text-zinc-400">{sub}</p>}
    </div>
  );
}

export function BetonKarisimTool() {
  const [sinif, setSinif] = useState<BetonSinifi>("C20");
  const [birim, setBirim] = useState<KarisimBirimi>("m3");
  const [miktar, setMiktar] = useState(1);

  const veri = SINIF_DATA[sinif];

  const sonuc = useMemo(() => {
    const carpan = birim === "m3" ? miktar : (miktar * TORBA_KG) / veri.cimento;
    return {
      cimento: veri.cimento * carpan,
      kum: veri.kum * carpan,
      cakil: veri.cakil * carpan,
      su: veri.su * carpan,
      toplamKuru: (veri.cimento + veri.kum + veri.cakil) * carpan,
      hacim: birim === "m3" ? miktar : (miktar * TORBA_KG) / veri.cimento,
      torba: birim === "m3" ? (veri.cimento * miktar) / TORBA_KG : miktar,
    };
  }, [sinif, birim, miktar, veri]);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        <Link href="/" className="transition hover:text-orange-600/90">Ana sayfa</Link>
        <span aria-hidden className="text-zinc-400">/</span>
        <Link href="/araclar" className="transition hover:text-orange-600/90">Araçlar</Link>
        <span aria-hidden className="text-zinc-400">/</span>
        <span className="text-orange-600/90">Beton karışım</span>
      </nav>

      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
          Beton Karışım Hesaplayıcı
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          Beton sınıfını ve miktarı girin — çimento, kum, çakıl ve su miktarlarını anında hesaplayın.
        </p>
      </div>

      {/* Beton Sınıfı Seçimi */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
        <p className="mb-3 text-sm font-semibold text-zinc-700">Beton Sınıfı</p>
        <div className="flex flex-wrap gap-2">
          {SINIFLAR.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSinif(s)}
              className={cn(
                "rounded-lg border px-4 py-2 text-sm font-bold transition",
                sinif === s
                  ? "border-orange-500 bg-orange-500 text-white shadow-sm"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-orange-300",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-3">
          <p className="text-xs font-medium text-zinc-500">
            <span className="font-semibold text-zinc-800">{sinif}</span> — {veri.dayanim} basınç dayanımı
          </p>
          <p className="mt-0.5 text-xs text-zinc-400">{veri.kullanim}</p>
          <p className="mt-2 text-[11px] text-zinc-400">
            1 m³ için: Çimento {veri.cimento} kg · Kum {veri.kum} kg · Çakıl {veri.cakil} kg · Su {veri.su} L
          </p>
        </div>
      </div>

      {/* Miktar & Birim */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
        <p className="mb-3 text-sm font-semibold text-zinc-700">Ne kadar beton lazım?</p>
        <div className="flex gap-2 mb-4">
          {(["m3", "torba"] as KarisimBirimi[]).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBirim(b)}
              className={cn(
                "flex-1 rounded-lg border px-4 py-2 text-sm font-semibold transition",
                birim === b
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-orange-300",
              )}
            >
              {b === "m3" ? "Hacim (m³)" : "Çimento torbası"}
            </button>
          ))}
        </div>
        <NumInput
          label={birim === "m3" ? "Beton Hacmi" : "Çimento Torbası Sayısı (50 kg)"}
          value={miktar}
          onChange={setMiktar}
          unit={birim === "m3" ? "m³" : "torba"}
          min={0.1}
          max={birim === "m3" ? 100 : 500}
          step={birim === "m3" ? 0.5 : 1}
        />
      </div>

      {/* Sonuçlar */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Malzeme Miktarları</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <ResultCard
            label="Çimento"
            value={`${sonuc.cimento.toFixed(1)} kg`}
            sub={`≈ ${Math.ceil(sonuc.torba)} torba (50 kg)`}
            highlight
          />
          <ResultCard label="Kum" value={`${sonuc.kum.toFixed(1)} kg`} sub="İnce agrega" />
          <ResultCard label="Çakıl" value={`${sonuc.cakil.toFixed(1)} kg`} sub="Kaba agrega" />
          <ResultCard label="Su" value={`${sonuc.su.toFixed(1)} L`} sub="S/Ç oranı dahil" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ResultCard
            label="Toplam Kuru Ağırlık"
            value={`${sonuc.toplamKuru.toFixed(0)} kg`}
            sub={`${sonuc.hacim.toFixed(2)} m³ taze beton`}
          />
          <ResultCard
            label="Çimento Torbası"
            value={`${Math.ceil(sonuc.torba)} adet`}
            sub={`1 torba = ${TORBA_KG} kg`}
          />
        </div>
      </div>

      {/* Uyarı */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-700">
        <strong>Not:</strong> Bu hesaplamalar standart kuru karışım oranlarına dayanır. Ortam sıcaklığı, agrega nem
        içeriği ve kullanılan çimento sınıfına göre oranlar değişebilir. Yapısal beton için mutlaka bir inşaat
        mühendisine danışın.
      </div>

      {/* Diğer Araçlar */}
      <div className="border-t border-zinc-100 pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Diğer araçlar</p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/araclar/matkap-ucu", label: "Matkap ucu seçimi" },
            { href: "/araclar/vida-dubel", label: "Vida & dübel" },
            { href: "/araclar/boya-hesaplayici", label: "Boya hesaplayıcı" },
            { href: "/araclar/zimpara-secimi", label: "Zımpara seçimi" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-orange-300 hover:text-orange-600"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
