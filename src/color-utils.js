/**
 * Utility for creating GitHub-inspired color functions that work with chalk
 */

const chalk = require('chalk');

// GitHub-inspired color mapping
const languageHexColors = {
  // JavaScript and TypeScript
  'js': '#f1e05a',
  'jsx': '#f1e05a',
  'ts': '#3178c6',
  'tsx': '#3178c6',
  'mjs': '#f1e05a',
  'cjs': '#f1e05a',
  
  // Python
  'py': '#3572A5',
  
  // Java
  'java': '#b07219',
  
  // C Family
  'c': '#555555',
  'cpp': '#f34b7d',
  'cc': '#f34b7d',
  'cxx': '#f34b7d',
  'h': '#555555',
  'hpp': '#f34b7d',
  
  // C#
  'cs': '#239120',
  'csx': '#239120',
  
  // Go
  'go': '#00ADD8',
  
  // Rust
  'rs': '#dea584',
  
  // PHP
  'php': '#4F5D95',
  'php3': '#4F5D95',
  'php4': '#4F5D95',
  'php5': '#4F5D95',
  'phtml': '#4F5D95',
  
  // Ruby
  'rb': '#701516',
  'gemspec': '#701516',
  
  // Swift
  'swift': '#FA7343',
  
  // Kotlin
  'kt': '#A97BFF',
  'kts': '#A97BFF',
  
  // Scala
  'scala': '#c22d40',
  'sc': '#c22d40',
  
  // Dart
  'dart': '#00B4AB',
  
  // Shell/Bash
  'sh': '#89e051',
  'bash': '#89e051',
  'zsh': '#89e051',
  'fish': '#89e051',
  'command': '#89e051',
  
  // HTML
  'html': '#e34c26',
  'htm': '#e34c26',
  'xhtml': '#e34c26',
  
  // CSS
  'css': '#563d7c',
  'scss': '#cf649a',
  'sass': '#cf649a',
  'less': '#1d365d',
  
  // SQL
  'sql': '#336790',
  
  // Markdown
  'md': '#083fa1',
  'markdown': '#083fa1',
  
  // JSON
  'json': '#292929',
  'jsonc': '#292929',
  
  // YAML
  'yaml': '#cb171e',
  'yml': '#cb171e',
  
  // TOML
  'toml': '#9c4221',
  
  // XML
  'xml': '#0060ac',
  'xsl': '#0060ac',
  'xsd': '#0060ac',
  
  // Vue
  'vue': '#2c3e50',
  
  // Svelte
  'svelte': '#ff3e00',
  
  // Astro
  'astro': '#ff5d01',
  
  // Groovy
  'groovy': '#4298b8',
  'gvy': '#4298b8',
  
  // Objective-C
  'm': '#438eff',
  'mm': '#438eff',
  
  // Perl
  'pl': '#0298c3',
  'pm': '#0298c3',
  
  // R
  'r': '#198ce7',
  
  // Lua
  'lua': '#000080',
  
  // Visual Basic
  'vb': '#945db7',
  'vbs': '#945db7',
  'vba': '#945db7',
  'bas': '#945db7',
  
  // Batch
  'bat': '#C1F12E',
  'cmd': '#C1F12E',
  
  // Assembly
  'asm': '#6E4C13',
  's': '#6E4C13',
  'nasm': '#6E4C13',
  'fasm': '#6E4C13',
  
  // Default color for unknown languages
  'default': '#858585'
};

/**
 * Creates a chalk instance with a specific hex color
 * @param {string} hexColor - Hex color code
 * @returns {Object} Chalk instance with the color
 */
function createChalkColor(hexColor) {
  // Remove # if present
  const color = hexColor.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  // Create a new chalk instance with the RGB color
  return chalk.rgb(r, g, b);
}

/**
 * Gets a chalk color function for a language
 * @param {string} extension - File extension
 * @returns {Object} Chalk instance with the language color
 */
function getLanguageColor(extension) {
  const ext = extension.toLowerCase();
  const hexColor = languageHexColors[ext] || languageHexColors.default;
  return createChalkColor(hexColor);
}

/**
 * Gets the hex color for a language
 * @param {string} extension - File extension
 * @returns {string} Hex color code
 */
function getLanguageHexColor(extension) {
  const ext = extension.toLowerCase();
  return languageHexColors[ext] || languageHexColors.default;
}

module.exports = {
  getLanguageColor,
  getLanguageHexColor,
  languageHexColors
};