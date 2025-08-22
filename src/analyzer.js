const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { countLinesByLanguage, getCommentPatterns } = require('./language-config');
const { loadCachedResults, saveCachedResults, updateUserStats, saveAnalysisHistory } = require('./cache');

// Default configuration constants
const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_STREAMING_THRESHOLD = 1024 * 1024; // 1MB - Use streaming for files larger than this
const DEFAULT_MAX_RECURSION_DEPTH = 100;
const BINARY_FILE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'ico', 'pdf', 'zip', 'tar', 'gz', 'exe', 'dll', 'so', 'dylib'];
const DEFAULT_MAX_FILES_PER_DIRECTORY = 10000;
const DEFAULT_BINARY_DETECTION_SAMPLE_SIZE = 1024;
const DEFAULT_BINARY_DETECTION_THRESHOLD = 0.3;
const DEFAULT_CANCELLATION_CHECK_INTERVAL = 1000;

/**
 * Gets the file extension from a file path
 * @param {string} filePath - Path to the file
 * @returns {string} File extension (without the dot) or 'unknown'
 */
function getFileExtension(filePath) {
  const ext = path.extname(filePath).toLowerCase().substring(1);
  return ext || 'unknown';
}

/**
 * Checks if a file is likely binary based on its extension and content
 * @param {string} filePath - Path to the file
 * @param {string} extension - File extension
 * @param {Object} config - Configuration object
 * @returns {boolean} True if the file is likely binary
 */
function isBinaryFile(filePath, extension, config = {}) {
  const {
    binaryDetectionSampleSize = DEFAULT_BINARY_DETECTION_SAMPLE_SIZE,
    binaryDetectionThreshold = DEFAULT_BINARY_DETECTION_THRESHOLD
  } = config;
  
  // Check extension first
  if (BINARY_FILE_EXTENSIONS.includes(extension.toLowerCase())) {
    return true;
  }
  
  // For unknown extensions, try to read the first few bytes
  try {
    const buffer = fs.readFileSync(filePath, { encoding: null });
    if (buffer.length === 0) return false;
    
    // Check for null bytes (common in binary files)
    if (buffer.includes(0x00)) return true;
    
    // Check for high concentration of non-printable characters
    let nonPrintableCount = 0;
    const sampleSize = Math.min(binaryDetectionSampleSize, buffer.length);
    for (let i = 0; i < sampleSize; i++) {
      const byte = buffer[i];
      if (byte < 32 && byte !== 9 && byte !== 10 && byte !== 13) {
        nonPrintableCount++;
      }
    }
    
    // If more than threshold % of the sample is non-printable, consider it binary
    return (nonPrintableCount / sampleSize) > binaryDetectionThreshold;
  } catch (error) {
    // If we can't read the file, assume it's not binary
    return false;
  }
}

/**
 * Custom error classes for better error handling
 */
class AnalysisError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'AnalysisError';
    this.code = code;
  }
}

class FileTooLargeError extends AnalysisError {
  constructor(filePath, size) {
    super(`File "${filePath}" is too large (${size} bytes > ${DEFAULT_MAX_FILE_SIZE} bytes)`, 'FILE_TOO_LARGE');
    this.name = 'FileTooLargeError';
    this.filePath = filePath;
    this.fileSize = size;
  }
}

class RecursionDepthError extends AnalysisError {
  constructor(path) {
    super(`Maximum recursion depth exceeded at "${path}"`, 'RECURSION_DEPTH_EXCEEDED');
    this.name = 'RecursionDepthError';
    this.path = path;
  }
}

class AccessDeniedError extends AnalysisError {
  constructor(path) {
    super(`Access denied to "${path}"`, 'ACCESS_DENIED');
    this.name = 'AccessDeniedError';
    this.path = path;
  }
}

/**
 * Counts lines in a file using streaming for large files
 * @param {string} filePath - Path to the file
 * @param {number} fileSize - Size of the file in bytes
 * @param {string} extension - File extension
 * @param {Object} config - Configuration object
 * @returns {Promise<Object>} Line count results
 */
