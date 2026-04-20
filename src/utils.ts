/**
 * Utility functions for CodeStat
 */

/**
 * Gets milestone description
 * @param {string} type - Milestone type
 * @param {number} threshold - Threshold value
 * @returns {string} Description
 */
function getMilestoneDescription(type, threshold) {
  const descriptions = {
    LINES_ANALYZED: `Analyze ${threshold.toLocaleString()} lines of code`,
    FILES_ANALYZED: `Analyze ${threshold.toLocaleString()} files`,
    PROJECTS_ANALYZED: `Analyze ${threshold} projects`
  };
  
  return descriptions[type] || 'Reach next milestone';
}

/**
 * Formats file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = {
  getMilestoneDescription,
  formatFileSize
};