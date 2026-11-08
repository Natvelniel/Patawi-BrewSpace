# Patawi-BrewSpace ☕

> Aplikasi Web Pemesanan Kopi Artisanal & Specialty Roastery — Dibuat berdasarkan Sistem Desain Figma Patawi Coffee secara interaktif dan fungsional.

---

## 🌟 Fitur Utama

- **Desain Otentik & Responsive (Mobile-First):**
  - Mengadaptasi sistem desain dari Figma (`4w9MNCQRO1UHqnjsssakY4`).
  - Google Fonts: `Playfair Display` (Serif untuk Judul/Brand) & `Plus Jakarta Sans` (UI Sans-serif).
  - Skema warna artisan earth-tone: `#2B1810`, `#FBF9F5`, `#E08A44`, `#F5F3EF`.
  - Dilengkapi frame mockup smartphone untuk tampilan desktop + toggle mode fullscreen.

- **Eksplorasi Katalog & Beranda:**
  - Pencarian real-time biji kopi berdasarkan nama, varietas, dan flavor notes.
  - Banner promo interaktif dengan tombol klaim voucher.
  - Filter metode seduh (*Single Origin, Espresso, Filter Roast, Cold Brew*).
  - Filter profil sangrai (*Semua, Light, Medium, Medium-Dark*).
  - Panduan ukuran gilingan (*Grind Size Guide*).

- **Kustomisasi Varian Produk (Bottom Sheet Modal):**
  - Indikator profil rasa visual (Cupping Score, Keasaman, Ketebalan, Manis).
  - Pilihan berat kemasan: `200g` (Favorit), `500g` (Hemat 8%), `1kg` (Hemat 20%) dengan kalkulasi harga otomatis.
  - Pilihan profil gilingan: *Whole Bean, Giling Kasar (Cold Brew), Giling Sedang (V60), Giling Halus (Espresso)*.
  - Input catatan seduhan khusus untuk barista/roaster.

- **Keranjang Belanja & Alur Checkout 3 Tahap:**
  - Stepper interaktif: *1. Keranjang → 2. Pengiriman → 3. Bayar*.
  - Kupon diskon promo (contoh: `PATAWIFRESH` & `BEANS20`).
  - Pilihan pengiriman: *GoSend Instant* atau *Pick Up di Outlet Senopati*.
  - Simulator pembayaran dinamis **QRIS BCA** dengan countdown timer dan verifikasi otomatis.

- **Pelacakan Pesanan Real-Time (Live Tracking):**
  - **GoSend Instant:** Tampilan peta GPS live Jakarta, estimasi tiba (ETA), profil kurir, fitur telepon, dan **live chat langsung dengan driver**.
  - **Linimasa 6 Tahap Pengiriman:** *Pesanan Diterima → Konfirmasi Roastery → Roasting & Packing → Kurir Menuju Outlet → Diambil Kurir → Selesai*.
  - **Pick Up di Outlet:** Menampilkan **PIN 4 Digit Barista** besar (`7 4 9 2`) serta navigasi rute ke outlet Senopati.
  - **Riwayat Pesanan:** Fitur *Pesan Lagi* (reorder) dan unduh invoice.

- **Multi-Role Header Switcher:**
  - **Customer:** Pengalaman belanja pembeli.
  - **Admin Patawi:** Manajemen antrean roasting station dan monitor suhu mesin sangrai.
  - **Delivery Order:** Tampilan kurir GoSend untuk rute pengantaran paket kopi.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Fonts:** Playfair Display, Plus Jakarta Sans

---

## 🚀 Menjalankan Secara Lokal

1. **Clone repository:**
   ```bash
   git clone https://github.com/Natvelniel/Patawi-BrewSpace.git
   cd Patawi-BrewSpace
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   Buka browser Anda di `http://localhost:5173`.

4. **Build untuk produksi:**
   ```bash
   npm run build
   ```
