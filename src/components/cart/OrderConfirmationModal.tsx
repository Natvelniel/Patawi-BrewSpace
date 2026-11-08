import React, { useState } from 'react';
import { Order } from '../../types';
import { CheckCircle2, FileText, Navigation, Home, Mail, Sparkles } from 'lucide-react';
import { InvoiceModal } from './InvoiceModal';

interface OrderConfirmationModalProps {
  order: Order;
  onTrack: () => void;
  onHome: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onTrack,
  onHome,
}) => {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const courierLabel =
    order.courierService === 'pickup'
      ? 'Self Pick-up di Outlet Senopati'
      : order.courierService === 'jne_yes'
      ? 'JNE YES (Next Day Delivery)'
      : order.courierService === 'jne_reg'
      ? 'JNE Regular (Estimasi 2-3 Hari)'
      : 'GoSend Instant Delivery (25 - 40 Menit)';

  const customerEmail =
    order.customerInfo?.email || 'nathanielchristian1109@gmail.com';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in select-none">
        <div className="bg-[#FAF7F2] rounded-3xl max-w-[420px] w-full p-6 shadow-2xl border border-[#ECE4DA] text-center relative animate-in zoom-in-95 max-h-[92vh] overflow-y-auto no-scrollbar">
          {/* Animated Gold/Green Success Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-emerald-600 shadow-md mb-3">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#865225] bg-[#FDF3EB] px-3 py-0.5 rounded-full uppercase tracking-wider mb-1.5 border border-[#FDB882]/40">
            <Sparkles className="w-3 h-3 text-[#C86826]" />
            Pembayaran QRIS Berhasil
          </span>

          <h3 className="font-serif text-[22px] font-bold text-[#26160F] leading-tight">
            Pesanan Diterima Roastery!
          </h3>
          <p className="text-xs text-[#75645C] mt-1 leading-relaxed">
            Batch pesanan #{order.orderNumber} telah masuk ke antrean stasiun roasting Senopati.
          </p>

          {/* Email Notification Card */}
          <div className="mt-4 bg-white p-3.5 rounded-2xl border border-[#ECE4DA] text-left shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#26160F]">
              <Mail className="w-4 h-4 text-[#C86826] shrink-0" />
              <span>Invoice Terkirim Otomatis</span>
            </div>
            <p className="text-[11px] text-[#75645C] leading-relaxed">
              Faktur digital resmi beserta rincian pesanan telah dikirimkan ke:{' '}
              <strong className="text-[#26160F] font-mono break-all font-semibold">
                {customerEmail}
              </strong>
            </p>
          </div>

          {/* Order Details Brief Card */}
          <div className="mt-3 bg-white p-3.5 rounded-2xl border border-[#ECE4DA] text-left shadow-2xs space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">Nomor Pesanan:</span>
              <strong className="font-mono text-[#26160F] text-xs">#{order.orderNumber}</strong>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">Penerima Paket:</span>
              <strong className="text-[#26160F] text-xs truncate max-w-[180px]">
                {order.customerInfo?.name || 'Nathaniel Christian'}
                {order.customerInfo?.isGuest && (
                  <span className="text-[10px] text-[#865225] font-normal ml-1">(Tamu)</span>
                )}
              </strong>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-[#F4EFE9]">
              <span className="text-[#75645C]">Layanan Pengiriman:</span>
              <span className="font-semibold text-[#865225] text-[11px] text-right truncate max-w-[180px]">
                {courierLabel}
              </span>
            </div>

            <div className="flex justify-between items-center pt-0.5">
              <span className="text-[#75645C] font-bold">Total Pembayaran:</span>
              <span className="font-serif text-[16px] font-bold text-[#C86826]">
                Rp {order.total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-5 space-y-2">
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-[#FAF7F2] text-[#26160F] border border-[#ECE4DA] py-2.5 rounded-2xl font-bold text-xs shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <FileText className="w-4 h-4 text-[#C86826]" />
              Lihat Pratinjau Invoice Resmi Digital
            </button>

            <button
              onClick={onTrack}
              className="w-full flex items-center justify-center gap-2 bg-[#26160F] hover:bg-[#C86826] text-white py-3 rounded-2xl font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Navigation className="w-4 h-4 text-[#FDB882]" />
              Lacak Status Pengiriman Real-Time
            </button>

            <button
              onClick={onHome}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-[#75645C] hover:text-[#26160F] py-2 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" /> Kembali Belanja ke Beranda
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Invoice Modal Preview */}
      {showInvoiceModal && (
        <InvoiceModal order={order} onClose={() => setShowInvoiceModal(false)} />
      )}
    </>
  );
};
