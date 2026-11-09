const { TestSuite, assert } = require('../test-utils.cjs');

const suite = new TestSuite('Tier 4 — Real-World Scenarios: Admin Batch Management & Courier Operations');

suite.test('Admin Product Management: Adds seasonal lot, updates cupping and adjusts price', () => {
  const catalog = [];

  const addProduct = (prod) => {
    const id = `ptw-custom-${Date.now()}`;
    const newProduct = { ...prod, id };
    catalog.push(newProduct);
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    const p = catalog.find(x => x.id === id);
    if (p) Object.assign(p, updates);
  };

  // Add seasonal lot
  const newLot = addProduct({
    name: 'Flores Bajawa Ngada Anaerobic',
    region: 'NUSA TENGGARA TIMUR',
    altitude: '1.600 MDPL',
    roastLevel: 'Medium',
    process: 'Anaerobic',
    flavorNotes: ['Red Apple', 'Caramel', 'Macadamia'],
    scores: {
      acidity: 'Cerah',
      body: 'Syrupy',
      sweetness: 'Tinggi',
      cuppingScore: 87.5,
    },
    basePrice: 92000,
    stock: 20.0,
  });

  assert.strictEqual(catalog.length, 1, 'Catalog should contain 1 new lot');
  assert.strictEqual(newLot.scores.cuppingScore, 87.5, 'Cupping score must be 87.5');

  // Roaster adjusts price after cupping session
  updateProduct(newLot.id, { basePrice: 98000, stock: 25.0 });
  assert.strictEqual(newLot.basePrice, 98000, 'Price must update to Rp 98.000');
  assert.strictEqual(newLot.stock, 25.0, 'Stock must update to 25.0 kg');
});

suite.test('Courier Operations: Multi-order dispatch and wallet commission accumulation', () => {
  let walletBalance = 212000;
  const completedRuns = [];

  const completeDelivery = (orderNumber, destination, shippingFee, tip = 0) => {
    const earning = shippingFee + tip;
    walletBalance += earning;
    completedRuns.push({
      orderNumber,
      destination,
      shippingFee,
      tip,
      earning,
    });
  };

  // Courier completes 2 delivery orders today
  completeDelivery('PTW-88291', 'Jl. Senopati No. 12', 15000, 5000);
  completeDelivery('PTW-88344', 'SCBD Tower 2', 18000, 10000);

  assert.strictEqual(completedRuns.length, 2, 'Should log 2 completed delivery runs');
  assert.strictEqual(walletBalance, 212000 + 20000 + 28000, 'Wallet balance must reflect both deliveries plus tips');
  assert.strictEqual(completedRuns[0].earning, 20000, 'First run earned Rp 20.000 (15k + 5k tip)');
  assert.strictEqual(completedRuns[1].earning, 28000, 'Second run earned Rp 28.000 (18k + 10k tip)');
});

module.exports = suite;

if (require.main === module) {
  suite.run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
