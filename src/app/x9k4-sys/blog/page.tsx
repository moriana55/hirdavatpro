"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, Trash2, Eye, EyeOff, Plus, Edit2, X, Check, Image as ImageIcon, LayoutTemplate } from "lucide-react";
import { CATEGORY_LABELS, CATEGORY_GROUPS } from "@/lib/products/types";

const TEMPLATE_KINDS = [
  { value: "best-of", label: "En İyi N Listesi" },
  { value: "spec-guide", label: "Teknik Spec Rehberi" },
  { value: "buyers-guide", label: "Satın Alma Rehberi" },
];

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string | null;
  readTime: string;
  published: boolean;
  createdAt: string;
};

type Tab = "liste" | "yeni" | "sablon";

type TemplateResult = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  content: string;
  readTime: string;
  suggestedProducts: { id: string; brand: string; model: string; slug: string; priceRange?: string }[];
  internalLinks: { label: string; href: string }[];
};

const CATEGORIES = [
  "Delme & Vidalama",
  "Taşlama & Zımparalama",
  "Testere & Kesme",
  "Kaynak",
  "Kompresör & Havalı Alet",
  "El Aletleri",
  "İş Güvenliği",
  "Ölçüm & Kontrol",
  "Genel",
];

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Genel",
  coverImage: "",
  readTime: "5 dk",
  published: false,
};

