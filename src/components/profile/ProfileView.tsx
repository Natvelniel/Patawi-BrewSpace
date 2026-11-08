import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Heart,
  MapPin,
  Coffee,
  CreditCard,
  LogOut,
  ChevronRight,
  Sparkles,
  User as UserIcon,
  LogIn,
  RotateCcw,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    favorites,
    toggleFavorite,
    setSelectedProductModal,
    showToast,
    currentUser,
    isLoggedIn,
    setShowAuthModal,
    logout,
    products,
  } = useStore();

  const favProducts = products.filter((p) => favorites.includes(p.id));

  // Penyamaran email untuk privasi & keamanan pengguna (e.g. nat••••••09@gmail.com)
  const maskEmail = (email: string) => {
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    const [name, domain] = parts;
    if (name.length <= 4) return `${name[0]}••••@${domain}`;
    return `${name.slice(0, 3)}••••••${name.slice(-2)}@${domain}`;
  };

  return (
    <div className="pb-16 pt-3 px-4 bg-[#FAF7F2] min-h-full space-y-4">
      {/* User Header Card */}
      {isLoggedIn && currentUser ? (
        <div className="bg-white rounded-3xl border border-[#ECE4DA] p-5 depth-card rim-light">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#C86826] shadow-xs shrink-0 bg-[#FAF7F2]">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif text-[18px] font-bold text-[#26160F] truncate">
                  {currentUser.name}
                </h3>
                <Sparkles className="w-4 h-4 text-[#C86826] shrink-0" />
              </div>
              <p className="text-xs text-[#75645C] font-mono tracking-tight truncate mt-0.5">
                {currentUser.role === 'customer' ? maskEmail(currentUser.email) : currentUser.email}
              </p>
              <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold bg-[#FDF3EB] text-[#865225] px-2.5 py-0.5 rounded-full border border-[#FDB882]/40">
                {currentUser.tier} • Patawi Member
              </span>
            </div>
          </div>

          {/* Member Benefits */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#F4EFE9] text-center">
            <div className="bg-[#FAF7F2] p-2.5 rounded-2xl border border-[#ECE4DA]">
              <span className="text-[10px] text-[#75645C] block">Poin Sangrai</span>
              <span className="font-serif text-[16px] font-bold text-[#26160F]">
                {currentUser.points.toLocaleString('id-ID')}
              </span>
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
      ) : (
        <div className="bg-white rounded-3xl border border-[#ECE4DA] p-6 depth-card text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#EFE8E0] text-[#865225] flex items-center justify-center mx-auto shadow-inner">
            <UserIcon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif text-[18px] font-bold text-[#26160F]">
              Masuk ke Akun Patawi
            </h3>
            <p className="text-xs text-[#75645C] mt-1">
              Nikmati diskon eksklusif member, poin reward, dan lacak pesanan secara langsung.
            </p>
          </div>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-[#26160F] hover:bg-[#3E2419] active:scale-[0.98] text-[#FDB882] py-3 rounded-2xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" /> Masuk / Daftar Akun
          </button>
        </div>
      )}

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
                className="bg-white rounded-2xl border border-[#ECE4DA] p-3 flex items-center justify-between cursor-pointer hover:bg-[#FAF7F2] transition-colors depth-card"
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
                  aria-label="Hapus Favorit"
                >
                  <Heart className="w-4 h-4 fill-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings / Preferences Menu */}
      <div className="bg-white rounded-3xl border border-[#ECE4DA] divide-y divide-[#F4EFE9] shadow-2xs overflow-hidden depth-card">
        <button
          onClick={() => showToast('Alamat utama: Jl. Senopati No. 42, Kebayoran Baru')}
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

      {/* Logout / Switch Account Actions */}
      {isLoggedIn && (
        <div className="pt-2 space-y-2">
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full py-2.5 text-center text-xs font-bold text-[#865225] hover:text-[#26160F] flex items-center justify-center gap-1.5 cursor-pointer bg-white border border-[#ECE4DA] rounded-2xl shadow-2xs hover:bg-[#FAF7F2] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Ganti Akun / Peran Demo
          </button>
          <button
            onClick={logout}
            className="w-full py-2.5 text-center text-xs font-bold text-red-600 hover:text-red-700 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Keluar dari Akun
          </button>
        </div>
      )}
    </div>
  );
};
