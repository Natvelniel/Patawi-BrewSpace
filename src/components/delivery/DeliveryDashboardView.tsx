import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Bike, Navigation, CheckCircle2 } from 'lucide-react';

export const DeliveryDashboardView: React.FC = () => {
  const { orders, advanceOrderStatus, setRole, showToast } = useStore();

  const deliveryOrders = orders.filter((o) => o.type === 'delivery');

  return (
    <div className="pb-32 pt-2 px-4 bg-[#FBF9F5] min-h-screen space-y-4">
      {/* Driver Header */}
      <div className="bg-[#865225] text-white rounded-3xl p-4.5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bike className="w-5 h-5 text-[#FDB882]" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#FDB882]">
              GOSEND MITRA KURIR
            </span>
          </div>
          <button
            onClick={() => {
              setRole('customer');
              showToast('Kembali ke tampilan Customer');
            }}
            className="text-[11px] font-bold bg-black/20 hover:bg-black/30 text-white px-3 py-1 rounded-full transition-colors"
          >
            Mode Customer &gt;
          </button>
        </div>

        <div className="flex items-center gap-3.5 mt-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-white">
            <img src="/assets/9e21e.png" alt="Driver" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-bold text-[16px]">Rian Hidayat</h3>
            <p className="text-[12px] text-[#FDE8D7]">
              Honda Vario Hitam • <strong>B 4521 SRX</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Active Deliveries */}
      <div className="space-y-3">
        <h4 className="font-serif text-[16px] font-bold text-[#2B1810]">
          Tugas Pengantaran Hari Ini
        </h4>

        {deliveryOrders.map((order) => {
          const currentStep = order.steps[order.currentStepIndex];
          const isFinished = order.currentStepIndex >= 5;

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
                    {order.items.length} Paket Biji Kopi
                  </span>
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isFinished
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-[#FDF3EB] text-[#865225]'
                  }`}
                >
                  {currentStep?.title || 'Pengantaran'}
                </span>
              </div>

              {/* Route */}
              <div className="bg-[#FBF9F5] p-3 rounded-xl border border-[#EAE8E4] space-y-2 text-[12px]">
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#817470] block">Pick-up (Outlet)</span>
                    <strong className="text-[#2B1810]">Roastery Senopati Flagship</strong>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E08A44] mt-1.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#817470] block">Drop-off (Pelanggan)</span>
                    <strong className="text-[#2B1810]">
                      Jl. Senopati No. 12, Kebayoran Baru, Jakarta Selatan
                    </strong>
                  </div>
                </div>
              </div>

              {!isFinished ? (
                <button
                  onClick={() => advanceOrderStatus(order.id)}
                  className="w-full flex items-center justify-center gap-2 bg-[#865225] hover:bg-[#78471b] text-white py-2.5 rounded-xl font-bold text-[12px] shadow-xs transition-colors cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-[#FDB882]" />
                  Simulasikan Update: "{order.steps[order.currentStepIndex + 1]?.title || 'Selesai Serah Terima'}"
                </button>
              ) : (
                <div className="flex items-center justify-center gap-1.5 text-emerald-700 bg-emerald-50 py-2 rounded-xl text-[12px] font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  Paket Kopi Berhasil Diterima Pelanggan
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
