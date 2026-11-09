const { TestSuite, readWorkspaceFile, assert } = require('../test-utils.cjs');

const suite = new TestSuite('Tier 1 — F12 & F13: Delivery Order Courier Views');

suite.test('F12: DeliveryDashboardView.tsx renders courier identity & dispatch telemetry', () => {
  const deliverySrc = readWorkspaceFile('src/components/delivery/DeliveryDashboardView.tsx');

  assert(deliverySrc.includes('GOSEND MITRA KURIR') || deliverySrc.includes('GoSend'), 'Must display GoSend courier partner identity');
  assert(deliverySrc.includes('Rian') || deliverySrc.includes('Driver'), 'Must display assigned driver name');
  assert(deliverySrc.includes('Siap Antar'), 'Must feature active courier readiness status');
});

suite.test('F12: DeliveryDashboardView.tsx renders active delivery route stepper & status advance', () => {
  const deliverySrc = readWorkspaceFile('src/components/delivery/DeliveryDashboardView.tsx');

  assert(deliverySrc.includes("deliveryTab === 'active'"), 'Must render Active deliveries tab');
  assert(deliverySrc.includes('advanceOrderStatus'), 'Must provide simulated status progression');
  assert(deliverySrc.includes('Senopati') || deliverySrc.includes('Outlet') || deliverySrc.includes('Roastery'), 'Must display pick-up origin');
  assert(deliverySrc.includes('Penerima') || deliverySrc.includes('customerInfo'), 'Must display recipient and drop-off info');
});

suite.test('F13: DeliveryDashboardView.tsx renders completed delivery history', () => {
  const deliverySrc = readWorkspaceFile('src/components/delivery/DeliveryDashboardView.tsx');

  assert(deliverySrc.includes("deliveryTab === 'history'"), 'Must render Delivery History tab');
  assert(deliverySrc.includes('Selesai') || deliverySrc.includes('historyOrders'), 'History must display completed orders archive');
  assert(deliverySrc.includes('Ongkir') || deliverySrc.includes('shippingFee'), 'History must record courier delivery earnings/commission');
});

suite.test('F13: DeliveryDashboardView.tsx renders driver wallet & performance metrics', () => {
  const deliverySrc = readWorkspaceFile('src/components/delivery/DeliveryDashboardView.tsx');

  assert(deliverySrc.includes("deliveryTab === 'earnings'") || deliverySrc.includes('Dompet'), 'Must render Courier Wallet / Earnings tab');
  assert(deliverySrc.includes('Saldo') || deliverySrc.includes('Dompet'), 'Must track courier digital wallet balance');
  assert(deliverySrc.includes('deliveryTab') || deliverySrc.includes('profile'), 'Must support courier navigation tabs');
});

module.exports = suite;

if (require.main === module) {
  suite.run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
