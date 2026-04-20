const os = require('os');

/**
 * Gets the terminal width with fallback to a default value
 * @returns {number} Terminal width in columns
 */
function getTerminalWidth() {
  try {
    // Try to get terminal width from stdout
    if (process.stdout && process.stdout.columns) {
      return process.stdout.columns;
    }
    
    // Fallback to environment variable
    if (process.env.COLUMNS) {
      return parseInt(process.env.COLUMNS, 10);
    }
    
    // Try using tty module if available
    const tty = require('tty');
    if (tty.isatty(process.stdout.fd)) {
      // This is a rough estimate - actual width detection requires platform-specific code
      return 80; // Default fallback
    }
  } catch (error) {
    // Ignore errors and use default
  }
  
  // Default fallback width
  return 80;
}

/**
 * Creates a responsive box that fits within terminal width
 * @param {string} title - Box title
 * @param {Array} content - Array of content lines
 * @param {Object} options - Options for box styling
 * @returns {string} Formatted box content
 */
function createResponsiveBox(title, content, options = {}) {
  const {
    minContentWidth = 40,
    maxContentWidth = 100,
    padding = 2,
    borderChars = {
      topLeft: '╭',
      topRight: '╮',
      bottomLeft: '╰',
      bottomRight: '╯',
      horizontal: '─',
      vertical: '│',
      topMid: '┬',
      bottomMid: '┴',
      leftMid: '├',
      rightMid: '┤',
      midMid: '┼'
    }
  } = options;
  
  const terminalWidth = getTerminalWidth();
  
  // Calculate available content width
  const availableWidth = terminalWidth - (padding * 2) - 2; // -2 for borders
  
  // Determine content width
  const contentWidth = Math.max(
    minContentWidth,
    Math.min(maxContentWidth, availableWidth)
  );
  
  // Format title
  const formattedTitle = title.length > contentWidth - 4 
    ? title.substring(0, contentWidth - 7) + '...' 
    : title;
  
  const titlePadding = contentWidth - formattedTitle.length - 4;
  const leftPadding = Math.floor(titlePadding / 2);
  const rightPadding = titlePadding - leftPadding;
  
  // Build box lines
  const lines = [];
  
  // Top border with title
  const topBorder = borderChars.topLeft + 
    borderChars.horizontal.repeat(leftPadding + 1) + 
    ' ' + formattedTitle + ' ' + 
    borderChars.horizontal.repeat(rightPadding + 1) + 
    borderChars.topRight;
  lines.push(topBorder);
  
  // Content lines
  content.forEach(line => {
    const formattedLine = line.length > contentWidth - 2
      ? line.substring(0, contentWidth - 5) + '...'
      : line;
    
    const linePadding = contentWidth - formattedLine.length - 2;
    const leftLinePadding = Math.floor(linePadding / 2);
    const rightLinePadding = linePadding - leftLinePadding;
    
    const contentLine = borderChars.vertical + 
      ' '.repeat(leftLinePadding) + 
      formattedLine + 
      ' '.repeat(rightLinePadding) + 
      borderChars.vertical;
    lines.push(contentLine);
  });
  
  // Bottom border
  const bottomBorder = borderChars.bottomLeft + 
    borderChars.horizontal.repeat(contentWidth) + 
    borderChars.bottomRight;
  lines.push(bottomBorder);
  
  return lines.join('\n');
}

/**
 * Creates a responsive table that fits within terminal width
 * @param {Array} headers - Array of header objects { text, width, align }
 * @param {Array} rows - Array of row arrays
 * @param {Object} options - Options for table styling
 * @returns {string} Formatted table content
 */
