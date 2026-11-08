import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
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
} from 'lucide-react';
import { QRISPaymentModal } from './QRISPaymentModal';

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
  } = useStore();

  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('Jl. Senopati No. 12, Kebayoran Baru, Jakarta Selatan');
  const [voucherInput, setVoucherInput] = useState('PATAWIFRESH');
  const [showQRIS, setShowQRIS] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  const shippingFee = deliveryType === 'delivery' ? 15000 : 0;
  const grandTotal = total + shippingFee;

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyVoucher(voucherInput);
    showToast(res.message);
  };

  if (cart.length === 0) {
    return (
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
    );
  }

  return (
    <div className="pb-8 pt-3 px-4 bg-[#FAF7F2] min-h-full space-y-4">
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

                    <h4 className="font-serif text-[15px] font-bold text-[#26160F] truncate mt-0.5 leading-snug">
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
                      <div className="flex items-center gap-1.5 text-[#5C4D46] truncate mr-2">
                        <Sliders className="w-3.5 h-3.5 text-[#865225] shrink-0" />
                        <span className="truncate">
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

          {/* Delivery Method Options */}
          <div className="space-y-2.5">
            <h4 className="font-serif text-[17px] font-bold text-[#26160F]">
              Pilih Metode Pengambilan
            </h4>

            {/* Option 1: GoSend Instant */}
            <div
              onClick={() => setDeliveryType('delivery')}
              className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                deliveryType === 'delivery'
                  ? 'bg-white border-[#26160F] shadow-sm ring-1 ring-[#26160F]'
                  : 'bg-[#FAF7F2] border-[#ECE4DA] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-2xl ${
                      deliveryType === 'delivery'
                        ? 'bg-[#26160F] text-[#FDB882]'
                        : 'bg-[#EFE8E0] text-[#75645C]'
                    }`}
                  >
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#26160F]">
                      GoSend Instant Delivery
                    </h5>
                    <span className="text-[11px] text-[#75645C]">
                      Estimasi 25 - 40 Menit (Live GPS Track)
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#26160F]">
                  Rp 15.000
                </span>
              </div>

              {deliveryType === 'delivery' && (
                <div className="mt-3 pt-3 border-t border-[#F4EFE9]">
                  <label className="text-[11px] font-bold text-[#75645C] block mb-1">
                    Alamat Pengantaran
                  </label>
                  <div className="flex items-center gap-2 bg-[#FAF7F2] p-2.5 rounded-xl border border-[#ECE4DA]">
                    <MapPin className="w-4 h-4 text-[#C86826] shrink-0" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-transparent text-xs text-[#26160F] focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Option 2: Pickup in store */}
            <div
              onClick={() => setDeliveryType('pickup')}
              className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                deliveryType === 'pickup'
                  ? 'bg-white border-[#26160F] shadow-sm ring-1 ring-[#26160F]'
                  : 'bg-[#FAF7F2] border-[#ECE4DA] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-2xl ${
                      deliveryType === 'pickup'
                        ? 'bg-[#26160F] text-[#FDB882]'
                        : 'bg-[#EFE8E0] text-[#75645C]'
                    }`}
                  >
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#26160F]">
                      Pick Up di Outlet Senopati
                    </h5>
                    <span className="text-[11px] text-[#75645C]">
                      Dapatkan 4-Digit PIN untuk Barista
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
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
              <span>Ongkos Kirim</span>
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
          onSuccess={() => {
            setShowQRIS(false);
            setCheckoutStep(1);
            setActiveTab('tracking');
          }}
          onClose={() => setShowQRIS(false)}
        />
      )}
    </div>
  );
};
