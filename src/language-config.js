/**
 * Language configuration for comment syntax detection
 * Maps file extensions to their comment patterns
 */

const languageConfig = {
  // Single-line comment patterns
  singleLine: {
    '//': ['js', 'ts', 'jsx', 'tsx', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'php', 'swift', 'kt', 'scala', 'dart', 'groovy', 'sh', 'bash', 'zsh', 'fish', 'pl', 'pm', 'r', 'm', 'mm', 'sql', 'lua', 'jsm', 'cjs', 'mjs'],
    '#': ['py', 'rb', 'pl', 'pm', 'r', 'sh', 'bash', 'zsh', 'fish', 'yaml', 'yml', 'toml', 'dockerfile', 'dockerignore', 'gitignore', 'npmignore', 'yaml', 'yml', 'properties', 'conf', 'ini', 'cfg'],
    '--': ['sql', 'lua', 'haskell', 'hs', 'elm', 'ada', 'vhdl', 'vhd'],
    ';': ['lisp', 'clj', 'cljs', 'cljc', 'edn', 'racket', 'scheme', 'asm', 's', 'nasm', 'fasm'],
    '%': ['latex', 'tex', 'sty', 'cls', 'matlab', 'm', 'octave', 'prolog', 'pl', 'swi', 'swipl'],
    '(*': ['fsharp', 'fs', 'fsi', 'fsx', 'ml', 'mli', 'ocaml', 'ml4', 'mll', 'mly'],
    'REM': ['bat', 'cmd', 'vb', 'vbs', 'vba', 'bas'],
    '::': ['bat', 'cmd'],
    '//!': ['rs', 'cpp', 'c'],
    '///': ['rs', 'cpp', 'c', 'cs']
  },
  
  // Multi-line comment patterns
  multiLine: {
    start: {
      '/*': ['js', 'ts', 'jsx', 'tsx', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'php', 'swift', 'kt', 'scala', 'dart', 'groovy', 'css', 'scss', 'sass', 'less', 'sql', 'lua', 'jsm', 'cjs', 'mjs'],
      '(*': ['fsharp', 'fs', 'fsi', 'fsx', 'ml', 'mli', 'ocaml', 'ml4', 'mll', 'mly'],
      '"""': ['py', 'rb', 'groovy'],
      "'''": ['py', 'groovy'],
      '<!--': ['html', 'htm', 'xhtml', 'xml', 'xsl', 'svg', 'vue', 'svelte', 'astro'],
      '{-': ['haskell', 'hs', 'elm', 'lhs'],
      '#|': ['racket', 'scheme'],
      '<%--': ['asp', 'aspx'],
      '{{!--': ['hbs', 'handlebars'],
      '###': ['cr', 'crystal'],
      '=begin': ['rb'],
      '=pod': ['pl', 'pm'],
      '/*': ['js', 'ts', 'jsx', 'tsx', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'php', 'swift', 'kt', 'scala', 'dart', 'groovy', 'css', 'scss', 'sass', 'less', 'sql', 'lua', 'jsm', 'cjs', 'mjs']
    },
    end: {
      '*/': ['js', 'ts', 'jsx', 'tsx', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'php', 'swift', 'kt', 'scala', 'dart', 'groovy', 'css', 'scss', 'sass', 'less', 'sql', 'lua', 'jsm', 'cjs', 'mjs'],
      '*)': ['fsharp', 'fs', 'fsi', 'fsx', 'ml', 'mli', 'ocaml', 'ml4', 'mll', 'mly'],
      '"""': ['py', 'rb', 'groovy'],
      "'''": ['py', 'groovy'],
      '-->': ['html', 'htm', 'xhtml', 'xml', 'xsl', 'svg', 'vue', 'svelte', 'astro'],
      '-}': ['haskell', 'hs', 'elm', 'lhs'],
      '|#': ['racket', 'scheme'],
      '-->': ['asp', 'aspx'],
      '--}}': ['hbs', 'handlebars'],
      '###': ['cr', 'crystal'],
      '=end': ['rb'],
      '=cut': ['pl', 'pm'],
      '*/': ['js', 'ts', 'jsx', 'tsx', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'php', 'swift', 'kt', 'scala', 'dart', 'groovy', 'css', 'scss', 'sass', 'less', 'sql', 'lua', 'jsm', 'cjs', 'mjs']
    }
  },
  
  // Languages that use indentation-based syntax
  indentationBased: ['py', 'rb', 'yaml', 'yml', 'coffee', 'coffeelitre', 'haml', 'sass', 'slim', 'pug', 'jade'],
  
  // Languages that support template literals
  templateLiteral: ['js', 'ts', 'jsx', 'tsx', 'dart', 'groovy']
};

/**
 * Gets the comment patterns for a given file extension
 * @param {string} extension - File extension
 * @returns {Object} Comment patterns for the language
 */
