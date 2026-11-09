# TEST_INFRA — Patawi BrewSpace Test Infrastructure & Architecture

**Branch**: `experiment`  
**Target Application**: Patawi BrewSpace (Artisanal Specialty Coffee Roastery Web App)  
**Author**: E2E Test Suite Architect & Writer  
**Version**: 1.0.0  
**Date**: 2026-11-09  

---

## 1. Test Philosophy & Principles

The Patawi BrewSpace automated test infrastructure is founded on four core principles:

1. **Opaque-Box & Requirement-Driven**: Tests assert observable outcomes, DOM contracts, typography rules, state transitions, and responsive layout constraints against authoritative specifications (`PROJECT.md`, `ORIGINAL_REQUEST.md`, and Explorer Survey Reports). Tests never rely on implementation tricks or shallow mock bypasses.
2. **Dual-Viewport & Ergonomic Mobile-First**: Every interactive element, layout boundary, and touch target is verified across mobile bezel constraints (375px/400px viewport with `max-w-[400px]`) and expanded desktop preview modes (`max-w-2xl` / full desktop), strictly enforcing minimum 44x44px touch targets and `pb-24` bottom navigation clearances.
3. **Cross-Role Synchronized State Integrity**: Validates the unified reactive state lifecycle connecting all three personas (Customer -> Roastery Admin -> Delivery Courier) without page reloads, ensuring inventory stock deductions, roasting status progressions, handover gates, and route updates synchronize accurately.
4. **Strict Anti-Slop & Human Accessibility**: Enforces zero tolerance for generic AI slop patterns: hard bans on em dashes (`—`), generic AI capsule badges ("AI Powered", "Beta"), floating unbordered ghost cards, low-contrast gray-on-gray typography, fake deltas, and dead buttons. Contrast must meet or exceed WCAG AA standards (>=4.5:1 for normal text, >=3:1 for large text).

---

## 2. Feature Inventory Test Matrix (F01–F15)

| Feature ID | Feature Name | Primary Spec Source | Target Component / File | Verification Tier | Verification Method |
|---|---|---|---|---|---|
| **F01** | Design Token System | Survey 3, `PROJECT.md` | `src/index.css`, `src/App.tsx` | Tier 1, Tier 2 | Theme token declarations, color hex mapping, palette contrast check |
| **F02** | Typographic Hierarchy | Survey 1, 3, `ORIGINAL_REQUEST.md` | `index.html`, `src/index.css` | Tier 1, Tier 2 | Google Fonts link imports, serif/sans assignment, WCAG AA contrast ratio |
| **F03** | Tactile Depth & Boundaries | Survey 3, `craft-floor.md` | `src/index.css`, `src/components/*` | Tier 1, Tier 4 | Perimeter 1px border verification, `.rim-light` presence, `.depth-card` classes |
| **F04** | App Shell & Navigation | Survey 1, 2, `PROJECT.md` | `src/App.tsx`, `AppHeader.tsx`, `BottomNav.tsx` | Tier 1, Tier 2 | Bezel toggle, 3-role switcher, role-specific bottom nav (5/4/4 tabs), pb-24 clearance |
| **F05** | Customer Home & Brew | Survey 2, `PROJECT.md` | `HomeView.tsx`, `GrindGuideModal.tsx` | Tier 1, Tier 4 | Hero banner, roastery origin story, roast pills, Grind Guide modal trigger |
| **F06** | Customer Catalog & Details | Survey 2, `PROJECT.md` | `CatalogView.tsx`, `FilterModal.tsx`, `ProductDetailModal.tsx` | Tier 1, Tier 4 | Origin filter, SCA cupping bars, weight (200g/500g/1kg), grind profiles, subtotal calc |
| **F07** | Customer Cart & Payment | Survey 2, `PROJECT.md` | `CartView.tsx`, `QRISPaymentModal.tsx`, `InvoiceModal.tsx` | Tier 1, Tier 3, Tier 4 | Cart item quantity CRUD, voucher deduction, QRIS modal, NPWP official tax invoice |
| **F08** | Customer Tracking & Profile | Survey 2, `PROJECT.md` | `TrackingView.tsx`, `ProfileView.tsx` | Tier 1, Tier 3 | 6-stage order timeline, courier GPS route card, pickup PIN, masked email privacy |
| **F09** | Admin Queue & Handover Gate | Survey 2, `PROJECT.md` | `AdminDashboardView.tsx` | Tier 1, Tier 3, Tier 4 | Order queue cards, "Majukan Tahap", "Serahkan ke Kurir DO" Handover Gate dispatch |
| **F10** | Admin Inventory & Batches | Survey 2, `PROJECT.md` | `AdminDashboardView.tsx`, `ProductManagementModal.tsx` | Tier 1, Tier 3, Tier 4 | Bean stock in kg, low stock alerts (<10kg), restock action, Product CRUD modal |
| **F11** | Admin Reports & Profile | Survey 2, `PROJECT.md` | `AdminDashboardView.tsx` | Tier 1, Tier 4 | Financial KPIs (Omzet, AOV), Probatone roaster machine operations, Head Roaster profile |
| **F12** | Courier Active Route & Queue | Survey 2, `PROJECT.md` | `DeliveryDashboardView.tsx` | Tier 1, Tier 3, Tier 4 | Courier identity, active delivery task, Senopati to customer route stepper, status advances |
| **F13** | Courier Wallet & Profile | Survey 2, `PROJECT.md` | `DeliveryDashboardView.tsx` | Tier 1, Tier 4 | Daily commission earnings, delivery history logs, wallet balance, GoSend profile |
| **F14** | Cross-Role State Pipeline | Survey 2, `StoreContext.tsx` | `StoreContext.tsx`, all role views | Tier 3, Tier 4 | Reactive zero-reload state synchronization across Customer, Admin, and Courier |
| **F15** | Anti-Slop Component Hygiene | Survey 3, `antislop/SKILL.md` | All `src/**/*.{tsx,ts,css,html}` | Tier 2, Tier 4 | Zero em dashes (`—`), no generic AI badges, no floating ghost cards, no fake stats |

