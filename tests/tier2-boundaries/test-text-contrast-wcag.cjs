const { TestSuite, calculateContrastRatio, getSrcFiles, assert } = require('../test-utils.cjs');
const fs = require('fs');

const suite = new TestSuite('Tier 2 — Boundary & Accessibility: WCAG AA Text Contrast Verification');

suite.test('Primary Brand Pairings meet WCAG AA normal text standard (>= 4.5:1)', () => {
  // 1. Dark roast text on warm paper background
  const ratioDarkOnPaper = calculateContrastRatio('#26160F', '#FAF7F2');
  assert(ratioDarkOnPaper >= 4.5, `Dark on paper ratio ${ratioDarkOnPaper.toFixed(2)} must be >= 4.5:1`);
  assert(ratioDarkOnPaper >= 7.0, `Dark on paper ratio ${ratioDarkOnPaper.toFixed(2)} exceeds AAA (7:1)`);

  // 2. Secondary roast text on warm paper background
  const ratioSecondaryOnPaper = calculateContrastRatio('#5C4D46', '#FAF7F2');
  assert(ratioSecondaryOnPaper >= 4.5, `Secondary on paper ratio ${ratioSecondaryOnPaper.toFixed(2)} must be >= 4.5:1`);

  // 3. Muted text on white card
  const ratioMutedOnWhite = calculateContrastRatio('#75645C', '#FFFFFF');
  assert(ratioMutedOnWhite >= 4.5, `Muted on white ratio ${ratioMutedOnWhite.toFixed(2)} must be >= 4.5:1`);

  // 4. White text on primary CTA button (#C86826) - large/bold text threshold >= 3.0:1
  const ratioWhiteOnCTA = calculateContrastRatio('#FFFFFF', '#C86826');
  assert(ratioWhiteOnCTA >= 3.0, `White on CTA ratio ${ratioWhiteOnCTA.toFixed(2)} must be >= 3.0:1 for bold CTA text`);
});

suite.test('Dark Roastery Container Pairings meet WCAG AA text standards', () => {
  // 1. White text on dark roast
  const ratioWhiteOnDark = calculateContrastRatio('#FFFFFF', '#26160F');
  assert(ratioWhiteOnDark >= 7.0, `White on dark ratio ${ratioWhiteOnDark.toFixed(2)} exceeds AAA`);

  // 2. Warm crema text on dark roast
  const ratioCremaOnDark = calculateContrastRatio('#FDB882', '#26160F');
  assert(ratioCremaOnDark >= 7.0, `Crema on dark ratio ${ratioCremaOnDark.toFixed(2)} exceeds AAA`);

  // 3. Emerald status indicator on dark container
  const ratioEmeraldOnDark = calculateContrastRatio('#10B981', '#26160F');
  assert(ratioEmeraldOnDark >= 4.5, `Emerald on dark ratio ${ratioEmeraldOnDark.toFixed(2)} must be >= 4.5:1`);
});

suite.test('Contrast Checker correctly rejects forbidden low-contrast gray pairings', () => {
  // Sanity check formula against known failing pairs from antislop-human skill
  const ratioFail1 = calculateContrastRatio('#777777', '#FFFFFF');
  assert(ratioFail1 < 4.5, `#777777 on white (${ratioFail1.toFixed(2)}) must fail 4.5:1 normal text`);

  const ratioFail2 = calculateContrastRatio('#999999', '#FFFFFF');
  assert(ratioFail2 < 3.0, `#999999 on white (${ratioFail2.toFixed(2)}) must fail 3.0:1 large text`);

  const ratioFail3 = calculateContrastRatio('#555555', '#000000');
  assert(ratioFail3 < 3.0, `#555555 on black (${ratioFail3.toFixed(2)}) must fail 3.0:1`);
});

suite.test('Static Scan: Source files do not use banned low-contrast gray-on-light classes', () => {
  const srcFiles = getSrcFiles().filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
  const forbiddenClasses = [
    'text-gray-300',
    'text-gray-400',
    'text-slate-300',
    'text-zinc-300',
    'text-neutral-300',
  ];

  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    for (const cls of forbiddenClasses) {
      assert(
        !content.includes(cls),
        `Found forbidden low-contrast class "${cls}" in ${file}`
      );
    }
  }
});

module.exports = suite;

if (require.main === module) {
  suite.run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
