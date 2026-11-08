import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  CoffeeProduct,
  CartItem,
  Order,
  Role,
  ActiveTab,
  DeliveryTab,
  AdminTab,
  RoastLevel,
  PackageWeight,
  GrindProfile,
  Voucher,
  User,
  FilterCriteria,
} from '../types';
import { COFFEE_PRODUCTS, INITIAL_ORDERS, DEMO_USERS } from '../data/coffeeProducts';

interface StoreContextType {
  role: Role;
  setRole: (role: Role) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  deliveryTab: DeliveryTab;
  setDeliveryTab: (tab: DeliveryTab) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedRoast: RoastLevel;
  setSelectedRoast: (roast: RoastLevel) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedOrigin: string;
  setSelectedOrigin: (origin: string) => void;

  // Auth
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (userOrEmail: string | User, password?: string) => void;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (v: boolean) => void;

  // Filter & Sort
  filterCriteria: FilterCriteria;
  setFilterCriteria: React.Dispatch<React.SetStateAction<FilterCriteria>>;
  showFilterModal: boolean;
  setShowFilterModal: (v: boolean) => void;
  resetFilter: () => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (
    product: CoffeeProduct,
    weight: PackageWeight,
    grind: GrindProfile,
    quantity: number,
    notes?: string
  ) => void;
  updateCartItemQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  updateCartItemNotes: (id: string, notes: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  total: number;
  
  // Voucher
  appliedVoucher: Voucher | null;
  applyVoucher: (code: string) => { success: boolean; message: string };
  removeVoucher: () => void;
  
  // Orders
  orders: Order[];
  createOrder: (type: 'delivery' | 'pickup', address?: string) => Order;
  advanceOrderStatus: (orderId: string) => void;
  
  // Modal states
  selectedProductModal: CoffeeProduct | null;
  setSelectedProductModal: (p: CoffeeProduct | null) => void;
  showGrindGuide: boolean;
  setShowGrindGuide: (val: boolean) => void;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  
  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const VOUCHER_LIST: Voucher[] = [
  {
    code: 'PATAWIFRESH',
    discountAmount: 20000,
    minSpend: 80000,
    description: 'Diskon Rp 20.000 untuk batch sangrai baru',
  },
  {
    code: 'BEANS20',
    discountAmount: 15000,
    minSpend: 50000,
    description: 'Diskon Rp 15.000 Beans Promo',
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('customer');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [deliveryTab, setDeliveryTab] = useState<DeliveryTab>('active');
  const [adminTab, setAdminTab] = useState<AdminTab>('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoast, setSelectedRoast] = useState<RoastLevel>('Semua');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('Semua Asal');

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(DEMO_USERS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Filter & Sort state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    category: 'Semua',
    roast: 'Semua',
    process: 'Semua',
    maxPrice: 0,
    sortBy: 'featured',
  });

  const login = (userOrEmail: string | User, _password?: string) => {
    let targetUser: User;
    if (typeof userOrEmail === 'string') {
      const found = DEMO_USERS.find(
        (u) =>
          u.email.toLowerCase() === userOrEmail.toLowerCase() ||
          u.name.toLowerCase().includes(userOrEmail.toLowerCase())
      );
      targetUser = found || {
        id: `user-${Date.now()}`,
        name: userOrEmail.split('@')[0] || 'Pelanggan Patawi',
        email: userOrEmail,
        role: 'customer',
        tier: 'Gold Member',
        points: 500,
        avatar: '/assets/9e21e.png',
        phone: '+62 812-3456-7890',
      };
    } else {
      targetUser = userOrEmail;
    }
    setCurrentUser(targetUser);
    setIsLoggedIn(true);
    setRole(targetUser.role);
    setShowAuthModal(false);
    showToast(`Berhasil masuk sebagai ${targetUser.name}!`);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setRole('customer');
    showToast('Anda telah keluar dari akun.');
  };

  const resetFilter = () => {
    setSelectedCategory('Semua');
    setSelectedRoast('Semua');
    setSelectedOrigin('Semua Asal');
    setSearchQuery('');
    setFilterCriteria({
      category: 'Semua',
      roast: 'Semua',
      process: 'Semua',
      maxPrice: 0,
      sortBy: 'featured',
    });
    showToast('Semua filter berhasil direset');
  };

  // Load initial cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    return [
      {
        id: 'cart-1',
        productId: 'ptw-aceh-gayo-1',
        product: COFFEE_PRODUCTS[0],
        weight: '200g',
        grind: 'medium',
        grindLabel: 'Giling V60 / Filter',
        price: 95000,
        quantity: 1,
        notes: 'Catatan: Medium Grind (Aeropress / V60 standard)',
      },
      {
        id: 'cart-2',
        productId: 'ptw-toraja-sapan-2',
        product: COFFEE_PRODUCTS[1],
        weight: '200g',
        grind: 'whole',
        grindLabel: 'Biji Utuh (Beans)',
        price: 88000,
        quantity: 1,
        notes: 'Catatan: Tidak digiling, siap simpan untuk espresso',
      }
    ];
  });

  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(VOUCHER_LIST[0]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedProductModal, setSelectedProductModal] = useState<CoffeeProduct | null>(null);
  const [showGrindGuide, setShowGrindGuide] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['ptw-aceh-gayo-1']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(exists ? 'Dihapus dari daftar favorit' : 'Ditambahkan ke favorit ❤️');
      return updated;
    });
  };

  // Cart calculations
  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const discount = useMemo(() => {
    if (!appliedVoucher) return 0;
    if (subtotal >= appliedVoucher.minSpend) {
      return appliedVoucher.discountAmount;
    }
    return 0;
  }, [appliedVoucher, subtotal]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount);
  }, [subtotal, discount]);

  const getGrindLabel = (grind: GrindProfile): string => {
    switch (grind) {
      case 'whole':
        return 'Biji Utuh (Whole Bean)';
      case 'coarse':
        return 'Giling Kasar (Cold Brew, French Press)';
      case 'medium':
        return 'Giling Sedang (V60, Aeropress)';
      case 'fine':
        return 'Giling Halus (Espresso, Tubruk)';
    }
  };

  const getWeightMultiplier = (weight: PackageWeight): number => {
    switch (weight) {
      case '200g':
        return 1.0;
      case '500g':
        return 2.3; // 8% discount
      case '1kg':
        return 4.0; // 20% discount
    }
  };

  const addToCart = (
    product: CoffeeProduct,
    weight: PackageWeight,
    grind: GrindProfile,
    quantity: number,
    notes?: string
  ) => {
    const unitPrice = Math.round(product.basePrice * getWeightMultiplier(weight));
    const grindLabel = getGrindLabel(grind);

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === product.id && i.weight === weight && i.grind === grind
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          notes: notes || next[existingIndex].notes,
        };
        return next;
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: product.id,
        product,
        weight,
        grind,
        grindLabel,
        price: unitPrice,
        quantity,
        notes: notes || `Catatan: ${grindLabel}`,
      };

      return [...prev, newItem];
    });

    showToast(`${quantity}x ${product.name} (${weight}) ditambahkan ke keranjang`);
  };

  const updateCartItemQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Item berhasil dihapus dari keranjang');
  };

  const updateCartItemNotes = (id: string, notes: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyVoucher = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = VOUCHER_LIST.find((v) => v.code === trimmed);
    if (!found) {
      return { success: false, message: 'Kode voucher tidak valid.' };
    }
    if (subtotal < found.minSpend) {
      return {
        success: false,
        message: `Minimal belanja Rp ${found.minSpend.toLocaleString('id-ID')} untuk menggunakan voucher ini.`,
      };
    }
    setAppliedVoucher(found);
    return { success: true, message: `Voucher ${found.code} berhasil dipasang!` };
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    showToast('Voucher dilepas');
  };

  // Orders
  const createOrder = (type: 'delivery' | 'pickup', address?: string): Order => {
    const randNum = Math.floor(10000 + Math.random() * 90000);
    const orderNum = `PTW-${randNum}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      type,
      date: `Hari ini • ${timeStr}`,
      status: 'processing',
      currentStepIndex: 1,
      items: [...cart],
      subtotal,
      discount,
      shippingFee: type === 'delivery' ? 15000 : 0,
      total: total + (type === 'delivery' ? 15000 : 0),
      steps: [
        {
          id: 1,
          title: 'Pesanan Diterima & Terbayar',
          subtitle: 'Pembayaran QRIS BCA terverifikasi otomatis.',
          time: timeStr,
          status: 'completed',
        },
        {
          id: 2,
          title: 'Dikonfirmasi Roastery Senopati',
          subtitle: 'Batch pesanan masuk ke roaster station.',
          time: 'Baru saja',
          status: 'current',
        },
        {
          id: 3,
          title: 'Roasting, Grinding & Packing',
          subtitle: 'Biji kopi disangrai segar dan digiling sesuai pesanan.',
          time: 'Menunggu',
          status: 'pending',
        },
        {
          id: 4,
          title: type === 'delivery' ? 'Kurir Menuju Outlet' : 'Siap Di Counter Barista',
          subtitle: type === 'delivery'
            ? 'Mitra kurir GoSend ditugaskan menuju outlet.'
            : 'Paket siap diambil di meja pickup Senopati.',
          time: 'Menunggu',
          status: 'pending',
        },
        {
          id: 5,
          title: type === 'delivery' ? 'Pesanan Diambil Kurir' : 'Pengambilan Selesai',
          subtitle: type === 'delivery'
            ? 'Kurir dalam perjalanan mengantar paket.'
            : 'Tunjukkan PIN ke Barista.',
          time: 'Menunggu',
          status: 'pending',
        },
        {
          id: 6,
          title: 'Pesanan Selesai',
          subtitle: 'Paket kopi segar telah diterima dengan selamat.',
          time: 'Estimasi 30 Menit',
          status: 'pending',
        },
      ],
      courier: type === 'delivery' ? {
        name: 'Rian Hidayat',
        vehicle: 'Honda Vario Hitam',
        plateNumber: 'B 4521 SRX',
        avatar: '/assets/9e21e.png',
        etaMinutes: 20,
        etaTime: 'Segera',
        distance: '2.5 km',
      } : undefined,
      pickupPin: type === 'pickup' ? `${Math.floor(1 + Math.random() * 9)} ${Math.floor(1 + Math.random() * 9)} ${Math.floor(1 + Math.random() * 9)} ${Math.floor(1 + Math.random() * 9)}` : undefined,
      pickupLocation: type === 'pickup' ? {
        name: 'Roastery Senopati Flagship',
        address: address || 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan',
        hours: 'Buka sampai 22:00 WIB',
      } : undefined,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const advanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const nextIdx = Math.min(order.steps.length - 1, order.currentStepIndex + 1);
        const updatedSteps = order.steps.map((step, idx) => {
          if (idx < nextIdx) return { ...step, status: 'completed' as const };
          if (idx === nextIdx) return { ...step, status: 'current' as const };
          return { ...step, status: 'pending' as const };
        });

        let newStatus: Order['status'] = order.status;
        if (nextIdx >= 5) newStatus = 'delivered';
        else if (nextIdx >= 3) newStatus = order.type === 'delivery' ? 'on_the_way' : 'ready_pickup';
        else if (nextIdx >= 2) newStatus = 'roasting';

        return {
          ...order,
          currentStepIndex: nextIdx,
          status: newStatus,
          steps: updatedSteps,
        };
      })
    );
    showToast('Status pesanan berhasil diperbarui!');
  };

  return (
    <StoreContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        deliveryTab,
        setDeliveryTab,
        adminTab,
        setAdminTab,
        searchQuery,
        setSearchQuery,
        selectedRoast,
        setSelectedRoast,
        selectedCategory,
        setSelectedCategory,
        selectedOrigin,
        setSelectedOrigin,
        currentUser,
        isLoggedIn,
        login,
        logout,
        showAuthModal,
        setShowAuthModal,
        filterCriteria,
        setFilterCriteria,
        showFilterModal,
        setShowFilterModal,
        resetFilter,
        cart,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        updateCartItemNotes,
        clearCart,
        cartCount,
        subtotal,
        discount,
        total,
        appliedVoucher,
        applyVoucher,
        removeVoucher,
        orders,
        createOrder,
        advanceOrderStatus,
        selectedProductModal,
        setSelectedProductModal,
        showGrindGuide,
        setShowGrindGuide,
        favorites,
        toggleFavorite,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
