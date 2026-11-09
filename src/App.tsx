import React, { useState, useRef, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Role } from './types';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNav } from './components/layout/BottomNav';
import { HomeView } from './components/home/HomeView';
import { CatalogView } from './components/catalog/CatalogView';
import { CartView } from './components/cart/CartView';
import { TrackingView } from './components/tracking/TrackingView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { DeliveryDashboardView } from './components/delivery/DeliveryDashboardView';
import { ProductDetailModal } from './components/catalog/ProductDetailModal';
import { GrindGuideModal } from './components/home/GrindGuideModal';
import { AuthModal } from './components/auth/AuthModal';
import { FilterModal } from './components/catalog/FilterModal';
import { Smartphone, Monitor, Sparkles, Coffee, Flame, Bike } from 'lucide-react';

interface RoleOption {
  id: Role;
  name: string;
  shortName: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  activeClass: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'customer',
    name: 'Customer',
    shortName: 'Customer',
    badge: 'Pembeli',
    icon: Coffee,
    activeClass:
      'bg-[#FAF7F2] text-[#26160F] border-[#ECE4DA] shadow-xs rim-light font-bold',
  },
  {
    id: 'admin',
    name: 'Roastery Admin',
    shortName: 'Admin',
    badge: 'Head Roaster',
    icon: Flame,
    activeClass:
      'bg-[#26160F] text-[#FDB882] border-[#865225] shadow-xs rim-light-dark font-bold',
  },
  {
    id: 'delivery',
    name: 'Courier DO',
    shortName: 'Kurir',
    badge: 'GoSend Mitra',
    icon: Bike,
    activeClass:
      'bg-[#160C07] text-[#10B981] border-[#10B981]/50 shadow-xs rim-light-dark font-bold',
  },
];

const MainApp: React.FC = () => {
  const { role, setRole, activeTab, toastMessage, showToast } = useStore();
  const [isFullWidthDesktop, setIsFullWidthDesktop] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to top on tab or role switch
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [role, activeTab]);

  const renderActiveView = () => {
    if (role === 'admin') return <AdminDashboardView />;
    if (role === 'delivery') return <DeliveryDashboardView />;

    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'catalog':
        return <CatalogView />;
      case 'cart':
        return <CartView />;
      case 'tracking':
        return <TrackingView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="h-dvh h-[100dvh] w-full bg-[#160C07] flex flex-col items-center justify-start md:justify-center p-0 md:py-2 md:px-4 text-[#26160F] selection:bg-[#C86826] selection:text-white overflow-hidden">
      {/* Desktop Helper Toolbar with Tactile Role Switcher & Viewport Toggle */}
      <div
        className={`w-full transition-all duration-300 hidden md:flex items-center justify-between px-3 py-1.5 mb-2 bg-[#26160F]/95 backdrop-blur-md rounded-2xl border border-[#382015] shadow-lg shrink-0 ${
          isFullWidthDesktop ? 'max-w-5xl' : 'max-w-2xl'
        }`}
      >
        {/* Brand Identity / Demo Tag */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 rounded-lg bg-[#382015] border border-[#5C4D46]/40 flex items-center justify-center text-[#FDB882] shadow-inner rim-light-dark">
            <Coffee className="w-3.5 h-3.5 text-[#FDB882]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-bold text-white text-xs tracking-tight">
              Patawi BrewSpace
            </span>
            <span className="text-white/30 text-xs">|</span>
            <span className="text-[#FDB882] text-[11px] font-medium hidden lg:inline">
              Senopati Roastery
            </span>
          </div>
        </div>

        {/* Tactile Role Switcher (Desktop Bar) */}
        <div className="flex items-center gap-1 bg-[#1A0E0A]/90 p-1 rounded-xl border border-[#382015] shrink-0">
          {ROLE_OPTIONS.map((opt) => {
            const isActive = role === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  setRole(opt.id);
                  showToast(`Mode dialihkan ke: ${opt.name}`);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all duration-200 cursor-pointer select-none border ${
                  isActive
                    ? opt.activeClass
                    : 'text-white/60 hover:text-white hover:bg-white/5 border-transparent'
                }`}
                title={`${opt.name} (${opt.badge})`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="font-semibold text-[11px]">
                  {isFullWidthDesktop ? opt.name : opt.shortName}
                </span>
                {isFullWidthDesktop && (
                  <span className="text-[9px] opacity-75 hidden xl:inline">({opt.badge})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Viewport Mode Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsFullWidthDesktop(!isFullWidthDesktop)}
            className="flex items-center gap-1.5 bg-[#382015] hover:bg-[#4E2B1D] border border-[#5C4D46]/40 text-[#FDB882] px-2.5 py-1 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer select-none"
            title={isFullWidthDesktop ? 'Switch to Mobile Bezel' : 'Switch to Desktop Preview'}
          >
            {isFullWidthDesktop ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#FDB882]" />
                <span className="text-[11px]">Mobile Bezel</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#FDB882]" />
                <span className="text-[11px]">Full Preview</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container / Device Viewport */}
      <main
        className={`w-full transition-all duration-300 relative bg-[#FAF7F2] flex flex-col overflow-hidden ${
          isFullWidthDesktop
            ? 'max-w-5xl h-full md:min-h-[88vh] md:max-h-[94vh] md:rounded-3xl md:border md:border-[#382015] md:shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
            : 'max-w-full md:max-w-[420px] h-full md:h-[min(844px,calc(100dvh-52px))] md:rounded-[48px] md:border-[10px] md:border-[#22130C] md:ring-1 md:ring-[#382015] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]'
        }`}
      >
        {/* Dynamic Island & Status Bar (Only in Mobile Bezel mode) */}
        {!isFullWidthDesktop && (
          <div className="hidden md:flex items-center justify-between px-8 pt-3 pb-1 text-[#26160F] text-xs font-bold shrink-0 select-none bg-[#FAF7F2]">
            <span className="tabular-nums">09:41</span>
            {/* Dynamic Island pill */}
            <div className="w-24 h-4 bg-[#160C07] rounded-full mx-auto flex items-center justify-between px-2.5 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-[#22130C] border border-white/10" />
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="font-semibold tracking-tight">5G</span>
              <div className="w-4 h-2.5 border border-[#26160F] rounded-xs p-0.5">
                <div className="w-full h-full bg-[#26160F] rounded-2xs" />
              </div>
            </div>
          </div>
        )}

        {/* Global App Header (Role switcher, brand, notifications) */}
        <AppHeader />

        {/* Scrollable View Area with Safe Bottom Nav Clearance (pb-24) */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar overscroll-contain relative pb-24"
        >
          {renderActiveView()}
        </div>

        {/* Bottom Navigation (Contained within frame) */}
        <BottomNav />

        {/* iOS Home Indicator Bar */}
        {!isFullWidthDesktop && (
          <div className="hidden md:flex justify-center pb-2 pt-1 bg-[#FAF7F2] shrink-0 border-t border-[#ECE4DA]/40">
            <div className="w-32 h-1 bg-[#26160F]/30 rounded-full" />
          </div>
        )}

        {/* Global Modals */}
        <ProductDetailModal />
        <GrindGuideModal />
        <AuthModal />
        <FilterModal />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-[#26160F] text-[#FAF7F2] px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl border border-[#382015] rim-light-dark flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 max-w-[90%] text-center">
            <Sparkles className="w-4 h-4 text-[#FDB882] shrink-0" />
            <span className="leading-snug">{toastMessage}</span>
          </div>
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}

