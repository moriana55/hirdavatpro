# Hırdavat Pro — bağlam

**Domain:** hirdavatpro.com  
**Vibe:** Industrial-Premium — koyu zemin, keskin grid, bol whitespace, güven veren tipografi (grotesk + teknik mono vurgular).  
**Stack:** Next.js App Router, Tailwind v4, shadcn-pattern bileşenler (Radix primitives), Lucide.

## Bu fazda ürün

**Matkap Ucu Seçim Aracı (MVP)**  
Kullanıcı malzeme + kullanım senaryosunu seçer; araç sanayi mantığıyla önerilen uç ailesi, kısa gerekçe ve dikkat notları üretir.

## Tasarım sığması

- Ana renk: soğuk çinko / grafit zemin, vurgu olarak turuncu-amber (endüstri) veya cyan (keskinlik) — şu an amber + çinko.
- Kartlar: ince border, düşük blur yok veya çok hafif; gölge minimal.
- Metin hiyerarşisi: tek güçlü H1, bölüm başlıkları uppercase tracking.

## Dosya odağı

- `src/app/page.tsx` — giriş / araç
- `src/components/matkap-ucu/*` — UI
- `src/lib/matkap-ucu/recommend.ts` — saf öneri mantığı
- `src/components/ui/*` — Button, Card, Label, RadioGroup
- `project.md` — ilerleme kaydı
