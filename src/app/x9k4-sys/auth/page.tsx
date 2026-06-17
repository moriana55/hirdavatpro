"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ShieldAlert, Terminal } from "lucide-react";

export default function AdminAuthPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirect to admin dashboard
        router.push("/x9k4-sys");
        router.refresh();
      } else {
        setError(data.error || "Geçersiz şifre!");
      }
    } catch (err) {
      setError("Bağlantı hatası!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Industrial Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>

      {/* Cyberpunk ambient glowing spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="relative w-full max-w-md">
        {/* Main Glassmorphic Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 overflow-hidden group hover:border-primary/50 transition-all duration-500">
          
          {/* Top Decorative Industrial Strip */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-primary to-amber-500"></div>

          {/* Authorization Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 border border-primary/30 rounded-xl text-primary mb-4 animate-pulse">
              <Lock className="w-6 h-6" />
            </div>
            
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-mono text-[10px] tracking-wider text-emerald-400 font-bold uppercase">
                GÜVENLİ SUNUCU BAĞLANTISI
              </span>
            </div>
            
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Yönetici Yetkilendirmesi
            </h1>
            <p className="text-slate-400 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
              HırdavatPro kontrol odasına erişmek için yönetici şifresini girin.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label 
                htmlFor="admin-password" 
                className="block text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase"
              >
                GİRİŞ ANAHTARI (PASSWORD)
              </label>
              
              <div className="relative rounded-lg overflow-hidden border border-slate-800 focus-within:border-primary transition-colors bg-slate-950/60">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoFocus
                  disabled={loading}
                  className="w-full bg-transparent px-4 py-3.5 pr-12 text-white font-mono text-sm placeholder-slate-700 focus:outline-none disabled:opacity-50"
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-xs animate-shake">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <span className="leading-relaxed font-medium">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-on-primary py-3.5 font-mono text-xs font-bold uppercase tracking-wider rounded-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-primary/20 border border-primary/20 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                  DOĞRULANIYOR...
                </>
              ) : (
                <>
                  <Terminal className="w-4 h-4" />
                  KONSOLU AÇ
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-slate-900 text-center">
            <span className="font-mono text-[9px] text-slate-600 block uppercase">
              HIRDAVATPRO CORE v4.0.0
            </span>
          </div>

        </div>
      </div>
    </main>
  );
}
