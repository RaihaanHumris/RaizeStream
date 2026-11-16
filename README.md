# Raize Stream — Watch Anime. Rise Higher.

Raize Stream adalah platform web streaming anime bertema dark, cinematic, dan energik. Dibangun dengan performa tinggi menggunakan Next.js 14 (App Router), Tailwind CSS, serta terintegrasi langsung dengan sumber metadata anime dan penyedia streaming subtitle Indonesia.

---

## 🌟 Fitur Utama

- **Sinematik & Responsif**: Tampilan dark mode modern (Midnight, Deep Navy, Electric Purple, dan Neon Pink) dengan responsivitas mobile & desktop.
- **Hero Spotlight & Carousel**: Carousel banner interaktif untuk anime trending, rilisan musim ini, anime dengan rating tertinggi, dan section *Continue Watching*.
- **Integrasi Streaming Sub Indo**:
  - Terkoneksi dengan REST API dari topik GitHub [animeindo-api](https://github.com/topics/animeindo-api) (seperti *kumanime-api* dan *AnimeIndo-RestAPI*).
  - Terintegrasi dengan [aniyoi-api](https://github.com/miukyo/aniyoi-api).
  - Multi-server player cadangan (Embed HD, MultiStream, dan Direct MP4) yang dapat dialihkan secara langsung di player.
- **Katalog & Filter Lengkap**: Halaman browse dengan filter genre, status (Airing/Completed), tipe (TV/Movie/OVA), pencarian judul realtime, serta sorting.
- **Player Video Kaya Fitur**: Kontrol video kustom, tombol navigasi episode sebelumnya/berikutnya, status episode ditonton, dan section diskusi/komentar.
- **Metadata Realtime**: Sinkronisasi data anime dari **AniList GraphQL** & **Jikan (MyAnimeList) API** dengan fallback dataset lokal.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Deployment**: Standalone Node.js / Vercel ready

---

## 🚀 Memulai Proyek

### 1. Prasyarat
- Node.js versi 18 atau 20+
- npm (atau pnpm / yarn)

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```

Isi konfigurasi (opsional jika menggunakan instance API sendiri):
```env
# URL API Streaming Anime Sub Indo (opsional, default: https://kumanime-api.vercel.app)
ANIMEINDO_API_URL=https://kumanime-api.vercel.app

# URL API Aniyoi (opsional, default: https://aniyoi-api.vercel.app)
ANIYOI_API_URL=https://aniyoi-api.vercel.app
```

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### 5. Build untuk Produksi
```bash
npm run build
npm start
```

### 6. Linting
```bash
npm run lint
```

---

## 📁 Struktur Direktori

```
├── app/
│   ├── anime/[slug]/        # Halaman detail & overview anime
│   │   └── watch/           # Halaman video streaming & player
│   ├── api/
│   │   ├── anime/           # API filter dan pencarian anime
│   │   └── stream/          # API resolver streaming video & multi-server
│   ├── browse/              # Halaman pencarian & katalog filter
│   ├── globals.css          # Styling global & utilitas gradient/glassmorphism
│   ├── layout.tsx           # Root layout & metadata SEO
│   └── page.tsx             # Halaman utama (Hero & Carousel)
├── components/              # Komponen UI (VideoPlayer, Navbar, Carousel, Footer, dll)
├── data/                    # Dataset lokal anime & genre
├── lib/
│   ├── animeindo.ts         # Klien REST API AnimeIndo
│   ├── aniyoi.ts            # Klien Aniyoi API
│   └── api.ts               # Klien GraphQL AniList & Jikan
└── types/                   # Definisi tipe TypeScript
```

---

## 👤 Pembuat

Dibuat oleh **Muhammad Raihaan Humris** ([@RaihaanHumris](https://github.com/RaihaanHumris)).
