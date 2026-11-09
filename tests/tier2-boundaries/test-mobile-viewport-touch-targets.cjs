const { TestSuite, readWorkspaceFile, assert } = require('../test-utils.cjs');

const suite = new TestSuite('Tier 2 — Boundary & Ergonomics: Mobile Viewports & Touch Targets');

suite.test('Viewport constraint: App shell constrains mobile layout to max 400px and prevents horizontal overflow', () => {
  const appSrc = readWorkspaceFile('src/App.tsx');
  assert(appSrc.includes('max-w-[400px]') || appSrc.includes('max-w-[420px]') || appSrc.includes('md:max-w-[420px]'), 'Must enforce max-w of 400px-420px for mobile bezel container');
  assert(appSrc.includes('overflow-x-hidden'), 'Scroll area must enforce overflow-x-hidden to prevent horizontal scrolling');
});

suite.test('Touch Targets: Bottom navigation buttons meet >=44px minimum tap size', () => {
  const navSrc = readWorkspaceFile('src/components/layout/BottomNav.tsx');
  assert(navSrc.includes('min-h-[46px]') || navSrc.includes('min-h-[44px]'), 'Bottom navigation buttons must declare min-h of at least 44px');
  assert(navSrc.includes('min-w-[54px]') || navSrc.includes('min-w-[44px]'), 'Bottom navigation buttons must declare min-w of at least 44px');
});

suite.test('Safe Area Inset: Header and bottom navigation apply safe area protection', () => {
  const headerSrc = readWorkspaceFile('src/components/layout/AppHeader.tsx');
  const navSrc = readWorkspaceFile('src/components/layout/BottomNav.tsx');

  assert(headerSrc.includes('env(safe-area-inset-top'), 'AppHeader must protect against notch/status bar with safe-area-inset-top');
  assert(navSrc.includes('env(safe-area-inset-bottom'), 'BottomNav must protect against home indicator with safe-area-inset-bottom');
});

suite.test('Bottom Clearance: Scrollable views provide sufficient bottom padding to clear navigation bar', () => {
  const homeSrc = readWorkspaceFile('src/components/home/HomeView.tsx');
  const catalogSrc = readWorkspaceFile('src/components/catalog/CatalogView.tsx');
  const cartSrc = readWorkspaceFile('src/components/cart/CartView.tsx');
  const adminSrc = readWorkspaceFile('src/components/admin/AdminDashboardView.tsx');
  const deliverySrc = readWorkspaceFile('src/components/delivery/DeliveryDashboardView.tsx');

  const hasBottomPadding = (src) => /pb-(16|20|24|28)/.test(src);

  assert(hasBottomPadding(homeSrc), 'HomeView must provide bottom clearance padding');
  assert(hasBottomPadding(catalogSrc), 'CatalogView must provide bottom clearance padding');
  assert(hasBottomPadding(cartSrc), 'CartView must provide bottom clearance padding');
  assert(hasBottomPadding(adminSrc), 'AdminDashboardView must provide bottom clearance padding');
  assert(hasBottomPadding(deliverySrc), 'DeliveryDashboardView must provide bottom clearance padding');
});

module.exports = suite;

if (require.main === module) {
  suite.run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
