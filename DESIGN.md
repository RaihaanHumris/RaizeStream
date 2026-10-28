# DESIGN.md — Raize Stream

## 1. Overview

**Raize Stream** adalah website streaming anime bertema gelap, sinematik, dan energik untuk audiens muda. Desain harus terasa seperti platform streaming premium: konten (poster & artwork) menjadi bintang utama, antarmuka tetap bersih dan tidak ramai.

- **Nama produk:** Raize Stream
- **Platform:** Web (desktop-first, responsif ke mobile)
- **Mode:** Dark mode (default dan utama)
- **Kepribadian:** Sleek, cinematic, energetic, modern
- **Pembuat:** Muhammad Raihaan Humris

---

## 2. Brand

- **Logo:** Ikon huruf "R" bergaya (bentuk tajam dengan gradasi ungu → pink) + wordmark "Raize Stream"
- **Tagline:** "Watch Anime. Rise Higher."
- **Nada bahasa:** Singkat, santai, antusias

---

## 3. Colors

| Peran | Nama | Hex |
|---|---|---|
| Background utama | Midnight | `#0B0B14` |
| Surface / kartu | Deep Navy | `#14142A` |
| Surface terangkat | Slate Night | `#1C1C38` |
| Border halus | Outline | `#2A2A4A` |
| Primary accent | Electric Purple | `#8B5CF6` |
| Secondary accent | Neon Pink | `#FF3D6E` |
| Teks utama | White | `#FFFFFF` |
| Teks sekunder | Soft Gray | `#A1A1B5` |
| Teks nonaktif | Muted | `#6B6B80` |
| Sukses | Green | `#22C55E` |
| Peringatan / rating | Amber | `#FBBF24` |
| Error | Red | `#EF4444` |

**Gradien brand:** `linear-gradient(135deg, #8B5CF6 0%, #FF3D6E 100%)`
**Overlay hero:** `linear-gradient(to top, #0B0B14 0%, transparent 70%)`

**Aturan pemakaian**
- Ungu untuk aksi utama (tombol, link aktif, progress).
- Pink untuk highlight (badge, notifikasi, "NEW", hover aksen).
- Gradien hanya untuk logo, tombol CTA utama, dan elemen hero.

---

## 4. Typography

| Elemen | Font | Ukuran | Berat |
|---|---|---|---|
| Display / Hero title | Outfit | 56px | 800 |
| H1 | Outfit | 40px | 700 |
| H2 (judul section) | Outfit | 28px | 700 |
| H3 (judul kartu) | Poppins | 18px | 600 |
| Body | Inter | 16px | 400 |
| Body kecil | Inter | 14px | 400 |
| Caption / badge | Inter | 12px | 500 |
| Tombol | Poppins | 15px | 600 |

- Line height body: 1.6; heading: 1.2
- Hindari teks panjang berwarna abu pada gambar tanpa overlay.

---

## 5. Spacing & Layout

- **Skala spasi (base 4px):** 4, 8, 12, 16, 24, 32, 48, 64, 96
- **Container max-width:** 1440px, padding samping 48px (desktop), 16px (mobile)
- **Grid:** 12 kolom, gutter 24px
- **Grid kartu anime:** 6 kolom (desktop), 4 (tablet), 2 (mobile)
- **Jarak antar section:** 48px (desktop), 32px (mobile)

**Breakpoint**
- Mobile: < 640px
- Tablet: 640–1024px
- Desktop: > 1024px

---

## 6. Shape, Elevation & Effects

- **Radius:** 8px (badge/input kecil), 12px (kartu, tombol), 16px (modal, panel), 999px (pill/tag)
- **Shadow kartu:** `0 8px 24px rgba(0,0,0,0.4)`
- **Glow ungu (hover/fokus):** `0 0 24px rgba(139,92,246,0.45)`
- **Glassmorphism:** background `rgba(20,20,42,0.6)`, `backdrop-filter: blur(16px)`, border `1px solid rgba(255,255,255,0.08)`
- **Transisi:** 200–300ms ease-out

---

## 7. Components

### Navbar
- Sticky, tinggi 72px, glassmorphism
- Kiri: logo. Tengah: menu (Home, Browse, Genres, Schedule, Trending). Kanan: search bar, toggle bahasa, tombol Login / avatar profil
- Menu aktif: teks putih + garis bawah ungu 2px
- Mobile: logo + search + hamburger, ditambah **bottom navigation bar** (Home, Browse, Schedule, Library, Profile)

