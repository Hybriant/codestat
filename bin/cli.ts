#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const { analyzeProject, analyzeFile } = require('../src/analyzer');
const { displayResults, displayQuickResults, displayFileResults } = require('../src/responsive-display');
const { loadConfig, createSampleConfig, parseSize } = require('../src/config');
const { clearCache, getCacheStats, getUserStats, getAnalysisHistory, CACHE_TTL } = require('../src/cache');
const pkg = require('../../package.json');

function parseCsv(value, fallback) {
  if (!value) return fallback;
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

function normalizePath(inputPath) {
  const resolved = path.resolve(inputPath || process.cwd());
  if (!fs.existsSync(resolved)) {
    throw new Error(`Path does not exist: ${resolved}`);
  }
  return resolved;
}

function toNumber(value, fallback) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseSize(value);
  return fallback;
}

function buildAnalyzeOptions(cmdOptions, config) {
  const extensions = parseCsv(cmdOptions.extensions, config.extensions);
  const ignorePatterns = parseCsv(cmdOptions.ignore, config.ignore);
  const maxFileSize = cmdOptions.maxSize
    ? parseSize(cmdOptions.maxSize)
    : toNumber(config.maxFileSize, 10 * 1024 * 1024);
  const output = cmdOptions.json ? 'json' : (cmdOptions.output || config.output || 'fancy');

  return {
    extensions,
    ignorePatterns,
    output,
    analysisOptions: {
      useCache: cmdOptions.cache,
      showHidden: cmdOptions.showHidden || config.showHidden,
      skipBinaryFiles: config.skipBinaryFiles !== false,
      maxFileSize,
      verbose: Boolean(cmdOptions.verbose),
      quiet: Boolean(cmdOptions.quiet || config.quiet),
      trackStats: true
    }
  };
}

function renderProjectResults(results, output, quickMode = false) {
  if (output === 'json') {
    console.log(JSON.stringify(results, null, 2));
    return;
  }
  if (quickMode) {
    displayQuickResults(results);
    return;
  }
  displayResults(results);
}

function printStats() {
  const stats = getUserStats();
  console.log('CodeStat User Stats');
  console.log(`- Projects analyzed: ${stats.totalProjectsAnalyzed}`);
  console.log(`- Files analyzed: ${stats.totalFilesAnalyzed.toLocaleString()}`);
  console.log(`- Lines analyzed: ${stats.totalLinesAnalyzed.toLocaleString()}`);
  console.log(`- Analyses completed: ${stats.analysesCompleted}`);
  console.log(`- Cache hits: ${stats.cacheHits}`);
  if (stats.milestones.length > 0) {
    console.log('- Milestones:');
    stats.milestones.slice(-10).forEach(milestone => {
      console.log(`  • ${milestone.description}`);
    });
  }
}

function printHistory(projectPath, count) {
  const history = getAnalysisHistory(projectPath, count);
  if (history.length === 0) {
    console.log('No analysis history found for this project.');
    return;
  }

  history.forEach((entry, index) => {
    const when = new Date(entry.timestamp).toISOString();
    console.log(`#${index + 1} ${when}`);
    console.log(`  Files: ${entry.results.totalFiles}`);
    console.log(`  Lines: ${entry.results.totalLines}`);
    console.log(`  Code: ${entry.results.codeLines}`);
    console.log(`  Comments: ${entry.results.commentLines}`);
    console.log(`  Blank: ${entry.results.blankLines}`);
  });
}

