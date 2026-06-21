"use client";

import { useEffect, useRef, useState } from "react";

interface ComparisonShareBarProps {
  /** Web Share API için paylaşım başlığı */
  shareTitle: string;
  /** Web Share API için açıklama metni */
  shareText?: string;
  /** Lead yakalama için bağlam (ör. karşılaştırılan ürünler / slug) */
  leadContext?: string;
  /** Lead kaynağı (analytics ayrımı için) */
  leadSource?: string;
}

/**
 * "PDF olarak indir / yazdır" + "Bağlantıyı kopyala / paylaş" aksiyon barı.
 * Tamamen istemci tarafında çalışır, harici bağımlılık yoktur.
 * - Yazdırma: window.print() + globals.css içindeki @media print kuralları.
 * - Paylaşma: Web Share API (mobil) → navigator.clipboard (masaüstü) → manuel kopya (fallback).
 * Bu barın kendisi yazdırma çıktısında "no-print" sınıfı ile gizlenir.
 */
export function ComparisonShareBar({ shareTitle, shareText, leadContext, leadSource = "comparison" }: ComparisonShareBarProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Opsiyonel lead (e-posta) yakalama ──
  const [showLead, setShowLead] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [leadState, setLeadState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [leadMsg, setLeadMsg] = useState<string | null>(null);

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setLeadState("error");
      setLeadMsg("Devam etmek için onay kutusunu işaretleyin.");
      return;
    }
    setLeadState("loading");
    setLeadMsg(null);
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true, source: leadSource, context: leadContext ?? "" }),
      });
      const d = await r.json();
      if (!r.ok) {
        setLeadState("error");
        setLeadMsg(d.error || "Kayıt yapılamadı.");
        return;
      }
      setLeadState("done");
      setLeadMsg(d.message || "Teşekkürler!");
    } catch {
      setLeadState("error");
      setLeadMsg("Sunucuya ulaşılamadı.");
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const flash = (msg: string) => {
    setFeedback(msg);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setFeedback(null), 2600);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined" && typeof window.print === "function") {
      window.print();
    }
  };

  const handleShare = async () => {
    const url =
      typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;

    // 1) Web Share API (genellikle mobil/desktop Safari/Chrome)
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url });
        return; // Başarılı paylaşımda geri bildirim göstermeye gerek yok
      } catch (err) {
        // Kullanıcı paylaşım panelini iptal ettiyse sessizce çık
        if (err instanceof DOMException && err.name === "AbortError") return;
        // Diğer hatalarda panoya kopyalamaya düş
      }
    }

    // 2) Clipboard fallback
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      try {
        await navigator.clipboard.writeText(url);
        setManualUrl(null);
        flash("Bağlantı kopyalandı");
        return;
      } catch {
        // Pano reddetti → manuel kopya kutusu göster
      }
    }

    // 3) Manuel kopya fallback (HTTP / izin reddi durumları)
    setManualUrl(url);
    flash("Bağlantıyı manuel olarak kopyalayın");
  };

  return (
    <div className="no-print mb-8 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 border border-slate-gray bg-surface-container-lowest px-5 py-2.5 font-label-caps text-label-caps font-bold text-on-surface rounded hover:bg-surface-container hover:border-primary transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">print</span>
          PDF OLARAK İNDİR / YAZDIR
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 border border-primary bg-primary/[0.06] px-5 py-2.5 font-label-caps text-label-caps font-bold text-primary rounded hover:bg-primary hover:text-white transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">share</span>
          BAĞLANTIYI KOPYALA / PAYLAŞ
        </button>

        <button
          type="button"
          onClick={() => setShowLead((s) => !s)}
          className="inline-flex items-center gap-2 border border-slate-gray bg-surface-container-lowest px-5 py-2.5 font-label-caps text-label-caps font-bold text-on-surface rounded hover:bg-surface-container hover:border-primary transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">mail</span>
          KAYDET / E-POSTA İLE GÖNDER
        </button>

        {feedback && (
          <span
            role="status"
            aria-live="polite"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-success-vibrant"
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            {feedback}
          </span>
        )}
      </div>

      {/* Manuel kopya fallback: pano API kullanılamadığında */}
      {manualUrl && (
        <div className="flex flex-wrap items-center gap-2 bg-surface-container-low border border-border-subtle rounded px-3 py-2">
          <span className="font-label-caps text-[10px] font-bold text-secondary uppercase">
            Bağlantı
          </span>
          <input
            type="text"
            readOnly
            value={manualUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="flex-1 min-w-[200px] bg-transparent text-[13px] text-on-surface font-mono outline-none"
          />
        </div>
      )}

      {/* Opsiyonel lead yakalama — paylaşımı/yazdırmayı engellemez, atlanabilir */}
      {showLead && (
        <div className="bg-surface-container-low border border-border-subtle rounded-xl p-4 max-w-xl">
          {leadState === "done" ? (
            <p className="inline-flex items-center gap-2 text-[14px] font-semibold text-success-vibrant">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              {leadMsg}
            </p>
          ) : (
            <form onSubmit={submitLead} className="flex flex-col gap-3">
              <div>
                <h4 className="font-title-sm text-title-sm font-bold text-on-surface">Karşılaştırmayı e-posta ile alın</h4>
                <p className="text-secondary text-[12px] mt-0.5">
                  İsteğe bağlı. Bu bağlantıyı kaydetmek ve ürün güncellemeleri almak isterseniz e-postanızı bırakın.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  aria-label="E-posta adresiniz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@eposta.com"
                  className="flex-1 border border-border-subtle rounded px-3 py-2 text-[14px] outline-none focus:border-primary bg-white"
                />
                <button
                  type="submit"
                  disabled={leadState === "loading"}
                  className="bg-primary text-white px-5 py-2 rounded font-label-caps text-label-caps font-bold hover:bg-primary/95 transition-all disabled:opacity-60"
                >
                  {leadState === "loading" ? "GÖNDERİLİYOR…" : "GÖNDER"}
                </button>
              </div>
              <label className="flex items-start gap-2 text-[12px] text-secondary leading-relaxed cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-primary cursor-pointer shrink-0"
                />
                <span>
                  E-posta adresimin, bu karşılaştırmayı göndermek ve ürün güncellemeleri paylaşmak için
                  işlenmesine (KVKK kapsamında) açık rıza veriyorum. İstediğim zaman geri çekebilirim.
                </span>
              </label>
              {leadState === "error" && leadMsg && (
                <p className="text-error text-[12px] font-semibold">{leadMsg}</p>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
