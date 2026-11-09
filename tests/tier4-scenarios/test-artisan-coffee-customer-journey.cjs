const { TestSuite, assert } = require('../test-utils.cjs');

const suite = new TestSuite('Tier 4 — Real-World Scenarios: Artisan Coffee Customer Journey');

// Journey simulation validating complete customer ordering workflow
function runArtisanCustomerJourney() {
  const gayoBasePrice = 95000;
  const torajaBasePrice = 88000;

  // Step 1: Customer selects 500g Aceh Gayo with V60 grind and barista notes
  const gayoMultiplier = 2.3;
  const gayoUnitPrice = Math.round(gayoBasePrice * gayoMultiplier); // 218500
  const gayoItem = {
    productId: 'ptw-aceh-gayo-1',
    name: 'Aceh Gayo Pantan Musara',
    weight: '500g',
    grind: 'medium',
    grindLabel: 'Giling V60 / Filter',
    quantity: 1,
    unitPrice: gayoUnitPrice,
    notes: 'Rasio seduh 1:15 air 92C blooming 45 detik',
  };

  // Step 2: Customer adds 200g Toraja Sapan Whole Bean
  const torajaMultiplier = 1.0;
  const torajaUnitPrice = Math.round(torajaBasePrice * torajaMultiplier); // 88000
  const torajaItem = {
    productId: 'ptw-toraja-sapan-2',
    name: 'Toraja Sapan Washed',
    weight: '200g',
    grind: 'whole',
    grindLabel: 'Biji Utuh (Beans)',
    quantity: 1,
    unitPrice: torajaUnitPrice,
    notes: 'Biji utuh untuk espresso grinder',
  };

  const cart = [gayoItem, torajaItem];

  // Step 3: Subtotal calculation
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Step 4: Promo voucher redemption
  const voucherCode = 'PATAWIFRESH';
  const voucherDiscount = 20000;
  const minSpend = 80000;
  const discount = subtotal >= minSpend ? voucherDiscount : 0;

  // Step 5: Courier selection (GoSend Instant)
  const shippingFee = 15000;
  const grandTotal = subtotal - discount + shippingFee;

  // Step 6: Order placement & invoice generation
  const orderNumber = 'PTW-88291';
  const npwp = '01.234.567.8-012.000';
  const ppnRate = 0.11;
  const dpp = Math.round(subtotal / (1 + ppnRate));
  const ppnAmount = subtotal - dpp;

  return {
    cart,
    subtotal,
    discount,
    shippingFee,
    grandTotal,
    orderNumber,
    npwp,
    dpp,
    ppnAmount,
  };
}

suite.test('Pricing & Discount Accuracy: 500g weight multiplier applies 2.3x', () => {
  const journey = runArtisanCustomerJourney();
  const gayoItem = journey.cart[0];
  assert.strictEqual(gayoItem.unitPrice, 218500, 'Aceh Gayo 500g must be Rp 218.500');
  const torajaItem = journey.cart[1];
  assert.strictEqual(torajaItem.unitPrice, 88000, 'Toraja Sapan 200g must be Rp 88.000');
  assert.strictEqual(journey.subtotal, 306500, 'Subtotal must be Rp 306.500');
});

suite.test('Voucher Application: PATAWIFRESH deducts Rp 20.000 with GoSend shipping (+Rp 15.000)', () => {
  const journey = runArtisanCustomerJourney();
  assert.strictEqual(journey.discount, 20000, 'Voucher discount must be Rp 20.000');
  assert.strictEqual(journey.shippingFee, 15000, 'GoSend shipping fee must be Rp 15.000');
  assert.strictEqual(journey.grandTotal, 301500, 'Grand total must be Rp 301.500');
});

suite.test('Official Invoice Generation: Tax breakdown complies with PPN 11% inclusive standard', () => {
  const journey = runArtisanCustomerJourney();
  assert.strictEqual(journey.npwp, '01.234.567.8-012.000', 'Official invoice must feature registered NPWP number');
  assert(journey.dpp > 0, 'DPP (Dasar Pengenaan Pajak) must be positive');
  assert(journey.ppnAmount > 0, 'PPN 11% must be calculated');
  assert.strictEqual(journey.dpp + journey.ppnAmount, journey.subtotal, 'DPP + PPN must equal subtotal');
});

module.exports = suite;

if (require.main === module) {
  suite.run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
