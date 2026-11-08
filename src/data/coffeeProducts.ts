import { CoffeeProduct, Order } from '../types';

export const COFFEE_PRODUCTS: CoffeeProduct[] = [
  {
    id: 'ptw-aceh-gayo-1',
    name: 'Aceh Gayo Pantan Musara',
    subtitle: 'Beans 1',
    region: 'ACEH TENGAH',
    altitude: '1.500 MDPL',
    roastLevel: 'Light-Med',
    process: 'Anaerobic',
    flavorNotes: ['Dark Berry', 'Winey', 'Caramel'],
    scores: {
      acidity: 'Medium',
      body: 'Bold',
      sweetness: 'Tinggi',
      cuppingScore: 86.5,
    },
    roastDate: 'Sangrai: 2 Hari Lalu',
    basePrice: 95000,
    image: '/assets/da276.png',
    stock: 24,
    rating: 4.9,
    tag: 'Fresh Roast',
    description: 'Biji kopi arabika single origin dari ketinggian 1.500 MDPL Pantan Musara, Aceh Tengah. Diproses secara Anaerobic fermentation menghasilkan keasaman winey yang kompleks dan aftertaste karamel yang tebal.',
  },
  {
    id: 'ptw-toraja-sapan-2',
    name: 'Toraja Sapan Washed',
    subtitle: 'Beans 2',
    region: 'SULAWESI SELATAN',
    altitude: '1.800 MDPL',
    roastLevel: 'Medium',
    process: 'Washed',
    flavorNotes: ['Herbal', 'Brown Sugar', 'Citrus'],
    scores: {
      acidity: 'Sedang',
      body: 'Medium-Full',
      sweetness: 'Tinggi',
      cuppingScore: 85.0,
    },
    roastDate: 'Sangrai: 3 Hari Lalu',
    basePrice: 88000,
    image: '/assets/af684.png',
    stock: 14,
    rating: 4.8,
    tag: 'Stok 14',
    description: 'Tumbuh di pegunungan tinggi Tana Toraja pada ketinggian 1.800 MDPL. Proses Washed klasik menonjolkan aroma herbal segar, sentuhan citrus buah tropis, dan rasa manis gula aren alami.',
  },
  {
    id: 'ptw-bali-kintamani-3',
    name: 'Bali Kintamani Anaerobic Honey',
    subtitle: 'Beans 3',
    region: 'BANGLI, BALI',
    altitude: '1.400 MDPL',
    roastLevel: 'Light',
    process: 'Anaerobic Honey',
    flavorNotes: ['Marmalade', 'Floral', 'Honey'],
    scores: {
      acidity: 'Cerah',
      body: 'Medium',
      sweetness: 'Sangat Tinggi',
      cuppingScore: 87.0,
    },
    roastDate: 'Sangrai: Kemarin',
    basePrice: 110000,
    image: '/assets/178db.png',
    stock: 18,
    rating: 5.0,
    tag: 'Pilihan Barista',
    description: 'Dipanen dari dataran tinggi lereng Gunung Batur, Kintamani. Proses Anaerobic Honey memberikan notes marmalade jeruk yang cerah berpadu dengan keharuman bunga melati dan manis madu hutan.',
  },
  {
    id: 'ptw-house-blend-4',
    name: 'Patawi Signature House Blend 70:30',
    subtitle: 'Beans 4',
    region: 'BLEND 70:30',
    altitude: '1.200 - 1.500 MDPL',
    roastLevel: 'Medium-Dark',
    process: 'House Blend',
    flavorNotes: ['Dark Choco', 'Almond', 'Nutty'],
    scores: {
      acidity: 'Rendah',
      body: 'Heavy / Bold',
      sweetness: 'Sedang',
      cuppingScore: 84.5,
    },
    roastDate: 'Sangrai: Fresh Batch',
    basePrice: 75000,
    image: '/assets/52eb7.png',
    stock: 35,
    rating: 4.7,
    tag: 'House Blend',
    description: 'Kombinasi 70% Arabika Gayo & Toraja dengan 30% Robusta Dampit premium. Dirancang khusus untuk penikmat espresso dan susu dengan body mantap dan aftertaste cokelat hitam pekat.',
  },
  {
    id: 'ptw-flores-bajawa-5',
    name: 'Flores Bajawa Ngada',
    subtitle: 'Beans 5',
    region: 'FLORES, NTT',
    altitude: '1.600 MDPL',
    roastLevel: 'Medium',
    process: 'Washed',
    flavorNotes: ['Caramel', 'Chocolate', 'Sweet Citrus'],
    scores: {
      acidity: 'Medium-Low',
      body: 'Smooth',
      sweetness: 'Tinggi',
      cuppingScore: 85.5,
    },
    roastDate: 'Sangrai: 3 Hari Lalu',
    basePrice: 92000,
    image: '/assets/4cfdc.png',
    stock: 20,
    rating: 4.8,
    tag: 'Fresh Roast',
    description: 'Biji kopi dari dataran tinggi Ngada, Flores. Memiliki karakter rasa cokelat karamel yang legit dengan tingkat keasaman lembut yang sangat nyaman dinikmati setiap hari.',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-ptw-88291',
    orderNumber: 'PTW-88291',
    type: 'delivery',
    date: 'Hari ini • 10:15 WIB',
    status: 'on_the_way',
    currentStepIndex: 3,
    items: [
      {
        id: 'item-init-1',
        productId: 'ptw-aceh-gayo-1',
        product: COFFEE_PRODUCTS[0],
        weight: '200g',
        grind: 'medium',
        grindLabel: 'Giling Sedang (V60)',
        price: 95000,
        quantity: 1,
        notes: 'Gilingan medium filter V60 standard'
      },
      {
        id: 'item-init-2',
        productId: 'ptw-toraja-sapan-2',
        product: COFFEE_PRODUCTS[1],
        weight: '200g',
        grind: 'whole',
        grindLabel: 'Biji Utuh (Beans)',
        price: 88000,
        quantity: 1,
        notes: 'Tidak digiling, siap simpan'
      }
    ],
    subtotal: 183000,
    discount: 0,
    shippingFee: 15000,
    total: 198000,
    steps: [
      {
        id: 1,
        title: 'Pesanan Diterima & Terbayar',
        subtitle: 'Pembayaran QRIS BCA terverifikasi otomatis.',
        time: '10:15 WIB',
        status: 'completed'
      },
      {
        id: 2,
        title: 'Dikonfirmasi Roastery Senopati',
        subtitle: 'Batch pesanan masuk ke roaster station.',
        time: '10:20 WIB',
        status: 'completed'
      },
      {
        id: 3,
        title: 'Roasting, Grinding & Packing',
        subtitle: 'Biji Aceh Gayo digiling medium-coarse, degassing pouch sealed.',
        time: '10:35 WIB',
        status: 'completed'
      },
      {
        id: 4,
        title: 'Kurir Menuju Outlet',
        subtitle: 'Mitra Rian Hidayat berjarak 400m dari Roastery Senopati untuk penjemputan paket.',
        time: '10:45 WIB',
        status: 'current'
      },
      {
        id: 5,
        title: 'Pesanan Diambil Kurir',
        subtitle: 'Dalam perjalanan langsung ke alamat pengiriman.',
        time: 'Estimasi 11:00 WIB',
        status: 'pending'
      },
      {
        id: 6,
        title: 'Pesanan Selesai Diterima',
        subtitle: 'Penerima menandatangani bukti serah terima digital.',
        time: 'Estimasi 11:15 WIB',
        status: 'pending'
      }
    ],
    courier: {
      name: 'Rian Hidayat',
      vehicle: 'Honda Vario Hitam',
      plateNumber: 'B 4521 SRX',
      avatar: '/assets/9e21e.png',
      etaMinutes: 25,
      etaTime: '11:15 WIB',
      distance: '3.8 km'
    }
  },
  {
    id: 'ord-ptw-88240',
    orderNumber: 'PTW-88240',
    type: 'pickup',
    date: 'Hari ini • 09:30 WIB',
    status: 'ready_pickup',
    currentStepIndex: 1,
    items: [
      {
        id: 'item-init-3',
        productId: 'ptw-bali-kintamani-3',
        product: COFFEE_PRODUCTS[2],
        weight: '200g',
        grind: 'fine',
        grindLabel: 'Giling Halus (Espresso)',
        price: 110000,
        quantity: 1,
        notes: 'Pouch zipper kedap udara'
      }
    ],
    subtotal: 110000,
    discount: 10000,
    shippingFee: 0,
    total: 100000,
    steps: [
      {
        id: 1,
        title: 'Pesanan Masuk & Roasting',
        subtitle: 'Biji kopi telah disangrai dan dikemas.',
        time: '09:30 WIB',
        status: 'completed'
      },
      {
        id: 2,
        title: 'Siap Di Counter Barista',
        subtitle: 'Paket siap diambil di pickup station.',
        time: '09:45 WIB',
        status: 'completed'
      },
      {
        id: 3,
        title: 'Selesai Ambil',
        subtitle: 'Konfirmasi PIN barista.',
        time: 'Menunggu Pengambilan',
        status: 'current'
      }
    ],
    pickupPin: '7 4 9 2',
    pickupLocation: {
      name: 'Roastery Senopati Flagship',
      address: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan',
      hours: 'Buka sampai 22:00 WIB'
    }
  }
];

export const ORDER_HISTORY = [
  {
    id: 'ord-ptw-87902',
    orderNumber: 'PTW-87902',
    date: '12 Okt 2024 • 14:22 WIB',
    title: 'Bali Kintamani Honey & Espresso Blend',
    detail: '2 Produk (250g Biji Utuh + 200g Espresso)',
    total: 185000,
    status: 'Pesanan Selesai',
    image: '/assets/612d3.png'
  }
];
