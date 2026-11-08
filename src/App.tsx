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
    <div className="min-h-screen bg-[#1F140E] flex flex-col items-center justify-start text-[#1B1C1A]">
      {/* Top Desktop Helper Toolbar */}
      <div className="w-full max-w-2xl hidden md:flex items-center justify-between px-4 py-2.5 text-white/70 text-[12px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold text-white">Patawi Coffee — Live Web Demo</span>
          <span className="text-white/40">|</span>
          <span className="text-[11px] text-[#FDB882]">Figma Design 390px (Mobile-First)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullWidthDesktop(!isFullWidthDesktop)}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg text-white text-[11px] font-semibold transition-colors cursor-pointer"
          >
            {isFullWidthDesktop ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#FDB882]" /> Mobile Frame
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#FDB882]" /> Fullscreen Mode
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container / Device Frame */}
      <main
        className={`w-full transition-all duration-300 relative bg-[#FBF9F5] min-h-screen shadow-2xl flex flex-col ${
          isFullWidthDesktop
            ? 'max-w-3xl md:rounded-3xl md:my-4 md:border md:border-[#3A241A] overflow-hidden'
            : 'max-w-[430px] md:rounded-[40px] md:my-6 md:border-[10px] md:border-[#2F1F17] md:ring-1 md:ring-white/10 overflow-hidden'
        }`}
      >
        {/* Device Status Bar Notch on Desktop Frame */}
        {!isFullWidthDesktop && (
          <div className="hidden md:flex items-center justify-between px-7 pt-3 pb-1 text-[#2B1810] text-[11px] font-bold">
            <span>09:41</span>
            <div className="w-20 h-4 bg-[#2F1F17] rounded-full mx-auto" />
            <div className="flex items-center gap-1">
              <span>5G</span>
              <div className="w-4 h-2.5 border border-[#2B1810] rounded-xs p-0.5">
                <div className="w-full h-full bg-[#2B1810]" />
              </div>
            </div>
          </div>
        )}

        {/* Global Header */}
        <AppHeader />

        {/* Dynamic View Body */}
        <div className="flex-1 overflow-x-hidden">{renderActiveView()}</div>

        {/* Bottom Navigation */}
        <BottomNav />

        {/* Global Modals */}
        <ProductDetailModal />
        <GrindGuideModal />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#2B1810] text-white px-4 py-2 rounded-xl text-[12px] font-bold shadow-xl border border-[#FDB882]/30 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FDB882]" />
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
