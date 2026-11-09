const { TestSuite, readWorkspaceFile, assert } = require('../test-utils.cjs');

const suite = new TestSuite('Tier 1 — F01 & F02: Design Tokens & Typography');

suite.test('F02: index.html loads Google Fonts for Playfair Display & Plus Jakarta Sans', () => {
  const indexHtml = readWorkspaceFile('index.html');
  assert(indexHtml.includes('fonts.googleapis.com'), 'Must preconnect/link to Google Fonts');
  assert(indexHtml.includes('Playfair+Display'), 'Must link to Playfair Display');
  assert(indexHtml.includes('Plus+Jakarta+Sans'), 'Must link to Plus Jakarta Sans');
  assert(indexHtml.includes('wght@400') || indexHtml.includes('wght@0,400'), 'Must include font weight specifications');
});

suite.test('F02: src/index.css maps --font-serif and --font-sans in @theme', () => {
  const css = readWorkspaceFile('src/index.css');
  assert(css.includes('@theme'), 'src/index.css must declare Tailwind v4 @theme block');
  assert(/--font-serif:\s*["']Playfair Display["']/.test(css), 'Must configure Playfair Display for --font-serif');
  assert(/--font-sans:\s*["']Plus Jakarta Sans["']/.test(css), 'Must configure Plus Jakarta Sans for --font-sans');
  assert(css.includes('h1, h2, h3, .font-serif'), 'Must apply font-serif to h1, h2, h3, and .font-serif');
  assert(css.includes('font-family: var(--font-serif)'), 'Must assign var(--font-serif) to display headings');
});

suite.test('F01: src/index.css defines 3-tier coffee palette tokens', () => {
  const css = readWorkspaceFile('src/index.css');
  assert(css.includes('--color-coffee-dark: #26160F'), 'Must define primary dark roast token #26160F');
  assert(css.includes('--color-coffee-accent: #C86826'), 'Must define golden crema accent token #C86826');
  assert(css.includes('--color-coffee-cream: #FAF7F2'), 'Must define warm paper background token #FAF7F2');
  assert(css.includes('--color-coffee-card: #FFFFFF'), 'Must define card surface token #FFFFFF');
  assert(css.includes('--color-coffee-muted: #75645C'), 'Must define muted roastery text token #75645C');
});

suite.test('F03: src/index.css defines tactile depth utilities (.rim-light & .depth-card)', () => {
  const css = readWorkspaceFile('src/index.css');
  assert(css.includes('.rim-light'), 'Must define .rim-light utility');
  assert(/inset\s+0\s+1px\s+0/.test(css), '.rim-light must provide top inner rim highlight');
  assert(css.includes('.depth-card'), 'Must define .depth-card utility');
  assert(css.includes('border: 1px solid #ECE4DA') || css.includes('border-color: #ECE4DA') || css.includes('1px solid #ECE4DA'), '.depth-card must have crisp 1px border');
});

module.exports = suite;

if (require.main === module) {
  suite.run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
