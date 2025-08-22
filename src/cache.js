const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');
const { getMilestoneDescription } = require('./utils');

// Cache directory location
const CACHE_DIR = path.join(os.homedir(), '.codestat', 'cache');
const CACHE_VERSION = '1';
const MAX_CACHE_SIZE = 100; // Maximum number of cached analyses
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const AUTO_CLEAN_THRESHOLD = 0.8; // Clean when cache is 80% full

// Milestone thresholds
const MILESTONES = {
  LINES_ANALYZED: [1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000],
  FILES_ANALYZED: [10, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
  PROJECTS_ANALYZED: [1, 5, 10, 25, 50, 100]
};

/**
 * Creates a hash key for the analysis parameters
 * @param {string} rootPath - Root directory path
 * @param {string[]} extensions - File extensions
 * @param {string[]} ignorePatterns - Ignore patterns
 * @param {Object} options - Additional options
 * @returns {string} Cache key
 */
function createCacheKey(rootPath, extensions, ignorePatterns, options = {}) {
  const keyData = {
    path: rootPath,
    extensions: extensions.sort(),
    ignore: ignorePatterns.sort(),
    maxFileSize: options.maxFileSize,
    showHidden: options.showHidden || false,
    skipBinaryFiles: options.skipBinaryFiles !== false,
    version: CACHE_VERSION
  };
  
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(keyData))
    .digest('hex');
}

/**
 * Gets the file modification time for a directory
 * @param {string} dirPath - Directory path
 * @returns {number} Latest modification timestamp
 */
function getDirectoryMTime(dirPath) {
  let latestMTime = 0;
  
  function walkSync(currentPath) {
    const stats = fs.statSync(currentPath);
    latestMTime = Math.max(latestMTime, stats.mtimeMs);
    
    if (stats.isDirectory()) {
      const items = fs.readdirSync(currentPath);
      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        try {
          const itemStats = fs.statSync(itemPath);
          if (itemStats.isDirectory()) {
            walkSync(itemPath);
          } else {
            latestMTime = Math.max(latestMTime, itemStats.mtimeMs);
          }
        } catch (error) {
          // Skip files we can't access
        }
      }
    }
  }
  
  try {
    walkSync(dirPath);
  } catch (error) {
    // If we can't access the directory, return current time
    return Date.now();
  }
  
  return latestMTime;
}

/**
 * Ensures cache directory exists
 */
function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

/**
 * Loads cached analysis results if available and valid
 * @param {string} rootPath - Root directory path
 * @param {string[]} extensions - File extensions
 * @param {string[]} ignorePatterns - Ignore patterns
 * @param {Object} options - Additional options
 * @returns {Object|null} Cached results or null if not available
 */
function loadCachedResults(rootPath, extensions, ignorePatterns, options = {}) {
  ensureCacheDir();
  
  // Perform auto maintenance before loading
  performAutoMaintenance();
  
  const cacheKey = createCacheKey(rootPath, extensions, ignorePatterns, options);
  const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`);
  
  if (!fs.existsSync(cacheFile)) {
    return null;
  }
  
  try {
    const cachedData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    
    // Check if cache is expired
    if (Date.now() - cachedData.timestamp > CACHE_TTL) {
      fs.unlinkSync(cacheFile);
      return null;
    }
    
    // Check if directory has been modified since cache was created
    const currentMTime = getDirectoryMTime(rootPath);
    if (currentMTime > cachedData.directoryMTime) {
      fs.unlinkSync(cacheFile);
      return null;
    }
    
    return cachedData.results;
  } catch (error) {
    // Invalid cache file, remove it
    try {
      fs.unlinkSync(cacheFile);
    } catch (e) {
      // Ignore errors when removing invalid cache
    }
    return null;
  }
}

/**
 * Saves analysis results to cache
 * @param {string} rootPath - Root directory path
 * @param {string[]} extensions - File extensions
 * @param {string[]} ignorePatterns - Ignore patterns
 * @param {Object} results - Analysis results
 * @param {Object} options - Additional options
 */
function saveCachedResults(rootPath, extensions, ignorePatterns, results, options = {}) {
  ensureCacheDir();
  
  const cacheKey = createCacheKey(rootPath, extensions, ignorePatterns, options);
  const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`);
  
  const cacheData = {
    timestamp: Date.now(),
    directoryMTime: getDirectoryMTime(rootPath),
    results: results,
    version: CACHE_VERSION
  };
  
  fs.writeFileSync(cacheFile, JSON.stringify(cacheData));
  
  // Clean up old cache files
  cleanupCache();
}

