# Hırdavat Pro — proje durumu

## Şu an (MVP)

| Öğe | Durum |
|-----|--------|
| Next.js + Tailwind v4 iskelet | Tamam |
| Industrial-Premium tema (`globals.css`, layout fontlar) | Tamam |
| shadcn-pattern UI (Button, Card, Label, RadioGroup) | Tamam |
| Matkap ucu öneri mantığı (`lib/matkap-ucu/recommend.ts`) | Tamam v0 |
| Arayüz bileşeni `MatkapUcuTool` | Tamam |
| `context.md` | Tamam |
| `project.md` | Bu dosya — güncel |

## Sonraki adımlar (öneri)

- [ ] Gerçek ürün linkleri / SKU yer tutucu (ticari entegrasyon yok, sadece metin).
- [ ] `opengraph` + `metadata` site adı hirdavatpro.com.
- [ ] Darbe matkap / SDS alt akışı ve çap girişi (sayısal).
- [ ] Unit test: `recommend.ts` için birkaç senaryo.
- [ ] `robots.txt` / basit `sitemap` (deploy sonrası).

## Çalıştırma

```bash
cd hirdavatpro && npm run dev
```

---

*Güncelleme: bu dosyayı her oturum sonunda veya milestone’da güncelle.*
