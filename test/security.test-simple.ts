const assert = require('assert');
const { sanitizeExtensions, sanitizeIgnorePatterns } = require('../src/input-sanitization');

function testRejectDangerousExtensionsInput() {
  const result = sanitizeExtensions('js,$(rm -rf /)');
  assert.strictEqual(result.isValid, false, 'dangerous extension input must be rejected');
}

function testRejectDangerousIgnorePatterns() {
  const result = sanitizeIgnorePatterns('node_modules,../secret');
  assert.strictEqual(result.isValid, false, 'dangerous ignore patterns must be rejected');
}

function run() {
  testRejectDangerousExtensionsInput();
  testRejectDangerousIgnorePatterns();
  console.log('security.test-simple.ts passed');
}

try {
  run();
} catch (error) {
  console.error(error);
  process.exit(1);
}
