const path = require('path');

const suites = [
  // Tier 1: Feature Coverage
  { tier: 'Tier 1', path: './tier1-features/test-f01-f02-design-tokens-fonts.cjs' },
  { tier: 'Tier 1', path: './tier1-features/test-f03-f04-app-shell-navigation.cjs' },
  { tier: 'Tier 1', path: './tier1-features/test-f05-f08-customer-views.cjs' },
  { tier: 'Tier 1', path: './tier1-features/test-f09-f11-admin-views.cjs' },
  { tier: 'Tier 1', path: './tier1-features/test-f12-f13-courier-views.cjs' },

  // Tier 2: Boundary & Corner Cases
  { tier: 'Tier 2', path: './tier2-boundaries/test-empty-states-and-limits.cjs' },
  { tier: 'Tier 2', path: './tier2-boundaries/test-mobile-viewport-touch-targets.cjs' },
  { tier: 'Tier 2', path: './tier2-boundaries/test-text-contrast-wcag.cjs' },
  { tier: 'Tier 2', path: './tier2-boundaries/test-long-text-and-edge-data.cjs' },

  // Tier 3: Cross-Role State Flow
  { tier: 'Tier 3', path: './tier3-stateflow/test-cross-role-order-lifecycle.cjs' },
  { tier: 'Tier 3', path: './tier3-stateflow/test-voucher-and-inventory-sync.cjs' },

  // Tier 4: Real-World Scenarios
  { tier: 'Tier 4', path: './tier4-scenarios/test-artisan-coffee-customer-journey.cjs' },
  { tier: 'Tier 4', path: './tier4-scenarios/test-admin-batch-courier-ops.cjs' },
  { tier: 'Tier 4', path: './tier4-scenarios/test-anti-slop-hygiene-audit.cjs' },

  // Tier 5: Adversarial Coverage Hardening
  { tier: 'Tier 5', path: './tier5-adversarial/test-tier5-stress-coverage.cjs' },
];

async function main() {
  const startTime = Date.now();
  console.log(`\n========================================================================`);
  console.log(`  PATAWI BREWSPACE — AUTOMATED 5-TIER E2E TEST SUITE RUNNER`);
  console.log(`  Target Branch: experiment | Integrity: Development`);
  console.log(`========================================================================`);

  const results = [];
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  for (const s of suites) {
    const fullPath = path.resolve(__dirname, s.path);
    const suiteModule = require(fullPath);
    const res = await suiteModule.run();
    results.push({ ...res, tier: s.tier });
    totalTests += res.total;
    totalPassed += res.passed;
    totalFailed += res.failed;
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n\n========================================================================`);
  console.log(`  FINAL VERIFICATION SUMMARY REPORT`);
  console.log(`========================================================================`);
  console.log(`  Execution Time: ${durationSec}s`);
  console.log(`  Total Suites:   ${suites.length}`);
  console.log(`  Total Tests:    ${totalTests}`);
  console.log(`  Passed:         ${totalPassed}`);
  console.log(`  Failed:         ${totalFailed}`);
  console.log(`------------------------------------------------------------------------`);

  console.log(`\n  TIER-BY-TIER BREAKDOWN:`);
  const tierSummary = {};
  for (const r of results) {
    if (!tierSummary[r.tier]) {
      tierSummary[r.tier] = { passed: 0, failed: 0, total: 0 };
    }
    tierSummary[r.tier].passed += r.passed;
    tierSummary[r.tier].failed += r.failed;
    tierSummary[r.tier].total += r.total;
  }

  for (const [t, data] of Object.entries(tierSummary)) {
    const status = data.failed === 0 ? '✓ PASS' : '✗ FAIL';
    console.log(`  - ${t.padEnd(8)}: ${status} (${data.passed}/${data.total} passed)`);
  }

  if (totalFailed > 0) {
    console.log(`\n  FAILED TESTS LIST:`);
    for (const r of results) {
      for (const err of r.errors) {
        console.log(`  - [${r.tier}] ${r.name} -> ${err.description}`);
        console.log(`    ${err.error.message}`);
      }
    }
    console.log(`\n========================================================================`);
    console.log(`  VERDICT: FAIL (Exit Code 1)`);
    console.log(`========================================================================\n`);
    process.exit(1);
  } else {
    console.log(`\n========================================================================`);
    console.log(`  VERDICT: ALL TESTS PASSED SUCCESSFULLY (Exit Code 0)`);
    console.log(`========================================================================\n`);
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal Runner Error:', err);
  process.exit(1);
});
