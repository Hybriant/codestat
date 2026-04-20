const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

function testCliAnalyzeJson() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codestat-cli-'));
  const jsFile = path.join(tempDir, 'cli-sample.js');
  fs.writeFileSync(jsFile, 'const x = 1;\n');

  const cliPath = path.join(__dirname, '..', 'bin', 'cli.js');
  const output = execFileSync('node', [cliPath, 'analyze', tempDir, '--json', '--quiet', '--no-cache'], {
    encoding: 'utf8'
  });

  const result = JSON.parse(output);
  assert.strictEqual(result.totalFiles, 1, 'cli analyze should detect one file');
  assert.strictEqual(result.byFileType.js.files, 1, 'cli analyze should include js stats');

  fs.rmSync(tempDir, { recursive: true, force: true });
}

function run() {
  testCliAnalyzeJson();
  console.log('cli.test-simple.ts passed');
}

try {
  run();
} catch (error) {
  console.error(error);
  process.exit(1);
}
