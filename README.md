# Patawi-BrewSpace ☕

> **Patawi Coffee** — Aplikasi Web Pemesanan Kopi Artisanal & Specialty Roastery. Dibuat berdasarkan Sistem Desain Figma Patawi Coffee secara interaktif, responsif, dan fungsional penuh. Berstandar **Production Ready** dengan kedalaman visual (*visual depth*), ritme spasi 8pt, autentikasi multi-peran, dan filter interaktif multi-kriteria.

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📸 Preview Tampilan Aplikasi (Fixed & Production-Ready)

| Beranda (Region Utuh & Zero Ellipsis) | Kustomisasi & Profil Cupping | Pilihan Gilingan Lengkap |
| :---: | :---: | :---: |
| <img src="docs/screenshots/home_cards_perfect.png" width="260" alt="Beranda Mobile Patawi Coffee dengan Kategori & Kartu Produk Aligned" /> | <img src="docs/screenshots/product_modal.png" width="260" alt="Modal Profil Cupping Sejajar & Altitude MDPL" /> | <img src="docs/screenshots/grind_guide_verified.png" width="260" alt="Panduan Profil Gilingan Sangat Dianjurkan Rapi" /> |

| Konfirmasi Pesanan & Notif Email | Faktur Pembelian Digital Resmi | Dashboard Kurir & Handover Gate |
| :---: | :---: | :---: |
| <img src="docs/screenshots/order_confirmed_modal.png" width="260" alt="Layar Sukses Pesanan dengan Notifikasi Email Terkirim" /> | <img src="docs/screenshots/invoice_modal.png" width="260" alt="Faktur Resmi Digital dengan NPWP dan QR Validasi" /> | <img src="docs/screenshots/kurir_handed_over_order.png" width="260" alt="Dashboard Kurir dengan Tugas Serah Terima Siap Antar" /> |

| Admin Inventaris & Edit Stok | Admin Laporan Finansial & Omzet | Admin Manajemen Kupon Promo |
| :---: | :---: | :---: |
| <img src="docs/screenshots/admin_inventory.png" width="260" alt="Manajemen Stok dan Harga Biji Kopi Real-Time" /> | <img src="docs/screenshots/admin_reports.png" width="260" alt="Laporan Omzet Penjualan dan Tren Mingguan" /> | <img src="docs/screenshots/admin_vouchers.png" width="260" alt="Kelola Promo dan Tambah Voucher Diskon" /> |

---

## 🌟 Fitur Utama

- **Navigasi Kontekstual Berdasarkan Peran (Role-Based Bottom Nav):**
  - **Mode Customer**: 5 tab e-commerce lengkap (*Beranda, Katalog, Keranjang, Pesanan, Profil*).
  - **Mode Kurir (Delivery Order)**: 4 tab operasional kurir (*Tugas Antar [badge aktif], Riwayat Selesai, Performa & Saldo, Profil Kurir*).
  - **Mode Admin Roastery**: 4 tab operasional sangrai (*Antrean Pesanan [badge antrean], Stok Biji Kopi, Laporan Roastery, Profil Roaster*).
  - Mengeliminasi menu belanja yang tidak relevan saat sedang bertugas sebagai kurir atau admin.

- **Alur Pelanggan & Guest Checkout Suite (`CartView.tsx` & `OrderConfirmationModal.tsx`):**
  - **Guest Checkout (Checkout Tamu)**: Opsi pemesanan instan tanpa kewajiban login. Dilengkapi input nama lengkap, email invoice, dan no. WhatsApp.
  - **Pilihan Ekspedisi Nasional & Lokal**:
    - 🛵 *GoSend Instant Delivery (Jakarta)* — Rp 15.000 (25-40 Menit, Live GPS Tracking)
    - 📦 *JNE Regular / SiCepat Standard* — Rp 22.000 (2-3 Hari ke seluruh Indonesia)
    - ⚡ *JNE YES (Next Day Delivery)* — Rp 35.000 (1 Hari Tiba)
    - 🏪 *Pick Up Sendiri di Outlet Senopati* — GRATIS
  - **Layar Konfirmasi Sukses Pesanan**: Alert notifikasi otomatis pengiriman faktur ke email pemesan, ringkasan penerima & metode pengiriman, tombol pelacakan live, dan tombol faktur digital.
  - **Faktur Pembelian Digital Resmi (`InvoiceModal.tsx`)**: Lengkap dengan identitas Patawi Coffee Senopati, NPWP roastery, nomor faktur `#PTW-XXXXX`, rincian item, PPN 11% inklusif, QR code sah validasi roastery, tanda tangan Head Roaster Budi Santoso, tombol unduh PDF, dan tombol kirim ulang ke email.
  - **Garansi Keranjang Batal/Keluar**: Keranjang belanja pelanggan tetap tersimpan aman saat modal bayar QRIS ditutup.

