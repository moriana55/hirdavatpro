"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth", { method: "DELETE" });
    } catch {
      // sessizce geç — yine de giriş sayfasına yönlendir
    } finally {
      router.replace("/x9k4-sys/auth");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      aria-label="Yönetici oturumunu kapat"
      className="text-xs bg-red-600 text-white px-4 py-2 font-bold rounded font-label-caps text-label-caps hover:bg-red-700 transition-all flex items-center gap-1.5 disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-[16px]">logout</span>
      {loading ? "ÇIKILIYOR..." : "ÇIKIŞ"}
    </button>
  );
}
