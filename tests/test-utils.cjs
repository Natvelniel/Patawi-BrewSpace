const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

class TestSuite {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.errors = [];
  }

  test(description, fn) {
    this.tests.push({ description, fn });
  }

  async run() {
    console.log(`\n======================================================`);
    console.log(`  SUITE: ${this.name}`);
    console.log(`======================================================`);

    for (const t of this.tests) {
      try {
        await t.fn();
        this.passed++;
        console.log(`  ✓ [PASS] ${t.description}`);
      } catch (err) {
        this.failed++;
        this.errors.push({ description: t.description, error: err });
        console.error(`  ✗ [FAIL] ${t.description}`);
        console.error(`    Error: ${err.message}`);
        if (err.stack) {
          const stackLine = err.stack.split('\n')[1] || '';
          console.error(`    Location: ${stackLine.trim()}`);
        }
      }
    }

    console.log(`------------------------------------------------------`);
    console.log(`  Results: ${this.passed} passed, ${this.failed} failed (${this.tests.length} total)`);
    return {
      name: this.name,
      total: this.tests.length,
      passed: this.passed,
      failed: this.failed,
      errors: this.errors,
    };
  }
}

// WCAG 2.x Contrast Ratio Formula
function hexToRgb(hex) {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function relativeLuminance(r, g, b) {
  const srgb = [r, g, b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function calculateContrastRatio(hex1, hex2) {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = relativeLuminance(r1, g1, b1);
  const l2 = relativeLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function readWorkspaceFile(relativePath) {
  const fullPath = path.join(ROOT_DIR, relativePath);
  return fs.readFileSync(fullPath, 'utf8');
}

function getSrcFiles(dir = SRC_DIR, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getSrcFiles(fullPath, fileList);
    } else if (/\.(tsx|ts|css|html)$/.test(item)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

module.exports = {
  TestSuite,
  ROOT_DIR,
  SRC_DIR,
  calculateContrastRatio,
  hexToRgb,
  relativeLuminance,
  readWorkspaceFile,
  getSrcFiles,
  assert,
};
