import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Bike,
  Navigation,
  CheckCircle2,
  Phone,
  MessageSquare,
  Star,
  ShieldCheck,
} from 'lucide-react';

export const DeliveryDashboardView: React.FC = () => {
  const { orders, advanceOrderStatus, setRole, showToast, deliveryTab } = useStore();

  const deliveryOrders = orders.filter((o) => o.type === 'delivery');
  const activeOrders = deliveryOrders.filter((o) => o.currentStepIndex < 5);

  return (
    <div className="pb-20 pt-3 px-4 bg-[#FAF7F2] min-h-full space-y-4 select-none">
      {/* 1. Driver Profile & Live Dispatch Header */}
      <div className="bg-gradient-to-br from-[#2D1A12] via-[#24130C] to-[#1A0D07] text-white rounded-3xl p-5 shadow-md border border-[#3E2419]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#C86826]/30 border border-[#C86826]/50 flex items-center justify-center text-[#FDB882]">
              <Bike className="w-4 h-4" />
            </div>
            <span className="text-[10.5px] font-bold tracking-wider uppercase text-[#FDB882]">
              GOSEND MITRA KURIR
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Siap Antar
            </span>
            <button
              onClick={() => {
                setRole('customer');
                showToast('Kembali ke tampilan Customer');
              }}
              className="text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-[#D9CEC5] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            >
              Mode Belanja &gt;
            </button>
          </div>
        </div>

        {/* Courier Details */}
        <div className="flex items-center gap-3.5 mt-3.5">
          <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-[#C86826] bg-[#FAF7F2] shrink-0 shadow-xs">
            <img src="/assets/9e21e.png" alt="Driver Rian" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif text-[17px] font-bold text-white leading-tight">
                Rian Hidayat
              </h3>
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
            <div className="flex items-center gap-2 text-xs text-[#D9CEC5] mt-1 flex-wrap">
              <span className="font-mono font-bold text-[#26160F] bg-white px-2 py-0.2 rounded text-[10.5px] shadow-2xs">
                B 4521 SRX
              </span>
              <span className="text-[#FDB882] text-[11px] font-medium">Honda Vario 160 Hitam</span>
            </div>
          </div>
        </div>

        {/* Driver 3-Grid Daily Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-white/10 text-center">
          <div className="bg-white/5 p-2 rounded-2xl border border-white/5">
            <span className="text-[10px] text-[#D9CEC5] block font-medium">Tugas Hari Ini</span>
            <span className="font-serif text-[15px] font-bold text-white mt-0.5 block">
              2 Selesai
            </span>
          </div>
          <div className="bg-white/5 p-2 rounded-2xl border border-white/5">
            <span className="text-[10px] text-[#D9CEC5] block font-medium">Tepat Waktu</span>
            <span className="font-serif text-[15px] font-bold text-emerald-400 mt-0.5 block">
              100%
            </span>
          </div>
          <div className="bg-white/5 p-2 rounded-2xl border border-white/5">
            <span className="text-[10px] text-[#D9CEC5] block font-medium">Rating Mitra</span>
            <div className="flex items-center justify-center gap-0.5 text-[#FDB882] font-serif text-[15px] font-bold mt-0.5">
              <Star className="w-3.5 h-3.5 fill-[#FDB882]" />
              <span>4.9</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TAB: TUGAS AKTIF (ACTIVE DELIVERIES) */}
      {deliveryTab === 'active' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-serif text-[17px] font-bold text-[#26160F]">
                Tugas Pengantaran Hari Ini
              </h4>
              <span className="w-2 h-2 rounded-full bg-[#C86826]" />
            </div>
            <span className="text-xs font-bold text-[#865225] bg-[#FDF3EB] px-2.5 py-0.5 rounded-full border border-[#FDB882]/40">
              {activeOrders.length} Pesanan Aktif
            </span>
          </div>

          {deliveryOrders.map((order) => {
            const currentStep = order.steps[order.currentStepIndex];
            const isFinished = order.currentStepIndex >= 5;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-[#ECE4DA] p-4.5 depth-card shadow-sm space-y-4"
              >
                {/* Header: Order Number & Status Pill */}
                <div className="flex items-start justify-between gap-2 border-b border-[#F4EFE9] pb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-serif text-[16px] font-bold text-[#26160F] whitespace-nowrap">
                        #{order.orderNumber}
                      </span>
                      <span className="text-[10px] font-bold bg-[#EFE8E0] text-[#865225] px-2 py-0.5 rounded-md whitespace-nowrap">
                        GoSend Instant
                      </span>
                    </div>
                    <span className="text-[11px] text-[#75645C] mt-0.5 block truncate">
                      {order.items.length} Paket Biji Kopi Sangrai Patawi
                    </span>
                  </div>

                  <span
                    className={`text-[10.5px] font-bold px-2.5 py-1 rounded-full shrink-0 shadow-2xs whitespace-nowrap ${
                      isFinished
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-[#FDF3EB] text-[#865225] border border-[#FDB882]/40'
                    }`}
                  >
                    {currentStep?.title || 'Pengantaran'}
                  </span>
                </div>

                {/* Recipient & Contact Row */}
                <div className="flex items-center justify-between bg-[#FAF7F2] p-3 rounded-2xl border border-[#ECE4DA]">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] text-[#75645C] font-medium block">
                      Penerima Paket:
                    </span>
                    <strong className="text-xs font-bold text-[#26160F] truncate block">
                      Nathaniel Christian (VIP Member)
                    </strong>
                    <span className="text-[10.5px] text-[#865225]">
                      Pesanan: Aceh Gayo & Toraja Sapan (Whole Bean)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => showToast('Menghubungi nomor telepon penerima paket...')}
                      className="w-8 h-8 rounded-full bg-white text-[#865225] hover:bg-[#FDB882] flex items-center justify-center border border-[#ECE4DA] transition-colors cursor-pointer active:scale-95 shadow-2xs"
                      title="Hubungi Pelanggan"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => showToast('Membuka percakapan WhatsApp dengan pelanggan...')}
                      className="w-8 h-8 rounded-full bg-[#26160F] text-[#FDB882] hover:bg-[#1A0D07] flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-2xs"
                      title="Kirim Chat"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Connected Stepper Route (Pick-up → Drop-off with solid vertical line) */}
                <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#ECE4DA] relative">
                  <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#D9CEC5]">
                    {/* Pick-up Outlet */}
                    <div className="relative">
                      <span className="absolute -left-5 top-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 z-10" />
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                            Pick-up (Outlet Roastery)
                          </span>
                          <span className="text-[10px] text-[#75645C] font-semibold">10:45 WIB</span>
                        </div>
                        <strong className="text-xs text-[#26160F] block mt-0.5">
                          Roastery Senopati Flagship
                        </strong>
                        <p className="text-[11px] text-[#75645C]">
                          Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan
                        </p>
                      </div>
                    </div>

                    {/* Drop-off Customer */}
                    <div className="relative">
                      <span className="absolute -left-5 top-0.5 w-3 h-3 rounded-full bg-[#C86826] ring-4 ring-orange-100 z-10" />
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#865225] uppercase tracking-wider">
                            Drop-off (Alamat Penerima)
                          </span>
                          <span className="text-[10px] font-bold text-[#C86826]">
                            Estimasi 11:15 WIB
                          </span>
                        </div>
                        <strong className="text-xs text-[#26160F] block mt-0.5">
                          Jl. Senopati No. 12, Kebayoran Baru
                        </strong>
                        <p className="text-[11px] text-[#75645C]">
                          Jakarta Selatan (Instruksi: Titip di lobby pos sekuriti)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Dispatch Button */}
                {!isFinished ? (
                  <button
                    onClick={() => advanceOrderStatus(order.id)}
                    className="w-full flex items-center justify-center gap-2 bg-[#26160F] hover:bg-[#3E2419] text-[#FDB882] py-3 rounded-2xl font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-98 border border-[#3E2419]"
                  >
                    <Navigation className="w-4 h-4 text-[#FDB882]" />
                    Simulasikan Update: "{order.steps[order.currentStepIndex + 1]?.title || 'Pesanan Selesai Diterima'}"
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50 py-3 rounded-2xl text-xs font-bold border border-emerald-200 shadow-2xs">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                    Paket Kopi Berhasil Diterima Pelanggan
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. TAB: RIWAYAT SELESAI (DELIVERY HISTORY) */}
      {deliveryTab === 'history' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-[17px] font-bold text-[#26160F]">
              Riwayat Pengantaran Selesai
            </h4>
            <span className="text-xs text-[#75645C]">Minggu Ini</span>
          </div>

          <div className="bg-white rounded-3xl border border-[#ECE4DA] p-4 depth-card space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#F4EFE9]">
              <div>
                <span className="font-serif text-sm font-bold text-[#26160F]">#PTW-87902</span>
                <span className="text-[11px] text-[#75645C] block">Kemarin, 14:30 WIB</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selesai Antar
              </span>
            </div>
            <p className="text-xs text-[#5C4D46]">
              2 Paket: Bali Kintamani & House Blend Espresso (Tujuan: SCBD Tower 2)
            </p>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F4EFE9]">
              <span className="text-[#75645C]">Ongkir Kurir:</span>
              <strong className="font-serif text-[#26160F]">Rp 18.000</strong>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: PERFORMA & SALDO (EARNINGS) */}
      {deliveryTab === 'earnings' && (
        <div className="space-y-3.5">
          <h4 className="font-serif text-[17px] font-bold text-[#26160F]">
            Dompet Mitra & Performa Kurir
          </h4>

          <div className="bg-white rounded-3xl border border-[#ECE4DA] p-5 depth-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-[#75645C] block">Saldo Dompet Tersedia</span>
                <span className="font-serif text-[24px] font-bold text-[#26160F]">
                  Rp 245.000
                </span>
              </div>
              <button
                onClick={() => showToast('Permintaan tarik dana kurir berhasil dikirim')}
                className="bg-[#26160F] text-[#FDB882] text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer active:scale-95"
              >
                Tarik Saldo
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F4EFE9]">
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#ECE4DA]">
                <span className="text-[10px] text-[#75645C] block">Pendapatan Hari Ini</span>
                <span className="font-serif text-sm font-bold text-[#865225]">Rp 36.000</span>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#ECE4DA]">
                <span className="text-[10px] text-[#75645C] block">Tip Pelanggan</span>
                <span className="font-serif text-sm font-bold text-emerald-600">+Rp 15.000</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB: PROFIL KURIR */}
      {deliveryTab === 'profile' && (
        <div className="space-y-3.5">
          <h4 className="font-serif text-[17px] font-bold text-[#26160F]">
            Data Mitra Pengemudi
          </h4>

          <div className="bg-white rounded-3xl border border-[#ECE4DA] p-5 depth-card space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">Nama Lengkap:</span>
              <strong className="text-[#26160F]">Rian Hidayat</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">ID Mitra GoSend:</span>
              <strong className="font-mono text-[#26160F]">GSD-JKT-8829</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">Kendaraan Operasional:</span>
              <strong className="text-[#26160F]">Honda Vario 160 (B 4521 SRX)</strong>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[#75645C]">Status Verifikasi SIM & STNK:</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Terverifikasi Aktif
              </span>
            </div>

            <button
              onClick={() => {
                setRole('customer');
                showToast('Beralih kembali ke mode Customer');
              }}
              className="w-full mt-3 bg-[#EFE8E0] hover:bg-[#E5DCD2] text-[#26160F] py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Kembali ke Tampilan Pelanggan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
