import React from 'react';
import { Order } from '../../types';
import { X, Download, CheckCircle2, QrCode, Mail } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface InvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  const { showToast } = useStore();

  const handleDownload = () => {
    showToast(`Invoice #${order.orderNumber} berhasil diunduh (PDF) 📄`);
  };

  const handleResendEmail = () => {
    const emailTarget = order.customerInfo?.email || 'nathanielchristian1109@gmail.com';
    showToast(`Invoice #${order.orderNumber} berhasil dikirim ulang ke ${emailTarget} ✉️`);
  };

  const courierLabel =
    order.courierService === 'pickup'
      ? 'Pick Up di Outlet Senopati'
      : order.courierService === 'jne_reg'
      ? 'JNE Regular Service (2-3 Hari)'
      : order.courierService === 'jne_yes'
      ? 'JNE YES Next Day Service'
      : 'GoSend Instant Delivery (Jakarta)';

  // Calculate simulated PPN 11% included in total
  const ppnAmount = Math.round(order.total * (11 / 111));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-[460px] w-full p-5 sm:p-6 shadow-2xl border border-[#ECE4DA] max-h-[92vh] overflow-y-auto no-scrollbar relative animate-in zoom-in-95">
        {/* Header Actions */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#ECE4DA]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#865225]">
              Faktur Pembelian Resmi
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#EFE8E0] text-[#75645C] hover:text-[#26160F] flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup Faktur"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invoice Printable Sheet Content */}
        <div className="mt-4 space-y-4 text-[#26160F]">
          {/* Brand & Roastery Info */}
          <div className="flex items-start justify-between">
            <div>
              <span className="font-serif text-[22px] font-bold text-[#26160F] tracking-tight leading-none block">
                Patawi Coffee
              </span>
              <span className="text-[11px] text-[#865225] font-semibold block mt-0.5">
                Specialty Coffee Roastery & Lab
              </span>
              <p className="text-[10px] text-[#75645C] mt-1 leading-tight max-w-[220px]">
                Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan 12190
                <br />
                NPWP: 09.876.543.2-012.000
              </p>
            </div>

            <div className="text-right">
              <span className="font-mono font-bold text-xs bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#ECE4DA] inline-block">
                #{order.orderNumber}
              </span>
              <span className="text-[10px] text-[#75645C] block mt-1">
                {order.date}
              </span>
              <span className="inline-flex items-center gap-1 mt-1 text-[9.5px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-2.5 h-2.5" /> LUNAS (QRIS BCA)
              </span>
            </div>
          </div>

          {/* Customer & Shipping Details Bar */}
          <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#ECE4DA] grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[9.5px] text-[#75645C] uppercase font-bold tracking-wider block">
                Penerima / Pemesan:
              </span>
              <strong className="text-xs text-[#26160F] block truncate mt-0.5">
                {order.customerInfo?.name || 'Nathaniel Christian'}
              </strong>
              <span className="text-[10.5px] text-[#75645C] font-mono block truncate">
                {order.customerInfo?.email || 'nathanielchristian1109@gmail.com'}
              </span>
              <span className="text-[10px] font-bold text-[#865225] block mt-0.5">
                {order.customerInfo?.isGuest ? 'Pelanggan Tamu (Guest)' : 'VIP Member Patawi'}
              </span>
            </div>

            <div>
              <span className="text-[9.5px] text-[#75645C] uppercase font-bold tracking-wider block">
                Metode Pengiriman:
              </span>
              <strong className="text-xs text-[#26160F] block truncate mt-0.5">
                {courierLabel}
              </strong>
              <span className="text-[10.5px] text-[#75645C] block truncate leading-tight mt-0.5">
                {order.address || 'Outlet Senopati (Self Pick-up)'}
              </span>
              {order.trackingCode && (
                <span className="text-[10px] font-mono text-[#C86826] font-bold block mt-0.5">
                  Resi: {order.trackingCode}
                </span>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-[#ECE4DA] rounded-2xl overflow-hidden">
            <div className="bg-[#EFE8E0]/70 px-3 py-2 text-[10.5px] font-bold text-[#75645C] grid grid-cols-12 gap-1 uppercase tracking-wider">
              <span className="col-span-7">Biji Kopi & Profil</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-3 text-right">Subtotal</span>
            </div>

            <div className="divide-y divide-[#F4EFE9] text-xs">
              {order.items.map((it, idx) => (
                <div key={idx} className="p-3 grid grid-cols-12 gap-1 items-start">
                  <div className="col-span-7 pr-1">
                    <strong className="text-[#26160F] font-serif text-[12.5px] block leading-tight">
                      {it.product.name}
                    </strong>
                    <span className="text-[10.5px] text-[#75645C] block mt-0.5">
                      Kemasan {it.weight} • {it.grindLabel}
                    </span>
                    {it.notes && (
                      <span className="text-[9.5px] text-[#865225] italic block mt-0.5 line-clamp-1">
                        "{it.notes}"
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 text-center text-[#5C4D46] font-medium pt-0.5">
                    {it.quantity}x
                  </div>
                  <div className="col-span-3 text-right font-bold text-[#26160F] pt-0.5">
                    Rp {(it.price * it.quantity).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Calculation */}
          <div className="space-y-1.5 pt-1 text-xs text-[#5C4D46]">
            <div className="flex justify-between">
              <span>Subtotal Produk</span>
              <span>Rp {order.subtotal.toLocaleString('id-ID')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#C86826]">
                <span>Diskon Kupon Promo</span>
                <span>- Rp {order.discount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Ongkos Kirim Ekspedisi</span>
              <span>{order.shippingFee > 0 ? `Rp ${order.shippingFee.toLocaleString('id-ID')}` : 'Gratis'}</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#75645C]">
              <span>Termasuk PPN 11% (Inklusif)</span>
              <span>Rp {ppnAmount.toLocaleString('id-ID')}</span>
            </div>

            <div className="pt-2 border-t-2 border-[#26160F] flex justify-between items-center text-sm font-bold text-[#26160F]">
              <span className="font-serif text-[15px]">TOTAL PEMBAYARAN</span>
              <span className="font-serif text-[17px] text-[#C86826]">
                Rp {order.total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Barcode / Authentication Seal */}
          <div className="pt-2 border-t border-[#ECE4DA] flex items-center justify-between text-[10px] text-[#75645C]">
            <div className="flex items-center gap-2">
              <QrCode className="w-8 h-8 text-[#26160F]" />
              <div>
                <span className="font-bold text-[#26160F] block">Faktur Digital Sah</span>
                <span>Divalidasi Roastery Patawi Senopati</span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-serif italic font-bold text-xs text-[#26160F] block">
                Budi Santoso
              </span>
              <span className="text-[9px]">Head Roaster & Station Manager</span>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="mt-5 pt-3 border-t border-[#ECE4DA] grid grid-cols-2 gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 bg-[#26160F] hover:bg-[#C86826] text-white py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-[#FDB882]" /> Unduh PDF
          </button>
          <button
            onClick={handleResendEmail}
            className="flex items-center justify-center gap-1.5 bg-[#FAF7F2] hover:bg-[#EFE8E0] text-[#26160F] border border-[#ECE4DA] py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer active:scale-95"
          >
            <Mail className="w-3.5 h-3.5 text-[#865225]" /> Kirim ke Email
          </button>
        </div>
      </div>
    </div>
  );
};
