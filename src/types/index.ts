export type Role = 'customer' | 'admin' | 'delivery';

export type ActiveTab = 'home' | 'catalog' | 'cart' | 'tracking' | 'profile';

export type RoastLevel = 'Semua' | 'Light' | 'Medium' | 'Medium-Dark';

export type ProcessType = 'Anaerobic' | 'Washed' | 'Anaerobic Honey' | 'House Blend' | 'Natural';

export type GrindProfile = 'whole' | 'coarse' | 'medium' | 'fine';

export type PackageWeight = '200g' | '500g' | '1kg';

export interface FlavorScores {
  acidity: string; // e.g., 'Medium', 'Rendah', 'Cerah'
  body: string;    // e.g., 'Bold', 'Medium', 'Syrupy'
  sweetness: string; // e.g., 'Tinggi', 'Sedang'
  cuppingScore?: number; // e.g., 86.5
}

export interface CoffeeProduct {
  id: string;
  name: string;
  subtitle?: string; // e.g. "Aceh Gayo Pantan Musara"
  region: string;   // e.g. "ACEH TENGAH" or "SUMATRA • 1.500 MDPL"
  altitude?: string; // e.g. "1.500 MDPL"
  roastLevel: 'Light' | 'Light-Med' | 'Medium' | 'Medium-Dark';
  process: ProcessType;
  flavorNotes: string[]; // e.g. ['Dark Berry', 'Winey', 'Caramel']
  scores: FlavorScores;
  roastDate: string; // e.g. "Sangrai: 2 Hari Lalu"
  basePrice: number; // Price for 200g
  image: string;
  stock: number;
  rating: number;
  tag?: string; // e.g. 'Fresh Roast', 'Pilihan Barista', 'Stok 14'
  description?: string;
}

export interface CartItem {
  id: string; // unique item uuid in cart
  productId: string;
  product: CoffeeProduct;
  weight: PackageWeight;
  grind: GrindProfile;
  grindLabel: string; // e.g. "Biji Utuh (Whole Bean)"
  price: number;
  quantity: number;
  notes?: string;
}

export interface OrderStep {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  status: 'completed' | 'current' | 'pending';
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. PTW-88291
  type: 'delivery' | 'pickup';
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: 'processing' | 'roasting' | 'on_the_way' | 'ready_pickup' | 'delivered';
  currentStepIndex: number;
  steps: OrderStep[];
  // GoSend Delivery fields
  courier?: {
    name: string;
    vehicle: string;
    plateNumber: string;
    avatar: string;
    etaMinutes: number;
    etaTime: string;
    distance: string;
  };
  // Pickup fields
  pickupPin?: string; // e.g. "7 4 9 2"
  pickupLocation?: {
    name: string;
    address: string;
    hours: string;
  };
}

export interface Voucher {
  code: string;
  discountAmount: number;
  minSpend: number;
  description: string;
}
