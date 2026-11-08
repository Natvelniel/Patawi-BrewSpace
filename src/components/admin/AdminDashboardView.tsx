import React from 'react';
import { useStore } from '../../context/StoreContext';
import { RefreshCw } from 'lucide-react';
import { COFFEE_PRODUCTS } from '../../data/coffeeProducts';

export const AdminDashboardView: React.FC = () => {
  const { orders, advanceOrderStatus, setRole, showToast, adminTab } = useStore();

  return (
    <div className="pb-20 pt-3 px-4 bg-[#FAF7F2] min-h-full space-y-4 select-none">
      {/* Admin Header */}
      <div className="bg-[#26160F] text-white rounded-3xl p-5 shadow-md border border-[#3E2419]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#FDB882]">
              ROASTERY STATION ADMIN
            </span>
          </div>
          <button
            onClick={() => {
              setRole('customer');
              showToast('Kembali ke tampilan Customer');
            }}
            className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-[#D9CEC5] px-3 py-1 rounded-full transition-colors cursor-pointer"
          >
            Mode Customer &gt;
          </button>
        </div>

        <h3 className="font-serif text-[20px] font-bold text-white mt-2.5">
          Patawi Roastery Senopati
        </h3>
        <p className="text-xs text-[#D9CEC5] mt-0.5 leading-relaxed">
          Kelola antrean sangrai, penggilingan, dan serah terima barista/kurir.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-white/10 text-center">
          <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5">
            <span className="text-[10px] text-[#D9CEC5] block">Total Antrean</span>
            <span className="font-serif text-[17px] font-bold text-white">
              {orders.length} Batch
            </span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5">
            <span className="text-[10px] text-[#D9CEC5] block">Proses Sangrai</span>
            <span className="font-serif text-[17px] font-bold text-[#FDB882]">
              Aktif
            </span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5">
            <span className="text-[10px] text-[#D9CEC5] block">Suhu Drum</span>
            <span className="font-serif text-[17px] font-bold text-emerald-400">
              205°C
            </span>
          </div>
        </div>
      </div>

      {/* 1. TAB: ANTREAN PESANAN (QUEUE) */}
      {adminTab === 'queue' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-[17px] font-bold text-[#26160F]">
              Antrean Pesanan Masuk
            </h4>
            <span className="text-xs font-bold text-[#865225] bg-[#FDF3EB] px-2.5 py-0.5 rounded-full border border-[#FDB882]/40">
              {orders.length} Pesanan
            </span>
          </div>

          {orders.map((order) => {
            const currentStep = order.steps[order.currentStepIndex];
            const isComplete = order.currentStepIndex >= order.steps.length - 1;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-[#ECE4DA] p-4.5 depth-card shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-serif text-[16px] font-bold text-[#26160F] whitespace-nowrap">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[11px] text-[#75645C] block">
                      {order.type === 'delivery' ? 'GoSend Instant' : 'Pick Up Outlet'} • {order.date}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                      isComplete
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#FDF3EB] text-[#865225]'
                    }`}
                  >
                    {isComplete ? 'Selesai' : currentStep?.title || 'Sedang Diproses'}
                  </span>
                </div>

                {/* Items List */}
                <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#ECE4DA] space-y-1.5 text-xs">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-[#5C4D46]">
                      <span>
                        {it.quantity}x {it.product.name} ({it.weight})
                      </span>
                      <span className="font-semibold text-[#865225]">{it.grindLabel}</span>
                    </div>
                  ))}
                </div>

                {/* Progress CTA */}
                {!isComplete && (
                  <button
                    onClick={() => advanceOrderStatus(order.id)}
                    className="w-full flex items-center justify-center gap-2 bg-[#26160F] hover:bg-[#C86826] text-white py-3 rounded-2xl font-bold text-xs shadow-xs transition-colors cursor-pointer active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#FDB882]" />
                    Majukan Tahap: "{order.steps[order.currentStepIndex + 1]?.title || 'Selesai'}"
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 2. TAB: STOK BIJI KOPI (INVENTORY) */}
      {adminTab === 'inventory' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-[17px] font-bold text-[#26160F]">
              Inventaris Green & Roasted Beans
            </h4>
            <span className="text-xs text-[#75645C]">Outlet Senopati</span>
          </div>

          <div className="space-y-2.5">
            {COFFEE_PRODUCTS.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-[#ECE4DA] p-3.5 flex items-center justify-between depth-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#ECE4DA]">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-serif text-xs font-bold text-[#26160F] truncate max-w-[180px]">
                      {p.name}
                    </h5>
                    <span className="text-[10px] text-[#75645C] block">
                      {p.region} • {p.roastLevel}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#865225] bg-[#FDF3EB] px-2 py-0.5 rounded-md border border-[#FDB882]/30">
                    Stok: 24 kg
                  </span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">Aman</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TAB: LAPORAN ROASTERY (REPORTS) */}
      {adminTab === 'reports' && (
        <div className="space-y-3.5">
          <h4 className="font-serif text-[17px] font-bold text-[#26160F]">
            Laporan Operasional Roastery
          </h4>

          <div className="bg-white rounded-3xl border border-[#ECE4DA] p-5 depth-card space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">Mesin Roaster:</span>
              <strong className="text-[#26160F]">Probatone 5kg Artisan</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">Volume Sangrai Hari Ini:</span>
              <strong className="text-[#26160F]">18.5 kg (4 Batch)</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">Rerata Cupping Score Batch:</span>
              <strong className="text-[#C86826] font-bold">86.8 / 100</strong>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#75645C]">Efisiensi Gas & Aliran Udara:</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Optimal 98.4%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: PROFIL ROASTER (PROFILE) */}
      {adminTab === 'profile' && (
        <div className="space-y-3.5">
          <h4 className="font-serif text-[17px] font-bold text-[#26160F]">
            Profil Head Roaster
          </h4>

          <div className="bg-white rounded-3xl border border-[#ECE4DA] p-5 depth-card space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">Nama Roaster:</span>
              <strong className="text-[#26160F]">Budi Santoso</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">Jabatan:</span>
              <strong className="text-[#26160F]">Head Roaster & Q-Grader Terlisensi</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">Lokasi Station:</span>
              <strong className="text-[#26160F]">Patawi Senopati Flagship</strong>
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
    </div>
  );
};
