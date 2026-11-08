import React from 'react';
import { useStore } from '../../context/StoreContext';
import { RefreshCw } from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { orders, advanceOrderStatus, setRole, showToast } = useStore();

  return (
    <div className="pb-32 pt-2 px-4 bg-[#FBF9F5] min-h-screen space-y-4">
      {/* Admin Header */}
      <div className="bg-[#2B1810] text-white rounded-3xl p-4.5 shadow-md">
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
            className="text-[11px] font-bold bg-white/10 hover:bg-white/20 text-[#D3C3BE] px-3 py-1 rounded-full transition-colors"
          >
            Mode Customer &gt;
          </button>
        </div>

        <h3 className="font-serif text-[20px] font-bold text-white mt-2">
          Patawi Roastery Senopati
        </h3>
        <p className="text-[12px] text-[#D3C3BE] mt-0.5">
          Kelola antrean sangrai, penggilingan, dan serah terima barista/kurir.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
          <div className="bg-white/5 p-2 rounded-xl">
            <span className="text-[10px] text-[#D3C3BE] block">Total Antrean</span>
            <span className="font-serif text-[16px] font-bold text-white">
              {orders.length} Batch
            </span>
          </div>
          <div className="bg-white/5 p-2 rounded-xl">
            <span className="text-[10px] text-[#D3C3BE] block">Proses Sangrai</span>
            <span className="font-serif text-[16px] font-bold text-[#FDB882]">
              Aktif
            </span>
          </div>
          <div className="bg-white/5 p-2 rounded-xl">
            <span className="text-[10px] text-[#D3C3BE] block">Suhu Drum Roaster</span>
            <span className="font-serif text-[16px] font-bold text-emerald-400">
              205°C
            </span>
          </div>
        </div>
      </div>

      {/* Orders Queue */}
      <div className="space-y-3">
        <h4 className="font-serif text-[16px] font-bold text-[#2B1810]">
          Antrean Pesanan Masuk
        </h4>

        {orders.map((order) => {
          const currentStep = order.steps[order.currentStepIndex];
          const isComplete = order.currentStepIndex >= order.steps.length - 1;

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-[#EAE8E4] p-4 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-serif text-[15px] font-bold text-[#2B1810]">
                    #{order.orderNumber}
                  </span>
                  <span className="text-[11px] text-[#817470] block">
                    {order.type === 'delivery' ? 'GoSend Instant' : 'Pick Up Outlet'} • {order.date}
                  </span>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isComplete
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-[#FDF3EB] text-[#865225]'
                  }`}
                >
                  {isComplete ? 'Selesai' : currentStep?.title || 'Sedang Diproses'}
                </span>
              </div>

              {/* Items List */}
              <div className="bg-[#FBF9F5] p-2.5 rounded-xl border border-[#EAE8E4] space-y-1 text-[12px]">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[#4F4440]">
                    <span>
                      {it.quantity}x {it.product.name} ({it.weight})
                    </span>
                    <span className="font-medium text-[#865225]">{it.grindLabel}</span>
                  </div>
                ))}
              </div>

              {/* Progress CTA */}
              {!isComplete && (
                <button
                  onClick={() => advanceOrderStatus(order.id)}
                  className="w-full flex items-center justify-center gap-2 bg-[#2B1810] hover:bg-[#1B1C1A] text-white py-2.5 rounded-xl font-bold text-[12px] shadow-xs transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#FDB882]" />
                  Majukan Tahap: "{order.steps[order.currentStepIndex + 1]?.title || 'Selesai'}"
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