async function countLinesStreaming(filePath, fileSize, extension, config) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity
    });

    let codeCount = 0;
    let commentCount = 0;
    let blankCount = 0;
    let totalLines = 0;
    let inMultiLine = false;
    
    // Get comment patterns for this language
    const patterns = getCommentPatterns(extension);

    rl.on('line', (line) => {
      totalLines++;
      const trimmed = line.trim();
      
      if (trimmed === '') {
        blankCount++;
      } else {
        let isComment = false;
        
        // Handle multi-line comments (simplified for streaming)
        if (inMultiLine) {
          isComment = true;
          // Check for end of multi-line comment
          for (const { end } of patterns.multiLine) {
            if (trimmed.includes(end)) {
              inMultiLine = false;
              break;
            }
          }
        } else {
          // Check for multi-line comment start
          for (const { start, end } of patterns.multiLine) {
            if (trimmed.startsWith(start)) {
              isComment = true;
              if (!trimmed.includes(end)) {
                inMultiLine = true;
              }
              break;
            }
          }
          
          // Check for single-line comments if not already identified as comment
          if (!isComment) {
            for (const pattern of patterns.singleLine) {
              if (trimmed.startsWith(pattern)) {
                isComment = true;
                break;
              }
            }
          }
        }
        
        if (isComment) {
          commentCount++;
        } else {
          codeCount++;
        }
      }
      
      // Check for cancellation every cancellationCheckInterval lines
      if (totalLines % (config.cancellationCheckInterval || DEFAULT_CANCELLATION_CHECK_INTERVAL) === 0) {
        config.cancellationCheck();
      }
    });

    rl.on('close', () => {
      resolve({ total: totalLines, code: codeCount, comments: commentCount, blank: blankCount });
    });

    rl.on('error', (error) => {
      reject(error);
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
}


/**
 * Analyzes a project directory and counts lines of code
 * @param {string} rootPath - Root directory to analyze
 * @param {string[]} extensions - File extensions to include
 * @param {string[]} ignorePatterns - Patterns to ignore
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Analysis results
 * @throws {AnalysisError} If analysis fails
 */
async function analyzeProject(rootPath, extensions, ignorePatterns, options = {}) {
  const config = {
    maxFileSize: options.maxFileSize || DEFAULT_MAX_FILE_SIZE,
    streamingThreshold: options.streamingThreshold || DEFAULT_STREAMING_THRESHOLD,
    maxRecursionDepth: options.maxRecursionDepth || DEFAULT_MAX_RECURSION_DEPTH,
    maxFilesPerDirectory: options.maxFilesPerDirectory || DEFAULT_MAX_FILES_PER_DIRECTORY,
    binaryDetectionSampleSize: options.binaryDetectionSampleSize || DEFAULT_BINARY_DETECTION_SAMPLE_SIZE,
    binaryDetectionThreshold: options.binaryDetectionThreshold || DEFAULT_BINARY_DETECTION_THRESHOLD,
    cancellationCheckInterval: options.cancellationCheckInterval || DEFAULT_CANCELLATION_CHECK_INTERVAL,
    skipBinaryFiles: options.skipBinaryFiles !== false,
    cancellationCheck: options.cancellationCheck || (() => {}),
    useCache: options.useCache !== false,
    progressCallback: options.progressCallback || (() => {}),
    ...options
  };

  let fromCache = false;
  let filesProcessed = 0;
  let totalFilesFound = 0;
  if (config.useCache) {
    const cached = loadCachedResults(rootPath, extensions, ignorePatterns, {
      maxFileSize: config.maxFileSize,
      showHidden: config.showHidden,
      skipBinaryFiles: config.skipBinaryFiles,
      binaryDetectionSampleSize: config.binaryDetectionSampleSize,
      binaryDetectionThreshold: config.binaryDetectionThreshold
    });
    
    if (cached) {
      fromCache = true;
      if (config.verbose) {
        console.log('[CACHE] Using cached results');
      }
      
      // Update user stats for cache hit
      if (config.trackStats) {
        updateUserStats(cached, true);
      }
      
      return cached;
    }
  }
  const results = {
    rootPath: rootPath,
    totalFiles: 0,
    totalDirectories: 0,
    totalLines: 0,
    codeLines: 0,
    commentLines: 0,
    blankLines: 0,
    byFileType: {},
    largestFiles: [],
    skippedFiles: {
      tooLarge: 0,
      binary: 0,
      accessDenied: 0,
      other: 0
    }
  };

  /**
   * Checks if a file should be ignored based on patterns
   * @param {string} filePath - Path to check
   * @returns {boolean} True if the file should be ignored
   */
  function shouldIgnore(filePath) {
    const fileName = path.basename(filePath);
    const relativePath = path.relative(rootPath, filePath);
    
    return ignorePatterns.some(pattern => {
      if (pattern.startsWith('.')) {
        return fileName === pattern || relativePath.includes(pattern);
      }
      return relativePath.includes(pattern);
    });
  }

  
  /**
   * Counts lines in content and categorizes them
   * @param {string} content - File content as string
   * @param {string} extension - File extension
   * @returns {LineCountResult} Line count statistics
   */
  function countLines(content, extension) {
    return countLinesByLanguage(content, extension);
  }

  /**
   * Analyzes a single file
   * @param {string} filePath - Path to the file
   */
  async function analyzeFile(filePath) {
    try {
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) return;

      // Check file size
      if (stats.size > config.maxFileSize) {
        results.skippedFiles.tooLarge++;
        if (config.verbose) {
          console.warn(`Warning: Skipping large file "${filePath}" (${stats.size} bytes)`);
        }
        return;
      }

      const ext = getFileExtension(filePath);
      if (!extensions.includes(ext)) return;

      // Check if file is binary
      if (config.skipBinaryFiles && isBinaryFile(filePath, ext, config)) {
        results.skippedFiles.binary++;
        if (config.verbose) {
          console.warn(`Warning: Skipping binary file "${filePath}"`);
        }
        return;
      }

      let lineCounts;
      
      // Use streaming for large files, read entire file for small ones
      if (stats.size > (config.streamingThreshold || DEFAULT_STREAMING_THRESHOLD)) {
        try {
          lineCounts = await countLinesStreaming(filePath, stats.size, ext, config);
        } catch (streamError) {
          // Fall back to reading entire file if streaming fails
          if (config.verbose) {
            console.warn(`Warning: Streaming failed for "${filePath}", falling back to full read: ${streamError.message}`);
          }
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            lineCounts = countLines(content, ext);
          } catch (readError) {
            results.skippedFiles.other++;
            if (config.verbose) {
              console.warn(`Warning: Could not read file "${filePath}": ${readError.message}`);
            }
            return;
          }
        }
      } else {
        // Read file with encoding handling
        let content;
        try {
          content = fs.readFileSync(filePath, 'utf8');
        } catch (encodingError) {
          // Try with different encodings if UTF-8 fails
          try {
            content = fs.readFileSync(filePath, 'latin1');
          } catch (latinError) {
            results.skippedFiles.other++;
            if (config.verbose) {
              console.warn(`Warning: Could not decode file "${filePath}": ${encodingError.message}`);
            }
            return;
          }
        }
        lineCounts = countLines(content, ext);
      }

      if (!results.byFileType[ext]) {
        results.byFileType[ext] = {
          files: 0,
          totalLines: 0,
          codeLines: 0,
          commentLines: 0,
          blankLines: 0
        };
      }

      results.byFileType[ext].files++;
      results.byFileType[ext].totalLines += lineCounts.total;
      results.byFileType[ext].codeLines += lineCounts.code;
      results.byFileType[ext].commentLines += lineCounts.comments;
      results.byFileType[ext].blankLines += lineCounts.blank;

      results.totalFiles++;
      results.totalLines += lineCounts.total;
      results.codeLines += lineCounts.code;
      results.commentLines += lineCounts.comments;
      results.blankLines += lineCounts.blank;

      results.largestFiles.push({
        path: path.relative(rootPath, filePath),
        lines: lineCounts.total,
        type: ext,
        size: stats.size
      });

    } catch (error) {
      if (error.code === 'EACCES') {
        results.skippedFiles.accessDenied++;
        if (config.verbose) {
          console.warn(`Warning: Access denied to file "${filePath}"`);
        }
      } else {
        results.skippedFiles.other++;
        if (config.verbose) {
          console.warn(`Warning: Could not read file "${filePath}": ${error.message}`);
        }
      }
    }
  }

  /**
   * Counts total files first for progress tracking
   * @param {string} dirPath - Directory path to count
   * @param {number} depth - Current recursion depth
   */
  async function countTotalFiles(dirPath, depth = 0) {
    if (depth > (config.maxRecursionDepth || DEFAULT_MAX_RECURSION_DEPTH)) return 0;
    
    try {
      const items = await fs.promises.readdir(dirPath);
      let count = 0;
      
      // Process items in batches to avoid overwhelming the event loop
      const batchSize = 50;
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        
        for (const item of batch) {
          const fullPath = path.join(dirPath, item);
          
          if (shouldIgnore(fullPath)) continue;
          
          try {
            const stats = await fs.promises.stat(fullPath);
            
            if (stats.isDirectory()) {
              count += await countTotalFiles(fullPath, depth + 1);
            } else if (stats.isFile()) {
              const ext = getFileExtension(fullPath);
              if (extensions.includes(ext)) {
                count++;
              }
            }
          } catch (error) {
            // Skip files we can't access
          }
        }
        
        // Allow event loop to process other tasks
        if (i + batchSize < items.length) {
          await new Promise(resolve => setImmediate(resolve));
        }
      }
      
      return count;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Recursively walks through directories
   * @param {string} dirPath - Directory path to walk
   * @param {number} depth - Current recursion depth
   */
  async function walkDirectory(dirPath, depth = 0) {
    // Check for cancellation
    config.cancellationCheck();
    
    // Check recursion depth
    if (depth > (config.maxRecursionDepth || DEFAULT_MAX_RECURSION_DEPTH)) {
      throw new RecursionDepthError(dirPath);
    }

    try {
      const items = await fs.promises.readdir(dirPath);
      
      // Check if directory has too many files
      const maxFiles = config.maxFilesPerDirectory || DEFAULT_MAX_FILES_PER_DIRECTORY;
      if (items.length > maxFiles) {
        if (config.verbose) {
          console.warn(`Warning: Directory "${dirPath}" contains ${items.length} files, skipping some for performance`);
        }
        // Process only the first N files
        items.length = maxFiles;
      }
      
      // Process items in batches to avoid overwhelming the event loop
      const batchSize = 25;
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        
        for (const item of batch) {
          // Check for cancellation periodically
          config.cancellationCheck();
          
          const fullPath = path.join(dirPath, item);
          
          if (shouldIgnore(fullPath)) {
            continue;
          }

          try {
            const stats = await fs.promises.stat(fullPath);
            
            // Handle symbolic links
            if (stats.isSymbolicLink()) {
              if (config.verbose) {
                console.warn(`Warning: Skipping symbolic link "${fullPath}"`);
              }
              continue;
            }
            
            if (stats.isDirectory()) {
              results.totalDirectories++;
              await walkDirectory(fullPath, depth + 1);
            } else if (stats.isFile()) {
              await analyzeFile(fullPath);
              filesProcessed++;
              
              // Report progress
              if (totalFilesFound > 0 && filesProcessed % 10 === 0) {
                const progress = Math.min((filesProcessed / totalFilesFound) * 100, 100);
                config.progressCallback({
                  stage: 'analyzing',
                  progress: Math.round(progress),
                  filesProcessed,
                  totalFiles: totalFilesFound,
                  currentFile: path.relative(rootPath, fullPath)
                });
              }
            }
          } catch (error) {
            if (error.code === 'EACCES') {
              results.skippedFiles.accessDenied++;
              if (config.verbose) {
                console.warn(`Warning: Access denied to "${fullPath}"`);
              }
            } else {
              results.skippedFiles.other++;
              if (config.verbose) {
                console.warn(`Warning: Could not stat "${fullPath}": ${error.message}`);
              }
            }
          }
        }
        
        // Allow event loop to process other tasks
        if (i + batchSize < items.length) {
          await new Promise(resolve => setImmediate(resolve));
        }
      }
    } catch (error) {
      if (error.code === 'EACCES') {
        results.skippedFiles.accessDenied++;
        if (config.verbose) {
          console.warn(`Warning: Access denied to directory "${dirPath}"`);
        }
      } else {
        results.skippedFiles.other++;
        if (config.verbose) {
          console.warn(`Warning: Could not read directory "${dirPath}": ${error.message}`);
        }
      }
    }
  }

  try {
    // Count total files first for progress tracking
    if (config.progressCallback) {
      config.progressCallback({ stage: 'counting', progress: 0 });
      totalFilesFound = await countTotalFiles(rootPath);
      config.progressCallback({ 
        stage: 'counting', 
        progress: 100,
        totalFiles: totalFilesFound 
      });
    }
    
    await walkDirectory(rootPath);
  } catch (error) {
    if (error instanceof RecursionDepthError) {
      if (config.verbose) {
        console.warn(`Warning: ${error.message}`);
      }
      // Continue with partial results
    } else {
      throw error; // Re-throw other errors
    }
  }

  results.largestFiles.sort((a, b) => b.lines - a.lines);

  // Save results to cache
  if (config.useCache) {
    saveCachedResults(rootPath, extensions, ignorePatterns, results, {
      maxFileSize: config.maxFileSize,
      showHidden: config.showHidden,
      skipBinaryFiles: config.skipBinaryFiles,
      binaryDetectionSampleSize: config.binaryDetectionSampleSize,
      binaryDetectionThreshold: config.binaryDetectionThreshold
    });
    
    if (config.verbose) {
      console.log('[CACHE] Results cached for future analyses');
    }
  }

  // Update user statistics and check for milestones
  let milestoneUpdate = { stats: null, newMilestones: [] };
  if (config.trackStats) {
    milestoneUpdate = updateUserStats(results, fromCache);
  }
  
  // Save analysis history (only if not from cache)
  if (config.trackStats && !fromCache) {
    saveAnalysisHistory(rootPath, results);
  }

  // Get comparison with previous analysis
  let comparison = null;
  if (config.trackStats && !fromCache) {
    const { compareWithPrevious } = require('./cache');
    comparison = compareWithPrevious(rootPath, results);
  }

  // Return results with milestone and comparison information
  return {
    ...results,
    _meta: {
      fromCache,
      milestones: milestoneUpdate.newMilestones,
      userStats: milestoneUpdate.stats,
      comparison
    }
  };
}