/**
 * Removes old cache files to prevent cache from growing too large
 * @param {boolean} aggressive - Whether to perform aggressive cleanup
 */
function cleanupCache(aggressive = false) {
  try {
    const files = fs.readdirSync(CACHE_DIR);
    const cacheFiles = files
      .filter(file => file.endsWith('.json') && !file.includes('user-stats') && !file.includes('analyzed-projects'))
      .map(file => ({
        file,
        path: path.join(CACHE_DIR, file),
        stats: fs.statSync(path.join(CACHE_DIR, file))
      }))
      .sort((a, b) => a.stats.mtimeMs - b.stats.mtimeMs);
    
    // Remove expired files first
    const now = Date.now();
    const expiredFiles = cacheFiles.filter(cf => {
      try {
        const data = JSON.parse(fs.readFileSync(cf.path, 'utf8'));
        return now - data.timestamp > CACHE_TTL;
      } catch (error) {
        return true; // Remove invalid files
      }
    });
    
    expiredFiles.forEach(cf => {
      try {
        fs.unlinkSync(cf.path);
      } catch (error) {
        // Ignore errors
      }
    });
    
    // Remove remaining files if we still have too many
    const remainingFiles = cacheFiles.filter(cf => !expiredFiles.includes(cf));
    const threshold = aggressive ? MAX_CACHE_SIZE * 0.5 : MAX_CACHE_SIZE * AUTO_CLEAN_THRESHOLD;
    
    while (remainingFiles.length > threshold) {
      const toRemove = remainingFiles.shift();
      try {
        fs.unlinkSync(toRemove.path);
      } catch (error) {
        // Ignore errors
      }
    }
    
    // Also clean up very old milestone data (keep only last 1000 milestones)
    try {
      const statsFile = path.join(CACHE_DIR, 'user-stats.json');
      if (fs.existsSync(statsFile)) {
        const stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
        if (stats.milestones && stats.milestones.length > 1000) {
          stats.milestones = stats.milestones.slice(-1000);
          fs.writeFileSync(statsFile, JSON.stringify(stats));
        }
      }
    } catch (error) {
      // Ignore errors
    }
  } catch (error) {
    // Ignore cache cleanup errors
  }
}

/**
 * Performs automatic cache maintenance
 * Should be called periodically or before cache operations
 */
function performAutoMaintenance() {
  try {
    const stats = getCacheStats();
    
    // Perform cleanup if cache is getting full
    if (stats.totalEntries > MAX_CACHE_SIZE * AUTO_CLEAN_THRESHOLD) {
      cleanupCache();
    }
    
    // Also clean up if total size is too large (>100MB)
    if (stats.totalSize > 100 * 1024 * 1024) {
      cleanupCache(true);
    }
  } catch (error) {
    // Ignore maintenance errors
  }
}

/**
 * Clears the entire cache
 */
function clearCache() {
  try {
    if (fs.existsSync(CACHE_DIR)) {
      const files = fs.readdirSync(CACHE_DIR);
      for (const file of files) {
        if (file.endsWith('.json')) {
          fs.unlinkSync(path.join(CACHE_DIR, file));
        }
      }
    }
  } catch (error) {
    // Ignore errors when clearing cache
  }
}

/**
 * Gets cache statistics
 * @returns {Object} Cache statistics
 */