---

## 3. Four-Tier Test Architecture

The test suite is structured into four independent, self-contained tiers under `tests/`:

```
tests/
├── run-all.cjs                                # Master test orchestrator & test runner
├── tier1-features/
│   ├── test-f01-f02-design-tokens-fonts.cjs   # Tokens, color variables, Google Fonts
│   ├── test-f03-f04-app-shell-navigation.cjs  # Dual viewport bezel, header, bottom nav
│   ├── test-f05-f08-customer-views.cjs        # Storefront, catalog, cart, tracking, profile
│   ├── test-f09-f11-admin-views.cjs           # Roastery queue, inventory, reports, roaster
│   └── test-f12-f13-courier-views.cjs         # Courier tasks, route stepper, wallet, history
├── tier2-boundaries/
│   ├── test-empty-states-and-limits.cjs       # Empty cart, zero search results, empty queue
│   ├── test-mobile-viewport-touch-targets.cjs # 400px width limit, touch targets >=44px, pb-24
│   ├── test-text-contrast-wcag.cjs            # WCAG AA luminance formula contrast checks
│   └── test-long-text-and-edge-data.cjs       # Long titles, multi-line addresses, masked privacy
├── tier3-stateflow/
│   ├── test-cross-role-order-lifecycle.cjs    # Customer -> Admin -> Handover Gate -> Courier -> Tracking
│   └── test-voucher-and-inventory-sync.cjs    # Voucher validation, stock decrements, bounds
└── tier4-scenarios/
    ├── test-artisan-coffee-customer-journey.cjs # Full end-to-end purchasing & invoice journey
    ├── test-admin-batch-courier-ops.cjs       # Multi-batch operations, product additions, courier tasks
    └── test-anti-slop-hygiene-audit.cjs       # Static code audit for anti-slop rules (R01..R40)
```

### Tier 1: Feature Coverage Specifications
- Verifies contract compliance for all 15 core features (F01–F15).
- Inspects design token declarations (`@theme` in `src/index.css`), Google Font links in `index.html`, and structural presence of all role views.
- Validates that Customer, Admin, and Courier components contain required sub-tabs, operational controls, and modals.

### Tier 2: Boundary & Corner Cases Specifications
- **Empty States**: Validates that zero items in the cart display clear empty cart messaging and CTA; zero search matches trigger actionable reset buttons; empty queues display appropriate roastery standby cards.
- **Ergonomics & Viewports**: Verifies mobile width constraints (`max-w-[400px]`), prevents horizontal overflow (`overflow-x-hidden`), and asserts that interactive elements meet the minimum 44x44px touch target standard.
- **WCAG AA Contrast**: Implements relative luminance equations `L = 0.2126*R_lin + 0.7152*G_lin + 0.0722*B_lin` and asserts contrast ratio `(L1 + 0.05)/(L2 + 0.05)` >= 4.5:1 for normal text and >= 3.0:1 for large/bold text. Prohibits low-contrast gray-on-gray classes.
- **Data Boundaries**: Asserts quantity updates do not produce negative numbers, prices and totals are formatted in IDR currency, and user email privacy masking functions properly.

### Tier 3: Cross-Role State Flow Specifications
- Simulates complete reactive state lifecycles:
  1. `createOrder()` initializes order `#PTW-xxxxx` with status `'processing'`, `currentStepIndex: 1`, and decrements bean stock.
  2. Order appears in Admin queue; Admin calls `advanceOrderStatus()` to enter `'roasting'`.
  3. Admin triggers Handover Gate via `dispatchOrderToDelivery()`, locking `readyForDelivery: true` and advancing status to `'on_the_way'`.
  4. Order appears in Courier active tasks; Courier advances order to `'delivered'` (`currentStepIndex: 5`).
  5. Customer `TrackingView` displays completed status with "Pesan Lagi" reorder capability.
- Validates coupon voucher logic: minimum spend thresholds, valid discount deduction, and rejection of invalid or inactive codes.

### Tier 4: Real-World Scenarios Specifications
- **Artisan Coffee Journey**: Simulates an authentic single origin purchasing scenario from flavor profile inspection to customized grind selection, barista brew notes, QRIS payment, and digital tax invoice with NPWP and PPN 11%.
- **Admin & Courier Operations**: Simulates batch management, product creation (`addProduct`), stock restock, and courier wallet credit calculations.
- **Anti-Slop Forensic Audit**: Performs static file scanning across all source code:
  - Banned em dashes (`—`) in UI copy (Rule R-02).
  - Banned AI gradients or neon palettes (Rule R-01, R-29).
  - Banned literal emojis inside button controls or headers (Rule R-04).
  - Banned AI capsule badges or fake social proof (Rule R-09, R-17, R-36).
  - Banned borderless ghost cards (Rule R-12).

---

## 4. Test Execution & Reporting

### Execution Command
The test suite runs natively on Node.js without requiring external testing daemons or network calls:

```powershell
cmd /c node tests/run-all.cjs
```

### Exit Semantics
- **Exit Code 0**: All test assertions passed successfully across Tiers 1–4.
- **Exit Code 1**: One or more assertions failed. A detailed error traceback and file location is printed to stdout/stderr.

### Summary Output Format
The runner prints a structured report summarizing:
- Total test suites executed.
- Individual test case assertions passed/failed.
- Execution duration per tier.
- Overall pass/fail verdict.
