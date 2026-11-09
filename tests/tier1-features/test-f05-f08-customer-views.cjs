const { TestSuite, readWorkspaceFile, assert } = require('../test-utils.cjs');

const suite = new TestSuite('Tier 1 — F05 to F08: Customer Experience Views & Modals');

suite.test('F05: HomeView.tsx & GrindGuideModal.tsx render hero, roast showcase & guide', () => {
  const homeSrc = readWorkspaceFile('src/components/home/HomeView.tsx');
  const guideSrc = readWorkspaceFile('src/components/home/GrindGuideModal.tsx');

  assert(homeSrc.includes('Batch Sangrai Baru') || homeSrc.includes('Artisan') || homeSrc.includes('Sangrai'), 'Home must feature artisanal roast showcase identity');
  assert(homeSrc.includes('selectedRoast') || homeSrc.includes('setSelectedRoast'), 'Home must provide roast level selection');
  assert(homeSrc.includes('setShowGrindGuide'), 'Home must trigger Grind Guide modal');
  assert(guideSrc.includes('Biji Utuh') || guideSrc.includes('Whole Bean'), 'Grind guide must explain Whole Bean');
  assert(guideSrc.includes('V60') || guideSrc.includes('Aeropress'), 'Grind guide must recommend equipment like V60/Aeropress');
});

suite.test('F06: CatalogView.tsx, ProductDetailModal.tsx & FilterModal.tsx render beans & cupping specs', () => {
  const catalogSrc = readWorkspaceFile('src/components/catalog/CatalogView.tsx');
  const detailSrc = readWorkspaceFile('src/components/catalog/ProductDetailModal.tsx');
  const filterSrc = readWorkspaceFile('src/components/catalog/FilterModal.tsx');

  assert(catalogSrc.includes('selectedOrigin') || catalogSrc.includes('searchQuery'), 'Catalog must support origin filtering or search');
  assert(detailSrc.includes('scores.cuppingScore') || detailSrc.includes('cuppingScore') || detailSrc.includes('acidity'), 'Detail modal must display SCA cupping scores');
  assert(detailSrc.includes('200g') && detailSrc.includes('500g') && detailSrc.includes('1kg'), 'Detail modal must offer 200g, 500g, and 1kg package weights');
  assert(detailSrc.includes('addToCart'), 'Detail modal must have addToCart CTA');
  assert(filterSrc.includes('filterCriteria') || filterSrc.includes('setFilterCriteria'), 'Filter modal must manage multi-criteria filters');
});

suite.test('F07: CartView.tsx, QRISPaymentModal.tsx & InvoiceModal.tsx render checkout & invoice', () => {
  const cartSrc = readWorkspaceFile('src/components/cart/CartView.tsx');
  const qrisSrc = readWorkspaceFile('src/components/cart/QRISPaymentModal.tsx');
  const invoiceSrc = readWorkspaceFile('src/components/cart/InvoiceModal.tsx');

  assert(cartSrc.includes('appliedVoucher') || cartSrc.includes('applyVoucher'), 'Cart must support voucher redemption');
  assert(cartSrc.includes('courierService') || cartSrc.includes('gosend') || cartSrc.includes('jne'), 'Cart must support courier shipping options');
  assert(qrisSrc.includes('QRIS') || qrisSrc.includes('svg') || qrisSrc.includes('Bank Indonesia'), 'QRIS modal must render QR payment standard');
  assert(invoiceSrc.includes('NPWP') || invoiceSrc.includes('Faktur') || invoiceSrc.includes('Invoice'), 'Invoice modal must display official tax invoice specs');
  assert(invoiceSrc.includes('11%') || invoiceSrc.includes('PPN'), 'Invoice must calculate or state PPN 11% inclusive');
});

suite.test('F08: TrackingView.tsx & ProfileView.tsx render 6-stage order status & profile', () => {
  const trackSrc = readWorkspaceFile('src/components/tracking/TrackingView.tsx');
  const profileSrc = readWorkspaceFile('src/components/profile/ProfileView.tsx');

  assert(trackSrc.includes('steps') || trackSrc.includes('currentStepIndex'), 'Tracking view must display multi-stage order steps');
  assert(trackSrc.includes('courier') || trackSrc.includes('GoSend') || trackSrc.includes('pickupPin'), 'Tracking view must support courier telemetry or pickup PIN');
  assert(profileSrc.includes('currentUser') || profileSrc.includes('user'), 'Profile must render current user info');
  assert(profileSrc.includes('@') || profileSrc.includes('mask') || profileSrc.includes('***'), 'Profile must format/mask customer email for privacy');
});

module.exports = suite;

if (require.main === module) {
  suite.run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
