import React, { useState } from 'react';
import { Voucher } from '../../types';
import { useStore } from '../../context/StoreContext';
import { X, Tag, Plus, Trash2, Power, Sparkles } from 'lucide-react';

interface VoucherManagementModalProps {
  onClose: () => void;
}

export const VoucherManagementModal: React.FC<VoucherManagementModalProps> = ({ onClose }) => {
  const { vouchers, addVoucher, deleteVoucher, toggleVoucherStatus, showToast } = useStore();

  const [code, setCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState('15000');
  const [minSpend, setMinSpend] = useState('50000');
  const [description, setDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      showToast('Kode voucher tidak boleh kosong');
      return;
    }

    const discountNum = parseInt(discountAmount.replace(/\D/g, ''), 10) || 10000;
    const minSpendNum = parseInt(minSpend.replace(/\D/g, ''), 10) || 50000;

    const newVoucher: Voucher = {
      code: code.trim().toUpperCase(),
      discountAmount: discountNum,
      minSpend: minSpendNum,
      description: description.trim() || `Potongan Rp ${discountNum.toLocaleString('id-ID')}`,
      isActive: true,
      discountType: 'nominal',
    };

    addVoucher(newVoucher);
    setCode('');
    setDescription('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-[460px] w-full p-5 sm:p-6 shadow-2xl border border-[#ECE4DA] max-h-[92vh] overflow-y-auto no-scrollbar relative animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#ECE4DA]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#26160F] text-[#FDB882] flex items-center justify-center shadow-xs shrink-0">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-[18px] font-bold text-[#26160F]">
                Kelola Promo & Voucher
              </h3>
              <p className="text-[11px] text-[#75645C]">
                Atur diskon belanja untuk pelanggan Patawi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#EFE8E0] text-[#75645C] hover:text-[#26160F] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-bold text-[#26160F]">
            Daftar Kupon Aktif ({vouchers.length})
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 bg-[#26160F] hover:bg-[#C86826] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#FDB882]" />
            {showAddForm ? 'Batal Tambah' : 'Tambah Voucher'}
          </button>
        </div>

        {/* Add Form (Collapsible) */}
        {showAddForm && (
          <form
            onSubmit={handleCreateVoucher}
            className="mt-3.5 p-4 bg-[#FAF7F2] rounded-2xl border border-[#ECE4DA] space-y-3 text-xs animate-in fade-in"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#865225]">
              <Sparkles className="w-3.5 h-3.5 text-[#C86826]" />
              <span>Buat Kupon Diskon Baru</span>
            </div>

            <div>
              <label className="text-[10.5px] font-bold text-[#75645C] block mb-1">
                Kode Kupon (Uppercase) *
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="CONTOH: BEANSSENOPATI"
                required
                className="w-full bg-white border border-[#ECE4DA] rounded-xl px-3 py-2 font-mono text-xs font-bold text-[#26160F] focus:outline-hidden focus:border-[#C86826]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10.5px] font-bold text-[#75645C] block mb-1">
                  Potongan Diskon (Rp) *
                </label>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  required
                  className="w-full bg-white border border-[#ECE4DA] rounded-xl px-2.5 py-1.5 font-bold text-xs text-[#26160F] focus:outline-hidden focus:border-[#C86826]"
                />
              </div>
              <div>
                <label className="text-[10.5px] font-bold text-[#75645C] block mb-1">
                  Minimal Belanja (Rp) *
                </label>
                <input
                  type="number"
                  value={minSpend}
                  onChange={(e) => setMinSpend(e.target.value)}
                  required
                  className="w-full bg-white border border-[#ECE4DA] rounded-xl px-2.5 py-1.5 font-bold text-xs text-[#26160F] focus:outline-hidden focus:border-[#C86826]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10.5px] font-bold text-[#75645C] block mb-1">
                Keterangan Promo
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Diskon spesial festival seduh Senopati"
                className="w-full bg-white border border-[#ECE4DA] rounded-xl px-3 py-2 text-xs text-[#26160F] focus:outline-hidden focus:border-[#C86826]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#C86826] hover:bg-[#9A4710] text-white py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
            >
              Simpan & Aktifkan Voucher
            </button>
          </form>
        )}

        {/* Voucher List */}
        <div className="mt-3.5 space-y-2.5">
          {vouchers.map((v) => {
            const isActive = v.isActive !== false;
            return (
              <div
                key={v.code}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-white border-[#ECE4DA] depth-card'
                    : 'bg-[#FAF7F2] border-dashed border-[#D9CEC5] opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-[#FAF7F2] text-[#26160F] px-2 py-0.5 rounded border border-[#ECE4DA]">
                        {v.code}
                      </span>
                      <span
                        className={`text-[9.5px] font-bold px-2 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>

                    <h5 className="font-serif text-[14px] font-bold text-[#C86826] mt-1">
                      Potongan Rp {v.discountAmount.toLocaleString('id-ID')}
                    </h5>
                    <p className="text-[11px] text-[#75645C] mt-0.5">
                      Min. Belanja: Rp {v.minSpend.toLocaleString('id-ID')}
                    </p>
                    <span className="text-[10px] text-[#865225] italic block mt-0.5">
                      "{v.description}"
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                    <button
                      type="button"
                      onClick={() => toggleVoucherStatus(v.code)}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#FAF7F2] hover:bg-amber-50 text-[#75645C] hover:text-amber-700 border-[#ECE4DA]'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                      title={isActive ? 'Nonaktifkan Voucher' : 'Aktifkan Voucher'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteVoucher(v.code)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                      title="Hapus Voucher"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
