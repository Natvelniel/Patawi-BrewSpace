import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Role } from '../../types';
import { Bell } from 'lucide-react';

export const AppHeader: React.FC = () => {
  const { role, setRole, orders, showToast } = useStore();

  const roles: { id: Role; label: string }[] = [
    { id: 'customer', label: 'Customer' },
    { id: 'admin', label: 'Admin Patawi' },
    { id: 'delivery', label: 'Delivery Order' },
  ];

  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#ECE4DA] px-5 pt-3.5 pb-2.5 transition-colors select-none shrink-0">
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

        {/* Action icons */}
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

          {/* User Profile Avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D9CEC5] shadow-xs shrink-0">
            <img
              src="/assets/9e21e.png"
              alt="Profil Pengguna"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
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
