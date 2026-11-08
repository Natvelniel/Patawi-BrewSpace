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

  return (
    <div className="pb-20 pt-3 px-4 bg-[#FAF7F2] min-h-full space-y-4 select-none">
      {/* 1. Admin Roastery Header */}
      <div className="bg-[#26160F] text-white rounded-3xl p-5 shadow-md border border-[#3E2419]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#FDB882]">
              ROASTERY STATION ADMIN
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVoucherModal(true)}
              className="flex items-center gap-1 text-[11px] font-bold bg-[#C86826] hover:bg-[#9A4710] text-white px-2.5 py-1 rounded-full transition-colors cursor-pointer shadow-2xs"
            >
              <Tag className="w-3 h-3 text-[#FDB882]" /> Kelola Promo
            </button>
            <button
              onClick={() => {
                setRole('customer');
                showToast('Kembali ke tampilan Customer');
              }}
              className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-[#D9CEC5] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            >
              Mode Belanja &gt;
            </button>
          </div>
        </div>

        <h3 className="font-serif text-[20px] font-bold text-white mt-2.5">
          Patawi Roastery Senopati
        </h3>
        <p className="text-xs text-[#D9CEC5] mt-0.5 leading-relaxed">
          Stasiun manajemen biji kopi, sangrai, antrean produksi, dan dispatch DO.
        </p>

        {/* Quick Stats Top Bar */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-white/10 text-center">
          <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5">
            <span className="text-[10px] text-[#D9CEC5] block">Total Antrean</span>
            <span className="font-serif text-[17px] font-bold text-white">
              {orders.length} Batch
            </span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5">
            <span className="text-[10px] text-[#D9CEC5] block">Biji Kopi Aktif</span>
            <span className="font-serif text-[17px] font-bold text-[#FDB882]">
              {products.length} Varian
            </span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5">
            <span className="text-[10px] text-[#D9CEC5] block">Promo Aktif</span>
            <span className="font-serif text-[17px] font-bold text-emerald-400">
              {vouchers.filter((v) => v.isActive !== false).length} Kupon
            </span>
          </div>
        </div>
      </div>

      {/* 2. TAB: ANTREAN PESANAN (QUEUE) */}
      {adminTab === 'queue' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-serif text-[17px] font-bold text-[#26160F]">
                Antrean Produksi & Dispatch
              </h4>
              <span className="w-2 h-2 rounded-full bg-[#C86826]" />
            </div>
            <span className="text-xs font-bold text-[#865225] bg-[#FDF3EB] px-2.5 py-0.5 rounded-full border border-[#FDB882]/40">
              {orders.length} Pesanan
            </span>
          </div>

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
                className="bg-white rounded-3xl border border-[#ECE4DA] p-4.5 depth-card shadow-sm space-y-3"
              >
                {/* Header: Order Number, Customer, Payment Badge */}
                <div className="flex items-start justify-between gap-2 border-b border-[#F4EFE9] pb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif text-[16px] font-bold text-[#26160F] whitespace-nowrap">
                        #{order.orderNumber}
                      </span>
                      <span className="text-[10px] font-bold bg-[#EFE8E0] text-[#865225] px-2 py-0.5 rounded-md whitespace-nowrap">
                        {order.type === 'delivery' ? 'Pengantaran DO' : 'Pick Up Outlet'}
                      </span>
                      {currentStep && (
                        <span className="text-[10px] font-bold bg-[#FDF3EB] text-[#C86826] border border-[#FDB882]/40 px-2 py-0.5 rounded-md whitespace-nowrap">
                          {currentStep.title}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#75645C] block mt-0.5">
                      Pemesan: <strong className="text-[#26160F]">{order.customerInfo?.name || 'Nathaniel Christian'}</strong> ({order.customerInfo?.isGuest ? 'Tamu' : 'Member'})
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 block">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Lunas QRIS
                    </span>
                    <span className="text-[10px] text-[#75645C] block mt-0.5 font-medium">
                      Rp {order.total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#ECE4DA] space-y-1.5 text-xs">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[#5C4D46]">
                      <span className="truncate pr-2">
                        {it.quantity}x {it.product.name} ({it.weight})
                      </span>
                      <span className="font-semibold text-[#865225] whitespace-nowrap">
                        {it.grindLabel}
                      </span>
                    </div>
                  ))}
                  {order.address && (
                    <div className="pt-2 border-t border-[#ECE4DA] text-[10.5px] text-[#75645C]">
                      <strong>Tujuan:</strong> {order.address}
                    </div>
                  )}
                </div>

                {/* Action CTAs */}
                <div className="space-y-2 pt-1">
                  {/* EXPLICIT HANDOVER GATE BUTTON TO DO COURIER */}
                  {isReadyForHandover && (
                    <button
                      onClick={() => dispatchOrderToDelivery(order.id)}
                      className="w-full flex items-center justify-center gap-2 bg-[#C86826] hover:bg-[#9A4710] text-white py-3 rounded-2xl font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                    >
                      <Bike className="w-4 h-4 text-[#FDB882]" />
                      Serahkan ke Kurir DO (Siap Diantar) 🛵
                    </button>
                  )}

                  {!isComplete && !isReadyForHandover && (
                    <button
                      onClick={() => advanceOrderStatus(order.id)}
                      className="w-full flex items-center justify-center gap-2 bg-[#26160F] hover:bg-[#C86826] text-white py-2.5 rounded-2xl font-bold text-xs shadow-xs transition-colors cursor-pointer active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#FDB882]" />
                      Majukan Tahap: "{order.steps[order.currentStepIndex + 1]?.title || 'Selesai'}"
                    </button>
                  )}

                  {isComplete && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5">
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
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-serif text-[17px] font-bold text-[#26160F]">
                Inventaris Biji Kopi
              </h4>
              <p className="text-xs text-[#75645C]">
                Atur stok & harga jual katalog Patawi
              </p>
            </div>
            <button
              onClick={() => {
                setProductToEdit(null);
                setShowProductModal(true);
              }}
              className="flex items-center gap-1.5 bg-[#26160F] hover:bg-[#C86826] text-white px-3 py-2 rounded-2xl text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-[#FDB882]" /> Tambah Biji Kopi
            </button>
          </div>

          {/* Product Cards with Edit / Restock */}
          <div className="space-y-2.5">
            {products.map((p) => {
              const isLowStock = p.stock < 10;
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-[#ECE4DA] p-3.5 depth-card space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#ECE4DA]">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-serif text-xs font-bold text-[#26160F] truncate">
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
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-md border block ${
                          isLowStock
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-[#FDF3EB] text-[#865225] border-[#FDB882]/40'
                        }`}
                      >
                        Stok: {p.stock} kg
                      </span>
                      <span
                        className={`text-[9.5px] block mt-0.5 font-bold ${
                          isLowStock ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        {isLowStock ? 'Perlu Restock' : 'Aman'}
                      </span>
                    </div>
                  </div>

                  {/* Actions for each product */}
                  <div className="pt-2 border-t border-[#F4EFE9] flex items-center justify-between text-xs">
                    <button
                      onClick={() => updateProductStock(p.id, p.stock + 5)}
                      className="text-[11px] font-bold text-[#865225] hover:text-[#26160F] bg-[#FAF7F2] hover:bg-[#EFE8E0] px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-[#ECE4DA]"
                    >
                      +5 kg Restock
                    </button>

                    <button
                      onClick={() => {
                        setProductToEdit(p);
                        setShowProductModal(true);
                      }}
                      className="flex items-center gap-1 bg-[#26160F] hover:bg-[#C86826] text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                    >
                      <Edit3 className="w-3 h-3 text-[#FDB882]" /> Edit Harga & Stok
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
        <div className="space-y-3.5">
          {/* Sub-tab Toggle */}
          <div className="bg-[#EFE8E0]/70 p-1 rounded-2xl border border-[#ECE4DA] grid grid-cols-2 gap-1 text-xs">
            <button
              onClick={() => setReportsSubTab('financial')}
              className={`py-2 px-2 rounded-xl text-center font-bold transition-all cursor-pointer ${
                reportsSubTab === 'financial'
                  ? 'bg-[#26160F] text-white shadow-xs'
                  : 'text-[#5C4D46] hover:bg-white/50'
              }`}
            >
              Laporan Omzet & Penjualan
            </button>
            <button
              onClick={() => setReportsSubTab('operations')}
              className={`py-2 px-2 rounded-xl text-center font-bold transition-all cursor-pointer ${
                reportsSubTab === 'operations'
                  ? 'bg-[#26160F] text-white shadow-xs'
                  : 'text-[#5C4D46] hover:bg-white/50'
              }`}
            >
              Operasional Roasting
            </button>
          </div>

          {/* FINANCIAL REPORT VIEW */}
          {reportsSubTab === 'financial' && (
            <div className="space-y-3.5 animate-in fade-in">
              {/* Financial Metrics 3-Grid */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-3 rounded-2xl border border-[#ECE4DA] depth-card">
                  <span className="text-[10px] text-[#75645C] block">Total Omzet</span>
                  <span className="font-serif text-[15px] font-bold text-[#C86826] mt-0.5 block">
                    Rp {totalRevenue.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-[#ECE4DA] depth-card">
                  <span className="text-[10px] text-[#75645C] block">Pesanan Berhasil</span>
                  <span className="font-serif text-[15px] font-bold text-emerald-600 mt-0.5 block">
                    {completedOrdersCount} Selesai
                  </span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-[#ECE4DA] depth-card">
                  <span className="text-[10px] text-[#75645C] block">Rerata Pesanan</span>
                  <span className="font-serif text-[15px] font-bold text-[#26160F] mt-0.5 block">
                    Rp {aov.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Weekly Sales Chart (Craft Pure SVG) */}
              <div className="bg-white p-4.5 rounded-3xl border border-[#ECE4DA] depth-card space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-serif text-sm font-bold text-[#26160F]">
                      Tren Penjualan Mingguan
                    </h5>
                    <span className="text-[10.5px] text-[#75645C]">
                      Volume pemesanan biji kopi (Senin - Minggu)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    +18.4% MoM
                  </span>
                </div>

                {/* SVG Visual Bars */}
                <div className="pt-2">
                  <div className="h-28 flex items-end justify-between gap-2 px-2 pb-1 border-b border-[#ECE4DA]">
                    {[
                      { day: 'Sen', val: 40 },
                      { day: 'Sel', val: 65 },
                      { day: 'Rab', val: 50 },
                      { day: 'Kam', val: 85 },
                      { day: 'Jum', val: 95 },
                      { day: 'Sab', val: 100 },
                      { day: 'Min', val: 80 },
                    ].map((b, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                        <div
                          style={{ height: `${b.val}%` }}
                          className={`w-full max-w-[24px] rounded-t-md transition-all ${
                            idx === 5
                              ? 'bg-[#C86826] shadow-xs'
                              : 'bg-[#26160F]/80 group-hover:bg-[#C86826]'
                          }`}
                        />
                        <span className="text-[10px] text-[#75645C] font-semibold">{b.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Best Selling Coffee Leaderboard */}
              <div className="bg-white p-4 rounded-3xl border border-[#ECE4DA] depth-card space-y-2.5">
                <h5 className="font-serif text-sm font-bold text-[#26160F]">
                  Biji Kopi Terfavorit (Best Sellers)
                </h5>
                <div className="space-y-2 text-xs">
                  {products.slice(0, 3).map((p, idx) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#ECE4DA]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#26160F] text-[#FDB882] flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <div>
                          <strong className="text-[#26160F] block">{p.name}</strong>
                          <span className="text-[10px] text-[#75645C]">{p.region}</span>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-[#865225]">
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
            <div className="bg-white rounded-3xl border border-[#ECE4DA] p-5 depth-card space-y-3 text-xs animate-in fade-in">
              <div className="flex justify-between py-2 border-b border-[#F4EFE9]">
                <span className="text-[#75645C]">Mesin Roaster:</span>
                <strong className="text-[#26160F]">Probatone 5kg Artisan Drum</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F4EFE9]">
                <span className="text-[#75645C]">Volume Sangrai Hari Ini:</span>
                <strong className="text-[#26160F]">18.5 kg (4 Batch Selesai)</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F4EFE9]">
                <span className="text-[#75645C]">Rerata Cupping Score Batch:</span>
                <strong className="text-[#C86826] font-bold">86.8 / 100 Specialty</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F4EFE9]">
                <span className="text-[#75645C]">Suhu Roasting Saat Ini:</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  205°C (Stabil)
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#75645C]">Efisiensi Gas & Aliran Udara:</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  Optimal 98.4%
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. TAB: PROFIL ROASTER (PROFILE) */}
      {adminTab === 'profile' && (
        <div className="space-y-3.5">
          <h4 className="font-serif text-[17px] font-bold text-[#26160F]">
            Profil Head Roaster & Station
          </h4>

          <div className="bg-white rounded-3xl border border-[#ECE4DA] p-5 depth-card space-y-3 text-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-[#F4EFE9]">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#C86826] shrink-0 bg-[#FAF7F2] shadow-xs">
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
                  Head Roaster & Q-Grader Terlisensi
                </span>
                <span className="text-[10px] font-mono text-[#865225] block mt-0.5">
                  budi.roaster@patawibrew.com
                </span>
              </div>
            </div>

            <div className="flex justify-between py-2 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">Lokasi Station:</span>
              <strong className="text-[#26160F]">Patawi Senopati Flagship</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">Sertifikasi:</span>
              <strong className="text-[#26160F]">CQI Q Arabica Grader (2024 - 2027)</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">Total Batch Sangrai:</span>
              <strong className="text-[#C86826]">1.420 Batch</strong>
            </div>

            <button
              onClick={() => {
                setRole('customer');
                showToast('Beralih kembali ke mode Customer');
              }}
              className="w-full mt-2 bg-[#EFE8E0] hover:bg-[#E5DCD2] text-[#26160F] py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
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
