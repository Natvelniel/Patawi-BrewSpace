import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomerInfo, CourierService, Order } from '../../types';
import { X, QrCode, CheckCircle2, ShieldCheck, Timer } from 'lucide-react';

interface QRISPaymentModalProps {
  deliveryType: 'delivery' | 'pickup';
  address: string;
  customerInfo: CustomerInfo;
  courierService: CourierService;
  onSuccess: (order: Order) => void;
  onClose: () => void;
}

export const QRISPaymentModal: React.FC<QRISPaymentModalProps> = ({
  deliveryType,
  address,
  customerInfo,
  courierService,
  onSuccess,
  onClose,
}) => {
  const { total, createOrder, showToast } = useStore();
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes countdown
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingFee = deliveryType === 'pickup' ? 0 : courierService === 'jne_yes' ? 35000 : courierService === 'jne_reg' ? 22000 : 15000;
  const grandTotal = total + shippingFee;

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newOrder = createOrder(deliveryType, address, customerInfo, courierService);
      setIsProcessing(false);
      showToast('Pembayaran QRIS BCA Terverifikasi Otomatis! 🎉');
      onSuccess(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-[400px] w-full p-6 shadow-2xl border border-[#ECE4DA] relative animate-in zoom-in-95 depth-card rim-light font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-[#EFE8E0] text-[#75645C] hover:text-[#26160F] hover:bg-[#E5DCD2] transition-colors cursor-pointer"
          aria-label="Tutup Pembayaran QRIS"
          title="Tutup Pembayaran"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pt-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#865225] bg-[#FDF3EB] px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-[#FDB882]/40">
            <QrCode className="w-3.5 h-3.5 text-[#C86826]" />
            QRIS Dinamis • BCA & All E-Wallet
          </span>
          <h3 className="font-serif text-[20px] font-bold text-[#26160F]">
            Pindai untuk Membayar
          </h3>
          <p className="text-[12px] text-[#75645C] mt-0.5">
            Gopay, OVO, Dana, BCA Mobile, Livin, ShopeePay
          </p>
        </div>

        {/* QR Code Container */}
        <div className="my-5 p-4 bg-[#FAF7F2] rounded-2xl border border-[#ECE4DA] flex flex-col items-center">
          <div className="w-52 h-52 bg-white rounded-xl p-3 shadow-inner border border-[#ECE4DA] flex flex-col items-center justify-center">
            {/* SVG QR Visual */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-[#26160F]"
              fill="currentColor"
            >
              {/* Corner position markers */}
              <rect x="5" y="5" width="25" height="25" fill="#26160F" rx="3" />
              <rect x="9" y="9" width="17" height="17" fill="white" />
              <rect x="13" y="13" width="9" height="9" fill="#26160F" />

              <rect x="70" y="5" width="25" height="25" fill="#26160F" rx="3" />
              <rect x="74" y="9" width="17" height="17" fill="white" />
              <rect x="78" y="13" width="9" height="9" fill="#26160F" />

              <rect x="5" y="70" width="25" height="25" fill="#26160F" rx="3" />
              <rect x="9" y="74" width="17" height="17" fill="white" />
              <rect x="13" y="78" width="9" height="9" fill="#26160F" />

              {/* Data modules pattern */}
              <rect x="35" y="8" width="6" height="6" />
              <rect x="45" y="8" width="6" height="6" />
              <rect x="55" y="8" width="8" height="6" />
              <rect x="35" y="18" width="8" height="6" />
              <rect x="48" y="18" width="14" height="6" />
              
              <rect x="8" y="35" width="6" height="8" />
              <rect x="8" y="48" width="14" height="6" />
              <rect x="8" y="58" width="8" height="6" />

              <rect x="35" y="35" width="30" height="30" fill="#26160F" rx="2" />
              <circle cx="50" cy="50" r="8" fill="white" />
              <circle cx="50" cy="50" r="4" fill="#C86826" />

              <rect x="70" y="35" width="6" height="14" />
              <rect x="80" y="35" width="12" height="6" />
              <rect x="72" y="54" width="20" height="6" />

              <rect x="35" y="70" width="8" height="10" />
              <rect x="48" y="70" width="12" height="8" />
              <rect x="65" y="70" width="6" height="18" />
              <rect x="75" y="78" width="18" height="12" />
              <rect x="35" y="84" width="25" height="8" />
            </svg>
          </div>

          {/* Amount */}
          <div className="mt-3 text-center">
            <span className="text-[11px] text-[#75645C] font-medium">Total Pembayaran</span>
            <div className="font-serif text-[24px] font-bold text-[#26160F]">
              Rp {grandTotal.toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        {/* Timer & Security */}
        <div className="flex items-center justify-between text-[12px] text-[#75645C] mb-4 px-1">
          <div className="flex items-center gap-1.5 font-medium">
            <Timer className="w-4 h-4 text-[#C86826]" />
            Sisa Waktu: <strong className="text-[#26160F] font-mono">{formatTimer(secondsLeft)}</strong>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#865225] font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Terverifikasi Bank Indonesia
          </div>
        </div>

        {/* Simulation Action */}
        <button
          onClick={handleSimulatePayment}
          disabled={isProcessing}
          className="w-full min-h-[48px] bg-[#26160F] hover:bg-[#382015] active:scale-[0.98] text-white py-3.5 rounded-xl font-bold text-[14px] shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Memverifikasi Pembayaran...
            </div>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#FDB882]" />
              Simulasikan Pembayaran Berhasil
            </>
          )}
        </button>
      </div>
    </div>
  );
};
