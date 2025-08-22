/**
 * Simple input sanitization utilities for CodeStat
 */

const path = require('path');

/**
 * Simple validation result
 */
class ValidationResult {
  constructor(isValid = true, errors = [], sanitized = null) {
    this.isValid = isValid;
    this.errors = errors;
    this.sanitized = sanitized;
  }

  addError(message, field = null) {
    this.isValid = false;
    this.errors.push({
      message,
      field,
      timestamp: Date.now()
    });
  }
}

/**
 * Basic string sanitization
 * @param {string} input - The input string to sanitize
 * @param {string} fieldName - The name of the field for error messages
 * @returns {ValidationResult} Validation result with sanitized string
 */
function sanitizeString(input, fieldName = 'input') {
  const result = new ValidationResult();
  
  if (!input || typeof input !== 'string') {
    result.addError(`Invalid ${fieldName}: must be a non-empty string`, fieldName);
    return result;
  }
  
  // Remove null bytes and control characters
  const sanitized = input
    .replace(/\0/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim();
  
  // Check for dangerous patterns
  const dangerousPatterns = [
    /\$\(/,  // Command substitution
    /`/,    // Backticks
    /\|/,   // Pipe
    /;/,    // Command separator
    /&/,    // Background process
    /</,    // Input redirection
    />/,    // Output redirection
    /\$\{/, // Variable expansion
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(sanitized)) {
      result.addError(`Invalid ${fieldName}: contains potentially dangerous characters`, fieldName);
      return result;
    }
  }
  
  result.sanitized = sanitized;
  return result;
}

/**
 * Basic file extension validation
 * @param {string} extensionsStr - Comma-separated extensions
 * @returns {ValidationResult} Validation result with sanitized extensions
 */
function sanitizeExtensions(extensionsStr) {
  const result = new ValidationResult();
  
  const stringResult = sanitizeString(extensionsStr, 'extensions');
  if (!stringResult.isValid) {
    return stringResult;
  }
  
  const extensions = stringResult.sanitized.split(',').map(ext => ext.trim()).filter(ext => ext);
  
  if (extensions.length === 0) {
    result.addError('At least one extension must be provided', 'extensions');
    return result;
  }
  
  const sanitizedExtensions = [];
  
  for (const ext of extensions) {
    // Basic validation - no dots allowed to prevent bypass attacks
    if (!/^[a-zA-Z0-9]+$/.test(ext) || ext.length > 10) {
      result.addError(`Invalid extension format: "${ext}"`, 'extensions');
      continue;
    }
    
    // Prevent path traversal
    if (ext.includes('..') || ext.includes('/') || ext.includes('\\')) {
      result.addError(`Extension "${ext}" contains invalid characters`, 'extensions');
      continue;
    }
    
    sanitizedExtensions.push(ext);
  }
  
  if (sanitizedExtensions.length === 0) {
    result.addError('No valid extensions found', 'extensions');
    return result;
  }
  
  result.sanitized = sanitizedExtensions;
  return result;
}

/**
 * Basic ignore pattern validation
 * @param {string} patternsStr - Comma-separated patterns
 * @returns {ValidationResult} Validation result with sanitized patterns
 */
function sanitizeIgnorePatterns(patternsStr) {
  const result = new ValidationResult();
  
  const stringResult = sanitizeString(patternsStr, 'ignore patterns');
  if (!stringResult.isValid) {
    return stringResult;
  }
  
  const patterns = stringResult.sanitized.split(',').map(pattern => pattern.trim()).filter(pattern => pattern);
  
  if (patterns.length === 0) {
    result.addError('At least one ignore pattern must be provided', 'ignore patterns');
    return result;
  }
  
  const sanitizedPatterns = [];
  
  for (const pattern of patterns) {
    // Prevent path traversal
    if (pattern.includes('..') || pattern.includes('~') || pattern.includes('$')) {
      result.addError(`Pattern "${pattern}" contains invalid characters`, 'ignore patterns');
      continue;
    }
    
    // Basic format validation - simplified to avoid ReDoS
    if (pattern.length > 100 || !/^[a-zA-Z0-9_\-\.\*\/]+$/.test(pattern)) {
      result.addError(`Invalid pattern format: "${pattern}"`, 'ignore patterns');
      continue;
    }
    
    sanitizedPatterns.push(pattern);
  }
  
  if (sanitizedPatterns.length === 0) {
    result.addError('No valid ignore patterns found', 'ignore patterns');
    return result;
  }
  
  result.sanitized = sanitizedPatterns;
  return result;
}

/**
 * Basic path validation
 * @param {string} inputPath - Path to validate
 * @param {Object} options - Validation options
 * @returns {ValidationResult} Validation result with sanitized path
 */
function validateAndSanitizePath(inputPath, options = {}) {
  const result = new ValidationResult();
  
  if (!inputPath || typeof inputPath !== 'string') {
    result.addError('Path must be a non-empty string', 'path');
    return result;
  }
  
  let sanitizedPath = inputPath.trim();
  
  // Remove null bytes and control characters
  sanitizedPath = sanitizedPath
    .replace(/\0/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim();
  
  // Check for path traversal
  if (sanitizedPath.includes('..') || sanitizedPath.includes('~')) {
    result.addError('Path contains potentially dangerous characters', 'path');
    return result;
  }
  
  // Normalize the path
  try {
    const normalizedPath = path.normalize(sanitizedPath);
    
    // Check if it still contains dangerous patterns
    if (normalizedPath.includes('..')) {
      result.addError('Normalized path contains dangerous patterns', 'path');
      return result;
    }
    
    result.sanitized = normalizedPath;
    return result;
    
  } catch (error) {
    result.addError('Path normalization failed', 'path');
    return result;
  }
}

/**
 * Basic config path validation
 * @param {string} configPath - Path to config file
 * @returns {ValidationResult} Validation result with sanitized path
 */
function sanitizeConfigPath(configPath) {
  return validateAndSanitizePath(configPath);
}

/**
 * Basic boolean validation
 * @param {string|boolean} boolValue - Boolean value to validate
 * @returns {ValidationResult} Validation result with sanitized boolean
 */
function sanitizeBoolean(boolValue) {
  const result = new ValidationResult();
  
  if (typeof boolValue === 'boolean') {
    result.sanitized = boolValue;
    return result;
  }
  
  if (typeof boolValue === 'string') {
    const lower = boolValue.toLowerCase().trim();
    if (lower === 'true' || lower === 'yes' || lower === '1') {
      result.sanitized = true;
      return result;
    }
    if (lower === 'false' || lower === 'no' || lower === '0') {
      result.sanitized = false;
      return result;
    }
  }
  
  result.addError('Invalid boolean value', 'boolean');
  return result;
}

module.exports = {
  ValidationResult,
  sanitizeString,
  sanitizeExtensions,
  sanitizeIgnorePatterns,
  validateAndSanitizePath,
  sanitizeConfigPath,
  sanitizeBoolean
};