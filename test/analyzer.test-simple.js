const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { analyzeProject } = require('../src/analyzer');

async function testAnalyzeProjectBasic() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codestat-analyzer-'));
  const jsFile = path.join(tempDir, 'sample.js');
  fs.writeFileSync(jsFile, 'const a = 1;\n// comment\n\nconst b = 2;\n');

  const result = await analyzeProject(tempDir, ['js'], [], {
    useCache: false,
    trackStats: false
  });

  assert.strictEqual(result.totalFiles, 1, 'should find one js file');
  assert.strictEqual(result.totalLines, 5, 'should count total lines');
  assert.strictEqual(result.codeLines, 2, 'should count code lines');
  assert.strictEqual(result.commentLines, 1, 'should count comment lines');
  assert.strictEqual(result.blankLines, 2, 'should count blank lines');

  fs.rmSync(tempDir, { recursive: true, force: true });
}

async function run() {
  await testAnalyzeProjectBasic();
  console.log('analyzer.test-simple.js passed');
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
