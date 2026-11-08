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
      <div className="pb-28 pt-8 px-5 bg-[#FBF9F5] min-h-screen flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-[#EFEEEA] flex items-center justify-center text-[#865225] mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h3 className="font-serif text-[22px] font-bold text-[#2B1810]">
          Keranjang Masih Kosong
        </h3>
        <p className="text-[13px] text-[#817470] mt-1 max-w-[280px]">
          Belum ada biji kopi sangrai segar pilihan Anda di keranjang.
        </p>
        <button
          onClick={() => setActiveTab('catalog')}
          className="mt-6 bg-[#2B1810] text-white px-6 py-2.5 rounded-xl font-bold text-[14px] shadow-sm hover:bg-[#1B1C1A] transition-colors"
        >
          Eksplorasi Katalog Kopi
        </button>
      </div>
    );
  }

  return (
    <div className="pb-32 pt-2 px-4 bg-[#FBF9F5] min-h-screen space-y-4">
      {/* 1. Stepper Header (3 Steps) */}
      <div className="bg-[#EFEEEA] p-1.5 rounded-2xl flex items-center justify-between text-[12px] font-bold">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
            checkoutStep === 1
              ? 'bg-[#2B1810] text-white shadow-xs'
              : 'text-[#817470]'
          }`}
        >
          <span
            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
              checkoutStep === 1 ? 'bg-[#E08A44] text-white' : 'bg-[#D3C3BE] text-white'
            }`}
          >
            1
          </span>
          Keranjang
        </div>

        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
            checkoutStep === 2
              ? 'bg-[#2B1810] text-white shadow-xs'
              : 'text-[#817470]'
          }`}
        >
          <span
            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
              checkoutStep === 2 ? 'bg-[#E08A44] text-white' : 'bg-[#D3C3BE] text-white'
            }`}
          >
            2
          </span>
          Pengiriman
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[#817470]">
          <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-[#D3C3BE] text-white">
            3
          </span>
          Bayar
        </div>
      </div>

      {/* Fresh Roast Batch Card */}
      <div className="bg-[#F5F3EF] border border-[#EAE8E4] rounded-2xl p-3.5 flex items-start gap-3">
        <div className="p-2 bg-[#FBF9F5] rounded-xl text-[#865225] shrink-0 border border-[#EAE8E4]">
          <Flame className="w-4 h-4 text-[#E08A44]" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#865225] uppercase tracking-wider block">
            FRESH ROAST BATCH • 2 HARI LALU
          </span>
          <p className="text-[11px] text-[#4F4440] mt-0.5 leading-relaxed">
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
                className="bg-white rounded-2xl border border-[#EAE8E4] p-3.5 shadow-2xs space-y-3"
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#EFEEEA] shrink-0 border border-[#EAE8E4]">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-[#865225] uppercase tracking-wider">
                        {item.product.region}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#817470] hover:text-red-500 p-1 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-serif text-[15px] font-bold text-[#2B1810] truncate mt-0.5">
                      {item.product.name}
                    </h4>

                    {/* Chips */}
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      <span className="text-[9px] font-semibold bg-[#F5F3EF] text-[#865225] px-1.5 py-0.5 rounded">
                        {item.weight}
                      </span>
                      <span className="text-[9px] font-semibold bg-[#F5F3EF] text-[#4F4440] px-1.5 py-0.5 rounded">
                        {item.product.roastLevel}
                      </span>
                      <span className="text-[9px] font-semibold bg-[#F5F3EF] text-[#4F4440] px-1.5 py-0.5 rounded">
                        {item.grindLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & Quantity Row */}
                <div className="flex items-center justify-between pt-2 border-t border-[#F5F3EF]">
                  <span className="font-serif text-[16px] font-bold text-[#2B1810]">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>

                  <div className="flex items-center bg-[#EFEEEA] rounded-xl px-2 py-1">
                    <button
                      onClick={() => updateCartItemQty(item.id, -1)}
                      className="p-1 rounded hover:bg-white text-[#2B1810] transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center text-[12px] font-bold text-[#2B1810]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartItemQty(item.id, 1)}
                      className="p-1 rounded hover:bg-white text-[#2B1810] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Custom Notes Strip */}
                <div className="bg-[#FBF9F5] p-2 rounded-xl flex items-center justify-between text-[11px] border border-[#EAE8E4]">
                  {editingNoteId === item.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={tempNote}
                        onChange={(e) => setTempNote(e.target.value)}
                        className="flex-1 bg-white px-2 py-1 rounded border border-[#D3C3BE] text-[11px]"
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          updateCartItemNotes(item.id, tempNote);
                          setEditingNoteId(null);
                        }}
                        className="bg-[#2B1810] text-white px-2 py-1 rounded text-[10px] font-bold"
                      >
                        Simpan
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5 text-[#4F4440] truncate mr-2">
                        <Sliders className="w-3 h-3 text-[#865225] shrink-0" />
                        <span className="truncate">
                          {item.notes || 'Belum ada catatan seduhan'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setEditingNoteId(item.id);
                          setTempNote(item.notes || '');
                        }}
                        className="text-[10px] font-bold text-[#865225] hover:underline shrink-0"
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
          <div className="bg-white rounded-2xl border border-[#EAE8E4] p-3 shadow-2xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <div className="p-2 bg-[#F5F3EF] rounded-xl text-[#865225]">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                placeholder="Kode Promo (PATAWIFRESH)"
                className="w-full bg-transparent text-[13px] font-bold text-[#2B1810] uppercase tracking-wider focus:outline-hidden"
              />
            </div>
            {appliedVoucher && appliedVoucher.code === voucherInput ? (
              <button
                onClick={removeVoucher}
                className="bg-[#EFEEEA] text-[#865225] text-[11px] font-bold px-3 py-1.5 rounded-xl hover:bg-[#EAE8E4] transition-colors"
              >
                TERPASANG ✓
              </button>
            ) : (
              <button
                onClick={handleApplyVoucher}
                className="bg-[#2B1810] text-white text-[11px] font-bold px-3.5 py-1.5 rounded-xl hover:bg-[#1B1C1A] transition-colors"
              >
                Gunakan
              </button>
            )}
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-2xl border border-[#EAE8E4] p-4 shadow-2xs space-y-2.5">
            <h4 className="font-serif text-[16px] font-bold text-[#2B1810] pb-2 border-b border-[#F5F3EF]">
              Ringkasan Pesanan
            </h4>

            <div className="flex justify-between text-[13px] text-[#4F4440]">
              <span>Subtotal Produk ({cart.length} item)</span>
              <span className="font-semibold text-[#2B1810]">
                Rp {subtotal.toLocaleString('id-ID')}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-[13px] text-[#E08A44] font-semibold">
                <span>Diskon {appliedVoucher?.code}</span>
                <span>- Rp {discount.toLocaleString('id-ID')}</span>
              </div>
            )}

            <div className="pt-2 border-t border-[#F5F3EF] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#817470] tracking-wider uppercase block">
                  PERKIRAAN BIAYA
                </span>
                <span className="font-serif text-[20px] font-bold text-[#2B1810]">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                onClick={() => setCheckoutStep(2)}
                className="flex items-center gap-2 bg-[#2B1810] hover:bg-[#1B1C1A] text-white px-5 py-3 rounded-xl font-bold text-[13px] shadow-sm transition-all cursor-pointer"
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
            className="flex items-center gap-1.5 text-[12px] font-bold text-[#865225] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Keranjang
          </button>

          {/* Delivery Method Options */}
          <div className="space-y-2.5">
            <h4 className="font-serif text-[16px] font-bold text-[#2B1810]">
              Pilih Metode Pengambilan
            </h4>

            {/* Option 1: GoSend Instant */}
            <div
              onClick={() => setDeliveryType('delivery')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                deliveryType === 'delivery'
                  ? 'bg-white border-[#2B1810] shadow-sm ring-1 ring-[#2B1810]'
                  : 'bg-[#FBF9F5] border-[#EAE8E4]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl ${
                      deliveryType === 'delivery'
                        ? 'bg-[#2B1810] text-[#FDB882]'
                        : 'bg-[#EFEEEA] text-[#817470]'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-[13px] font-bold text-[#2B1810]">
                      GoSend Instant Delivery
                    </h5>
                    <span className="text-[11px] text-[#817470]">
                      Estimasi 25 - 40 Menit (Live GPS Track)
                    </span>
                  </div>
                </div>
                <span className="text-[13px] font-bold text-[#2B1810]">
                  Rp 15.000
                </span>
              </div>

              {deliveryType === 'delivery' && (
                <div className="mt-3 pt-3 border-t border-[#F5F3EF]">
                  <label className="text-[11px] font-bold text-[#817470] block mb-1">
                    Alamat Pengantaran
                  </label>
                  <div className="flex items-center gap-2 bg-[#F5F3EF] p-2.5 rounded-xl border border-[#EAE8E4]">
                    <MapPin className="w-4 h-4 text-[#E08A44] shrink-0" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-transparent text-[12px] text-[#2B1810] focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Option 2: Pickup in store */}
            <div
              onClick={() => setDeliveryType('pickup')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                deliveryType === 'pickup'
                  ? 'bg-white border-[#2B1810] shadow-sm ring-1 ring-[#2B1810]'
                  : 'bg-[#FBF9F5] border-[#EAE8E4]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl ${
                      deliveryType === 'pickup'
                        ? 'bg-[#2B1810] text-[#FDB882]'
                        : 'bg-[#EFEEEA] text-[#817470]'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-[13px] font-bold text-[#2B1810]">
                      Pick Up di Outlet Senopati
                    </h5>
                    <span className="text-[11px] text-[#817470]">
                      Dapatkan 4-Digit PIN untuk Barista
                    </span>
                  </div>
                </div>
                <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  GRATIS
                </span>
              </div>

              {deliveryType === 'pickup' && (
                <div className="mt-3 pt-3 border-t border-[#F5F3EF] text-[11px] text-[#4F4440]">
                  <strong>Lokasi Pengambilan:</strong>
                  <p className="mt-0.5 text-[#817470]">
                    Roastery Senopati Flagship, Jl. Senopati No. 42, Kebayoran Baru (Buka s/d 22:00 WIB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Final Summary Card */}
          <div className="bg-white rounded-2xl border border-[#EAE8E4] p-4 shadow-2xs space-y-2">
            <h4 className="font-serif text-[15px] font-bold text-[#2B1810] pb-2 border-b border-[#F5F3EF]">
              Rincian Pembayaran
            </h4>

            <div className="flex justify-between text-[12px] text-[#4F4440]">
              <span>Subtotal Produk</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-[12px] text-[#E08A44]">
                <span>Diskon Kupon</span>
                <span>- Rp {discount.toLocaleString('id-ID')}</span>
              </div>
            )}

            <div className="flex justify-between text-[12px] text-[#4F4440]">
              <span>Ongkos Kirim</span>
              <span>{shippingFee > 0 ? `Rp ${shippingFee.toLocaleString('id-ID')}` : 'Gratis'}</span>
            </div>

            <div className="pt-2 border-t border-[#F5F3EF] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#817470] tracking-wider uppercase block">
                  TOTAL PEMBAYARAN
                </span>
                <span className="font-serif text-[20px] font-bold text-[#2B1810]">
                  Rp {grandTotal.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                onClick={() => setShowQRIS(true)}
                className="flex items-center gap-2 bg-[#2B1810] hover:bg-[#1B1C1A] text-white px-5 py-3 rounded-xl font-bold text-[13px] shadow-sm transition-all cursor-pointer"
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
