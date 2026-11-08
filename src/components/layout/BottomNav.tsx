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
    <nav className="fixed bottom-0 left-0 right-0 z-30 max-w-[480px] mx-auto bg-white/95 backdrop-blur-md border-t border-[#EAE8E4] px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          if (isActive) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center justify-center bg-[#2B1810] text-[#FDB882] px-3.5 py-1.5 rounded-[14px] shadow-sm transition-all scale-102 cursor-pointer"
              >
                <div className="relative">
                  <Icon className="w-5 h-5 text-[#FDB882]" />
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-[#865225] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-[#2B1810]">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold tracking-tight mt-0.5 text-[#FDB882]">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center text-[#4F4440] hover:text-[#2B1810] px-3 py-1.5 transition-colors cursor-pointer group"
            >
              <div className="relative">
                <Icon className="w-5 h-5 text-[#4F4440] group-hover:text-[#2B1810] transition-colors" />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#865225] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium tracking-tight mt-0.5 text-[#4F4440] group-hover:text-[#2B1810]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
