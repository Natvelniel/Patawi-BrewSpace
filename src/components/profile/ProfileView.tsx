import React from 'react';
import { useStore } from '../../context/StoreContext';
import { COFFEE_PRODUCTS } from '../../data/coffeeProducts';
import {
  Heart,
  MapPin,
  Coffee,
  CreditCard,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { favorites, toggleFavorite, setSelectedProductModal, showToast } = useStore();

  const favProducts = COFFEE_PRODUCTS.filter((p) => favorites.includes(p.id));

  return (
    <div className="pb-8 pt-3 px-4 bg-[#FAF7F2] min-h-full space-y-4">
      {/* User Header Card */}
      <div className="bg-white rounded-3xl border border-[#ECE4DA] p-5 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#C86826] shadow-xs shrink-0">
            <img
              src="/assets/9e21e.png"
              alt="Avatar Pengguna"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif text-[18px] font-bold text-[#26160F] truncate">
                Nathaniel Huang
              </h3>
              <Sparkles className="w-4 h-4 text-[#C86826] shrink-0" />
            </div>
            <p className="text-xs text-[#75645C] truncate">
              nathanielchristian1109@gmail.com
            </p>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold bg-[#FDF3EB] text-[#865225] px-2.5 py-0.5 rounded-full border border-[#FDB882]/40">
              Gold Member • Patawi Connoisseur
            </span>
          </div>
        </div>

        {/* Member Benefits */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#F4EFE9] text-center">
          <div className="bg-[#FAF7F2] p-2.5 rounded-2xl border border-[#ECE4DA]">
            <span className="text-[10px] text-[#75645C] block">Poin Sangrai</span>
            <span className="font-serif text-[16px] font-bold text-[#26160F]">1.450</span>
          </div>
          <div className="bg-[#FAF7F2] p-2.5 rounded-2xl border border-[#ECE4DA]">
            <span className="text-[10px] text-[#75645C] block">Voucher Aktif</span>
            <span className="font-serif text-[16px] font-bold text-[#C86826]">2 Kupon</span>
          </div>
          <div className="bg-[#FAF7F2] p-2.5 rounded-2xl border border-[#ECE4DA]">
            <span className="text-[10px] text-[#75645C] block">Total Seduhan</span>
            <span className="font-serif text-[16px] font-bold text-[#26160F]">48 Cup</span>
          </div>
        </div>
      </div>

      {/* Favorite Beans Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-[17px] font-bold text-[#26160F]">
            Biji Kopi Favorit ({favProducts.length})
          </h4>
        </div>

        {favProducts.length === 0 ? (
          <p className="text-xs text-[#75645C] italic">
            Belum ada biji kopi yang ditandai sebagai favorit.
          </p>
        ) : (
          <div className="space-y-2">
            {favProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProductModal(p)}
                className="bg-white rounded-2xl border border-[#ECE4DA] p-3 flex items-center justify-between cursor-pointer hover:bg-[#FAF7F2] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#ECE4DA]">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-serif text-[14px] font-bold text-[#26160F] line-clamp-1">
                      {p.name}
                    </h5>
                    <span className="text-xs text-[#865225] font-semibold">
                      Rp {p.basePrice.toLocaleString('id-ID')} / 200g
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(p.id);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings / Preferences Menu */}
      <div className="bg-white rounded-3xl border border-[#ECE4DA] divide-y divide-[#F4EFE9] shadow-2xs overflow-hidden">
        <button
          onClick={() => showToast('Membuka daftar alamat tersimpan')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#FAF7F2] text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[#865225]" />
            <span className="text-xs font-semibold text-[#26160F]">
              Alamat Pengiriman Utama (Senopati, Jakarta)
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#75645C]" />
        </button>

        <button
          onClick={() => showToast('Preferensi seduhan: Pour Over V60 & Aeropress')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#FAF7F2] text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Coffee className="w-4 h-4 text-[#865225]" />
            <span className="text-xs font-semibold text-[#26160F]">
              Profil Seduhan & Rekomendasi Grinder
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#75645C]" />
        </button>

        <button
          onClick={() => showToast('Metode pembayaran utama terhubung: QRIS BCA')}
          className="w-full p-4 flex items-center justify-between hover:bg-[#FAF7F2] text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-[#865225]" />
            <span className="text-xs font-semibold text-[#26160F]">
              Metode Pembayaran QRIS & E-Wallet
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#75645C]" />
        </button>
      </div>

      {/* Logout / Switch */}
      <div className="pt-2">
        <button
          onClick={() => showToast('Sesi akun Nathaniel Huang tetap aktif')}
          className="w-full py-2.5 text-center text-xs font-semibold text-[#75645C] hover:text-[#26160F] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
};
