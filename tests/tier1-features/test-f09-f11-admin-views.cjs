const { TestSuite, readWorkspaceFile, assert } = require('../test-utils.cjs');

const suite = new TestSuite('Tier 1 — F09 to F11: Roastery Admin Operational Views');

suite.test('F09: AdminDashboardView.tsx renders queue, stage advancement & Handover Gate', () => {
  const adminSrc = readWorkspaceFile('src/components/admin/AdminDashboardView.tsx');

  assert(adminSrc.includes("adminTab === 'queue'"), 'Admin dashboard must render Queue tab');
  assert(adminSrc.includes('advanceOrderStatus'), 'Queue must support status advancement');
  assert(adminSrc.includes('dispatchOrderToDelivery'), 'Queue must support handover gate dispatch to courier');
  assert(adminSrc.includes('Serahkan ke Kurir DO'), 'Queue must feature explicit "Serahkan ke Kurir DO" button');
});

suite.test('F10: AdminDashboardView.tsx & ProductManagementModal.tsx manage stock & products', () => {
  const adminSrc = readWorkspaceFile('src/components/admin/AdminDashboardView.tsx');
  const prodModalSrc = readWorkspaceFile('src/components/admin/ProductManagementModal.tsx');

  assert(adminSrc.includes("adminTab === 'inventory'"), 'Admin dashboard must render Inventory tab');
  assert(adminSrc.includes('updateProductStock') || adminSrc.includes('Restock'), 'Inventory must support stock updating/restocking');
  assert(adminSrc.includes('isLowStock') || adminSrc.includes('< 10'), 'Inventory must highlight low stock conditions (<10kg)');
  assert(prodModalSrc.includes('cuppingScore') || prodModalSrc.includes('acidity'), 'Product modal must support SCA cupping score attributes');
  assert(prodModalSrc.includes('basePrice') && prodModalSrc.includes('stock'), 'Product modal must manage price and stock in kg');
});

suite.test('F11: AdminDashboardView.tsx renders financial KPIs & roasting machine telemetry', () => {
  const adminSrc = readWorkspaceFile('src/components/admin/AdminDashboardView.tsx');

  assert(adminSrc.includes("adminTab === 'reports'"), 'Admin dashboard must render Reports tab');
  assert(adminSrc.includes('financial') && adminSrc.includes('operations'), 'Reports must support financial and operations subtabs');
  assert(adminSrc.includes('totalRevenue') || adminSrc.includes('Omzet'), 'Reports must display total revenue / Omzet');
  assert(adminSrc.includes('aov') || adminSrc.includes('Average Order Value'), 'Reports must calculate or display AOV');
  assert(adminSrc.includes('Probatone') || adminSrc.includes('Artisan') || adminSrc.includes('Batch'), 'Reports must display roasting machine operations specs');
});

suite.test('F11: Admin profile renders roaster credentials', () => {
  const adminSrc = readWorkspaceFile('src/components/admin/AdminDashboardView.tsx');

  assert(adminSrc.includes("adminTab === 'profile'"), 'Admin dashboard must render Profile tab');
  assert(adminSrc.includes('Roaster') || adminSrc.includes('Budi Santoso'), 'Roaster profile must render head roaster identity');
  assert(adminSrc.includes('Q Arabica Grader') || adminSrc.includes('CQI') || adminSrc.includes('Batch'), 'Roaster profile must showcase professional cupping/roasting credentials');
});

module.exports = suite;

if (require.main === module) {
  suite.run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
