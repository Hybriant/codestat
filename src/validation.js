const path = require('path');

/**
 * Validates and sanitizes a file path to prevent directory traversal attacks
 * @param {string} inputPath - The input path to validate
 * @param {string} basePath - The base path to resolve against (default: process.cwd())
 * @returns {string} The validated and resolved absolute path
 * @throws {Error} If the path is invalid or contains traversal patterns
 */
function validateAndResolvePath(inputPath, basePath = process.cwd()) {
  // Input validation
  if (!inputPath || typeof inputPath !== 'string') {
    throw new Error('Invalid path: Path must be a non-empty string');
  }
  
  // Remove any null bytes and other dangerous characters
  let sanitizedPath = inputPath.replace(/\0/g, '').trim();
  
  // Decode URL-encoded characters to prevent encoded traversal attacks
  try {
    const decodedPath = decodeURIComponent(sanitizedPath);
    if (decodedPath !== sanitizedPath) {
      // Check if decoded path contains dangerous patterns
      if (decodedPath.includes('..') || decodedPath.includes('~') || decodedPath.includes('$')) {
        throw new Error('Invalid path: Path traversal detected');
      }
    }
    sanitizedPath = decodedPath;
  } catch (error) {
    throw new Error('Invalid path: Contains invalid URL encoding');
  }
  
  // Check for obvious traversal attempts before any processing
  if (sanitizedPath.includes('..') || sanitizedPath.includes('~') || sanitizedPath.includes('$')) {
    throw new Error('Invalid path: Path traversal detected');
  }
  
  // Resolve the base path to ensure it's absolute
  const resolvedBasePath = path.resolve(basePath);
  
  // Join and resolve the full path
  let fullPath;
  try {
    fullPath = path.resolve(resolvedBasePath, sanitizedPath);
  } catch (error) {
    throw new Error('Invalid path: Unable to resolve path');
  }
  
  // Normalize the path for comparison
  const normalizedFullPath = path.normalize(fullPath);
  const normalizedBasePath = path.resolve(resolvedBasePath);
  
  // Security check: ensure the resolved path is within the base path
  // This is the critical security check
  if (!normalizedFullPath.startsWith(normalizedBasePath)) {
    throw new Error('Invalid path: Target is outside the allowed directory');
  }
  
  // Additional check for symlink attacks (if we have access to fs)
  try {
    const fs = require('fs');
    const stats = fs.statSync(normalizedFullPath, { throwIfNoEntry: false });
    if (stats && stats.isSymbolicLink()) {
      throw new Error('Invalid path: Symbolic links are not allowed');
    }
  } catch (error) {
    // If we can't check for symlinks, continue but this is a potential risk
  }
  
  return normalizedFullPath;
}

/**
 * Validates file extensions format
 * @param {string} extensionsStr - Comma-separated extensions
 * @returns {string[]} Array of validated extensions
 * @throws {Error} If extensions format is invalid
 */
function validateExtensions(extensionsStr) {
  if (!extensionsStr || typeof extensionsStr !== 'string') {
    throw new Error('Extensions must be a non-empty string');
  }
  
  const extensions = extensionsStr.split(',').map(ext => ext.trim());
  
  // Validate each extension
  for (const ext of extensions) {
    if (!ext || !/^[a-zA-Z0-9]+$/.test(ext)) {
      throw new Error(`Invalid extension: "${ext}". Extensions must be alphanumeric`);
    }
  }
  
  return extensions;
}

/**
 * Validates ignore patterns format
 * @param {string} patternsStr - Comma-separated patterns
 * @returns {string[]} Array of validated patterns
 * @throws {Error} If patterns format is invalid
 */
function validateIgnorePatterns(patternsStr) {
  if (!patternsStr || typeof patternsStr !== 'string') {
    throw new Error('Ignore patterns must be a non-empty string');
  }
  
  const patterns = patternsStr.split(',').map(pattern => pattern.trim());
  
  // Validate each pattern
  for (const pattern of patterns) {
    if (!pattern || pattern.includes('..') || pattern.startsWith('/')) {
      throw new Error(`Invalid ignore pattern: "${pattern}"`);
    }
  }
  
  return patterns;
}

module.exports = {
  validateAndResolvePath,
  validateExtensions,
  validateIgnorePatterns
};