/**
 * Analyzes a single file and returns detailed statistics
 * @param {string} filePath - Path to the file to analyze
 * @param {Object} config - Configuration object
 * @returns {Promise<Object>} Analysis results for the file
 */
async function analyzeFile(filePath, config = {}) {
  const finalConfig = {
    maxFileSize: DEFAULT_MAX_FILE_SIZE,
    streamingThreshold: DEFAULT_STREAMING_THRESHOLD,
    skipBinaryFiles: true,
    verbose: false,
    ...config
  };

  try {
    // Validate and resolve the file path
    const absolutePath = path.resolve(filePath);
    
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File '${absolutePath}' does not exist.`);
    }
    
    const stats = fs.statSync(absolutePath);
    if (!stats.isFile()) {
      throw new Error(`'${absolutePath}' is not a file.`);
    }
    
    // Check file size
    if (stats.size > finalConfig.maxFileSize) {
      throw new FileTooLargeError(absolutePath, stats.size);
    }

    const ext = getFileExtension(absolutePath);
    
    // Check if file is binary
    if (finalConfig.skipBinaryFiles && isBinaryFile(absolutePath, ext, finalConfig)) {
      throw new Error(`Cannot analyze binary file '${absolutePath}'`);
    }

    let lineCounts;
    
    // Use streaming for large files, read entire file for small ones
    if (stats.size > (finalConfig.streamingThreshold || DEFAULT_STREAMING_THRESHOLD)) {
      try {
        lineCounts = await countLinesStreaming(absolutePath, stats.size, ext, finalConfig);
      } catch (streamError) {
        // Fall back to reading entire file if streaming fails
        if (finalConfig.verbose) {
          console.warn(`Warning: Streaming failed for "${absolutePath}", falling back to full read: ${streamError.message}`);
        }
        const content = fs.readFileSync(absolutePath, 'utf8');
        lineCounts = countLinesByLanguage(content, ext);
      }
    } else {
      const content = fs.readFileSync(absolutePath, 'utf8');
      lineCounts = countLinesByLanguage(content, ext);
    }

    // Return results in the same format as analyzeProject but for a single file
    return {
      totalFiles: 1,
      totalDirectories: 0,
      totalLines: lineCounts.total,
      codeLines: lineCounts.code,
      commentLines: lineCounts.comments,
      blankLines: lineCounts.blank,
      byFileType: {
        [ext]: {
          files: 1,
          totalLines: lineCounts.total,
          codeLines: lineCounts.code,
          commentLines: lineCounts.comments,
          blankLines: lineCounts.blank
        }
      },
      largestFiles: [{
        path: path.basename(absolutePath),
        fullPath: absolutePath,
        lines: lineCounts.total,
        type: ext,
        size: stats.size
      }],
      skippedFiles: {
        tooLarge: 0,
        binary: 0,
        accessDenied: 0,
        other: 0
      },
      filePath: absolutePath,
      fileName: path.basename(absolutePath),
      fileSize: stats.size
    };
  } catch (error) {
    if (error instanceof AnalysisError) {
      throw error;
    }
    throw new AnalysisError(`Failed to analyze file '${filePath}': ${error.message}`, 'FILE_ANALYSIS_ERROR');
  }
}

module.exports = { 
  analyzeProject,
  analyzeFile,
  AnalysisError,
  FileTooLargeError,
  RecursionDepthError,
  AccessDeniedError,
  BINARY_FILE_EXTENSIONS,
  getFileExtension,
  isBinaryFile
};