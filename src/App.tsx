import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
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
import { Smartphone, Monitor, Sparkles } from 'lucide-react';

const MainApp: React.FC = () => {
  const { role, activeTab, toastMessage } = useStore();
  const [isFullWidthDesktop, setIsFullWidthDesktop] = useState(false);

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
    <div className="min-h-screen bg-[#160C07] flex flex-col items-center justify-center p-0 md:py-2 md:px-4 text-[#1B1C1A] selection:bg-[#C86826] selection:text-white">
      {/* Desktop Helper Toolbar */}
      <div className="w-full max-w-[400px] md:max-w-xl hidden md:flex items-center justify-between px-2 mb-2 text-white/70 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">Patawi Coffee</span>
          <span className="text-white/30">|</span>
          <span className="text-[#FDB882] text-[11px] font-medium">Artisanal Roastery Demo</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullWidthDesktop(!isFullWidthDesktop)}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.2 rounded-lg text-white text-xs font-medium transition-colors cursor-pointer"
          >
            {isFullWidthDesktop ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#FDB882]" /> Mobile Bezel
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#FDB882]" /> Full Preview
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container / Device Viewport */}
      <main
        className={`w-full transition-all duration-300 relative bg-[#FAF7F2] flex flex-col overflow-hidden ${
          isFullWidthDesktop
            ? 'max-w-2xl min-h-[90vh] md:rounded-3xl md:border md:border-[#382015] md:shadow-2xl'
            : 'max-w-[400px] h-[100dvh] md:h-[min(760px,calc(100vh-60px))] md:rounded-[44px] md:border-[8px] md:border-[#22130C] md:ring-1 md:ring-white/15 md:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)]'
        }`}
      >
        {/* Dynamic Island / Status Bar (Only in Mobile Bezel mode) */}
        {!isFullWidthDesktop && (
          <div className="hidden md:flex items-center justify-between px-8 pt-3 pb-1 text-[#26160F] text-xs font-bold shrink-0 select-none">
            <span>09:41</span>
            {/* Dynamic island pill */}
            <div className="w-24 h-4 bg-[#22130C] rounded-full mx-auto flex items-center justify-end px-2">
              <div className="w-2 h-2 rounded-full bg-[#160C07] border border-white/10" />
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span>5G</span>
              <div className="w-4 h-2.5 border border-[#26160F] rounded-xs p-0.5">
                <div className="w-full h-full bg-[#26160F] rounded-2xs" />
              </div>
            </div>
          </div>
        )}

        {/* Global App Header (Role switcher, brand, notifications) */}
        <AppHeader />

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar overscroll-contain relative">
          {renderActiveView()}
        </div>

        {/* Bottom Navigation (Contained within frame) */}
        <BottomNav />

        {/* iOS Home Indicator Bar */}
        {!isFullWidthDesktop && (
          <div className="hidden md:flex justify-center pb-1.5 pt-0.5 bg-white/95 shrink-0">
            <div className="w-28 h-1 bg-[#26160F]/20 rounded-full" />
          </div>
        )}

        {/* Global Modals */}
        <ProductDetailModal />
        <GrindGuideModal />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-[#26160F] text-white px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-xl border border-[#FDB882]/30 flex items-center gap-2 animate-in fade-in slide-in-from-top-3 max-w-[90%] text-center">
            <Sparkles className="w-4 h-4 text-[#FDB882] shrink-0" />
            <span>{toastMessage}</span>
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
