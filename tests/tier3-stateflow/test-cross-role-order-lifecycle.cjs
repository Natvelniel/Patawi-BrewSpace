const { TestSuite, assert } = require('../test-utils.cjs');

const suite = new TestSuite('Tier 3 — Cross-Role State Flow: End-to-End Order Lifecycle');

// Pure state simulation faithfully replicating StoreContext.tsx logic
class SimulatedStore {
  constructor() {
    this.role = 'customer';
    this.activeTab = 'home';
    this.deliveryTab = 'active';
    this.adminTab = 'queue';
    this.products = [
      {
        id: 'ptw-gayo',
        name: 'Aceh Gayo Pantan Musara',
        basePrice: 95000,
        stock: 25.0, // kg
      },
      {
        id: 'ptw-bali',
        name: 'Bali Kintamani Anaerobic Honey',
        basePrice: 110000,
        stock: 18.0, // kg
      },
    ];
    this.cart = [];
    this.orders = [];
  }

  addToCart(product, weight, grind, quantity) {
    const multiplier = weight === '1kg' ? 4.0 : weight === '500g' ? 2.3 : 1.0;
    const price = Math.round(product.basePrice * multiplier);
    this.cart.push({
      id: `cart-${Date.now()}-${Math.random()}`,
      productId: product.id,
      product,
      weight,
      grind,
      price,
      quantity,
    });
  }

  createOrder(type = 'delivery', courierService = 'gosend', customerInfo = { name: 'Nathaniel Christian' }) {
    const subtotal = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = type === 'pickup' ? 0 : courierService === 'jne_yes' ? 35000 : courierService === 'jne_reg' ? 22000 : 15000;
    const randNum = Math.floor(10000 + Math.random() * 90000);

    // Deduct stock
    for (const item of this.cart) {
      const p = this.products.find(p => p.id === item.productId);
      if (p) {
        const kg = (item.weight === '1kg' ? 1 : item.weight === '500g' ? 0.5 : 0.2) * item.quantity;
        p.stock = Math.max(0, p.stock - kg);
      }
    }

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `PTW-${randNum}`,
      type,
      status: 'processing',
      currentStepIndex: 1,
      items: [...this.cart],
      subtotal,
      shippingFee,
      total: subtotal + shippingFee,
      customerInfo,
      courierService,
      readyForDelivery: false,
      steps: [
        { id: 1, title: 'Pesanan Diterima & Terbayar', status: 'completed' },
        { id: 2, title: 'Dikonfirmasi Roastery Senopati', status: 'current' },
        { id: 3, title: 'Roasting, Grinding & Packing', status: 'pending' },
        { id: 4, title: 'Kurir Menuju Outlet', status: 'pending' },
        { id: 5, title: 'Pesanan Diambil Kurir', status: 'pending' },
        { id: 6, title: 'Pesanan Selesai', status: 'pending' },
      ],
    };

    this.orders.unshift(newOrder);
    this.cart = [];
    return newOrder;
  }

  advanceOrderStatus(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;
    const nextIdx = Math.min(order.steps.length - 1, order.currentStepIndex + 1);
    order.currentStepIndex = nextIdx;

    if (nextIdx >= 5) order.status = 'delivered';
    else if (nextIdx >= 3) order.status = 'on_the_way';
    else if (nextIdx >= 2) order.status = 'roasting';

    order.steps.forEach((s, idx) => {
      if (idx < nextIdx) s.status = 'completed';
      else if (idx === nextIdx) s.status = 'current';
      else s.status = 'pending';
    });
  }

  dispatchOrderToDelivery(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;
    order.readyForDelivery = true;
    order.currentStepIndex = 3;
    order.status = 'on_the_way';
    order.steps.forEach((s, idx) => {
      if (idx <= 3) s.status = 'completed';
      else if (idx === 4) s.status = 'current';
      else s.status = 'pending';
    });
  }
}

