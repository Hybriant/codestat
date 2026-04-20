const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Default configuration
 */
const DEFAULT_CONFIG = {
  extensions: [
    'js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'go', 'rs', 
    'php', 'rb', 'cs', 'swift', 'kt', 'scala', 'dart', 'groovy', 
    'sql', 'sh', 'vb', 'pl', 'html', 'css', 'scss', 'less', 'vue', 
    'svelte', 'astro', 'xml', 'json', 'yaml', 'yml', 'toml', 'md', 'txt'
  ],
  ignore: ['node_modules', '.git', 'dist', 'build'],
  maxFileSize: '10MB',
  output: 'fancy',
  showHidden: false,
  skipBinaryFiles: true,
  quiet: false,
  binaryDetectionSampleSize: 1024,
  binaryDetectionThreshold: 0.3,
  cancellationCheckInterval: 1000,
  maxRecursionDepth: 100,
  maxFilesPerDirectory: 10000
};

/**
 * Configuration file locations in order of priority
 */
const CONFIG_LOCATIONS = [
  './.codestatrc',
  './.codestatrc.json',
  './.codestatrc.yml',
  './.codestatrc.yaml',
  path.join(os.homedir(), '.codestatrc'),
  path.join(os.homedir(), '.codestatrc.json'),
  path.join(os.homedir(), '.codestatrc.yml'),
  path.join(os.homedir(), '.codestatrc.yaml')
];

/**
 * Parses a size string (e.g., '10MB') to bytes
 * @param {string} sizeStr - Size string
 * @returns {number} Size in bytes
 */
function parseSize(sizeStr) {
  if (typeof sizeStr === 'number') return sizeStr;
  
  const units = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024
  };
  
  const match = sizeStr.toString().match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)$/i);
  if (!match) {
    throw new Error(`Invalid size format: ${sizeStr}`);
  }
  
  return parseFloat(match[1]) * units[match[2].toUpperCase()];
}

/**
 * Loads configuration from file
 * @param {string} configPath - Path to config file (optional)
 * @returns {Object} Configuration object
 */
function loadConfig(configPath) {
  let config = { ...DEFAULT_CONFIG };
  
  // If specific config path is provided, try to load it
  if (configPath) {
    if (!fs.existsSync(configPath)) {
      throw new Error(`Configuration file not found: ${configPath}`);
    }
    return loadConfigFile(configPath, config);
  }
  
  // Try to find config file in default locations
  for (const location of CONFIG_LOCATIONS) {
    if (fs.existsSync(location)) {
      try {
        config = loadConfigFile(location, config);
        break;
      } catch (error) {
        console.warn(`Warning: Failed to load config from ${location}: ${error.message}`);
      }
    }
  }
  
  // Apply environment variable overrides
  applyEnvOverrides(config);
  
  return config;
}

/**
 * Loads a specific configuration file
 * @param {string} filePath - Path to config file
 * @param {Object} currentConfig - Current configuration to merge with
 * @returns {Object} Merged configuration
 */
function loadConfigFile(filePath, currentConfig) {
  const content = fs.readFileSync(filePath, 'utf8');
  const ext = path.extname(filePath).toLowerCase();
  
  let fileConfig;
  
  if (ext === '.json' || filePath.endsWith('.rc.json')) {
    try {
      fileConfig = JSON.parse(content);
    } catch (error) {
      throw new Error(`Invalid JSON in config file: ${error.message}`);
    }
  } else if (ext === '.yml' || ext === '.yaml' || filePath.endsWith('.rc.yml') || filePath.endsWith('.rc.yaml')) {
    // For YAML, we would need a YAML parser
    // For now, we'll skip YAML files
    return currentConfig;
  } else {
    // Assume it's a simple .rc file with KEY=VALUE format
    fileConfig = parseSimpleConfig(content);
  }
  
  // Validate and merge configuration
  return validateAndMergeConfig(fileConfig, currentConfig);
}

/**
 * Parses a simple configuration file format
 * @param {string} content - File content
 * @returns {Object} Parsed configuration
 */
function parseSimpleConfig(content) {
  const config = {};
  
  content.split('\n').forEach(line => {
    line = line.trim();
    
    // Skip comments and empty lines
    if (line.startsWith('#') || line === '') return;
    
    // Parse KEY=VALUE or KEY: VALUE format
    const match = line.match(/^([^=:]+)[=:]\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Parse arrays (comma-separated)
      if (value.includes(',')) {
        value = value.split(',').map(item => item.trim());
      }
      
      // Parse boolean values
      if (String(value).toLowerCase() === 'true') value = true;
      if (String(value).toLowerCase() === 'false') value = false;
      
      config[key] = value;
    }
  });
  
  return config;
}

/**
 * Validates and merges configuration
 * @param {Object} newConfig - New configuration to merge
 * @param {Object} currentConfig - Current configuration
 * @returns {Object} Validated and merged configuration
 */
