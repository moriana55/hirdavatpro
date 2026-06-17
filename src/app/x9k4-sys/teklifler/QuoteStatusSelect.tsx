"use client";

import { useState } from "react";

const STATUSES: { value: string; label: string }[] = [
  { value: "new", label: "Yeni" },
  { value: "quoted", label: "Teklif Verildi" },
  { value: "won", label: "Kazanıldı" },
  { value: "lost", label: "Kaybedildi" },
];

export function QuoteStatusSelect({ id, initial }: { id: string; initial: string }) {
  const [status, setStatus] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(false);

  async function update(next: string) {
    const prev = status;
    setStatus(next);
    setSaving(true);
    setErr(false);
    try {
      const r = await fetch("/api/b2b/quote/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
      if (!r.ok) throw new Error();
    } catch {
      setStatus(prev);
      setErr(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        disabled={saving}
        onChange={(e) => update(e.target.value)}
        className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs font-bold text-zinc-700 outline-none focus:border-orange-500 disabled:opacity-50"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      {err && <span className="text-[10px] text-red-500">Kaydedilemedi</span>}
    </div>
  );
}