- **Admin / Owner Roastery Suite (`AdminDashboardView.tsx`, `ProductManagementModal.tsx`, `VoucherManagementModal.tsx`):**
  - **Katalog CRUD & Pengaturan Harga**: Tambah varian biji kopi baru (asal daerah, MDPL, proses, rasa, cupping score, harga dasar) dan hapus produk yang discontinued.
  - **Manajemen Stok Real-Time**: Update stok fisik biji kopi (kg) dengan restock cepat `+5 kg` dan indikator status stok (*Aman* vs *Menipis*).
  - **Manajemen Kode Promo (Voucher Manager)**: Tambah kupon promo baru (persen / nominal), atur minimal belanja, serta toggle status aktif/nonaktif kupon seketika.
  - **Laporan Penjualan Finansial (Revenue Reports)**: Perhitungan omzet Rp real-time, total transaksi berhasil, AOV (*Average Order Value*), serta grafik tren penjualan mingguan (Senin–Minggu) berbasis visual SVG bebas dependensi pihak ketiga.
  - **Gerbang Serah Terima Kurir (Dispatch Handover Gate)**: Tombol pengesahan pesanan *"Serahkan ke Kurir DO (Siap Diantar)"* yang secara otomatis menyinkronkan antrean tugas kurir pengantar.

- **Dashboard Pengantaran Mitra Kurir (`DeliveryDashboardView.tsx`):**
  - **Penapisan Handover Gate Terpadu**: Kurir hanya menerima tugas yang sudah disahkan/diserahkan oleh Admin Roastery (`readyForDelivery` atau tahap 2+), dengan kotak status informasi pesanan yang masih dalam sangrai outlet.
  - **Data Pemesan & Kontak Real-Time**: Nama pemesan (Member / Tamu), telepon, dan tombol direct chat WhatsApp dinamis per pesanan.
  - **Connected Stepper Route**: Rute visual menghubungkan Pick-up Roastery Senopati Flagship ke Drop-off alamat pelanggan.
  - **Simulasi Progres Pengantaran**: Majukan status kurir dari pengambilan paket hingga *"Pesanan Selesai Diterima"*.
  - **Riwayat Pengantaran & Saldo**: Tab riwayat selesai dan tab dompet performa kurir lengkap dengan komisi pengantaran.

- **Privasi Pengguna & Penyamaran Email (`ProfileView.tsx` & `AuthModal.tsx`):**
  - Nama akun tetap ditampilkan lengkap sebagai **Nathaniel Christian** (VIP Gold Member).
  - Email disamarkan dengan fungsi masking privat: `nat••••••09@gmail.com` untuk standar keamanan data.

- **Panduan Profil Gilingan Premium (`GrindGuideModal.tsx`):**
  - Judul `Biji Utuh (Whole Bean)` tampil utuh tanpa terbelah kata `Bean)` ke baris baru.
  - Lencana `Sangat Dianjurkan` diberi lencana aksen emas dengan ikon sparkles dan border premium.
  - Kartu rekomendasi utama dibalut border tebal 2px oranye roastery (`border-2 border-[#C86826] bg-[#FAF5EF]`).
  - **Segmented Role Switcher**: Kontrol navigasi 3 tab simetris (`Customer` | `Admin` | `Kurir`) dengan kontainer rounded-2xl dan elevasi tegas tanpa overflow pada layar terkecil sekalipun.
  - **Profil Rasa Cupping Sejajar (3 Stat Cards)**: Menghapus tabrakan teks dan efek tangga zig-zag menjadi 3 micro-card vertikal presisi (Keasaman, Ketebalan, Manis) dengan progress bar lurus sejajar di dasar card.
  - **Ketinggian MDPL & Badge Utuh**: Format `whitespace-nowrap` memastikan ketinggian `1.800 MDPL` tidak pernah pecah sendirian ke baris kedua.
  - **Pilihan Profil Gilingan Utuh**: Judul dan lencana rekomendasi dipisahkan secara fleksibel; deskripsi alat seduh (*V60 Pour Over, Aeropress, Espresso Mesin, Moka Pot*) tampil 100% lengkap tanpa elipsis (`truncate`).
  - **Kartu Driver & Rute Peta Rapi**: Nomor plat `B 4521 SRX` disematkan dalam micro-pill putih bersih dan nama motor `Honda Vario Hitam` tampil utuh tanpa pemotongan kata.
  - **Catatan Keranjang Multi-Line**: Catatan gilingan khusus pesanan di keranjang belanja tampil lengkap dan rapi tanpa terpotong.
  - **Zero Badge Collisions**: Badge status di kiri atas dan tombol favorit di kanan atas gambar; rating bintang diposisikan rapi di baris metadata.
  - **Zero Drowning Navigation**: Dilengkapi `viewport-fit=cover`, padding aman `env(safe-area-inset-bottom)`, dan layout fleksibel penuh.

