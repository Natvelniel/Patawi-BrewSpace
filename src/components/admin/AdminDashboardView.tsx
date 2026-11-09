import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { CoffeeProduct } from '../../types';
import {
  RefreshCw,
  Plus,
  Tag,
  Edit3,
  CheckCircle2,
  Bike,
  Sparkles,
  Flame,
  Package,
  MapPin,
  Phone,
} from 'lucide-react';
import { ProductManagementModal } from './ProductManagementModal';
import { VoucherManagementModal } from './VoucherManagementModal';

export const AdminDashboardView: React.FC = () => {
  const {
    orders,
    advanceOrderStatus,
    dispatchOrderToDelivery,
    setRole,
    showToast,
    adminTab,
    products,
    updateProductStock,
    vouchers,
    currentUser,
  } = useStore();

  const [showProductModal, setShowProductModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState<CoffeeProduct | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [reportsSubTab, setReportsSubTab] = useState<'financial' | 'operations'>('financial');

  // Financial calculations
  const totalRevenue = useMemo(() => {
    return orders.reduce((acc, o) => acc + o.total, 0);
  }, [orders]);

  const completedOrdersCount = useMemo(() => {
    return orders.filter((o) => o.currentStepIndex >= 5).length;
  }, [orders]);

  const aov = useMemo(() => {
    return orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  }, [orders, totalRevenue]);

  const totalStockKg = useMemo(() => {
    return products.reduce((acc, p) => acc + p.stock, 0);
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stock < 10).length;
  }, [products]);

  return (
    <div className="pb-24 pt-3 px-4 bg-[#FAF7F2] min-h-full space-y-4 select-none font-sans">
      {/* 1. Admin Roastery Header */}
      <div className="depth-card-dark rim-light-dark text-white rounded-3xl p-5 border border-[#382015] shadow-warm-card-dark">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#FDB882]">
              ROASTERY STATION ADMIN
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVoucherModal(true)}
              className="min-h-[44px] flex items-center gap-1.5 text-xs font-bold bg-[#C86826] hover:bg-[#D47A33] text-white px-3.5 py-2 rounded-full transition-colors cursor-pointer shadow-xs border border-[#E08A44]/40"
            >
              <Tag className="w-3.5 h-3.5 text-[#FDB882]" /> Kelola Promo
            </button>
            <button
              onClick={() => {
                setRole('customer');
                showToast('Kembali ke tampilan Customer');
              }}
              className="min-h-[44px] flex items-center text-xs font-semibold bg-white/10 hover:bg-white/20 text-[#D9CEC5] px-3.5 py-2 rounded-full transition-colors cursor-pointer border border-white/10"
            >
              Mode Belanja &gt;
            </button>
          </div>
        </div>

        <h3 className="font-serif text-[22px] font-bold text-white mt-3">
          Patawi Roastery Senopati
        </h3>
        <p className="text-xs text-[#D9CEC5] mt-1 leading-relaxed">
          Stasiun sangrai artisanal, manajemen antrean batch, kurasi green bean, dan gerbang serah terima kurir DO.
        </p>

        {/* Quick Stats Top Bar */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-white/10 text-center">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-[#D9CEC5] block font-medium">Total Antrean</span>
            <span className="font-serif text-[17px] font-bold text-white mt-0.5 block">
              {orders.length} Batch
            </span>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-[#D9CEC5] block font-medium">Biji Kopi Aktif</span>
            <span className="font-serif text-[17px] font-bold text-[#FDB882] mt-0.5 block">
              {products.length} Varian
            </span>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-[#D9CEC5] block font-medium">Promo Aktif</span>
            <span className="font-serif text-[17px] font-bold text-emerald-400 mt-0.5 block">
              {vouchers.filter((v) => v.isActive !== false).length} Kupon
            </span>
          </div>
        </div>
      </div>

      {/* 2. TAB: ANTREAN PESANAN (QUEUE) */}
      {adminTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-serif text-[18px] font-bold text-[#26160F]">
                Antrean Produksi & Handover Kurir
              </h4>
              <span className="w-2 h-2 rounded-full bg-[#C86826]" />
            </div>
            <span className="text-xs font-bold text-[#865225] bg-[#FDF3EB] px-3 py-1 rounded-full border border-[#FDB882]/40">
              {orders.length} Pesanan
            </span>
          </div>

          {orders.length === 0 && (
            <div className="depth-card rim-light bg-white rounded-3xl p-8 border border-[#ECE4DA] text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto opacity-80" />
              <h4 className="font-serif text-base font-bold text-[#26160F]">
                Tidak Ada Antrean Produksi Aktif
              </h4>
              <p className="text-xs text-[#75645C] max-w-xs mx-auto">
                Semua pesanan batch telah selesai diproses atau diserahkan ke kurir. Menunggu pesanan baru dari pelanggan.
              </p>
            </div>
          )}

          {orders.map((order) => {
            const currentStep = order.steps[order.currentStepIndex];
            const isComplete = order.currentStepIndex >= order.steps.length - 1;
            const isReadyForHandover =
              order.type === 'delivery' &&
              order.currentStepIndex >= 2 &&
              !order.readyForDelivery;

            return (
              <div
                key={order.id}
                className="depth-card rim-light bg-white rounded-3xl border border-[#ECE4DA] p-5 shadow-warm-card space-y-4"
              >
                {/* Header: Order Number, Customer, Payment Badge */}
                <div className="flex items-start justify-between gap-2 border-b border-[#F4EFE9] pb-3.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif text-[17px] font-bold text-[#26160F] whitespace-nowrap">
                        #{order.orderNumber}
                      </span>
                      <span className="text-[10px] font-bold bg-[#EFE8E0] text-[#865225] px-2.5 py-0.5 rounded-md whitespace-nowrap">
                        {order.type === 'delivery' ? 'Pengantaran DO (GoSend)' : 'Pick Up Outlet Senopati'}
                      </span>
                      {currentStep && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#FDF3EB] text-[#C86826] border border-[#FDB882]/40 px-2.5 py-0.5 rounded-md whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C86826] animate-pulse" />
                          {currentStep.title}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#75645C] mt-1 space-y-0.5">
                      <div>
                        Pemesan: <strong className="text-[#26160F]">{order.customerInfo?.name || 'Nathaniel Christian'}</strong>{' '}
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FAF7F2] border border-[#ECE4DA] text-[#865225] font-semibold">
                          {order.customerInfo?.isGuest ? 'Tamu' : 'VIP Member'}
                        </span>
                      </div>
                      {order.customerInfo?.phone && (
                        <div className="text-[10.5px] text-[#75645C] flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#865225]" />
                          <span>{order.customerInfo.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 block shadow-2xs">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Lunas QRIS
                    </span>
                    <span className="font-serif text-[14px] font-bold text-[#26160F] block mt-1">
                      Rp {order.total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Items List (Roastery Bill of Materials) */}
                <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#ECE4DA] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#865225] border-b border-[#ECE4DA] pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-[#C86826]" /> Rincian Paket Biji Kopi
                    </span>
                    <span>{order.items.length} Item</span>
                  </div>

                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[#5C4D46] pt-1">
                      <div className="min-w-0 pr-2">
                        <span className="font-semibold text-[#26160F] block truncate">
                          {it.quantity}x {it.product.name}
                        </span>
                        <span className="text-[10px] text-[#75645C] block">
                          Kemasan: {it.weight} • Gilingan: <strong className="text-[#865225]">{it.grindLabel}</strong>
                        </span>
                        {it.notes && (
                          <span className="text-[9.5px] text-[#865225] italic block">
                            Catatan: {it.notes}
                          </span>
                        )}
                      </div>
                      <span className="font-serif font-bold text-[#865225] whitespace-nowrap text-xs">
                        Rp {(it.price * it.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}

                  {order.address && (
                    <div className="pt-2.5 border-t border-[#ECE4DA] text-[11px] text-[#75645C] flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C86826] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#26160F]">Alamat Tujuan:</strong> {order.address}
                      </div>
                    </div>
                  )}
                </div>

                {/* Production Stage Progress Indicator */}
                <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#ECE4DA]">
                  <div className="flex items-center justify-between text-[10.5px] text-[#75645C] font-semibold mb-2">
                    <span>Progres Tahap Produksi ({order.currentStepIndex + 1}/6)</span>
                    <span className="text-[#C86826] font-bold">{currentStep?.title || 'Menunggu'}</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {order.steps.map((st, sIdx) => {
                      const isPast = sIdx < order.currentStepIndex;
                      const isCurr = sIdx === order.currentStepIndex;
                      return (
                        <div
                          key={st.id}
                          className={`h-2 rounded-full transition-all ${
                            isPast
                              ? 'bg-[#C86826]'
                              : isCurr
                              ? 'bg-[#FDB882] ring-2 ring-[#C86826]'
                              : 'bg-[#ECE4DA]'
                          }`}
                          title={`Tahap ${st.id}: ${st.title}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="space-y-2 pt-1">
                  {/* EXPLICIT HANDOVER GATE BUTTON TO DO COURIER */}
                  {isReadyForHandover && (
                    <div className="space-y-1.5">
                      <button
                        onClick={() => {
                          dispatchOrderToDelivery(order.id);
                          showToast(`Pesanan #${order.orderNumber} berhasil diserahkan ke Kurir DO!`);
                        }}
                        className="min-h-[48px] w-full flex items-center justify-center gap-2.5 bg-[#C86826] hover:bg-[#D47A33] text-white py-3 px-4 rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer active:scale-[0.98] border border-[#E08A44]/40"
                      >
                        <Bike className="w-4 h-4 text-[#FDB882]" />
                        Serahkan ke Kurir DO (Siap Diantar) 🛵
                      </button>
                      <p className="text-[10px] text-center text-[#75645C]">
                        Biji kopi telah disangrai dan dikemas. Klik untuk mengaktifkan tugas jemput kurir DO.
                      </p>
                    </div>
                  )}

                  {!isComplete && !isReadyForHandover && (
                    <button
                      onClick={() => {
                        advanceOrderStatus(order.id);
                        showToast(`Tahap produksi pesanan #${order.orderNumber} dimajukan.`);
                      }}
                      className="min-h-[46px] w-full flex items-center justify-center gap-2 bg-[#26160F] hover:bg-[#382015] text-[#FDB882] py-3 px-4 rounded-2xl font-bold text-xs shadow-xs transition-colors cursor-pointer active:scale-[0.98] border border-[#382015]"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#FDB882]" />
                      Majukan Tahap: "{order.steps[order.currentStepIndex + 1]?.title || 'Selesai'}"
                    </button>
                  )}

                  {isComplete && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl text-center text-xs font-bold flex items-center justify-center gap-2 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Pesanan Telah Selesai Diterima Pelanggan
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. TAB: STOK & INVENTARIS PRODUK (INVENTORY) */}
      {adminTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <h4 className="font-serif text-[18px] font-bold text-[#26160F]">
                Inventaris Biji Kopi & Green Bean Batches
              </h4>
              <p className="text-xs text-[#75645C]">
                Atur stok green bean, jadwal sangrai, dan harga jual katalog Patawi
              </p>
            </div>
            <button
              onClick={() => {
                setProductToEdit(null);
                setShowProductModal(true);
              }}
              className="min-h-[44px] flex items-center gap-1.5 bg-[#26160F] hover:bg-[#C86826] text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-[0.98] border border-[#382015]"
            >
              <Plus className="w-3.5 h-3.5 text-[#FDB882]" /> Tambah Biji Kopi
            </button>
          </div>

          {/* Stock Overview Telemetry Pill */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="depth-card rim-light bg-white p-3 rounded-2xl border border-[#ECE4DA]">
              <span className="text-[10px] text-[#75645C] block font-medium">Total Stok Biji</span>
              <span className="font-serif text-[15px] font-bold text-[#26160F] mt-0.5 block">
                {totalStockKg.toFixed(1)} kg
              </span>
            </div>
            <div className="depth-card rim-light bg-white p-3 rounded-2xl border border-[#ECE4DA]">
              <span className="text-[10px] text-[#75645C] block font-medium">Status Stok Rendah</span>
              <span
                className={`font-serif text-[13px] font-bold mt-0.5 block ${
                  lowStockCount > 0 ? 'text-amber-700' : 'text-emerald-700'
                }`}
              >
                {lowStockCount > 0 ? `${lowStockCount} Lot Restock` : 'Semua Lot Aman'}
              </span>
            </div>
            <div className="depth-card rim-light bg-white p-3 rounded-2xl border border-[#ECE4DA]">
              <span className="text-[10px] text-[#75645C] block font-medium">Rerata Cupping</span>
              <span className="font-serif text-[15px] font-bold text-[#C86826] mt-0.5 block">
                86.8 SCA
              </span>
            </div>
          </div>

          {/* Product Cards with Edit / Restock */}
          <div className="space-y-3">
            {products.map((p) => {
              const isLowStock = p.stock < 10;
              return (
                <div
                  key={p.id}
                  className="depth-card rim-light bg-white rounded-2xl border border-[#ECE4DA] p-4 shadow-warm-card space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#ECE4DA] shadow-2xs">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-serif text-[14px] font-bold text-[#26160F] truncate">
                          {p.name}
                        </h5>
                        <span className="text-[10.5px] text-[#75645C] block">
                          {p.region} • {p.roastLevel} • {p.process}
                        </span>
                        <span className="font-serif text-xs font-bold text-[#C86826] block mt-0.5">
                          Rp {p.basePrice.toLocaleString('id-ID')} / 200g
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-md border block shadow-2xs ${
                          isLowStock
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-[#FDF3EB] text-[#865225] border-[#FDB882]/40'
                        }`}
                      >
                        Stok: {p.stock} kg
                      </span>
                      <span
                        className={`text-[10px] block mt-1 font-bold ${
                          isLowStock ? 'text-amber-700' : 'text-emerald-700'
                        }`}
                      >
                        {isLowStock ? 'Perlu Restock' : 'Aman'}
                      </span>
                    </div>
                  </div>

                  {/* Flavor Notes & Batch Telemetry */}
                  <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#ECE4DA] flex items-center justify-between text-[11px] text-[#75645C] flex-wrap gap-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[#865225] font-semibold">Tasting:</span>
                      <span>{p.flavorNotes.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-[#865225]">
                      <span>SCA: {p.scores?.cuppingScore || 86.5}</span>
                      <span>•</span>
                      <span>{p.roastDate || 'Sangrai: Baru'}</span>
                    </div>
                  </div>

                  {/* Actions for each product */}
                  <div className="pt-2 border-t border-[#F4EFE9] flex items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => {
                        updateProductStock(p.id, p.stock + 5);
                        showToast(`Stok ${p.name} ditambah +5 kg.`);
                      }}
                      className="min-h-[44px] flex items-center gap-1 text-[11px] font-bold text-[#865225] hover:text-[#26160F] bg-[#FAF7F2] hover:bg-[#EFE8E0] px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-[#ECE4DA]"
                    >
                      +5 kg Restock
                    </button>

                    <button
                      onClick={() => {
                        setProductToEdit(p);
                        setShowProductModal(true);
                      }}
                      className="min-h-[44px] flex items-center gap-1.5 bg-[#26160F] hover:bg-[#C86826] text-white text-[11px] font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-2xs border border-[#382015]"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#FDB882]" /> Edit Harga & Stok
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TAB: LAPORAN PENJUALAN & OPERASIONAL (REPORTS) */}
      {adminTab === 'reports' && (
        <div className="space-y-4">
          {/* Sub-tab Toggle */}
          <div className="bg-[#EFE8E0]/70 p-1 rounded-2xl border border-[#ECE4DA] grid grid-cols-2 gap-1 text-xs">
            <button
              onClick={() => setReportsSubTab('financial')}
              className={`min-h-[44px] py-2 px-3 rounded-xl text-center font-bold transition-all cursor-pointer ${
                reportsSubTab === 'financial'
                  ? 'bg-[#26160F] text-white shadow-xs border border-[#382015]'
                  : 'text-[#5C4D46] hover:bg-white/50'
              }`}
            >
              Laporan Omzet & Penjualan
            </button>
            <button
              onClick={() => setReportsSubTab('operations')}
              className={`min-h-[44px] py-2 px-3 rounded-xl text-center font-bold transition-all cursor-pointer ${
                reportsSubTab === 'operations'
                  ? 'bg-[#26160F] text-white shadow-xs border border-[#382015]'
                  : 'text-[#5C4D46] hover:bg-white/50'
              }`}
            >
              Operasional Roasting
            </button>
          </div>

          {/* FINANCIAL REPORT VIEW */}
          {reportsSubTab === 'financial' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Financial Metrics 3-Grid */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="depth-card rim-light bg-white p-3 rounded-2xl border border-[#ECE4DA] shadow-warm-card">
                  <span className="text-[10px] text-[#75645C] block font-medium">Total Omzet</span>
                  <span className="font-serif text-[15px] font-bold text-[#C86826] mt-0.5 block truncate">
                    Rp {totalRevenue.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="depth-card rim-light bg-white p-3 rounded-2xl border border-[#ECE4DA] shadow-warm-card">
                  <span className="text-[10px] text-[#75645C] block font-medium">Pesanan Berhasil</span>
                  <span className="font-serif text-[15px] font-bold text-emerald-700 mt-0.5 block">
                    {completedOrdersCount} Selesai
                  </span>
                </div>
                <div className="depth-card rim-light bg-white p-3 rounded-2xl border border-[#ECE4DA] shadow-warm-card">
                  <span className="text-[10px] text-[#75645C] block font-medium">Rerata Pesanan</span>
                  <span className="font-serif text-[15px] font-bold text-[#26160F] mt-0.5 block truncate">
                    Rp {aov.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Roastery Profit Margin Telemetry */}
              <div className="depth-card rim-light bg-white p-4 rounded-2xl border border-[#ECE4DA] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#75645C] font-semibold block uppercase tracking-wider">
                    Estimasi Margin Kotor Batch Sangrai
                  </span>
                  <strong className="font-serif text-base text-[#865225] block mt-0.5">
                    64.2% Gross Roastery Margin
                  </strong>
                </div>
                <div className="text-right text-[11px] text-[#75645C]">
                  <span>Biaya Green Bean: Rp 55rb/kg</span>
                  <span className="block text-[#C86826] font-bold">Rendemen: 84.8%</span>
                </div>
              </div>

              {/* Weekly Sales Chart (Craft Pure SVG) */}
              <div className="depth-card rim-light bg-white p-5 rounded-3xl border border-[#ECE4DA] shadow-warm-card space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-serif text-sm font-bold text-[#26160F]">
                      Tren Penjualan Mingguan
                    </h5>
                    <span className="text-[10.5px] text-[#75645C]">
                      Volume pemesanan biji kopi (Senin - Minggu)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    +18.4% MoM
                  </span>
                </div>

                {/* SVG Visual Bars */}
                <div className="pt-2">
                  <div className="h-32 flex items-end justify-between gap-2 px-2 pb-1 border-b border-[#ECE4DA]">
                    {[
                      { day: 'Sen', val: 40, amt: '400k' },
                      { day: 'Sel', val: 65, amt: '650k' },
                      { day: 'Rab', val: 50, amt: '500k' },
                      { day: 'Kam', val: 85, amt: '850k' },
                      { day: 'Jum', val: 95, amt: '950k' },
                      { day: 'Sab', val: 100, amt: '1.2M' },
                      { day: 'Min', val: 80, amt: '800k' },
                    ].map((b, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                        <span className="text-[9px] text-[#75645C] opacity-0 group-hover:opacity-100 transition-opacity">
                          {b.amt}
                        </span>
                        <div
                          style={{ height: `${b.val}%` }}
                          className={`w-full max-w-[26px] rounded-t-md transition-all ${
                            idx === 5
                              ? 'bg-[#C86826] shadow-xs'
                              : 'bg-[#26160F]/85 group-hover:bg-[#C86826]'
                          }`}
                        />
                        <span className="text-[10px] text-[#75645C] font-semibold">{b.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Best Selling Coffee Leaderboard */}
              <div className="depth-card rim-light bg-white p-5 rounded-3xl border border-[#ECE4DA] shadow-warm-card space-y-3">
                <h5 className="font-serif text-sm font-bold text-[#26160F]">
                  Biji Kopi Terfavorit (Best Sellers)
                </h5>
                <div className="space-y-2 text-xs">
                  {products.slice(0, 3).map((p, idx) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] border border-[#ECE4DA]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-[#26160F] text-[#FDB882] flex items-center justify-center font-bold text-[11px] shadow-2xs">
                          {idx + 1}
                        </span>
                        <div>
                          <strong className="text-[#26160F] block text-xs">{p.name}</strong>
                          <span className="text-[10.5px] text-[#75645C]">
                            {p.region} • Cupping {p.scores?.cuppingScore || 86.5}
                          </span>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-[#865225] text-xs">
                        {28 - idx * 6} Terjual
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OPERATIONS REPORT VIEW */}
          {reportsSubTab === 'operations' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="depth-card rim-light bg-white rounded-3xl border border-[#ECE4DA] p-5 shadow-warm-card space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#F4EFE9]">
                  <span className="text-[#75645C] flex items-center gap-1.5 font-medium">
                    <Flame className="w-3.5 h-3.5 text-[#C86826]" /> Mesin Roaster:
                  </span>
                  <strong className="text-[#26160F]">Probatone 5kg Artisan Drum</strong>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#F4EFE9]">
                  <span className="text-[#75645C]">Volume Sangrai Hari Ini:</span>
                  <strong className="text-[#26160F]">18.5 kg (4 Batch Selesai)</strong>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#F4EFE9]">
                  <span className="text-[#75645C]">Rerata Cupping Score Batch:</span>
                  <strong className="text-[#C86826] font-bold font-serif">86.8 / 100 Specialty</strong>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#F4EFE9]">
                  <span className="text-[#75645C]">Suhu Roasting Saat Ini:</span>
                  <span className="text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    205°C (Stabil)
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#F4EFE9]">
                  <span className="text-[#75645C]">Efisiensi Gas & Aliran Udara:</span>
                  <span className="text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    Optimal 98.4%
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[#75645C]">Yield Rendemen Sangrai:</span>
                  <strong className="text-[#865225]">84.8% (Weight loss 15.2% pada First Crack)</strong>
                </div>
              </div>

              {/* Roasting Drum Temperature Curve (Artisanal SVG Telemetry) */}
              <div className="depth-card rim-light bg-white rounded-3xl border border-[#ECE4DA] p-5 shadow-warm-card space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-serif text-sm font-bold text-[#26160F]">
                      Kurva Profil Suhu Sangrai (Roast Curve)
                    </h5>
                    <span className="text-[10.5px] text-[#75645C]">
                      Telemetri Probatone 5kg Artisan: Charge ke Drop
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#865225] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#ECE4DA]">
                    Batch #RST-04
                  </span>
                </div>

                {/* SVG Curve Graphic */}
                <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#ECE4DA]">
                  <svg viewBox="0 0 320 120" className="w-full h-28 overflow-visible">
                    <line x1="20" y1="100" x2="300" y2="100" stroke="#ECE4DA" strokeWidth="1" />
                    <line x1="20" y1="60" x2="300" y2="60" stroke="#ECE4DA" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="20" y1="20" x2="300" y2="20" stroke="#ECE4DA" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Roast curve path */}
                    <path
                      d="M 20 50 Q 50 110 80 90 T 150 65 T 230 35 T 295 20"
                      fill="none"
                      stroke="#C86826"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Milestones markers */}
                    <circle cx="20" cy="50" r="3.5" fill="#26160F" />
                    <text x="20" y="42" fontSize="7" fill="#75645C" textAnchor="middle">180°C</text>

                    <circle cx="80" cy="90" r="3.5" fill="#865225" />
                    <text x="80" y="105" fontSize="7" fill="#75645C" textAnchor="middle">TP 92°C</text>

                    <circle cx="150" cy="65" r="3.5" fill="#C86826" />
                    <text x="150" y="58" fontSize="7" fill="#75645C" textAnchor="middle">Yellow 150°C</text>

                    <circle cx="230" cy="35" r="3.5" fill="#D47A33" />
                    <text x="230" y="28" fontSize="7" fill="#75645C" textAnchor="middle">FC 198°C</text>

                    <circle cx="295" cy="20" r="4" fill="#10B981" />
                    <text x="295" y="14" fontSize="7" fill="#047857" fontWeight="bold" textAnchor="middle">Drop 205°C</text>
                  </svg>
                  <div className="flex justify-between text-[9.5px] text-[#75645C] mt-2 pt-1 border-t border-[#ECE4DA] font-mono">
                    <span>Charge: 00:00</span>
                    <span>Turning: 01:20</span>
                    <span>Yellowing: 04:30</span>
                    <span>First Crack: 09:15</span>
                    <span>Drop: 11:30</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. TAB: PROFIL ROASTER (PROFILE) */}
      {adminTab === 'profile' && (
        <div className="space-y-4">
          <h4 className="font-serif text-[18px] font-bold text-[#26160F]">
            Profil Head Roaster & Station
          </h4>

          <div className="depth-card rim-light bg-white rounded-3xl border border-[#ECE4DA] p-5 shadow-warm-card space-y-4 text-xs">
            <div className="flex items-center gap-3.5 pb-3.5 border-b border-[#F4EFE9]">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#C86826] shrink-0 bg-[#FAF7F2] shadow-xs">
                <img
                  src={currentUser?.role === 'admin' ? currentUser.avatar : '/assets/9e21e.png'}
                  alt="Head Roaster Budi Santoso"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/9e21e.png';
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif text-base font-bold text-[#26160F]">
                    Budi Santoso
                  </h4>
                  <Sparkles className="w-3.5 h-3.5 text-[#C86826]" />
                </div>
                <span className="text-[11px] text-[#75645C] block">
                  Head Roaster & Q Arabica Grader Terlisensi
                </span>
                <span className="text-[10px] font-mono text-[#865225] block mt-0.5">
                  budi.roaster@patawibrew.com
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">Lokasi Station:</span>
              <strong className="text-[#26160F]">Patawi Senopati Flagship, Jakarta Selatan</strong>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">Sertifikasi Kredensial:</span>
              <strong className="text-[#26160F]">CQI Q Arabica Grader (2024 - 2027)</strong>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">Total Batch Sangrai:</span>
              <strong className="text-[#C86826] font-bold font-serif">1.420 Batch</strong>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">Laboratorium Sensoris:</span>
              <strong className="text-[#26160F]">SCA Standard Cupping Lab</strong>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">Filosofi Sangrai:</span>
              <span className="text-[11px] text-[#5C4D46] text-right max-w-[210px]">
                Menonjolkan karakter terroir dan acidity bersih tanpa cacat baking.
              </span>
            </div>

            <button
              onClick={() => {
                setRole('customer');
                showToast('Beralih kembali ke mode Customer');
              }}
              className="min-h-[44px] w-full mt-2 bg-[#EFE8E0] hover:bg-[#E5DCD2] text-[#26160F] py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer border border-[#ECE4DA]"
            >
              Kembali ke Tampilan Pelanggan
            </button>
          </div>
        </div>
      )}

      {/* Global Admin Modals */}
      {showProductModal && (
        <ProductManagementModal
          productToEdit={productToEdit}
          onClose={() => {
            setShowProductModal(false);
            setProductToEdit(null);
          }}
        />
      )}

      {showVoucherModal && (
        <VoucherManagementModal onClose={() => setShowVoucherModal(false)} />
      )}
    </div>
  );
};