function getCacheStats() {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      return { totalEntries: 0, totalSize: 0 };
    }
    
    const files = fs.readdirSync(CACHE_DIR);
    const cacheFiles = files.filter(file => file.endsWith('.json'));
    
    let totalSize = 0;
    let validEntries = 0;
    
    for (const file of cacheFiles) {
      const filePath = path.join(CACHE_DIR, file);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
      
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Date.now() - data.timestamp <= CACHE_TTL) {
          validEntries++;
        }
      } catch (error) {
        // Invalid cache file
      }
    }
    
    return {
      totalEntries: cacheFiles.length,
      validEntries,
      totalSize,
      cacheDir: CACHE_DIR
    };
  } catch (error) {
    return { totalEntries: 0, totalSize: 0 };
  }
}

/**
 * Gets user statistics and milestones
 * @returns {Object} User statistics
 */
function getUserStats() {
  const statsFile = path.join(CACHE_DIR, 'user-stats.json');
  
  try {
    if (!fs.existsSync(statsFile)) {
      return {
        totalLinesAnalyzed: 0,
        totalFilesAnalyzed: 0,
        totalProjectsAnalyzed: 0,
        analysesCompleted: 0,
        cacheHits: 0,
        milestones: [],
        lastUpdated: Date.now()
      };
    }
    
    return JSON.parse(fs.readFileSync(statsFile, 'utf8'));
  } catch (error) {
    return {
      totalLinesAnalyzed: 0,
      totalFilesAnalyzed: 0,
      totalProjectsAnalyzed: 0,
      analysesCompleted: 0,
      cacheHits: 0,
      milestones: [],
      lastUpdated: Date.now()
    };
  }
}

/**
 * Saves user statistics
 * @param {Object} stats - User statistics to save
 */
function saveUserStats(stats) {
  ensureCacheDir();
  const statsFile = path.join(CACHE_DIR, 'user-stats.json');
  stats.lastUpdated = Date.now();
  fs.writeFileSync(statsFile, JSON.stringify(stats));
}

/**
 * Updates user statistics after analysis
 * @param {Object} results - Analysis results
 * @param {boolean} fromCache - Whether results came from cache
 * @returns {Object} Updated statistics and new milestones
 */
function updateUserStats(results, fromCache = false) {
  const stats = getUserStats();
  const newMilestones = [];
  
  if (!fromCache) {
    stats.totalLinesAnalyzed += results.totalLines;
    stats.totalFilesAnalyzed += results.totalFiles;
    stats.analysesCompleted++;
    
    // Track unique projects
    const projectsFile = path.join(CACHE_DIR, 'analyzed-projects.json');
    let projects = [];
    
    try {
      if (fs.existsSync(projectsFile)) {
        projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
      }
    } catch (error) {
      // Ignore errors
    }
    
    // Add current project if not already tracked
    const projectKey = results.rootPath || process.cwd();
    if (!projects.includes(projectKey)) {
      projects.push(projectKey);
      fs.writeFileSync(projectsFile, JSON.stringify(projects));
      stats.totalProjectsAnalyzed = projects.length;
    }
  } else {
    stats.cacheHits++;
  }
  
  // Check for milestones
  const checks = [
    { type: 'LINES_ANALYZED', value: stats.totalLinesAnalyzed },
    { type: 'FILES_ANALYZED', value: stats.totalFilesAnalyzed },
    { type: 'PROJECTS_ANALYZED', value: stats.totalProjectsAnalyzed }
  ];
  
  checks.forEach(check => {
    const thresholds = MILESTONES[check.type];
    thresholds.forEach(threshold => {
      if (check.value >= threshold && !stats.milestones.some(m => m.type === check.type && m.threshold === threshold)) {
        const milestone = {
          type: check.type,
          threshold: threshold,
          achieved: Date.now(),
          description: getMilestoneDescription(check.type, threshold)
        };
        stats.milestones.push(milestone);
        newMilestones.push(milestone);
      }
    });
  });
  
  saveUserStats(stats);
  return { stats, newMilestones };
}


/**
 * Saves analysis history
 * @param {string} projectPath - Path to the project
 * @param {Object} results - Analysis results
 */