- **Fungsi Autentikasi & Manajemen Akun (Login System):**
  - **Modal Autentikasi Cerdas (`AuthModal.tsx`)**: Form login dan registrasi dengan validasi email/kata sandi dan toggle visibilitas kata sandi.
  - **1-Click Quick Demo Login**: Beralih akun seketika dalam 1 klik untuk pengujian:
    - 👤 **Nathaniel Christian**: Pelanggan VIP Gold Member (1.250 Poin)
    - ☕ **Budi Santoso**: Head Roaster Outlet Senopati (Admin)
    - 🛵 **Rian Hidayat**: Mitra Kurir GoSend Express (Delivery)
  - **Sinkronisasi Profil & Header**: Klik avatar di header atau menu profil langsung membuka manajemen akun, rincian poin, serta opsi keluar/logout fungsional.

- **Sistem Filter & Sortir Interaktif Multi-Kriteria:**
  - **Quick Filter Kategori**: Klik chip kategori metode seduh (misal: *Cold Brew*) langsung menyaring daftar produk secara instan dan menampilkan chip filter aktif yang dapat dihapus.
  - **Advanced Filter Drawer (`FilterModal.tsx`)**:
    - *Metode Seduh*: Semua, Single Origin, Espresso, Filter Roast, Cold Brew
    - *Profil Sangrai*: Semua, Light, Medium, Medium-Dark
    - *Proses Pascapanen*: Semua, Anaerobic, Washed, Honey, House Blend
    - *Rentang Harga*: Semua, < Rp 85.000, Rp 85.000 - Rp 100.000, > Rp 100.000
    - *Urutkan Berdasarkan*: Paling Sesuai, Rating Tertinggi, Harga Terendah, Harga Tertinggi, Cupping Score
  - **Live Result Counter**: Tombol *Tampilkan X Biji Kopi* dinamis dan tombol *Reset Semua Filter*.

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
  - **Bip Live GPS Presisi**: Indikator radar konsentris hijau yang berkedip tepat di tengah badge Live GPS.
  - **Pin Kurir Dinamis**: Ikon motor kurir GoSend berdenyut langsung di atas peta Jakarta.
  - **WhatsApp Roastery Hotline**: Layanan pelanggan resmi prototipe dengan nomor bersih `+62 812-0000-8888`, tombol salin cepat, dan status online real-time.
  - **PIN 4 Digit Barista**: Tampilan kode penjemputan outlet Senopati (`7 4 9 2`).

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Fonts:** Playfair Display, Plus Jakarta Sans

---

## 📁 Struktur Proyek

```
UI/
├── docs/
│   └── screenshots/          # Tangkapan layar tampilan aplikasi (Mobile & Desktop)
├── public/
│   └── assets/               # Aset vektor (SVG) dan gambar lokal dari Figma
├── src/
│   ├── components/
│   │   ├── admin/            # Tampilan Dashboard Roastery Admin
│   │   ├── auth/             # Modal Autentikasi Pengguna & Quick Demo Login
│   │   ├── cart/             # Keranjang & Modal Pembayaran QRIS
│   │   ├── catalog/          # Katalog Produk, Modal Varian, & Filter Drawer
│   │   ├── delivery/         # Dashboard Kurir Pengiriman
│   │   ├── home/             # Beranda, Chip Kategori, Banner Promo, & Panduan Gilingan
│   │   ├── layout/           # Header (Role Switcher & Avatar Auth) & Bottom Navigation
│   │   ├── profile/          # Profil Member, Poin Patawi, & Pengaturan Akun
│   │   └── tracking/         # Pelacakan GPS, Chat Driver, Hotline WhatsApp, & PIN Barista
│   ├── context/
│   │   └── StoreContext.tsx  # Global State Management (Auth, Filter, Cart, Orders, Roles)
│   ├── data/
│   │   └── coffeeProducts.ts # Mock Data Biji Kopi Specialty, Akun Demo, & Pesanan
│   ├── types/
│   │   └── index.ts          # Definisi TypeScript Interfaces & Enums
│   ├── App.tsx               # Root Component dengan Device Frame & Safe-Area Layout
│   ├── index.css             # Konfigurasi Tailwind CSS v4, Token Kedalaman, & Utilitas
│   └── main.tsx              # Entry Point React DOM
└── package.json
```

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

---

## 📄 Lisensi

Dibuat untuk keperluan demonstrasi dan pengembangan portofolio sistem desain digital.