export default function AdminBlogPage() {
  const [tab, setTab] = useState<Tab>("liste");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...emptyForm });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);

  // Şablon üretimi
  const [tplCategory, setTplCategory] = useState("darbeli-matkap");
  const [tplKind, setTplKind] = useState("best-of");
  const [tplCount, setTplCount] = useState(5);
  const [tplEnrich, setTplEnrich] = useState(false);
  const [tplLoading, setTplLoading] = useState(false);
  const [tplResult, setTplResult] = useState<TemplateResult | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/blog");
      setPosts(await r.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const flash = (type: "ok" | "err", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const autoSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
      .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleTitleChange = (v: string) => {
    setForm(f => ({ ...f, title: v, slug: f.slug || autoSlug(v) }));
  };

  const generateContent = async () => {
    if (!form.title) { flash("err", "Önce başlık gir"); return; }
    setGenerating(true);
    try {
      const r = await fetch("/api/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title, category: form.category, excerpt: form.excerpt }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setForm(f => ({ ...f, content: data.content, readTime: data.readTime }));
      flash("ok", "İçerik üretildi!");
    } catch (e: unknown) {
      flash("err", (e as Error).message || "Hata");
    } finally {
      setGenerating(false);
    }
  };

  const generateTemplate = async () => {
    setTplLoading(true);
    setTplResult(null);
    try {
      const r = await fetch("/api/blog/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: tplCategory, kind: tplKind, count: tplCount, enrich: tplEnrich }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setTplResult(data.template);
      flash("ok", "Taslak üretildi!");
    } catch (e: unknown) {
      flash("err", (e as Error).message || "Hata");
    } finally {
      setTplLoading(false);
    }
  };

  const useTemplate = () => {
    if (!tplResult) return;
    setForm({
      ...emptyForm,
      title: tplResult.title,
      slug: tplResult.slug,
      excerpt: tplResult.excerpt,
      content: tplResult.content,
      category: tplResult.category,
      readTime: tplResult.readTime,
    });
    setEditId(null);
    setPreview(false);
    setTab("yeni");
    flash("ok", "Taslak editöre yüklendi. Düzenleyip kaydedin.");
  };

  const save = async () => {
    if (!form.title) { flash("err", "Başlık zorunlu"); return; }
    setSaving(true);
    try {
      const payload = { ...form, slug: form.slug || autoSlug(form.title), coverImage: form.coverImage || null };
      const method = editId ? "PATCH" : "POST";
      const body = editId ? { id: editId, ...payload } : payload;
      const r = await fetch("/api/blog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      flash("ok", editId ? "Güncellendi!" : "Yazı oluşturuldu!");
      setForm({ ...emptyForm });
      setEditId(null);
      setTab("liste");
      await load();
    } catch (e: unknown) {
      flash("err", (e as Error).message || "Hata");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p: BlogPost) => {
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      category: p.category,
      coverImage: p.coverImage ?? "",
      readTime: p.readTime,
      published: p.published,
    });
    setEditId(p.id);
    setPreview(false);
    setTab("yeni");
  };

  const togglePublish = async (p: BlogPost) => {
    await fetch("/api/blog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, published: !p.published }),
    });
    await load();
  };

  const deletePost = async (id: string) => {
    await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    await load();
  };

  const cancelEdit = () => {
    setForm({ ...emptyForm });
    setEditId(null);
    setPreview(false);
    setTab("liste");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Blog Yönetimi</h1>
            <p className="text-zinc-400 text-sm mt-1">{posts.length} yazı · {posts.filter(p => p.published).length} yayında</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setTab("liste"); }} className={`px-4 py-2 rounded text-sm font-medium transition-colors ${tab === "liste" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"}`}>
              Liste
            </button>
            <button onClick={() => { setTab("sablon"); }} className={`px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-1.5 ${tab === "sablon" ? "bg-orange-600 text-white" : "bg-zinc-800 text-zinc-300 hover:text-white"}`}>
              <LayoutTemplate className="size-4" /> Şablon
            </button>
            <button onClick={() => { cancelEdit(); setTab("yeni"); }} className={`px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-1.5 ${tab === "yeni" && !editId ? "bg-orange-600 text-white" : "bg-zinc-800 text-zinc-300 hover:text-white"}`}>
              <Plus className="size-4" /> Yeni Yazı
            </button>
          </div>
        </div>

        {/* Flash */}
        {msg && (
          <div className={`mb-4 px-4 py-3 rounded text-sm font-medium ${msg.type === "ok" ? "bg-emerald-900/60 text-emerald-300 border border-emerald-700" : "bg-red-900/60 text-red-300 border border-red-700"}`}>
            {msg.text}
          </div>
        )}

        {/* LIST TAB */}
        {tab === "liste" && (
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-zinc-400">
                <Loader2 className="size-6 animate-spin mr-2" /> Yükleniyor...
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 text-zinc-500">
                <p className="text-lg font-medium mb-2">Henüz yazı yok</p>
                <button onClick={() => setTab("yeni")} className="text-orange-400 hover:text-orange-300 text-sm underline">Yeni yazı ekle</button>
              </div>
            ) : (
              posts.map(p => (
                <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-start gap-4">
                  {p.coverImage && (
                    <img src={p.coverImage} alt="" className="w-16 h-16 object-cover rounded flex-shrink-0 bg-zinc-800" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${p.published ? "bg-emerald-900/60 text-emerald-400 border border-emerald-700" : "bg-zinc-800 text-zinc-500 border border-zinc-700"}`}>
                        {p.published ? "Yayında" : "Taslak"}
                      </span>
                      <span className="text-[11px] text-zinc-500">{p.category}</span>
                      <span className="text-[11px] text-zinc-600">· {p.readTime}</span>
                    </div>
                    <h3 className="font-semibold text-white text-sm leading-snug">{p.title}</h3>
                    {p.excerpt && <p className="text-zinc-400 text-xs mt-1 line-clamp-1">{p.excerpt}</p>}
                    <p className="text-zinc-600 text-[11px] mt-1">/blog/{p.slug}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => togglePublish(p)} title={p.published ? "Taslağa Al" : "Yayınla"}
                      className={`p-2 rounded transition-colors ${p.published ? "text-emerald-400 hover:text-zinc-400" : "text-zinc-500 hover:text-emerald-400"}`}>
                      {p.published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                    </button>
                    <button onClick={() => startEdit(p)} className="p-2 rounded text-zinc-400 hover:text-orange-400 transition-colors">
                      <Edit2 className="size-4" />
                    </button>
                    {deleteConfirm === p.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => deletePost(p.id)} className="p-1.5 rounded bg-red-700 hover:bg-red-600 text-white">
                          <Check className="size-3.5" />
                        </button>
                        <button onClick={() => setDeleteConfirm(null)} className="p-1.5 rounded bg-zinc-700 hover:bg-zinc-600 text-white">
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(p.id)} className="p-2 rounded text-zinc-500 hover:text-red-400 transition-colors">
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TEMPLATE TAB */}
        {tab === "sablon" && (
          <div className="space-y-5">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <h2 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <LayoutTemplate className="size-4 text-orange-400" /> Kategoriye Duyarlı Blog Şablonu
              </h2>
              <p className="text-xs text-zinc-500 mb-4">
                Kategori seçin; ilgili katalog ürünleri ve dahili rehber linkleri otomatik eklenir. Harici API gerekmez.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Kategori</label>
                  <select
                    value={tplCategory}
                    onChange={(e) => setTplCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                  >
                    {CATEGORY_GROUPS.map((g) => (
                      <optgroup key={g.label} label={g.label}>
                        {g.categories.map((c) => (
                          <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Şablon Tipi</label>
                  <select
                    value={tplKind}
                    onChange={(e) => setTplKind(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                  >
                    {TEMPLATE_KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Ürün Sayısı (liste)</label>
                  <input
                    type="number" min={3} max={10}
                    value={tplCount}
                    onChange={(e) => setTplCount(Math.max(3, Math.min(10, parseInt(e.target.value) || 5)))}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 mt-4 cursor-pointer">
                <input type="checkbox" checked={tplEnrich} onChange={(e) => setTplEnrich(e.target.checked)} className="accent-orange-500" />
                <span className="text-xs text-zinc-300">OpenAI ile cilala (anahtar varsa)</span>
              </label>

              <button
                onClick={generateTemplate}
                disabled={tplLoading}
                className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 rounded text-white font-medium text-sm transition-colors"
              >
                {tplLoading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                {tplLoading ? "Üretiyor..." : "Taslak Üret"}
              </button>
            </div>

            {tplResult && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Başlık</p>
                  <h3 className="text-white font-semibold">{tplResult.title}</h3>
                  <p className="text-zinc-400 text-xs mt-1">{tplResult.excerpt}</p>
                </div>

                {tplResult.suggestedProducts.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                      Önerilen Ürünler ({tplResult.suggestedProducts.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tplResult.suggestedProducts.map((p) => (
                        <span key={p.id} className="text-[11px] bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-300">
                          {p.brand} {p.model}{p.priceRange ? ` · ${p.priceRange}` : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {tplResult.internalLinks.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Dahili Linkler</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tplResult.internalLinks.map((l) => (
                        <span key={l.href} className="text-[11px] bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-orange-300">
                          {l.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">İçerik Önizleme</p>
                  <pre className="bg-zinc-950 border border-zinc-700 rounded p-4 text-zinc-300 text-xs leading-relaxed whitespace-pre-wrap max-h-[320px] overflow-auto font-mono">{tplResult.content}</pre>
                </div>

                <button
                  onClick={useTemplate}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 rounded text-white font-medium text-sm transition-colors"
                >
                  <Check className="size-4" /> Editöre Yükle
                </button>
              </div>
            )}
          </div>
        )}

        {/* NEW / EDIT TAB */}
        {tab === "yeni" && (
          <div className="space-y-5">
            {editId && (
              <div className="flex items-center justify-between">
                <p className="text-orange-400 text-sm font-medium">Düzenleme modu</p>
                <button onClick={cancelEdit} className="text-zinc-500 hover:text-zinc-300 text-sm underline">İptal</button>
              </div>
            )}

            {/* Başlık + Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Başlık *</label>
                <input
                  value={form.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="Matkap Nasıl Seçilir?"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Slug (URL)</label>
                <input
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="matkap-nasil-secilir"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors font-mono"
                />
              </div>
            </div>

            {/* Kategori + ReadTime + Published */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Kategori</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Okuma Süresi</label>
                <input
                  value={form.readTime}
                  onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))}
                  placeholder="5 dk"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${form.published ? "bg-emerald-600" : "bg-zinc-700"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.published ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-sm text-zinc-300">{form.published ? "Yayında" : "Taslak"}</span>
                </label>
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                <ImageIcon className="inline size-3.5 mr-1" /> Kapak Görseli URL
              </label>
              <input
                value={form.coverImage}
                onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
                placeholder="https://..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
              />
              {form.coverImage && (
                <img src={form.coverImage} alt="preview" className="mt-2 h-24 rounded object-cover border border-zinc-700" />
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Özet (liste sayfasında görünür)</label>
              <textarea
                value={form.excerpt}
                onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                rows={2}
                placeholder="Kısa açıklama..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-zinc-400">İçerik (Markdown)</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreview(!preview)}
                    className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    {preview ? "Düzenle" : "Önizle"}
                  </button>
                  <button
                    onClick={generateContent}
                    disabled={generating}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 rounded text-white text-xs font-medium transition-colors"
                  >
                    {generating ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                    {generating ? "Üretiyor..." : "OpenAI ile Yaz"}
                  </button>
                </div>
              </div>
              {preview ? (
                <div className="bg-zinc-900 border border-zinc-700 rounded p-4 min-h-[300px] text-zinc-200 text-sm prose prose-invert max-w-none whitespace-pre-wrap font-mono text-xs leading-relaxed overflow-auto">
                  {form.content || <span className="text-zinc-600">İçerik yok</span>}
                </div>
              ) : (
                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={18}
                  placeholder="## Giriş&#10;&#10;İçerik buraya..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 resize-y font-mono text-xs leading-relaxed"
                />
              )}
            </div>

            {/* Save */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 rounded text-white font-medium transition-colors"
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                {saving ? "Kaydediyor..." : editId ? "Güncelle" : "Kaydet"}
              </button>
              {editId && (
                <button onClick={cancelEdit} className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 transition-colors">
                  İptal
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
