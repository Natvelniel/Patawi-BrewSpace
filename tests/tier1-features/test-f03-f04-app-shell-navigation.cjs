const { TestSuite, readWorkspaceFile, assert } = require('../test-utils.cjs');

const suite = new TestSuite('Tier 1 — F03 & F04: App Shell, Bezel & Navigation');

suite.test('F04: App.tsx implements dual viewport support (Mobile Bezel vs Full Preview)', () => {
  const appSrc = readWorkspaceFile('src/App.tsx');
  assert(appSrc.includes('isFullWidthDesktop'), 'Must have isFullWidthDesktop state toggle');
  assert(appSrc.includes('max-w-[400px]') || appSrc.includes('max-w-[420px]') || appSrc.includes('md:max-w-[420px]'), 'Must support 400-420px mobile bezel frame');
  assert(appSrc.includes('max-w-2xl') || appSrc.includes('max-w-5xl') || appSrc.includes('md:max-w-xl'), 'Must support expanded desktop preview container');
  assert(appSrc.includes('Smartphone') && appSrc.includes('Monitor'), 'Must render viewport switch toggle icons');
});

suite.test('F04: App.tsx renders distinct role views and scrolls to top on navigation', () => {
  const appSrc = readWorkspaceFile('src/App.tsx');
  assert(appSrc.includes("role === 'admin'"), 'Must route to AdminDashboardView when role is admin');
  assert(appSrc.includes("role === 'delivery'"), 'Must route to DeliveryDashboardView when role is delivery');
  assert(appSrc.includes('AdminDashboardView'), 'Must import and mount AdminDashboardView');
  assert(appSrc.includes('DeliveryDashboardView'), 'Must import and mount DeliveryDashboardView');
  assert(appSrc.includes('scrollContainerRef'), 'Must reference scroll container to reset scroll position on view change');
});

suite.test('F04: AppHeader.tsx renders 3-role switcher with active indicator', () => {
  const headerSrc = readWorkspaceFile('src/components/layout/AppHeader.tsx');
  assert(headerSrc.includes("'customer'"), 'Must include customer role option');
  assert(headerSrc.includes("'admin'"), 'Must include admin role option');
  assert(headerSrc.includes("'delivery'"), 'Must include delivery role option');
  assert(headerSrc.includes('setRole'), 'Must trigger setRole on role button click');
  assert(headerSrc.includes('grid-cols-3'), 'Must arrange roles in a balanced 3-column segmented control');
  assert(headerSrc.includes('font-serif'), 'Brand title must use Playfair font-serif');
});

suite.test('F04: BottomNav.tsx renders role-specific tabs with minimum touch dimensions', () => {
  const navSrc = readWorkspaceFile('src/components/layout/BottomNav.tsx');
  // Customer tabs
  assert(navSrc.includes("'home'") && navSrc.includes('Beranda'), 'Customer nav must have Beranda tab');
  assert(navSrc.includes("'catalog'") && navSrc.includes('Katalog'), 'Customer nav must have Katalog tab');
  assert(navSrc.includes("'cart'") && navSrc.includes('Keranjang'), 'Customer nav must have Keranjang tab');
  assert(navSrc.includes("'tracking'") && navSrc.includes('Pesanan'), 'Customer nav must have Pesanan tab');
  assert(navSrc.includes("'profile'") && navSrc.includes('Profil'), 'Customer nav must have Profil tab');

  // Courier tabs
  assert(navSrc.includes("'active'") && navSrc.includes('Tugas Antar'), 'Courier nav must have Tugas Antar tab');
  assert(navSrc.includes("'history'") && navSrc.includes('Riwayat'), 'Courier nav must have Riwayat tab');
  assert(navSrc.includes("'earnings'") && navSrc.includes('Performa'), 'Courier nav must have Performa tab');

  // Admin tabs
  assert(navSrc.includes("'queue'") && navSrc.includes('Antrean'), 'Admin nav must have Antrean tab');
  assert(navSrc.includes("'inventory'") && navSrc.includes('Stok Biji'), 'Admin nav must have Stok Biji tab');
  assert(navSrc.includes("'reports'") && navSrc.includes('Laporan'), 'Admin nav must have Laporan tab');

  // Ergonomic touch sizes & safe area
  assert(navSrc.includes('min-h-[46px]') || navSrc.includes('min-h-[44px]'), 'Buttons must meet 44px minimum touch height');
  assert(navSrc.includes('safe-area-inset-bottom'), 'Must include safe-area-inset-bottom padding');
});

module.exports = suite;

if (require.main === module) {
  suite.run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
