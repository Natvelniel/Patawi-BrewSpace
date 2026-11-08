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
    <div className="pb-32 pt-2 px-4 bg-[#FBF9F5] min-h-screen space-y-4">
      {/* User Header Card */}
      <div className="bg-white rounded-3xl border border-[#EAE8E4] p-5 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#E08A44] shadow-xs">
            <img
              src="/assets/9e21e.png"
              alt="Avatar Pengguna"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif text-[18px] font-bold text-[#2B1810] truncate">
                Nathaniel Huang
              </h3>
              <Sparkles className="w-4 h-4 text-[#E08A44] shrink-0" />
            </div>
            <p className="text-[12px] text-[#817470] truncate">
              nathanielchristian1109@gmail.com
            </p>
            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold bg-[#FDF3EB] text-[#865225] px-2.5 py-0.5 rounded-full border border-[#FDB882]/40">
              Gold Member • Patawi Connoisseur
            </span>
          </div>
        </div>

        {/* Member Benefits */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#F5F3EF] text-center">
          <div className="bg-[#FBF9F5] p-2 rounded-xl border border-[#EAE8E4]">
            <span className="text-[10px] text-[#817470] block">Poin Sangrai</span>
            <span className="font-serif text-[15px] font-bold text-[#2B1810]">1.450</span>
          </div>
          <div className="bg-[#FBF9F5] p-2 rounded-xl border border-[#EAE8E4]">
            <span className="text-[10px] text-[#817470] block">Voucher Aktif</span>
            <span className="font-serif text-[15px] font-bold text-[#E08A44]">2 Kupon</span>
          </div>
          <div className="bg-[#FBF9F5] p-2 rounded-xl border border-[#EAE8E4]">
            <span className="text-[10px] text-[#817470] block">Total Seduhan</span>
            <span className="font-serif text-[15px] font-bold text-[#2B1810]">48 Cup</span>
          </div>
        </div>
      </div>

      {/* Favorite Beans Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-[16px] font-bold text-[#2B1810]">
            Biji Kopi Favorit ({favProducts.length})
          </h4>
        </div>

        {favProducts.length === 0 ? (
          <p className="text-[12px] text-[#817470] italic">
            Belum ada biji kopi yang ditandai sebagai favorit.
          </p>
        ) : (
          <div className="space-y-2">
            {favProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProductModal(p)}
                className="bg-white rounded-2xl border border-[#EAE8E4] p-3 flex items-center justify-between cursor-pointer hover:bg-[#F5F3EF] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#EFEEEA] shrink-0 border border-[#EAE8E4]">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-serif text-[14px] font-bold text-[#2B1810] line-clamp-1">
                      {p.name}
                    </h5>
                    <span className="text-[11px] text-[#865225]">
                      Rp {p.basePrice.toLocaleString('id-ID')} / 200g
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(p.id);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                >
                  <Heart className="w-4 h-4 fill-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings / Preferences Menu */}
      <div className="bg-white rounded-2xl border border-[#EAE8E4] divide-y divide-[#F5F3EF] shadow-2xs">
        <button
          onClick={() => showToast('Membuka daftar alamat tersimpan')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-[#FBF9F5] text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[#865225]" />
            <span className="text-[13px] font-medium text-[#2B1810]">
              Alamat Pengiriman Utama (Senopati, Jakarta)
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#817470]" />
        </button>

        <button
          onClick={() => showToast('Preferensi seduhan: Pour Over V60 & Aeropress')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-[#FBF9F5] text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Coffee className="w-4 h-4 text-[#865225]" />
            <span className="text-[13px] font-medium text-[#2B1810]">
              Profil Seduhan & Rekomendasi Grinder
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#817470]" />
        </button>

        <button
          onClick={() => showToast('Metode pembayaran utama terhubung: QRIS BCA')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-[#FBF9F5] text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-[#865225]" />
            <span className="text-[13px] font-medium text-[#2B1810]">
              Metode Pembayaran QRIS & E-Wallet
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#817470]" />
        </button>
      </div>

      {/* Logout / Switch */}
      <div className="pt-2">
        <button
          onClick={() => showToast('Sesi akun Nathaniel Huang tetap aktif')}
          className="w-full py-2.5 text-center text-[12px] font-semibold text-[#817470] hover:text-[#2B1810] flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
};
