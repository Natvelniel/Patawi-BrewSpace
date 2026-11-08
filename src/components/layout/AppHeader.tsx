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
    <header className="sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#EAE8E4] px-5 pt-3.5 pb-2.5 shadow-xs transition-colors">
      <div className="flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex flex-col">
          <span className="font-serif text-[22px] font-bold text-[#2B1810] tracking-tight leading-none">
            Patawi
          </span>
          <span className="font-serif text-[18px] font-medium text-[#2B1810] tracking-tight -mt-0.5 leading-none">
            Coffee
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast(`Anda memiliki ${activeOrdersCount} pesanan aktif`)}
            className="relative p-2 rounded-full text-[#4F4440] hover:bg-[#EFEEEA] transition-colors focus:outline-hidden"
            title="Notifikasi"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {activeOrdersCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E08A44] rounded-full ring-2 ring-[#FBF9F5]" />
            )}
          </button>

          {/* User Profile Avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D3C3BE] shadow-xs">
            <img
              src="/assets/9e21e.png"
              alt="Profil Pengguna"
              className="w-full h-full object-cover"
              onError={(e) => {
                // fallback if image fails
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
              className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#2B1810] text-[#FFFFFF] shadow-xs scale-102'
                  : 'bg-[#EFEEEA] text-[#4F4440] hover:bg-[#EAE8E4]'
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
