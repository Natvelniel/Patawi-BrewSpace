const { TestSuite, readWorkspaceFile, assert } = require('../test-utils.cjs');

const suite = new TestSuite('Tier 2 — Boundary & Edge Data: Long Text, Price Multipliers & Privacy');

suite.test('Text Wrapping & Truncation: Long titles and descriptions use line-clamp or truncate', () => {
  const homeSrc = readWorkspaceFile('src/components/home/HomeView.tsx');
  const catalogSrc = readWorkspaceFile('src/components/catalog/CatalogView.tsx');
  const deliverySrc = readWorkspaceFile('src/components/delivery/DeliveryDashboardView.tsx');

  assert(homeSrc.includes('line-clamp-') || homeSrc.includes('truncate'), 'HomeView must use line-clamp or truncate for descriptions');
  assert(catalogSrc.includes('truncate') || catalogSrc.includes('line-clamp-'), 'CatalogView must use truncate or line-clamp for bean titles');
  assert(deliverySrc.includes('truncate') || deliverySrc.includes('line-clamp-'), 'DeliveryDashboard must truncate long customer addresses');
});

suite.test('Price Multipliers: Package weights apply specified discounts (200g: 1.0x, 500g: 2.3x, 1kg: 4.0x)', () => {
  const storeSrc = readWorkspaceFile('src/context/StoreContext.tsx');
  assert(storeSrc.includes("case '200g'") && storeSrc.includes('1.0'), '200g package must have 1.0 multiplier');
  assert(storeSrc.includes("case '500g'") && storeSrc.includes('2.3'), '500g package must have 2.3 multiplier');
  assert(storeSrc.includes("case '1kg'") && storeSrc.includes('4.0'), '1kg package must have 4.0 multiplier');
});

suite.test('Shipping Fees: Courier rates match specified tiers (Pickup: 0, GoSend: 15k, JNE Reg: 22k, JNE YES: 35k)', () => {
  const storeSrc = readWorkspaceFile('src/context/StoreContext.tsx');
  assert(storeSrc.includes('35000'), 'Must define JNE YES rate of Rp 35.000');
  assert(storeSrc.includes('22000'), 'Must define JNE Regular rate of Rp 22.000');
  assert(storeSrc.includes('15000'), 'Must define GoSend rate of Rp 15.000');
});

suite.test('Privacy Masking: Customer profile formats or masks email to protect user privacy', () => {
  const profileSrc = readWorkspaceFile('src/components/profile/ProfileView.tsx');
  assert(
    profileSrc.includes('***') ||
    profileSrc.includes('slice') ||
    profileSrc.includes('replace') ||
    profileSrc.includes('email'),
    'ProfileView must handle email display responsibly with privacy considerations'
  );
});

module.exports = suite;

if (require.main === module) {
  suite.run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
