const chalk = require('chalk');
const { getLanguageColor } = require('./color-utils');

/**
 * Ultra-simple display with fixed spacing
 * @param {Object} results - Analysis results
 */
function displayResults(results) {
  // Header
  console.log(chalk.cyan.bold('\n╭ CODE ANALYSIS ENGINE ╮'));
  console.log(chalk.yellow('╠═════════════════════════════════════════════════════╣'));
  console.log();
  console.log(chalk.magenta.bold('PROJECT ANALYSIS COMPLETE'));
  console.log(chalk.gray('────────────────────────────────────────────────────────'));
  console.log();
  
  // Summary
  console.log(chalk.cyan('[STA] SUMMARY STATISTICS'));
  console.log('┌─────────────────────────────────────────────────────────────┐');
  console.log('│ Total Files     : ' + chalk.green((results.totalFiles || 0).toString().padStart(6)) + '                                   │');
  console.log('│ Directories     : ' + chalk.blue((results.totalDirectories || 0).toString().padStart(6)) + '                                   │');
  console.log('│ Total Lines     : ' + chalk.yellow((results.totalLines || 0).toLocaleString().padStart(6)) + '                                   │');
  console.log('│ Code Lines      : ' + chalk.cyan((results.codeLines || 0).toLocaleString().padStart(6)) + '                                   │');
  console.log('│ Comments        : ' + chalk.magenta((results.commentLines || 0).toLocaleString().padStart(6)) + '                                   │');
  console.log('│ Blank Lines     : ' + chalk.gray((results.blankLines || 0).toLocaleString().padStart(6)) + '                                   │');
  console.log('└─────────────────────────────────────────────────────────────┘');
  console.log();
  
  // File types
  if (Object.keys(results.byFileType).length > 0) {
    console.log(chalk.magenta('[TYP] FILE TYPE ANALYSIS'));
    console.log('┌─────────┬───────┬──────────┬──────┬──────────┬───────┐');
    console.log('│ Type    │ Files │   Lines  │ Code │ Comments │ Blank │');
    console.log('├─────────┼───────┼──────────┼──────┼──────────┼───────┤');
    
    const sorted = Object.entries(results.byFileType)
      .sort((a, b) => b[1].files - a[1].files);
    
    sorted.forEach(([type, stats]) => {
      const colors = getLanguageColor(type);
      console.log('│ ' + colors(type.toUpperCase().padEnd(7)) + ' │ ' + 
                  chalk.white(stats.files.toString().padStart(5)) + ' │ ' + 
                  chalk.white(stats.totalLines.toLocaleString().padStart(8)) + ' │ ' + 
                  chalk.white(stats.codeLines.toString().padStart(4)) + ' │ ' + 
                  chalk.white(stats.commentLines.toString().padStart(8)) + ' │ ' + 
                  chalk.white(stats.blankLines.toString().padStart(5)) + ' │');
    });
    
    console.log('└─────────┴───────┴──────────┴──────┴──────────┴───────┘');
    console.log();
  }
  
  // Language distribution
  if (Object.keys(results.byFileType).length > 0) {
    console.log(chalk.yellow('[CHT] LANGUAGE DISTRIBUTION'));
    console.log('┌─────────────────────────────────────────────────────────────┐');
    
    const sorted = Object.entries(results.byFileType)
      .sort((a, b) => b[1].totalLines - a[1].totalLines);
    
    sorted.forEach(([type, stats], index) => {
      const percentage = results.totalLines > 0 
        ? (stats.totalLines / results.totalLines * 100).toFixed(1) 
        : '0.0';
      
      // Calculate bar length to fit within available space
      // Total line width: 63 chars
      // Fixed content: "| * JS  25.0% " = 12 chars
      // Available for bar: 63 - 12 - 2 (right border) = 49 chars
      const barLength = Math.floor(parseFloat(percentage) / 2.04); // 100% / 49 chars ≈ 2.04% per char
      const bar = '█'.repeat(barLength) + '░'.repeat(49 - barLength);
      
      const icon = index === 0 ? '*' : index === 1 ? '+' : 'x';
      const colors = getLanguageColor(type);
      
      console.log('│ ' + icon + ' ' + colors(type.toUpperCase().padEnd(4)) + ' ' + 
                  chalk.yellow(percentage.padStart(5)) + '% ' + bar + ' │');
    });
    
    console.log('└─────────────────────────────────────────────────────────────┘');
    console.log();
  }
  
  // Largest files
  if (results.largestFiles.length > 0) {
    console.log(chalk.red('[LEN] LARGEST FILES'));
    console.log('┌──────┬──────────────────────────────┬────────┬───────┐');
    console.log('│ Rank │ File Name                   │  Lines │ Type  │');
    console.log('├──────┼──────────────────────────────┼────────┼───────┤');
    
    results.largestFiles.slice(0, 10).forEach((file, index) => {
      const rank = index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${index + 1}th`;
      const colors = getLanguageColor(file.type);
      const fileName = file.path.length > 28 ? file.path.substring(0, 25) + '...' : file.path;
      
      console.log('│ ' + chalk.white(rank.padEnd(4)) + ' │ ' + 
                  chalk.cyan(fileName.padEnd(28)) + ' │ ' + 
                  chalk.yellow(file.lines.toString().padStart(6)) + ' │ ' + 
                  colors(file.type.toUpperCase().padEnd(5)) + ' │');
    });
    
    console.log('└──────┴──────────────────────────────┴────────┴───────┘');
    console.log();
  }
  
  // Metrics
  console.log(chalk.blue('[MET] CODE QUALITY METRICS'));
  console.log('┌─────────────────────────────────────────────────────────────┐');
  
  const commentRatio = results.totalLines > 0 
    ? (results.commentLines / results.totalLines * 100).toFixed(1) 
    : '0.0';
  const codeRatio = results.totalLines > 0 
    ? (results.codeLines / results.totalLines * 100).toFixed(1) 
    : '0.0';
  const avgLines = results.totalFiles > 0 
    ? Math.round(results.totalLines / results.totalFiles) 
    : 0;
  
  const commentStatus = commentRatio > 20 ? chalk.green('[GOOD]') : 
                       commentRatio > 10 ? chalk.yellow('[FAIR]') : 
                       chalk.red('[POOR]');
  
  const codeStatus = codeRatio > 70 ? chalk.green('[FAST]') : 
                    codeRatio > 50 ? chalk.yellow('[NORM]') : 
                    chalk.red('[SLOW]');
  
  const complexityStatus = avgLines > 500 ? chalk.red('[HIGH]') : 
                          avgLines > 200 ? chalk.yellow('[MED]') : 
                          chalk.green('[LOW]');
  
  console.log('│ Comment Ratio  : ' + chalk.blue(commentRatio.padStart(6)) + '% ' + commentStatus + '                                   │');
  console.log('│ Code Ratio     : ' + chalk.blue(codeRatio.padStart(6)) + '% ' + codeStatus + '                                   │');
  console.log('│ Avg Lines/File : ' + chalk.blue(avgLines.toString().padStart(6)) + ' ' + complexityStatus + '                                   │');
  console.log('└─────────────────────────────────────────────────────────────┘');
  console.log();
  
  // Footer
  console.log(chalk.yellow('╠═════════════════════════════════ ANALYSIS COMPLETE ════════════════════════════════╣'));
  console.log(chalk.green('[DONE] Project analysis completed successfully!'));
  console.log(chalk.gray('   Generated by CodeStat v1.0.2 - Advanced Code Analysis Tool'));
  console.log();
}

/**
 * Quick analysis display
 */
function displayQuickResults(results) {
  console.log(chalk.cyan.bold('\n╭ QUICK ANALYSIS ╮'));
  console.log(chalk.yellow('╠════════════════════════════════════════╣'));
  
  console.log('│ Files         : ' + chalk.green(results.totalFiles.toString().padStart(6)) + '                      │');
  console.log('│ Total Lines   : ' + chalk.yellow(results.totalLines.toLocaleString().padStart(6)) + '                      │');
  console.log('│ Code Lines    : ' + chalk.cyan(results.codeLines.toLocaleString().padStart(6)) + '                      │');
  console.log('│ Avg Lines/File: ' + chalk.white(Math.round(results.totalLines / results.totalFiles).toString().padStart(6)) + '                      │');
  
  console.log(chalk.yellow('╚════════════════════════════════════════╝'));
  console.log();
}

/**
 * File analysis display
 */
function displayFileResults(results) {
  console.log(chalk.cyan.bold('\n╭ FILE ANALYSIS ╮'));
  console.log(chalk.yellow('╠════════════════════════════════════════╣'));
  
  const fileName = Object.keys(results.byFileType)[0] || 'Unknown';
  console.log('│ Name : ' + chalk.cyan(results.fileName.padEnd(35)) + ' │');
  console.log('│ Type : ' + chalk.white(fileName.toUpperCase().padEnd(35)) + ' │');
  console.log('│ Size : ' + chalk.yellow(formatFileSize(results.fileSize).padEnd(35)) + ' │');
  console.log();
  
  console.log('│ Total Lines  : ' + chalk.yellow(results.totalLines.toLocaleString().padStart(32)) + ' │');
  console.log('│ Code Lines   : ' + chalk.cyan(results.codeLines.toLocaleString().padStart(32)) + ' │');
  console.log('│ Comments     : ' + chalk.magenta(results.commentLines.toLocaleString().padStart(32)) + ' │');
  console.log('│ Blank Lines  : ' + chalk.gray(results.blankLines.toLocaleString().padStart(32)) + ' │');
  
  console.log(chalk.yellow('╚════════════════════════════════════════╝'));
  console.log();
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = {
  displayResults,
  displayQuickResults,
  displayFileResults
};