function getCommentPatterns(extension) {
  const ext = extension.toLowerCase();
  
  const singleLinePatterns = [];
  const multiLinePatterns = [];
  
  // Find single-line comment patterns
  for (const [pattern, extensions] of Object.entries(languageConfig.singleLine)) {
    if (extensions.includes(ext)) {
      singleLinePatterns.push(pattern);
    }
  }
  
  // Find multi-line comment patterns
  for (const [startPattern, extensions] of Object.entries(languageConfig.multiLine.start)) {
    if (extensions.includes(ext)) {
      // Find the corresponding end pattern
      let endPattern = null;
      
      // Simple mapping for common patterns
      if (startPattern === '/*') endPattern = '*/';
      else if (startPattern === '(*') endPattern = '*)';
      else if (startPattern === '"""') endPattern = '"""';
      else if (startPattern === "'''") endPattern = "'''";
      else if (startPattern === '<!--') endPattern = '-->';
      else if (startPattern === '{-') endPattern = '-}';
      else if (startPattern === '#|') endPattern = '|#';
      else if (startPattern === '<%--') endPattern = '--%>';
      else if (startPattern === '{{!--') endPattern = '--}}';
      else if (startPattern === '###') endPattern = '###';
      else if (startPattern === '=begin') endPattern = '=end';
      else if (startPattern === '=pod') endPattern = '=cut';
      
      if (endPattern) {
        multiLinePatterns.push({ start: startPattern, end: endPattern });
      }
    }
  }
  
  return {
    singleLine: singleLinePatterns,
    multiLine: multiLinePatterns,
    isIndentationBased: languageConfig.indentationBased.includes(ext),
    supportsTemplateLiterals: languageConfig.templateLiteral.includes(ext)
  };
}

/**
 * Checks if a line is a comment based on language patterns
 * @param {string} line - The line to check
 * @param {string} extension - File extension
 * @param {boolean} inMultiLine - Whether we're currently in a multi-line comment
 * @returns {Object} Object containing isComment and updated inMultiLine
 */
function isCommentLine(line, extension, inMultiLine = false) {
  const trimmed = line.trim();
  const patterns = getCommentPatterns(extension);
  
  // Handle multi-line comments
  if (inMultiLine) {
    for (const { end } of patterns.multiLine) {
      if (trimmed.includes(end)) {
        const endIndex = trimmed.indexOf(end);
        const afterEnd = trimmed.substring(endIndex + end.length).trim();
        return {
          isComment: afterEnd === '',
          inMultiLine: afterEnd !== ''
        };
      }
    }
    // Still in multi-line comment
    return { isComment: true, inMultiLine: true };
  }
  
  // Check for multi-line comment start
  for (const { start, end } of patterns.multiLine) {
    if (trimmed.startsWith(start)) {
      // Check if it also ends on the same line
      if (trimmed.includes(end) && trimmed.indexOf(end) > trimmed.indexOf(start)) {
        const endIndex = trimmed.indexOf(end);
        const afterEnd = trimmed.substring(endIndex + end.length).trim();
        return {
          isComment: afterEnd === '',
          inMultiLine: false
        };
      }
      return { isComment: true, inMultiLine: true };
    }
  }
  
  // Check for single-line comments
  for (const pattern of patterns.singleLine) {
    if (trimmed.startsWith(pattern)) {
      return { isComment: true, inMultiLine: false };
    }
  }
  
  // Special handling for template literals
  if (patterns.supportsTemplateLiterals && trimmed.includes('`')) {
    return { isComment: false, inMultiLine: false };
  }
  
  return { isComment: false, inMultiLine: false };
}

/**
 * Enhanced line counter that understands language-specific comment syntax
 * @param {string} content - File content
 * @param {string} extension - File extension
 * @returns {Object} Line count statistics
 */
function countLinesByLanguage(content, extension) {
  const lines = content.split('\n');
  let codeCount = 0;
  let commentCount = 0;
  let blankCount = 0;
  let inMultiLine = false;
  
  lines.forEach(line => {
    const trimmed = line.trim();
    
    if (trimmed === '') {
      // For indentation-based languages, blank lines might be significant
      const patterns = getCommentPatterns(extension);
      if (patterns.isIndentationBased && line !== '') {
        codeCount++;
      } else {
        blankCount++;
      }
    } else {
      const result = isCommentLine(line, extension, inMultiLine);
      inMultiLine = result.inMultiLine;
      
      if (result.isComment) {
        commentCount++;
      } else {
        codeCount++;
      }
    }
  });
  
  return {
    total: lines.length,
    code: codeCount,
    comments: commentCount,
    blank: blankCount
  };
}

module.exports = {
  getCommentPatterns,
  isCommentLine,
  countLinesByLanguage,
  languageConfig
};