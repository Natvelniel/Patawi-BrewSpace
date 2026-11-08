import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CourierService, CustomerInfo, Order } from '../../types';
import {
  Flame,
  Trash2,
  Minus,
  Plus,
  Sliders,
  Tag,
  ArrowRight,
  ArrowLeft,
  Truck,
  Store,
  MapPin,
  ShoppingBag,
  Package,
  Zap,
} from 'lucide-react';
import { QRISPaymentModal } from './QRISPaymentModal';
import { OrderConfirmationModal } from './OrderConfirmationModal';

export const CartView: React.FC = () => {
  const {
    cart,
    updateCartItemQty,
    removeFromCart,
    updateCartItemNotes,
    subtotal,
    discount,
    total,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    setActiveTab,
    showToast,
    currentUser,
    isLoggedIn,
  } = useStore();

  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [courierService, setCourierService] = useState<CourierService>('gosend');
  const [isGuestCheckout, setIsGuestCheckout] = useState(!isLoggedIn);
  const [guestName, setGuestName] = useState('Budi Pratama');
  const [guestEmail, setGuestEmail] = useState('budi.pratama@gmail.com');
  const [guestPhone, setGuestPhone] = useState('+62 813-9876-5432');
  const [destCity, setDestCity] = useState('Jakarta Selatan');
  const [postalCode, setPostalCode] = useState('12190');
  const [address, setAddress] = useState('Jl. Senopati No. 12, Kebayoran Baru');
  const [voucherInput, setVoucherInput] = useState('PATAWIFRESH');
  const [showQRIS, setShowQRIS] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  const shippingFee = deliveryType === 'pickup' ? 0 : courierService === 'jne_yes' ? 35000 : courierService === 'jne_reg' ? 22000 : 15000;
  const grandTotal = total + shippingFee;

  const customerInfo: CustomerInfo = isGuestCheckout || !currentUser ? {
    name: guestName.trim() || 'Pelanggan Tamu',
    email: guestEmail.trim() || 'tamu@patawibrew.com',
    phone: guestPhone.trim() || '+62 812-0000-8888',
    isGuest: true,
    destinationCity: destCity,
    postalCode: postalCode,
  } : {
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    isGuest: false,
    destinationCity: destCity,
    postalCode: postalCode,
  };

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyVoucher(voucherInput);
    showToast(res.message);
  };

  if (cart.length === 0) {
    return (
      <>
        {confirmedOrder && (
          <OrderConfirmationModal
            order={confirmedOrder}
            onTrack={() => {
              setConfirmedOrder(null);
              setCheckoutStep(1);
              setActiveTab('tracking');
            }}
            onHome={() => {
              setConfirmedOrder(null);
              setCheckoutStep(1);
              setActiveTab('home');
            }}
          />
        )}
        <div className="pb-8 pt-8 px-5 bg-[#FAF7F2] min-h-full flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#EFE8E0] flex items-center justify-center text-[#865225] mb-4 shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h3 className="font-serif text-[22px] font-bold text-[#26160F]">
            Keranjang Masih Kosong
          </h3>
          <p className="text-xs text-[#75645C] mt-1 max-w-[280px] leading-relaxed">
            Belum ada biji kopi sangrai segar pilihan Anda di keranjang.
          </p>
          <button
            onClick={() => setActiveTab('catalog')}
            className="mt-6 bg-[#26160F] hover:bg-[#C86826] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
          >
            Eksplorasi Katalog Kopi
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="pb-20 pt-3 px-4 bg-[#FAF7F2] min-h-full space-y-4">
      {/* 1. Stepper Header (3 Steps) */}
      <div className="bg-white border border-[#ECE4DA] p-1.5 rounded-2xl flex items-center justify-between text-xs font-bold shadow-2xs">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
            checkoutStep === 1
              ? 'bg-[#26160F] text-white shadow-xs'
              : 'text-[#75645C]'
          }`}
        >
          <span
            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
              checkoutStep === 1 ? 'bg-[#C86826] text-white' : 'bg-[#D9CEC5] text-[#26160F]'
            }`}
          >
            1
          </span>
          Keranjang
        </div>

        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
            checkoutStep === 2
              ? 'bg-[#26160F] text-white shadow-xs'
              : 'text-[#75645C]'
          }`}
        >
          <span
            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
              checkoutStep === 2 ? 'bg-[#C86826] text-white' : 'bg-[#D9CEC5] text-[#26160F]'
            }`}
          >
            2
          </span>
          Pengiriman
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[#75645C]">
          <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-[#D9CEC5] text-[#26160F]">
            3
          </span>
          Bayar
        </div>
      </div>

      {/* Fresh Roast Batch Card */}
      <div className="bg-white border border-[#ECE4DA] rounded-2xl p-3.5 flex items-start gap-3 shadow-2xs">
        <div className="p-2.5 bg-[#FAF7F2] rounded-xl text-[#865225] shrink-0 border border-[#ECE4DA]">
          <Flame className="w-4 h-4 text-[#C86826]" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-[#865225] uppercase tracking-wider block">
            FRESH ROAST BATCH • 2 HARI LALU
          </span>
          <p className="text-xs text-[#5C4D46] mt-0.5 leading-relaxed">
            Biji kopi Anda disangrai segar di Patawi Roastery Senopati untuk menjaga puncak aroma profil seduhan.
          </p>
        </div>
      </div>

      {/* STEP 1: CART ITEMS & SUMMARY */}
      {checkoutStep === 1 && (
        <>
          {/* Cart Items List */}
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-[#ECE4DA] p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#F4EFE9] shrink-0 border border-[#ECE4DA]">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#865225] uppercase tracking-wider">
                        {item.product.region}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#75645C] hover:text-red-500 p-1 transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-serif text-[15px] font-bold text-[#26160F] line-clamp-2 mt-0.5 leading-snug">
                      {item.product.name}
                    </h4>

                    {/* Chips */}
                    <div className="flex flex-wrap items-center gap-1 mt-1.5">
                      <span className="text-[10px] font-semibold bg-[#F4EFE9] text-[#865225] px-2 py-0.5 rounded-md">
                        {item.weight}
                      </span>
                      <span className="text-[10px] font-semibold bg-[#F4EFE9] text-[#5C4D46] px-2 py-0.5 rounded-md">
                        {item.product.roastLevel}
                      </span>
                      <span className="text-[10px] font-semibold bg-[#F4EFE9] text-[#5C4D46] px-2 py-0.5 rounded-md">
                        {item.grindLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & Quantity Row */}
                <div className="flex items-center justify-between pt-2 border-t border-[#F4EFE9]">
                  <span className="font-serif text-[16px] font-bold text-[#26160F]">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>

                  <div className="flex items-center bg-[#EFE8E0] rounded-xl px-2 py-1">
                    <button
                      onClick={() => updateCartItemQty(item.id, -1)}
                      className="p-1 rounded-lg hover:bg-white text-[#26160F] transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-[#26160F]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartItemQty(item.id, 1)}
                      className="p-1 rounded-lg hover:bg-white text-[#26160F] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Custom Notes Strip */}
                <div className="bg-[#FAF7F2] p-2.5 rounded-xl flex items-center justify-between text-xs border border-[#ECE4DA]">
                  {editingNoteId === item.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={tempNote}
                        onChange={(e) => setTempNote(e.target.value)}
                        className="flex-1 bg-white px-2.5 py-1 rounded-lg border border-[#D9CEC5] text-xs text-[#26160F]"
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          updateCartItemNotes(item.id, tempNote);
                          setEditingNoteId(null);
                        }}
                        className="bg-[#26160F] text-white px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        Simpan
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-1.5 text-[#5C4D46] mr-2 flex-1 min-w-0">
                        <Sliders className="w-3.5 h-3.5 text-[#865225] shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-snug">
                          {item.notes || 'Belum ada catatan seduhan'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setEditingNoteId(item.id);
                          setTempNote(item.notes || '');
                        }}
                        className="text-[11px] font-bold text-[#865225] hover:underline shrink-0 cursor-pointer"
                      >
                        Ubah
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Code Section */}
          <div className="bg-white rounded-2xl border border-[#ECE4DA] p-3 shadow-2xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 flex-1">
              <div className="p-2 bg-[#FAF7F2] rounded-xl text-[#865225] border border-[#ECE4DA]">
                <Tag className="w-4 h-4 text-[#C86826]" />
              </div>
              <input
                type="text"
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                placeholder="Kode Promo (PATAWIFRESH)"
                className="w-full bg-transparent text-xs font-bold text-[#26160F] uppercase tracking-wider focus:outline-hidden"
              />
            </div>
            {appliedVoucher && appliedVoucher.code === voucherInput ? (
              <button
                onClick={removeVoucher}
                className="bg-[#EFE8E0] text-[#865225] text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-[#E5DCD2] transition-colors cursor-pointer"
              >
                TERPASANG ✓
              </button>
            ) : (
              <button
                onClick={handleApplyVoucher}
                className="bg-[#26160F] hover:bg-[#C86826] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95"
              >
                Gunakan
              </button>
            )}
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-3xl border border-[#ECE4DA] p-4.5 shadow-2xs space-y-3">
            <h4 className="font-serif text-[17px] font-bold text-[#26160F] pb-2 border-b border-[#F4EFE9]">
              Ringkasan Pesanan
            </h4>

            <div className="flex justify-between text-xs text-[#5C4D46]">
              <span>Subtotal Produk ({cart.length} item)</span>
              <span className="font-semibold text-[#26160F]">
                Rp {subtotal.toLocaleString('id-ID')}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-xs text-[#C86826] font-semibold">
                <span>Diskon {appliedVoucher?.code}</span>
                <span>- Rp {discount.toLocaleString('id-ID')}</span>
              </div>
            )}

            <div className="pt-2 border-t border-[#F4EFE9] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#75645C] tracking-wider uppercase block">
                  PERKIRAAN BIAYA
                </span>
                <span className="font-serif text-[20px] font-bold text-[#26160F]">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                onClick={() => setCheckoutStep(2)}
                className="flex items-center gap-2 bg-[#26160F] hover:bg-[#C86826] text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
              >
                Lanjut Pengiriman <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* STEP 2: SHIPPING & METHOD */}
      {checkoutStep === 2 && (
        <div className="space-y-4 animate-in fade-in">
          {/* Back to Step 1 */}
          <button
            onClick={() => setCheckoutStep(1)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#865225] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Keranjang
          </button>

          {/* 1. Checkout Identity Mode (Guest vs Member) */}
          <div className="bg-white rounded-3xl border border-[#ECE4DA] p-4.5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif text-[16px] font-bold text-[#26160F]">
                Identitas Pemesan
              </span>
              <span className="text-[10px] text-[#75645C] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#ECE4DA]">
                {isGuestCheckout ? 'Tamu Tanpa Akun' : 'Member Terdaftar'}
              </span>
            </div>

            {/* Toggle Segmented Pill */}
            <div className="bg-[#FAF7F2] p-1 rounded-2xl border border-[#ECE4DA] grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setIsGuestCheckout(false)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                  !isGuestCheckout
                    ? 'bg-[#26160F] text-white shadow-xs font-bold'
                    : 'text-[#5C4D46] hover:bg-white/60'
                }`}
              >
                Gunakan Akun Member
              </button>
              <button
                type="button"
                onClick={() => setIsGuestCheckout(true)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                  isGuestCheckout
                    ? 'bg-[#26160F] text-white shadow-xs font-bold'
                    : 'text-[#5C4D46] hover:bg-white/60'
                }`}
              >
                Checkout sebagai Tamu
              </button>
            </div>

            {/* If Member */}
            {!isGuestCheckout && currentUser && (
              <div className="flex items-center gap-3 p-3 bg-[#FAF7F2] rounded-2xl border border-[#ECE4DA]">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#C86826] shrink-0"
                />
                <div className="min-w-0 flex-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    <strong className="text-[#26160F] truncate">{currentUser.name}</strong>
                    <span className="text-[9.5px] font-bold text-[#865225] bg-[#FDF3EB] px-1.5 py-0.2 rounded">
                      VIP Gold
                    </span>
                  </div>
                  <span className="text-[11px] text-[#75645C] font-mono block truncate">
                    {currentUser.email}
                  </span>
                  <span className="text-[10.5px] text-[#75645C] block">
                    {currentUser.phone}
                  </span>
                </div>
              </div>
            )}

            {/* If Guest Form */}
            {isGuestCheckout && (
              <div className="space-y-2.5 pt-1 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-[#75645C] block mb-1">
                    Nama Lengkap Pemesan
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Nama penerima paket"
                    className="w-full bg-[#FAF7F2] border border-[#ECE4DA] rounded-xl px-3 py-2 text-xs text-[#26160F] focus:outline-hidden focus:border-[#C86826]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-[#75645C] block mb-1">
                      Email (Untuk Kirim Invoice)
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="contoh@gmail.com"
                      className="w-full bg-[#FAF7F2] border border-[#ECE4DA] rounded-xl px-3 py-2 text-xs text-[#26160F] focus:outline-hidden focus:border-[#C86826]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#75645C] block mb-1">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+62 812-xxxx-xxxx"
                      className="w-full bg-[#FAF7F2] border border-[#ECE4DA] rounded-xl px-3 py-2 text-xs text-[#26160F] focus:outline-hidden focus:border-[#C86826]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Delivery & Courier Options */}
          <div className="space-y-2.5">
            <h4 className="font-serif text-[17px] font-bold text-[#26160F]">
              Pilih Metode Pengiriman & Ekspedisi
            </h4>

            {/* Option 1: GoSend Instant */}
            <div
              onClick={() => {
                setDeliveryType('delivery');
                setCourierService('gosend');
              }}
              className={`p-3.5 rounded-3xl border transition-all cursor-pointer ${
                deliveryType === 'delivery' && courierService === 'gosend'
                  ? 'bg-white border-[#26160F] shadow-sm ring-1 ring-[#26160F]'
                  : 'bg-[#FAF7F2] border-[#ECE4DA] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-2xl ${
                      deliveryType === 'delivery' && courierService === 'gosend'
                        ? 'bg-[#26160F] text-[#FDB882]'
                        : 'bg-[#EFE8E0] text-[#75645C]'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#26160F]">
                      GoSend Instant Delivery (Jakarta)
                    </h5>
                    <span className="text-[10.5px] text-[#75645C]">
                      Estimasi 25 - 40 Menit (Live GPS Track)
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#26160F]">
                  Rp 15.000
                </span>
              </div>
            </div>

            {/* Option 2: JNE Regular / SiCepat Standard */}
            <div
              onClick={() => {
                setDeliveryType('delivery');
                setCourierService('jne_reg');
              }}
              className={`p-3.5 rounded-3xl border transition-all cursor-pointer ${
                deliveryType === 'delivery' && courierService === 'jne_reg'
                  ? 'bg-white border-[#26160F] shadow-sm ring-1 ring-[#26160F]'
                  : 'bg-[#FAF7F2] border-[#ECE4DA] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-2xl ${
                      deliveryType === 'delivery' && courierService === 'jne_reg'
                        ? 'bg-[#26160F] text-[#FDB882]'
                        : 'bg-[#EFE8E0] text-[#75645C]'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#26160F]">
                      JNE Regular / SiCepat Standard
                    </h5>
                    <span className="text-[10.5px] text-[#75645C]">
                      Estimasi 2 - 3 Hari (Seluruh Indonesia)
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#26160F]">
                  Rp 22.000
                </span>
              </div>
            </div>

            {/* Option 3: JNE YES Next Day */}
            <div
              onClick={() => {
                setDeliveryType('delivery');
                setCourierService('jne_yes');
              }}
              className={`p-3.5 rounded-3xl border transition-all cursor-pointer ${
                deliveryType === 'delivery' && courierService === 'jne_yes'
                  ? 'bg-white border-[#26160F] shadow-sm ring-1 ring-[#26160F]'
                  : 'bg-[#FAF7F2] border-[#ECE4DA] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-2xl ${
                      deliveryType === 'delivery' && courierService === 'jne_yes'
                        ? 'bg-[#26160F] text-[#FDB882]'
                        : 'bg-[#EFE8E0] text-[#75645C]'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#26160F]">
                      JNE YES (Next Day Delivery)
                    </h5>
                    <span className="text-[10.5px] text-[#75645C]">
                      Garansi 1 Hari Tiba (Kilat Roastery)
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#26160F]">
                  Rp 35.000
                </span>
              </div>
            </div>

            {/* Option 4: Pick Up Outlet */}
            <div
              onClick={() => {
                setDeliveryType('pickup');
                setCourierService('pickup');
              }}
              className={`p-3.5 rounded-3xl border transition-all cursor-pointer ${
                deliveryType === 'pickup'
                  ? 'bg-white border-[#26160F] shadow-sm ring-1 ring-[#26160F]'
                  : 'bg-[#FAF7F2] border-[#ECE4DA] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-2xl ${
                      deliveryType === 'pickup'
                        ? 'bg-[#26160F] text-[#FDB882]'
                        : 'bg-[#EFE8E0] text-[#75645C]'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#26160F]">
                      Pick Up Sendiri di Outlet Senopati
                    </h5>
                    <span className="text-[10.5px] text-[#75645C]">
                      Dapatkan 4-Digit PIN untuk Barista
                    </span>
                  </div>
                </div>
                <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  GRATIS
                </span>
              </div>

              {deliveryType === 'pickup' && (
                <div className="mt-3 pt-3 border-t border-[#F4EFE9] text-xs text-[#5C4D46]">
                  <strong>Lokasi Pengambilan:</strong>
                  <p className="mt-0.5 text-[#75645C]">
                    Roastery Senopati Flagship, Jl. Senopati No. 42, Kebayoran Baru (Buka s/d 22:00 WIB)
                  </p>
                </div>
              )}
            </div>

            {/* Address Field (If Delivery) */}
            {deliveryType === 'delivery' && (
              <div className="bg-white rounded-3xl border border-[#ECE4DA] p-4 shadow-2xs space-y-2.5">
                <label className="text-[11px] font-bold text-[#75645C] block">
                  Alamat Lengkap Pengantaran
                </label>
                <div className="flex items-center gap-2 bg-[#FAF7F2] p-2.5 rounded-xl border border-[#ECE4DA]">
                  <MapPin className="w-4 h-4 text-[#C86826] shrink-0" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nama jalan, nomor rumah, RT/RW, instruksi satpam"
                    className="w-full bg-transparent text-xs text-[#26160F] focus:outline-hidden"
                  />
                </div>

                {courierService.startsWith('jne') && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[10px] font-bold text-[#75645C] block mb-1">
                        Kota / Kabupaten
                      </label>
                      <input
                        type="text"
                        value={destCity}
                        onChange={(e) => setDestCity(e.target.value)}
                        placeholder="Contoh: Bandung"
                        className="w-full bg-[#FAF7F2] border border-[#ECE4DA] rounded-xl px-2.5 py-1.5 text-xs text-[#26160F] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#75645C] block mb-1">
                        Kode Pos
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Contoh: 40115"
                        className="w-full bg-[#FAF7F2] border border-[#ECE4DA] rounded-xl px-2.5 py-1.5 text-xs text-[#26160F] focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Final Summary Card */}
          <div className="bg-white rounded-3xl border border-[#ECE4DA] p-4.5 shadow-2xs space-y-2.5">
            <h4 className="font-serif text-[16px] font-bold text-[#26160F] pb-2 border-b border-[#F4EFE9]">
              Rincian Pembayaran
            </h4>

            <div className="flex justify-between text-xs text-[#5C4D46]">
              <span>Subtotal Produk</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-xs text-[#C86826]">
                <span>Diskon Kupon</span>
                <span>- Rp {discount.toLocaleString('id-ID')}</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-[#5C4D46]">
              <span>Ongkos Kirim ({deliveryType === 'pickup' ? 'Pick Up' : courierService === 'gosend' ? 'GoSend Instant' : courierService === 'jne_yes' ? 'JNE YES' : 'JNE Regular'})</span>
              <span>{shippingFee > 0 ? `Rp ${shippingFee.toLocaleString('id-ID')}` : 'Gratis'}</span>
            </div>

            <div className="pt-2 border-t border-[#F4EFE9] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#75645C] tracking-wider uppercase block">
                  TOTAL PEMBAYARAN
                </span>
                <span className="font-serif text-[20px] font-bold text-[#26160F]">
                  Rp {grandTotal.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                onClick={() => setShowQRIS(true)}
                className="flex items-center gap-2 bg-[#26160F] hover:bg-[#C86826] text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
              >
                Bayar dengan QRIS <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QRIS Payment Modal */}
      {showQRIS && (
        <QRISPaymentModal
          deliveryType={deliveryType}
          address={address}
          customerInfo={customerInfo}
          courierService={courierService}
          onSuccess={(newOrder) => {
            setShowQRIS(false);
            setConfirmedOrder(newOrder);
          }}
          onClose={() => {
            setShowQRIS(false);
            showToast('Pembayaran QRIS ditutup. Keranjang belanja Anda tetap tersimpan!');
          }}
        />
      )}

      {/* Order Confirmation Screen Modal */}
      {confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder}
          onTrack={() => {
            setConfirmedOrder(null);
            setCheckoutStep(1);
            setActiveTab('tracking');
          }}
          onHome={() => {
            setConfirmedOrder(null);
            setCheckoutStep(1);
            setActiveTab('home');
          }}
        />
      )}
    </div>
  );
};
