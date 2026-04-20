const assert = require('assert');
const { countLinesByLanguage } = require('../src/language-config');

function testLanguageCommentDetection() {
  const content = 'const a = 1;\n// comment line\n\nconst b = 2;';
  const result = countLinesByLanguage(content, 'js');

  assert.strictEqual(result.total, 4, 'should count total lines');
  assert.strictEqual(result.code, 2, 'should count code lines');
  assert.strictEqual(result.comments, 1, 'should count comment lines');
  assert.strictEqual(result.blank, 1, 'should count blank lines');
}

function run() {
  testLanguageCommentDetection();
  console.log('language.test.js passed');
}

try {
  run();
} catch (error) {
  console.error(error);
  process.exit(1);
}