function createResponsiveTable(headers, rows, options = {}) {
  const {
    minColumnWidth = 8,
    padding = 1,
    borderChars = {
      topLeft: '┌',
      topRight: '┐',
      bottomLeft: '└',
      bottomRight: '┘',
      horizontal: '─',
      vertical: '│',
      topMid: '┬',
      bottomMid: '┴',
      leftMid: '├',
      rightMid: '┤',
      midMid: '┼'
    }
  } = options;
  
  const terminalWidth = getTerminalWidth();
  const totalPadding = (headers.length * 2 * padding) + headers.length + 1; // borders
  
  // Calculate flexible column widths
  let availableWidth = terminalWidth - totalPadding;
  const fixedWidthHeaders = headers.filter(h => h.width);
  const flexibleHeaders = headers.filter(h => !h.width);
  
  // Subtract fixed widths
  fixedWidthHeaders.forEach(header => {
    availableWidth -= header.width;
  });
  
  // Distribute remaining width to flexible columns
  const flexibleWidth = flexibleHeaders.length > 0 
    ? Math.max(minColumnWidth, Math.floor(availableWidth / flexibleHeaders.length))
    : minColumnWidth;
  
  // Calculate total available width for content (excluding borders and padding)
  const totalContentWidth = terminalWidth - 2; // -2 for left and right borders
  
  // Calculate content-based column widths
  const columnWidths = headers.map((header, i) => {
    // Find the maximum content width for this column
    const maxContentLength = Math.max(
      header.text.length,
      ...rows.map(row => String(row[i] || '').length)
    );
    
    // Calculate required width including padding
    const requiredWidth = Math.max(
      minColumnWidth,
      maxContentLength + (padding * 2)
    );
    
    return Math.min(
      requiredWidth,
      header.maxWidth || Math.floor(totalContentWidth / headers.length)
    );
  });
  
  // Build table lines
  const lines = [];
  
  // Top border
  const topBorder = borderChars.topLeft + 
    columnWidths.map((width, i) => borderChars.horizontal.repeat(width)).join(borderChars.topMid) + 
    borderChars.topRight;
  lines.push(topBorder);
  
  // Header row
  const headerCells = headers.map((header, i) => {
    const availableSpace = columnWidths[i] - (padding * 2);
    const text = header.text.length > availableSpace
      ? header.text.substring(0, availableSpace - 3) + '...'
      : header.text;
    
    const align = header.align || 'left';
    const totalCellSpace = columnWidths[i];
    
    if (align === 'center') {
      const leftPad = Math.floor((totalCellSpace - text.length) / 2);
      const rightPad = totalCellSpace - text.length - leftPad;
      return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
    } else if (align === 'right') {
      const leftPad = totalCellSpace - text.length - padding;
      return ' '.repeat(leftPad) + text + ' '.repeat(padding);
    } else {
      return ' '.repeat(padding) + text + ' '.repeat(totalCellSpace - text.length - padding);
    }
  });
  
  const headerLine = borderChars.vertical + 
    headerCells.join(borderChars.vertical) + 
    borderChars.vertical;
  lines.push(headerLine);
  
  // Header separator
  const headerSep = borderChars.leftMid + 
    columnWidths.map(width => borderChars.horizontal.repeat(width)).join(borderChars.midMid) + 
    borderChars.rightMid;
  lines.push(headerSep);
  
  // Data rows
  rows.forEach(row => {
    const cells = row.map((cell, i) => {
      const availableSpace = columnWidths[i] - (padding * 2);
      const text = String(cell || '').length > availableSpace
        ? String(cell || '').substring(0, availableSpace - 3) + '...'
        : String(cell || '');
      
      const align = headers[i].align || 'left';
      const totalCellSpace = columnWidths[i];
      
      if (align === 'center') {
        const leftPad = Math.floor((totalCellSpace - text.length) / 2);
        const rightPad = totalCellSpace - text.length - leftPad;
        return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
      } else if (align === 'right') {
        const leftPad = totalCellSpace - text.length - padding;
        return ' '.repeat(leftPad) + text + ' '.repeat(padding);
      } else {
        return ' '.repeat(padding) + text + ' '.repeat(totalCellSpace - text.length - padding);
      }
    });
    
    const rowLine = borderChars.vertical + 
      cells.join(borderChars.vertical) + 
      borderChars.vertical;
    lines.push(rowLine);
  });
  
  // Bottom border
  const bottomBorder = borderChars.bottomLeft + 
    columnWidths.map(width => borderChars.horizontal.repeat(width)).join(borderChars.bottomMid) + 
    borderChars.bottomRight;
  lines.push(bottomBorder);
  
  return lines.join('\n');
}

/**
 * Truncates text to fit within specified width
 * @param {string} text - Text to truncate
 * @param {number} maxWidth - Maximum width
 * @param {string} ellipsis - Ellipsis character (default: '...')
 * @returns {string} Truncated text
 */
function truncateText(text, maxWidth, ellipsis = '...') {
  if (text.length <= maxWidth) {
    return text;
  }
  
  return text.substring(0, maxWidth - ellipsis.length) + ellipsis;
}

/**
 * Creates a progress bar that fits within terminal width
 * @param {number} percentage - Progress percentage (0-100)
 * @param {number} maxWidth - Maximum width of progress bar
 * @param {Object} options - Options for progress bar styling
 * @returns {string} Progress bar string
 */
function createProgressBar(percentage, maxWidth, options = {}) {
  const {
    filledChar = '█',
    emptyChar = '░',
    leftBracket = '[',
    rightBracket = ']',
    showPercentage = true
  } = options;
  
  const barWidth = Math.min(maxWidth - (showPercentage ? 5 : 0) - 2, 50); // -2 for brackets
  const filledWidth = Math.floor((percentage / 100) * barWidth);
  const emptyWidth = barWidth - filledWidth;
  
  const bar = leftBracket + 
    filledChar.repeat(filledWidth) + 
    emptyChar.repeat(emptyWidth) + 
    rightBracket;
  
  return showPercentage 
    ? bar + ' ' + percentage.toFixed(1).padStart(4) + '%'
    : bar;
}

module.exports = {
  getTerminalWidth,
  createResponsiveBox,
  createResponsiveTable,
  truncateText,
  createProgressBar
};