const { TestSuite, readWorkspaceFile, assert } = require('../test-utils.cjs');

const suite = new TestSuite('Tier 2 — Boundary & Corner Cases: Empty States & Numeric Limits');

suite.test('Empty Cart State: CartView renders informative empty state and catalog CTA', () => {
  const cartSrc = readWorkspaceFile('src/components/cart/CartView.tsx');
  assert(cartSrc.includes('cart.length === 0'), 'CartView must explicitly check for empty cart condition');
  assert(cartSrc.includes('Keranjang Masih Kosong'), 'Must provide clear empty cart headline');
  assert(cartSrc.includes('Eksplorasi Katalog Kopi'), 'Must provide actionable CTA to catalog when empty');
});

suite.test('Empty Filter State: CatalogView renders zero-match fallback with reset button', () => {
  const catalogSrc = readWorkspaceFile('src/components/catalog/CatalogView.tsx');
  assert(catalogSrc.includes('filtered.length === 0'), 'CatalogView must check for zero matching products');
  assert(catalogSrc.includes('Tidak Menemukan Biji Kopi'), 'Must display informative zero-match heading');
  assert(catalogSrc.includes('resetFilter') || catalogSrc.includes('Reset Semua Filter'), 'Must provide reset filter button');
});

suite.test('Empty Courier Queue: DeliveryDashboardView renders completion card', () => {
  const deliverySrc = readWorkspaceFile('src/components/delivery/DeliveryDashboardView.tsx');
  assert(deliverySrc.includes('activeOrders.length === 0'), 'DeliveryDashboard must check for zero active orders');
  assert(deliverySrc.includes('Semua Tugas Antar Selesai!'), 'Must display completed tasks message');
});

suite.test('Cart Item Quantity Lower Limit: Cannot be decremented to negative numbers', () => {
  const storeSrc = readWorkspaceFile('src/context/StoreContext.tsx');
  assert(storeSrc.includes('updateCartItemQty'), 'StoreContext must define updateCartItemQty');
  assert(storeSrc.includes('nextQty > 0'), 'Quantity reduction must filter out items reaching 0 and prevent negative values');
});

suite.test('Inventory Stock Lower Limit: Stock cannot become negative', () => {
  const storeSrc = readWorkspaceFile('src/context/StoreContext.tsx');
  assert(storeSrc.includes('updateProductStock'), 'StoreContext must define updateProductStock');
  assert(storeSrc.includes('Math.max(0, newStock)') || storeSrc.includes('Math.max(0, p.stock'), 'Product stock updates and deductions must be clamped at 0');
});

module.exports = suite;

if (require.main === module) {
  suite.run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
