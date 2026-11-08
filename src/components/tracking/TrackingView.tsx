import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ORDER_HISTORY, COFFEE_PRODUCTS } from '../../data/coffeeProducts';
import {
  Bike,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  Navigation,
  RotateCcw,
  FileDown,
  Headphones,
  Check,
  Store,
} from 'lucide-react';

export const TrackingView: React.FC = () => {
  const { orders, addToCart, setActiveTab, showToast, advanceOrderStatus } = useStore();
  const [activeDriverChat, setActiveDriverChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([
    'Halo kak! Saya mitra kurir GoSend, sedang jalan menuju Roastery Senopati untuk ambil pesanan biji kopi kakak ya.',
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setMessages((prev) => [...prev, `Anda: ${chatMessage}`]);
    setChatMessage('');
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        'Rian (Driver): Siap kak! Begitu beans selesai dipacking barista langsung saya meluncur.',
      ]);
    }, 1000);
  };

  const handleReorder = (item: (typeof ORDER_HISTORY)[0]) => {
    addToCart(COFFEE_PRODUCTS[2], '200g', 'whole', 1, 'Pesan ulang dari riwayat pesanan');
    setActiveTab('cart');
    showToast(`Pesanan ${item.title} dimasukkan kembali ke keranjang!`);
  };

  const activeOrders = orders.filter((o) => o.status !== 'delivered');

  return (
    <div className="pb-8 pt-3 px-4 bg-[#FAF7F2] min-h-full space-y-5">
      {/* 1. Header Strip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#865225]" />
          <h3 className="font-serif text-[18px] font-bold text-[#26160F]">
            Pesanan Berlangsung
          </h3>
        </div>
        <span className="text-[11px] font-bold bg-[#FDF3EB] text-[#865225] px-3 py-1 rounded-full border border-[#FDB882]/40">
          {activeOrders.length} PESANAN AKTIF
        </span>
      </div>

      {/* ACTIVE ORDERS */}
      {orders.map((order) => {
        if (order.type === 'delivery') {
          return (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-[#ECE4DA] shadow-2xs overflow-hidden"
            >
              {/* Header Badge Strip */}
              <div className="p-4 bg-[#FAF7F2] border-b border-[#ECE4DA] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#75645C] tracking-wider uppercase block">
                    GOSEND INSTANT DELIVERY
                  </span>
                  <span className="font-serif text-[17px] font-bold text-[#26160F]">
                    #{order.orderNumber}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-[#865225] text-white px-3 py-1.5 rounded-full text-[11px] font-bold shadow-xs">
                  <Bike className="w-3.5 h-3.5 text-[#FDB882]" />
                  <span>
                    {order.currentStepIndex >= 4
                      ? 'Dalam Pengantaran'
                      : 'Kurir Menuju Outlet'}
                  </span>
                </div>
              </div>

              {/* Live GPS Map Container */}
              <div className="p-4">
                <div className="relative h-44 rounded-2xl overflow-hidden border border-[#ECE4DA] shadow-inner bg-[#E5E3DF]">
                  {/* Map Graphic */}
                  <img
                    src="/assets/048b7.png"
                    alt="Peta Pengantaran Jakarta"
                    className="w-full h-full object-cover"
                  />

                  {/* Top Right Live Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/80 backdrop-blur-xs text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -ml-3.5" />
                    Live GPS
                  </div>

                  {/* Bottom Left ETA Strip */}
                  <div className="absolute bottom-3 left-3 right-3 bg-[#26160F]/90 backdrop-blur-md rounded-xl p-2.5 flex items-center justify-between text-white border border-white/10 shadow-lg">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-[#C86826] shrink-0" />
                      <div>
                        <span className="text-[10px] text-[#D9CEC5] block leading-tight">
                          Estimasi Tiba di Alamat
                        </span>
                        <span className="text-xs font-bold leading-tight">
                          11:15 WIB (±{order.courier?.etaMinutes || 20} Menit)
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => advanceOrderStatus(order.id)}
                      className="bg-[#C86826] hover:bg-[#B3581C] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer active:scale-95"
                      title="Simulasi pergerakan kurir"
                    >
                      Perbarui Rute
                    </button>
                  </div>
                </div>

                {/* Driver Profile Card */}
                {order.courier && (
                  <div className="mt-3.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#ECE4DA] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden border border-[#D9CEC5] bg-[#EFE8E0]">
                        <img
                          src={order.courier.avatar}
                          alt={order.courier.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#26160F]">
                          {order.courier.name}
                        </h4>
                        <p className="text-[11px] text-[#75645C]">
                          <strong className="text-[#26160F]">{order.courier.plateNumber}</strong> • {order.courier.vehicle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showToast(`Menghubungi driver ${order.courier?.name}...`)}
                        className="w-9 h-9 rounded-full bg-[#FDF3EB] text-[#865225] hover:bg-[#FDB882] flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                        title="Telepon Driver"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActiveDriverChat(true)}
                        className="w-9 h-9 rounded-full bg-[#26160F] text-[#FDB882] hover:bg-[#1A0D07] flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                        title="Kirim Pesan ke Driver"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step-by-Step Delivery Timeline */}
                <div className="mt-4 pt-3 border-t border-[#F4EFE9]">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-serif text-[15px] font-bold text-[#26160F]">
                      Tahapan Pengiriman
                    </h4>
                    <span className="text-[11px] text-[#75645C] font-semibold">
                      Langkah {order.currentStepIndex + 1} dari {order.steps.length}
                    </span>
                  </div>

                  <div className="space-y-3.5 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#ECE4DA]">
                    {order.steps.map((step, idx) => {
                      const isCompleted = idx < order.currentStepIndex;
                      const isCurrent = idx === order.currentStepIndex;

                      return (
                        <div key={step.id} className="relative flex items-start gap-3 pl-1">
                          {/* Dot / Icon */}
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 ${
                              isCompleted
                                ? 'bg-[#865225] text-white shadow-xs'
                                : isCurrent
                                ? 'bg-[#C86826] text-white ring-4 ring-[#FDF3EB] shadow-xs'
                                : 'bg-[#EFE8E0] text-[#75645C]'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-3 h-3 stroke-[3]" />
                            ) : isCurrent ? (
                              <Clock className="w-3 h-3 animate-spin" />
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-[#75645C]" />
                            )}
                          </div>

                          {/* Content */}
                          <div
                            className={`flex-1 -mt-0.5 p-2 rounded-xl transition-all ${
                              isCurrent ? 'bg-[#FDF3EB] border border-[#FDB882]/40' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <h5
                                className={`text-xs font-bold ${
                                  isCurrent ? 'text-[#865225]' : 'text-[#26160F]'
                                }`}
                              >
                                {step.title}
                              </h5>
                              <span className="text-[10px] font-semibold text-[#75645C]">
                                {step.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#5C4D46] mt-0.5 leading-relaxed">
                              {step.subtitle}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items in this order */}
                <div className="mt-4 pt-3 border-t border-[#F4EFE9]">
                  <div className="bg-[#FAF7F2] rounded-2xl p-3 flex items-center justify-between border border-[#ECE4DA]">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#F4EFE9] border border-[#ECE4DA]">
                        <img
                          src={order.items[0]?.product.image || '/assets/da276.png'}
                          alt="Produk"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-[#26160F]">
                          {order.items[0]?.product.name || 'Kopi Patawi'}
                        </h5>
                        <p className="text-[10px] text-[#75645C]">
                          {order.items[0]?.weight} • {order.items[0]?.grindLabel}
                        </p>
                      </div>
                    </div>
                    <span className="font-serif text-[14px] font-bold text-[#26160F]">
                      Rp {order.total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // PICK UP AT OUTLET ORDER
        return (
          <div
            key={order.id}
            className="bg-white rounded-3xl border border-[#ECE4DA] shadow-2xs overflow-hidden"
          >
            {/* Peach Top Header */}
            <div className="p-4 bg-[#FDE8D7] border-b border-[#FDB882]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#865225] tracking-wider uppercase block">
                  PICK UP DI OUTLET
                </span>
                <span className="font-serif text-[17px] font-bold text-[#26160F]">
                  #{order.orderNumber}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#26160F] text-[#FDB882] px-3 py-1.5 rounded-full text-[11px] font-bold">
                <Store className="w-3.5 h-3.5 text-[#FDB882]" />
                <span>Siap Diambil</span>
              </div>
            </div>

            {/* PIN Card */}
            <div className="p-4 space-y-4">
              <div className="bg-[#FAF7F2] rounded-2xl p-4 text-center border border-[#ECE4DA]">
                <span className="text-[11px] font-bold text-[#865225] tracking-wider uppercase block mb-2">
                  PIN PENGAMBILAN BARISTA
                </span>

                {/* 4 Large Digits */}
                <div className="flex items-center justify-center gap-2.5 my-2">
                  {(order.pickupPin || '7 4 9 2').split(' ').map((num, i) => (
                    <div
                      key={i}
                      className="w-12 h-14 bg-white rounded-2xl border border-[#D9CEC5] shadow-xs flex items-center justify-center font-serif text-[28px] font-bold text-[#26160F]"
                    >
                      {num}
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-[#75645C] mt-2">
                  Tunjukkan kode PIN 4 angka ini ke Barista di Counter Senopati.
                </p>
              </div>

              {/* Progress Steps */}
              <div className="space-y-1.5">
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-[#5C4D46]">
                  <span className="text-[#865225]">Persiapan</span>
                  <span className="text-[#26160F] font-extrabold underline decoration-[#C86826] decoration-2">
                    Siap Di Counter
                  </span>
                  <span className="text-[#75645C]">Selesai Ambil</span>
                </div>
                <div className="grid grid-cols-3 gap-1 h-1.5">
                  <div className="bg-[#865225] rounded-full" />
                  <div className="bg-[#C86826] rounded-full" />
                  <div className="bg-[#EFE8E0] rounded-full" />
                </div>
              </div>

              {/* Store Address & Route */}
              <div className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-[#ECE4DA] flex items-center justify-between">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 bg-[#EFE8E0] rounded-xl text-[#865225] shrink-0">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#26160F]">
                      {order.pickupLocation?.name || 'Roastery Senopati Flagship'}
                    </h5>
                    <p className="text-[11px] text-[#75645C] mt-0.5">
                      {order.pickupLocation?.address || 'Jl. Senopati No. 42, Kebayoran Baru'}
                    </p>
                    <span className="text-[10px] font-semibold text-[#865225] mt-1 block">
                      {order.pickupLocation?.hours || 'Buka sampai 22:00 WIB'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    window.open(
                      'https://maps.google.com/?q=Senopati+Kebayoran+Baru',
                      '_blank'
                    )
                  }
                  className="flex items-center gap-1 bg-[#26160F] text-[#FDB882] hover:bg-[#C86826] hover:text-white text-[11px] font-bold px-3 py-2 rounded-xl transition-all shrink-0 cursor-pointer active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Rute
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* 2. Riwayat Pesanan Terdahulu */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-[17px] font-bold text-[#26160F]">
            Riwayat Pesanan Terdahulu
          </h3>
          <button
            onClick={() => showToast('Menampilkan seluruh riwayat arsip pesanan')}
            className="text-xs font-semibold text-[#865225] hover:underline cursor-pointer"
          >
            Lihat Semua
          </button>
        </div>

        {ORDER_HISTORY.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-[#ECE4DA] p-4 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#26160F]">#{item.orderNumber}</span>
              <div className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px]">
                <CheckCircle2 className="w-3 h-3" />
                {item.status}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#ECE4DA] shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-serif text-[14px] font-bold text-[#26160F] truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#75645C] mt-0.5 truncate">{item.detail}</p>
                <span className="font-serif text-[15px] font-bold text-[#26160F] mt-1 block">
                  Rp {item.total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F4EFE9]">
              <button
                onClick={() => handleReorder(item)}
                className="flex items-center justify-center gap-1.5 bg-[#26160F] hover:bg-[#C86826] text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#FDB882]" />
                Pesan Lagi
              </button>

              <button
                onClick={() =>
                  showToast('Mengunduh Invoice PDF Resmi Patawi Coffee Roastery #PTW-87902')
                }
                className="flex items-center justify-center gap-1.5 bg-[#EFE8E0] hover:bg-[#E5DCD2] text-[#26160F] py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
              >
                <FileDown className="w-3.5 h-3.5" />
                Unduh Invoice
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Customer Care & WhatsApp Support Banner */}
      <div className="bg-[#FAF7F2] rounded-3xl p-4 border border-[#ECE4DA] space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-[#FDF3EB] rounded-2xl text-[#865225] border border-[#FDB882]/40">
            <Headphones className="w-5 h-5 text-[#C86826]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#26160F]">
              Butuh Bantuan dengan Pesanan Anda?
            </h4>
            <p className="text-[11px] text-[#75645C] mt-0.5 leading-relaxed">
              Tim Customer Care & Roaster kami siap mendampingi setiap hari pukul 08:00 - 21:00 WIB.
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            window.open(
              'https://wa.me/6281234567890?text=Halo%20Patawi%20Coffee%20Roastery,%20saya%20ingin%20bertanya%20mengenai%20pesanan%20saya',
              '_blank'
            )
          }
          className="w-full flex items-center justify-center gap-2 bg-[#865225] hover:bg-[#78471b] text-white py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <MessageSquare className="w-4 h-4 text-[#FDB882]" />
          Hubungi WhatsApp Roastery (+62 812-3456-7890)
        </button>
      </div>

      {/* Driver Chat Modal */}
      {activeDriverChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in select-none">
          <div className="bg-white rounded-3xl max-w-[380px] w-full p-4 shadow-2xl border border-[#ECE4DA] flex flex-col h-[420px]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE4DA]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-[#EFE8E0]">
                  <img src="/assets/9e21e.png" alt="Driver" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#26160F]">Rian Hidayat</h4>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Sedang Berkendara
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveDriverChat(false)}
                className="text-[#75645C] hover:text-[#26160F] text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 text-xs">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl max-w-[85%] ${
                    m.startsWith('Anda:')
                      ? 'ml-auto bg-[#26160F] text-white rounded-tr-none'
                      : 'bg-[#FAF7F2] text-[#26160F] rounded-tl-none border border-[#ECE4DA]'
                  }`}
                >
                  {m}
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="pt-2 border-t border-[#ECE4DA] flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ketik pesan untuk driver..."
                className="flex-1 bg-[#FAF7F2] px-3.5 py-2 rounded-xl text-xs text-[#26160F] border border-[#ECE4DA] focus:outline-hidden"
              />
              <button
                type="submit"
                className="bg-[#26160F] text-[#FDB882] px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