suite.test('Step 1: Customer creates order, stock decrements, cart clears', () => {
  const store = new SimulatedStore();
  const gayo = store.products[0];
  const bali = store.products[1];

  store.addToCart(gayo, '200g', 'medium', 1); // 0.2kg
  store.addToCart(bali, '500g', 'whole', 2);  // 1.0kg

  assert.strictEqual(store.cart.length, 2, 'Cart should contain 2 items');

  const order = store.createOrder('delivery', 'gosend');

  assert.strictEqual(store.cart.length, 0, 'Cart must be cleared after order creation');
  assert.strictEqual(order.status, 'processing', 'Initial status must be processing');
  assert.strictEqual(order.readyForDelivery, false, 'readyForDelivery must initially be false');
  assert.strictEqual(gayo.stock, 24.8, 'Gayo stock must reduce from 25.0 to 24.8 kg');
  assert.strictEqual(bali.stock, 17.0, 'Bali stock must reduce from 18.0 to 17.0 kg');
});

suite.test('Step 2: Admin Queue receives order and advances to roasting', () => {
  const store = new SimulatedStore();
  store.addToCart(store.products[0], '200g', 'medium', 1);
  const order = store.createOrder('delivery', 'gosend');

  // Admin checks queue
  store.role = 'admin';
  store.adminTab = 'queue';
  const queueOrders = store.orders;
  assert.strictEqual(queueOrders[0].id, order.id, 'Admin queue must see the new customer order');

  // Admin advances stage
  store.advanceOrderStatus(order.id);
  assert.strictEqual(order.currentStepIndex, 2, 'Stage must advance to index 2 (Roasting, Grinding & Packing)');
  assert.strictEqual(order.status, 'roasting', 'Order status must update to roasting');
});

suite.test('Step 3: Admin triggers Handover Gate to Courier (dispatchOrderToDelivery)', () => {
  const store = new SimulatedStore();
  store.addToCart(store.products[0], '200g', 'medium', 1);
  const order = store.createOrder('delivery', 'gosend');
  store.advanceOrderStatus(order.id); // to roasting

  // Trigger Handover Gate
  store.dispatchOrderToDelivery(order.id);

  assert.strictEqual(order.readyForDelivery, true, 'Handover Gate must set readyForDelivery to true');
  assert.strictEqual(order.status, 'on_the_way', 'Status must advance to on_the_way');
  assert.strictEqual(order.currentStepIndex, 3, 'currentStepIndex must advance to 3');
});

suite.test('Step 4: Courier active tasks unlock order and complete delivery', () => {
  const store = new SimulatedStore();
  store.addToCart(store.products[0], '200g', 'medium', 1);
  const order = store.createOrder('delivery', 'gosend');
  store.advanceOrderStatus(order.id);
  store.dispatchOrderToDelivery(order.id);

  // Courier switches to delivery role
  store.role = 'delivery';
  store.deliveryTab = 'active';

  // Order unlocks in courier's active queue
  const courierActiveOrders = store.orders.filter(o => o.type === 'delivery' && (o.readyForDelivery || o.currentStepIndex >= 2));
  assert(courierActiveOrders.some(o => o.id === order.id), 'Courier active queue must list the handed-over order');

  // Courier picks up and delivers
  store.advanceOrderStatus(order.id); // step 4
  assert.strictEqual(order.currentStepIndex, 4, 'Courier progresses to step 4 (Pesanan Diambil Kurir)');

  store.advanceOrderStatus(order.id); // step 5
  assert.strictEqual(order.currentStepIndex, 5, 'Courier progresses to step 5 (Pesanan Selesai)');
  assert.strictEqual(order.status, 'delivered', 'Final status must be delivered');
});

suite.test('Step 5: Customer TrackingView reflects final delivered state', () => {
  const store = new SimulatedStore();
  store.addToCart(store.products[0], '200g', 'medium', 1);
  const order = store.createOrder('delivery', 'gosend');
  store.advanceOrderStatus(order.id);
  store.dispatchOrderToDelivery(order.id);
  store.advanceOrderStatus(order.id);
  store.advanceOrderStatus(order.id); // delivered

  // Customer checks tracking view
  store.role = 'customer';
  store.activeTab = 'tracking';

  const trackedOrder = store.orders.find(o => o.id === order.id);
  assert.strictEqual(trackedOrder.status, 'delivered', 'Customer tracking must show delivered');
  assert.strictEqual(trackedOrder.steps[5].status, 'current', 'Last step must be reached');
});

module.exports = suite;

if (require.main === module) {
  suite.run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
