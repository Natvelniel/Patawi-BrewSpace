import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Role } from '../../types';
import { Bell, LogIn } from 'lucide-react';

export const AppHeader: React.FC = () => {
  const { role, setRole, orders, showToast, currentUser, isLoggedIn, setShowAuthModal } = useStore();

  const roles: { id: Role; label: string }[] = [
    { id: 'customer', label: 'Customer' },
    { id: 'admin', label: 'Admin Patawi' },
    { id: 'delivery', label: 'Delivery Order' },
  ];

  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-xl border-b border-[#ECE4DA]/80 px-5 pt-[max(0.75rem,env(safe-area-inset-top,12px))] pb-2.5 transition-colors select-none shrink-0 shadow-[0_2px_10px_rgba(38,22,15,0.03)]">
      <div className="flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex flex-col">
          <span className="font-serif text-[22px] font-bold text-[#26160F] tracking-tight leading-none">
            Patawi
          </span>
          <span className="font-serif text-[17px] font-medium text-[#865225] tracking-tight leading-none mt-0.5">
            Coffee
          </span>
        </div>

        {/* Action icons & Auth trigger */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => showToast(`Anda memiliki ${activeOrdersCount} pesanan aktif`)}
            className="relative w-9 h-9 rounded-full text-[#5C4D46] hover:bg-[#EFE8E0] hover:text-[#26160F] flex items-center justify-center transition-colors cursor-pointer"
            title="Notifikasi"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {activeOrdersCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#C86826] rounded-full ring-2 ring-[#FAF7F2]" />
            )}
          </button>

          {/* User Profile Avatar / Login Button */}
          {isLoggedIn && currentUser ? (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 p-1 pl-2.5 pr-1 rounded-full bg-[#EFE8E0]/70 hover:bg-[#E5DCD2] border border-[#ECE4DA] transition-all cursor-pointer active:scale-95"
              title="Kelola Akun"
            >
              <span className="text-[11px] font-bold text-[#26160F] max-w-[80px] truncate hidden sm:inline">
                {currentUser.name.split(' ')[0]}
              </span>
              <div className="w-7 h-7 rounded-full overflow-hidden border border-[#C86826] shadow-2xs shrink-0 bg-[#FAF7F2]">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 bg-[#26160F] hover:bg-[#3E2419] text-[#FDB882] px-3 py-1.5 rounded-full text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" /> Masuk
            </button>
          )}
        </div>
      </div>

      {/* Role Switcher Pills */}
      <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
        {roles.map((r) => {
          const isActive = role === r.id;
          return (
            <button
              key={r.id}
              onClick={() => {
                setRole(r.id);
                showToast(`Mode dialihkan ke: ${r.label}`);
              }}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#26160F] text-[#FFFFFF] shadow-xs scale-102'
                  : 'bg-[#EFE8E0] text-[#5C4D46] hover:bg-[#E5DCD2]'
              }`}
            >
              {r.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
