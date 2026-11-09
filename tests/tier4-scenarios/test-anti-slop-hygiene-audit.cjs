const { TestSuite, getSrcFiles, assert } = require('../test-utils.cjs');
const fs = require('fs');

const suite = new TestSuite('Tier 4 — Real-World Scenarios: Anti-Slop Hygiene Forensic Audit');

suite.test('R-02 (Hard Gate): Zero em dashes (—) present in source code or UI copy', () => {
  const srcFiles = getSrcFiles().filter(f => !f.includes('tests') && (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.html')));
  const violations = [];

  for (const file of srcFiles) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, idx) => {
      // Allow comment lines if any, but UI strings must have no em dash
      if (line.includes('—')) {
        violations.push(`${file}:${idx + 1}: ${line.trim()}`);
      }
    });
  }

  assert.strictEqual(
    violations.length,
    0,
    `Hard Gate R-02 Violation: Found em dash (—) in UI copy:\n${violations.join('\n')}`
  );
});

suite.test('R-01 & R-29: Zero generic AI gradients (blue/purple/neon) in CSS and JSX', () => {
  const srcFiles = getSrcFiles().filter(f => f.endsWith('.tsx') || f.endsWith('.css'));
  const bannedGradients = [
    'from-blue-500',
    'from-blue-600',
    'to-purple-500',
    'to-purple-600',
    'from-indigo-500',
    'to-pink-500',
    'from-cyan-400',
  ];

  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    for (const grad of bannedGradients) {
      assert(
        !content.includes(grad),
        `Found banned AI gradient "${grad}" in ${file}`
      );
    }
  }
});

suite.test('R-09: Zero generic AI capsule badges ("AI Powered", "Next Gen", "Beta Version")', () => {
  const srcFiles = getSrcFiles().filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
  const bannedBadges = [
    'AI Powered',
    'AI-Powered',
    'Next Generation',
    'Beta Version',
    'Magic AI',
  ];

  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    for (const badge of bannedBadges) {
      assert(
        !content.toLowerCase().includes(badge.toLowerCase()),
        `Found banned AI badge text "${badge}" in ${file}`
      );
    }
  }
});

suite.test('R-16 & R-36: Zero corporate AI buzzwords & fake social proof in UI copy', () => {
  const srcFiles = getSrcFiles().filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
  const bannedBuzzwords = [
    'revolutionary coffee',
    'cutting-edge brewing',
    'seamless coffee experience',
    '10,000+ happy drinkers',
    '+12% this week',
    'trusted by fortune 500',
  ];

  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    for (const word of bannedBuzzwords) {
      assert(
        !content.toLowerCase().includes(word.toLowerCase()),
        `Found banned AI buzzword "${word}" in ${file}`
      );
    }
  }
});

suite.test('R-12: Tactile Depth: Card containers use explicit crisp borders rather than floating ghost cards', () => {
  const srcFiles = getSrcFiles().filter(f => f.includes('components') && f.endsWith('.tsx'));
  let borderUsageCount = 0;

  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('border-[#ECE4DA]') || content.includes('border-[#382015]') || content.includes('border border-')) {
      borderUsageCount++;
    }
  }

  assert(
    borderUsageCount >= 5,
    `Expected widespread use of crisp 1px borders across components, found in ${borderUsageCount} files`
  );
});

module.exports = suite;

if (require.main === module) {
  suite.run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
