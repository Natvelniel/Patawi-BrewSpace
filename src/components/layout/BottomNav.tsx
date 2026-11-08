import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ActiveTab } from '../../types';
import { Coffee, Store, ShoppingBag, ReceiptText, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, cartCount, orders } = useStore();

  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;

  const tabs: {
    id: ActiveTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'home', label: 'Beranda', icon: Coffee },
    { id: 'catalog', label: 'Katalog', icon: Store },
    { id: 'cart', label: 'Keranjang', icon: ShoppingBag, badge: cartCount },
    { id: 'tracking', label: 'Pesanan', icon: ReceiptText, badge: activeOrdersCount },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <nav className="shrink-0 bg-white/95 backdrop-blur-md border-t border-[#ECE4DA] px-2 py-1.5 z-20 transition-all select-none">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          if (isActive) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center justify-center bg-[#26160F] text-[#FDB882] px-3.5 py-1.5 rounded-2xl shadow-xs transition-all scale-102 cursor-pointer min-w-[56px]"
              >
                <div className="relative">
                  <Icon className="w-4 h-4 text-[#FDB882]" />
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-[#C86826] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-[#26160F] leading-none">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold tracking-tight mt-0.5 text-[#FDB882]">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center text-[#6B5A52] hover:text-[#26160F] px-2.5 py-1.5 transition-colors cursor-pointer group min-w-[52px]"
            >
              <div className="relative">
                <Icon className="w-4 h-4 text-[#6B5A52] group-hover:text-[#26160F] transition-colors" />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#C86826] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-none">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium tracking-tight mt-0.5 text-[#6B5A52] group-hover:text-[#26160F]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