async function run() {
  const program = new Command();

  program
    .name('codestat')
    .description('Analyze project composition and lines of code')
    .version(pkg.version)
    .option('-c, --config <path>', 'Path to config file');

  program
    .command('analyze [targetPath]')
    .description('Analyze a project directory')
    .option('-e, --extensions <extensions>', 'Comma-separated extensions')
    .option('-i, --ignore <patterns>', 'Comma-separated ignore patterns')
    .option('-j, --json', 'Output JSON')
    .option('-q, --quiet', 'Quiet mode')
    .option('-o, --output <format>', 'Output format: fancy, simple, json')
    .option('--no-cache', 'Disable cache for this run')
    .option('--clear-cache', 'Clear cache before running')
    .option('--max-size <size>', 'Max file size, e.g. 10MB')
    .option('--show-hidden', 'Include hidden files and directories')
    .option('--verbose', 'Verbose output')
    .action(async (targetPath, cmdOptions) => {
      try {
        const baseConfig = loadConfig(program.opts().config);
        if (cmdOptions.clearCache) {
          clearCache();
        }
        const target = normalizePath(targetPath || process.cwd());
        const runtime = buildAnalyzeOptions(cmdOptions, baseConfig);
        const results = await analyzeProject(
          target,
          runtime.extensions,
          runtime.ignorePatterns,
          runtime.analysisOptions
        );
        renderProjectResults(results, runtime.output, false);
      } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exitCode = 1;
      }
    });

  program
    .command('quick [targetPath]')
    .description('Quick analysis with compact output')
    .option('--no-cache', 'Disable cache for this run')
    .option('--show-hidden', 'Include hidden files and directories')
    .option('--max-size <size>', 'Max file size, e.g. 10MB')
    .option('-j, --json', 'Output JSON')
    .action(async (targetPath, cmdOptions) => {
      try {
        const baseConfig = loadConfig(program.opts().config);
        const target = normalizePath(targetPath || process.cwd());
        const runtime = buildAnalyzeOptions(
          {
            ...cmdOptions,
            output: 'simple'
          },
          baseConfig
        );
        const results = await analyzeProject(
          target,
          runtime.extensions,
          runtime.ignorePatterns,
          runtime.analysisOptions
        );
        renderProjectResults(results, runtime.output, true);
      } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exitCode = 1;
      }
    });

  program
    .command('file <filePath>')
    .description('Analyze a single file')
    .option('--max-size <size>', 'Max file size, e.g. 10MB')
    .option('-j, --json', 'Output JSON')
    .option('--verbose', 'Verbose output')
    .action(async (filePath, cmdOptions) => {
      try {
        const target = normalizePath(filePath);
        const maxFileSize = cmdOptions.maxSize ? parseSize(cmdOptions.maxSize) : 10 * 1024 * 1024;
        const results = await analyzeFile(target, {
          maxFileSize,
          verbose: Boolean(cmdOptions.verbose)
        });
        if (cmdOptions.json) {
          console.log(JSON.stringify(results, null, 2));
          return;
        }
        displayFileResults(results);
      } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exitCode = 1;
      }
    });

  program
    .command('cache')
    .description('Cache operations')
    .option('-c, --clear', 'Clear cache')
    .option('-s, --stats', 'Show cache stats')
    .action(cmdOptions => {
      if (cmdOptions.clear) {
        clearCache();
        console.log('Cache cleared.');
      }
      if (cmdOptions.stats) {
        const stats = getCacheStats();
        console.log('Cache Stats');
        console.log(`- Entries: ${stats.totalEntries || 0}`);
        console.log(`- Valid entries: ${stats.validEntries || 0}`);
        console.log(`- Total size: ${stats.totalSize || 0} bytes`);
        console.log(`- TTL: ${Math.round(CACHE_TTL / (1000 * 60 * 60))} hours`);
        if (stats.cacheDir) {
          console.log(`- Directory: ${stats.cacheDir}`);
        }
      }
      if (!cmdOptions.clear && !cmdOptions.stats) {
        console.log('Use --clear or --stats');
      }
    });

  program
    .command('stats')
    .description('Show your CodeStat statistics')
    .action(() => {
      printStats();
    });

  program
    .command('history [targetPath]')
    .description('Show project analysis history')
    .option('-n, --number <count>', 'Number of entries', '10')
    .action((targetPath, cmdOptions) => {
      try {
        const target = normalizePath(targetPath || process.cwd());
        const count = Number.parseInt(cmdOptions.number, 10);
        printHistory(target, Number.isNaN(count) ? 10 : count);
      } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exitCode = 1;
      }
    });

  program
    .command('config')
    .description('Manage configuration')
    .option('--init', 'Create sample .codestatrc in current directory')
    .option('--show', 'Show resolved configuration')
    .action(cmdOptions => {
      try {
        if (cmdOptions.init) {
          const configPath = path.join(process.cwd(), '.codestatrc');
          createSampleConfig(configPath);
        }
        if (cmdOptions.show) {
          const config = loadConfig(program.opts().config);
          console.log(JSON.stringify(config, null, 2));
        }
        if (!cmdOptions.init && !cmdOptions.show) {
          console.log('Use --init or --show');
        }
      } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exitCode = 1;
      }
    });

  await program.parseAsync(process.argv);
}

run();