function saveAnalysisHistory(projectPath, results) {
  ensureCacheDir();
  const historyFile = path.join(CACHE_DIR, 'analysis-history.json');
  
  let history = [];
  try {
    if (fs.existsSync(historyFile)) {
      history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
    }
  } catch (error) {
    // Ignore errors, start with empty history
  }
  
  // Add new analysis entry
  const entry = {
    projectPath,
    timestamp: Date.now(),
    results: {
      totalFiles: results.totalFiles,
      totalLines: results.totalLines,
      codeLines: results.codeLines,
      commentLines: results.commentLines,
      blankLines: results.blankLines,
      byFileType: results.byFileType
    }
  };
  
  history.push(entry);
  
  // Keep only last 50 analyses
  if (history.length > 50) {
    history = history.slice(-50);
  }
  
  fs.writeFileSync(historyFile, JSON.stringify(history));
}

/**
 * Gets analysis history for a project
 * @param {string} projectPath - Path to the project
 * @param {number} limit - Maximum number of entries to return
 * @returns {Array} Analysis history
 */
function getAnalysisHistory(projectPath, limit = 10) {
  const historyFile = path.join(CACHE_DIR, 'analysis-history.json');
  
  try {
    if (!fs.existsSync(historyFile)) {
      return [];
    }
    
    const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
    
    // Filter entries for the specified project and sort by timestamp
    return history
      .filter(entry => entry.projectPath === projectPath)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  } catch (error) {
    return [];
  }
}

/**
 * Compares current analysis with previous one
 * @param {string} projectPath - Path to the project
 * @param {Object} currentResults - Current analysis results
 * @returns {Object} Comparison data
 */
function compareWithPrevious(projectPath, currentResults) {
  const history = getAnalysisHistory(projectPath, 2);
  
  if (history.length < 2) {
    return {
      hasPrevious: false,
      message: 'No previous analysis found for comparison'
    };
  }
  
  const previous = history[1].results; // The second most recent entry
  const current = currentResults;
  
  const changes = {
    totalFiles: current.totalFiles - previous.totalFiles,
    totalLines: current.totalLines - previous.totalLines,
    codeLines: current.codeLines - previous.codeLines,
    commentLines: current.commentLines - previous.commentLines,
    blankLines: current.blankLines - previous.blankLines,
    timeSincePrevious: Date.now() - history[1].timestamp
  };
  
  // Calculate percentage changes
  const percentageChanges = {};
  Object.keys(changes).forEach(key => {
    if (key !== 'timeSincePrevious' && previous[key] > 0) {
      percentageChanges[key] = ((changes[key] / previous[key]) * 100).toFixed(1);
    }
  });
  
  // Analyze file type changes
  const fileTypeChanges = {};
  Object.keys(previous.byFileType || {}).forEach(type => {
    if (current.byFileType && current.byFileType[type]) {
      fileTypeChanges[type] = {
        files: current.byFileType[type].files - previous.byFileType[type].files,
        lines: current.byFileType[type].totalLines - previous.byFileType[type].totalLines
      };
    }
  });
  
  // Detect new file types
  if (current.byFileType) {
    Object.keys(current.byFileType).forEach(type => {
      if (!previous.byFileType || !previous.byFileType[type]) {
        fileTypeChanges[type] = {
          files: current.byFileType[type].files,
          lines: current.byFileType[type].totalLines,
          isNew: true
        };
      }
    });
  }
  
  return {
    hasPrevious: true,
    previous,
    changes,
    percentageChanges,
    fileTypeChanges,
    timeSincePrevious: changes.timeSincePrevious,
    previousTimestamp: history[1].timestamp
  };
}

module.exports = {
  loadCachedResults,
  saveCachedResults,
  clearCache,
  getCacheStats,
  getUserStats,
  updateUserStats,
  performAutoMaintenance,
  cleanupCache,
  saveAnalysisHistory,
  getAnalysisHistory,
  compareWithPrevious,
  CACHE_DIR,
  CACHE_TTL
};