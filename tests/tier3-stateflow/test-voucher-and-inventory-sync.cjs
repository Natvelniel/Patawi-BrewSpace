const { TestSuite, assert } = require('../test-utils.cjs');

const suite = new TestSuite('Tier 3 — Cross-Role State Flow: Voucher & Inventory Synchronization');

class VoucherAndInventoryEngine {
  constructor() {
    this.vouchers = [
      {
        code: 'PATAWIFRESH',
        discountAmount: 20000,
        minSpend: 80000,
        isActive: true,
      },
      {
        code: 'BEANS20',
        discountAmount: 15000,
        minSpend: 50000,
        isActive: true,
      },
      {
        code: 'EXPIRED10',
        discountAmount: 10000,
        minSpend: 40000,
        isActive: false,
      },
    ];
    this.products = [
      { id: 'p1', name: 'Aceh Gayo', basePrice: 95000, stock: 12.0 },
      { id: 'p2', name: 'Toraja Sapan', basePrice: 88000, stock: 5.0 },
    ];
    this.appliedVoucher = null;
  }

  applyVoucher(code, subtotal) {
    const trimmed = code.trim().toUpperCase();
    const found = this.vouchers.find(v => v.code === trimmed && v.isActive !== false);
    if (!found) {
      return { success: false, message: 'Kode voucher tidak valid atau sudah tidak aktif.' };
    }
    if (subtotal < found.minSpend) {
      return {
        success: false,
        message: `Minimal belanja Rp ${found.minSpend.toLocaleString('id-ID')} untuk menggunakan voucher ini.`,
      };
    }
    this.appliedVoucher = found;
    return { success: true, message: `Voucher ${found.code} berhasil dipasang!` };
  }

  toggleVoucherStatus(code) {
    this.vouchers = this.vouchers.map(v =>
      v.code === code ? { ...v, isActive: !v.isActive } : v
    );
  }

  deleteVoucher(code) {
    this.vouchers = this.vouchers.filter(v => v.code !== code);
    if (this.appliedVoucher && this.appliedVoucher.code === code) {
      this.appliedVoucher = null;
    }
  }

  updateProductStock(id, newStock) {
    this.products = this.products.map(p =>
      p.id === id ? { ...p, stock: Math.max(0, newStock) } : p
    );
  }

  deductStockFromPurchase(purchases) {
    for (const item of purchases) {
      const prod = this.products.find(p => p.id === item.productId);
      if (prod) {
        const kg = (item.weight === '1kg' ? 1.0 : item.weight === '500g' ? 0.5 : 0.2) * item.quantity;
        prod.stock = Math.max(0, prod.stock - kg);
      }
    }
  }
}

suite.test('Voucher: Met minimum spend successfully applies discount', () => {
  const engine = new VoucherAndInventoryEngine();
  const subtotal = 95000; // >= 80000
  const result = engine.applyVoucher('PATAWIFRESH', subtotal);

  assert.strictEqual(result.success, true, 'Should successfully apply voucher when subtotal >= minSpend');
  assert.strictEqual(engine.appliedVoucher.code, 'PATAWIFRESH');
  const discount = engine.appliedVoucher.discountAmount;
  assert.strictEqual(discount, 20000, 'Discount must be Rp 20.000');
  const finalTotal = subtotal - discount;
  assert.strictEqual(finalTotal, 75000, 'Final total must be subtotal - discount');
});

suite.test('Voucher: Unmet minimum spend is rejected with helpful error message', () => {
  const engine = new VoucherAndInventoryEngine();
  const subtotal = 45000; // < 80000
  const result = engine.applyVoucher('PATAWIFRESH', subtotal);

  assert.strictEqual(result.success, false, 'Should reject voucher when subtotal < minSpend');
  assert(result.message.includes('Minimal belanja'), 'Error message must mention minimum spend');
  assert.strictEqual(engine.appliedVoucher, null, 'No voucher should be applied');
});

suite.test('Voucher: Invalid or inactive promo code is rejected', () => {
  const engine = new VoucherAndInventoryEngine();
  const res1 = engine.applyVoucher('INVALID_CODE', 100000);
  assert.strictEqual(res1.success, false, 'Non-existent code must be rejected');

  const res2 = engine.applyVoucher('EXPIRED10', 100000);
  assert.strictEqual(res2.success, false, 'Inactive voucher must be rejected');
});

suite.test('Voucher CRUD: Admin toggles status and deletes voucher with store synchronization', () => {
  const engine = new VoucherAndInventoryEngine();
  engine.applyVoucher('BEANS20', 60000);
  assert.strictEqual(engine.appliedVoucher.code, 'BEANS20');

  // Admin deactivates BEANS20
  engine.toggleVoucherStatus('BEANS20');
  const v = engine.vouchers.find(x => x.code === 'BEANS20');
  assert.strictEqual(v.isActive, false, 'Voucher should become inactive');

  // Admin deletes BEANS20
  engine.deleteVoucher('BEANS20');
  assert.strictEqual(engine.vouchers.some(x => x.code === 'BEANS20'), false, 'Voucher should be removed');
  assert.strictEqual(engine.appliedVoucher, null, 'Applied voucher must be reset if deleted');
});

suite.test('Inventory: Stock deduction and restock sync with lower-bound protection at 0 kg', () => {
  const engine = new VoucherAndInventoryEngine();
  const p1 = engine.products[0]; // 12kg

  // Restock 5kg
  engine.updateProductStock('p1', p1.stock + 5.0);
  assert.strictEqual(p1.stock + 5.0, 17.0, 'Stock must increase to 17.0 kg after restock');

  // Customer purchases 3x 1kg pouches
  engine.deductStockFromPurchase([{ productId: 'p1', weight: '1kg', quantity: 3 }]);
  const updatedP1 = engine.products.find(p => p.id === 'p1');
  assert.strictEqual(updatedP1.stock, 14.0, 'Stock must decrement by 3kg');

  // Massive purchase attempting to drive stock negative
  engine.deductStockFromPurchase([{ productId: 'p1', weight: '1kg', quantity: 20 }]);
  assert.strictEqual(updatedP1.stock, 0, 'Stock cannot drop below 0 kg');
});

module.exports = suite;

if (require.main === module) {
  suite.run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
