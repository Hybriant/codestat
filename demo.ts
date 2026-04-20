#!/usr/bin/env node

/**
 * CodeStat Demo Script
 * Showcases all the amazing features of CodeStat
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Welcome to the CodeStat Demo! 🚀\n');

// Check if CodeStat is installed
try {
  execSync('codestat --version', { stdio: 'pipe' });
  console.log('✅ CodeStat is installed and ready!\n');
} catch (error) {
  console.log('❌ CodeStat is not installed. Please run: npm install -g codestat\n');
  process.exit(1);
}

// Demo commands
const demos = [
  {
    title: '🎯 Basic Analysis',
    command: 'codestat analyze',
    description: 'Analyze the current directory with beautiful output'
  },
  {
    title: '⚡ Quick Analysis',
    command: 'codestat quick',
    description: 'Get a quick overview of your project'
  },
  {
    title: '📊 Your Statistics',
    command: 'codestat stats',
    description: 'View your personal coding achievements'
  },
  {
    title: '🗂️ Cache Management',
    command: 'codestat cache --stats',
    description: 'Check cache performance and statistics'
  },
  {
    title: '📋 Configuration',
    command: 'codestat config --show',
    description: 'View current configuration settings'
  },
  {
    title: '🔍 JSON Output',
    command: 'codestat analyze --json',
    description: 'Export results in JSON format for integration'
  },
  {
    title: '🎨 Simple Output',
    command: 'codestat analyze -o simple',
    description: 'Clean, minimal output perfect for scripts'
  }
];

console.log('📋 Available Demo Commands:\n');
demos.forEach((demo, index) => {
  console.log(`${index + 1}. ${demo.title}`);
  console.log(`   Command: ${demo.command}`);
  console.log(`   Description: ${demo.description}\n`);
});

// Interactive demo
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('💡 Tip: You can also try these advanced features:');
console.log('   • codestat file <filename>     - Analyze a single file');
console.log('   • codestat history              - View project analysis history');
console.log('   • codestat analyze -e "js,ts"   - Analyze specific extensions');
console.log('   • codestat analyze -i "node_modules" - Ignore specific patterns\n');

rl.question('🎬 Press Enter to run the first demo, or Ctrl+C to exit: ', () => {
  console.log('\n🎬 Running demo: Basic Analysis\n');
  try {
    execSync('codestat analyze', { stdio: 'inherit' });
  } catch (error) {
    console.log('Demo completed with some output.\n');
  }
  
  console.log('\n✨ Demo completed! Try running other commands:\n');
  demos.slice(1).forEach(demo => {
    console.log(`   ${demo.command}`);
  });
  
  rl.close();
});