### Buttons
- **Primary:** gradien brand, teks putih, radius 12px, tinggi 48px, hover: glow + naik 2px
- **Secondary:** transparan, border ungu 1px, teks putih, hover: isi ungu 15%
- **Ghost:** tanpa border, teks abu, hover: teks putih
- **Icon button:** bulat 40px, background glass

### Anime Card
- Poster rasio 2:3, radius 12px
- Badge rating (kiri atas, amber), badge jumlah episode (kanan bawah)
- Hover: poster zoom 1.05, overlay gelap, tombol play bulat di tengah, glow ungu
- Di bawah poster: judul (1–2 baris) dan genre singkat

### Hero Banner
- Tinggi ±70vh, artwork full-width dengan overlay gradien ke bawah
- Konten kiri: label "Featured", judul besar, genre tag, rating, sinopsis (maks 3 baris), tombol **Watch Now** (primary) dan **Add to List** (secondary)
- Indikator slide di bawah

### Section Carousel
- Judul section + link "See All"
- Scroll horizontal dengan tombol panah di sisi (desktop), swipe (mobile)
- Varian "Continue Watching": kartu landscape 16:9 dengan progress bar ungu di bawah

### Genre Tag / Pill
- Radius 999px, background `#1C1C38`, teks 12px, hover: border ungu

### Search Bar
- Pill, background glass, ikon kaca pembesar, placeholder "Search anime..."
- Fokus: border ungu + glow

### Episode Item
- Thumbnail 16:9, nomor episode, judul, durasi, status (ditonton / belum)
- Episode aktif: border kiri ungu + background `#1C1C38`

### Video Player
- Rasio 16:9, radius 16px
- Kontrol: play/pause, progress bar ungu, volume, kualitas, subtitle, kecepatan, fullscreen
- Tombol Previous / Next Episode di bawah player

### Comment Section
- Avatar, nama, waktu, teks, tombol like & reply
- Input komentar dengan avatar pengguna

---

## 8. Pages

### Home
1. Navbar
2. Hero banner
3. Continue Watching
4. Trending Now
5. New Episodes
6. Popular This Season
7. Top Rated
8. Footer

### Anime Detail
- Banner besar + poster, judul, rating, status, studio, tahun rilis, genre
- Tombol Watch Now, Trailer, Bookmark
- Sinopsis (expand/collapse)
- Daftar episode
- Section "Recommended for You"

### Video Player
- Player besar (kiri, ±70% lebar), sidebar daftar episode (kanan)
- Judul episode, navigasi episode, komentar di bawah
- Mobile: player di atas, daftar episode dan komentar di bawah

### Browse / Search
- Sidebar filter: Genre, Year, Season, Status, Type
- Grid kartu anime + dropdown sort (Popular, Latest, A–Z)
- Pagination atau infinite scroll

---

## 9. Footer (semua halaman)

- Background `#07070F`, border atas `1px solid #2A2A4A`
- Kolom 1: logo Raize Stream + tagline singkat
- Kolom 2: Quick Links — About, Contact, Terms of Service, Privacy Policy, DMCA
- Kolom 3: Browse — Genres, Schedule, Trending
- Kolom 4: Social media (Instagram, X/Twitter, Discord, YouTube) dalam ikon bulat
- Baris bawah (tengah): **© 2026 Raize Stream. Created by Muhammad Raihaan Humris**
- Mobile: kolom menumpuk, copyright tetap di tengah

---

## 10. Motion

- Hover kartu: scale 1.05, 250ms
- Pergantian hero: fade 500ms
- Muat halaman: skeleton shimmer pada kartu dan banner
- Hormati `prefers-reduced-motion`

---

## 11. Accessibility

- Kontras teks minimal 4.5:1
- Fokus keyboard terlihat (outline ungu 2px)
- Semua gambar poster memiliki alt text
- Target sentuh minimal 44×44px di mobile

---

## 12. Do & Don't

**Do**
- Biarkan artwork anime menjadi fokus visual
- Pakai ruang kosong yang cukup
- Konsisten dengan radius dan palet warna

**Don't**
- Jangan memakai latar putih atau terang
- Jangan memakai lebih dari dua warna aksen
- Jangan menumpuk terlalu banyak efek glow dalam satu layar