function validateAndMergeConfig(newConfig, currentConfig) {
  const merged = { ...currentConfig };
  
  // Validate and merge each property
  if (newConfig.extensions) {
    if (!Array.isArray(newConfig.extensions)) {
      throw new Error('extensions must be an array');
    }
    if (newConfig.extensions.length === 0) {
      throw new Error('extensions cannot be empty');
    }
    if (newConfig.extensions.some(ext => typeof ext !== 'string' || ext.trim() === '')) {
      throw new Error('all extensions must be non-empty strings');
    }
    merged.extensions = newConfig.extensions;
  }
  
  if (newConfig.ignore) {
    if (!Array.isArray(newConfig.ignore)) {
      throw new Error('ignore must be an array');
    }
    if (newConfig.ignore.some(pattern => typeof pattern !== 'string' || pattern.trim() === '')) {
      throw new Error('all ignore patterns must be non-empty strings');
    }
    merged.ignore = newConfig.ignore;
  }
  
  if (newConfig.maxFileSize) {
    try {
      const size = parseSize(newConfig.maxFileSize);
      if (size < 1024) { // Less than 1KB
        throw new Error('maxFileSize must be at least 1KB');
      }
      if (size > 1024 * 1024 * 1024) { // More than 1GB
        throw new Error('maxFileSize cannot exceed 1GB');
      }
      merged.maxFileSize = size;
    } catch (error) {
      throw new Error(`Invalid maxFileSize: ${error.message}`);
    }
  }
  
  if (newConfig.output) {
    if (!['fancy', 'simple', 'json'].includes(newConfig.output)) {
      throw new Error('output must be one of: fancy, simple, json');
    }
    merged.output = newConfig.output;
  }
  
  if (typeof newConfig.showHidden === 'boolean') {
    merged.showHidden = newConfig.showHidden;
  }
  
  if (typeof newConfig.skipBinaryFiles === 'boolean') {
    merged.skipBinaryFiles = newConfig.skipBinaryFiles;
  }
  
  if (typeof newConfig.quiet === 'boolean') {
    merged.quiet = newConfig.quiet;
  }
  
  if (typeof newConfig.binaryDetectionSampleSize === 'number') {
    if (newConfig.binaryDetectionSampleSize < 100 || newConfig.binaryDetectionSampleSize > 10000) {
      throw new Error('binaryDetectionSampleSize must be between 100 and 10000');
    }
    merged.binaryDetectionSampleSize = newConfig.binaryDetectionSampleSize;
  }
  
  if (typeof newConfig.binaryDetectionThreshold === 'number') {
    if (newConfig.binaryDetectionThreshold < 0.1 || newConfig.binaryDetectionThreshold > 0.9) {
      throw new Error('binaryDetectionThreshold must be between 0.1 and 0.9');
    }
    merged.binaryDetectionThreshold = newConfig.binaryDetectionThreshold;
  }
  
  if (typeof newConfig.cancellationCheckInterval === 'number') {
    if (newConfig.cancellationCheckInterval < 100 || newConfig.cancellationCheckInterval > 10000) {
      throw new Error('cancellationCheckInterval must be between 100 and 10000');
    }
    merged.cancellationCheckInterval = newConfig.cancellationCheckInterval;
  }
  
  if (typeof newConfig.maxRecursionDepth === 'number') {
    if (newConfig.maxRecursionDepth < 1 || newConfig.maxRecursionDepth > 1000) {
      throw new Error('maxRecursionDepth must be between 1 and 1000');
    }
    merged.maxRecursionDepth = newConfig.maxRecursionDepth;
  }
  
  if (typeof newConfig.maxFilesPerDirectory === 'number') {
    if (newConfig.maxFilesPerDirectory < 100 || newConfig.maxFilesPerDirectory > 100000) {
      throw new Error('maxFilesPerDirectory must be between 100 and 100000');
    }
    merged.maxFilesPerDirectory = newConfig.maxFilesPerDirectory;
  }
  
  return merged;
}

/**
 * Applies environment variable overrides
 * @param {Object} config - Configuration object
 */
function applyEnvOverrides(config) {
  if (process.env.CODESTAT_EXTENSIONS) {
    config.extensions = process.env.CODESTAT_EXTENSIONS.split(',');
  }
  
  if (process.env.CODESTAT_IGNORE) {
    config.ignore = process.env.CODESTAT_IGNORE.split(',');
  }
  
  if (process.env.CODESTAT_MAX_FILE_SIZE) {
    try {
      config.maxFileSize = parseSize(process.env.CODESTAT_MAX_FILE_SIZE);
    } catch (error) {
      console.warn(`Warning: Invalid CODESTAT_MAX_FILE_SIZE: ${error.message}`);
    }
  }
  
  if (process.env.CODESTAT_OUTPUT) {
    if (['fancy', 'simple', 'json'].includes(process.env.CODESTAT_OUTPUT)) {
      config.output = process.env.CODESTAT_OUTPUT;
    } else {
      console.warn(`Warning: Invalid CODESTAT_OUTPUT: ${process.env.CODESTAT_OUTPUT}`);
    }
  }
  
  if (process.env.CODESTAT_SHOW_HIDDEN) {
    config.showHidden = String(process.env.CODESTAT_SHOW_HIDDEN).toLowerCase() === 'true';
  }
  
  if (process.env.CODESTAT_SKIP_BINARY) {
    config.skipBinaryFiles = String(process.env.CODESTAT_SKIP_BINARY).toLowerCase() !== 'false';
  }
}

/**
 * Creates a sample configuration file
 * @param {string} filePath - Path where to create the config file
 */
function createSampleConfig(filePath) {
  const sampleConfig = `# CodeStat Configuration File
# This file can be in JSON, YAML, or simple KEY=VALUE format

# File extensions to analyze (comma-separated array)
extensions=js,ts,jsx,tsx,py,java,cpp,c,go,rs,php,rb,cs

# Patterns to ignore (comma-separated array)
ignore=node_modules,.git,dist,build,coverage

# Maximum file size to analyze (e.g., 10MB, 5KB, 1GB)
maxFileSize=10MB

# Output format: fancy, simple, or json
output=fancy

# Show hidden files and directories
showHidden=false

# Skip binary files
skipBinaryFiles=true

# Quiet mode (suppress progress indicators)
quiet=false
`;
  
  fs.writeFileSync(filePath, sampleConfig);
  console.log(`Sample configuration created at: ${filePath}`);
}

module.exports = {
  loadConfig,
  createSampleConfig,
  DEFAULT_CONFIG,
  parseSize
};