# 🚀 CodeStat

<div align="center">

**Beautiful CLI tool to analyze project composition and count lines of code with GitHub-inspired colors**

[![npm version](https://badge.fury.io/js/codestat.svg)](https://badge.fury.io/js/codestat)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Code Quality](https://img.shields.io/badge/code_quality-A%2B-brightgreen)](https://github.com/yourusername/codestat)
[![Security](https://img.shields.io/badge/security-verified-brightgreen)](https://github.com/yourusername/codestat)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/yourusername/codestat)

[![Stars](https://img.shields.io/github/stars/yourusername/codestat?style=social)](https://github.com/yourusername/codestat)
[![Forks](https://img.shields.io/github/forks/yourusername/codestat?style=social)](https://github.com/yourusername/codestat)
[![Issues](https://img.shields.io/github/issues/yourusername/codestat)](https://github.com/yourusername/codestat/issues)

**Transform your code analysis experience with stunning visuals and powerful insights**

</div>

## ✨ Features

### 🎨 **Beautiful Visual Output**
- **GitHub-inspired colors** for 93+ programming languages
- **Rich terminal output** with ASCII art and progress bars
- **Responsive design** that adapts to your terminal size
- **Multiple output formats**: Fancy, Simple, and JSON

### 🚀 **Performance & Intelligence**
- **⚡ Lightning fast** with async directory traversal
- **🧠 Smart caching** for instant repeated analyses
- **📊 Real-time progress** tracking with beautiful spinners
- **🔍 Streaming support** for large files (10MB+)

### 📈 **Advanced Analytics**
- **🏆 Gamified experience** with milestones and achievements
- **📅 Analysis history** with growth trends
- **🔄 Change comparison** between analyses
- **📋 Detailed insights** including largest files and language distribution

### 🔧 **Flexible & Extensible**
- **⚙️ Configuration files** for project-specific settings
- **🎯 Quick analysis** mode for rapid feedback
- **🌐 Multi-platform** support (Linux, macOS, Windows)
- **📦 Lightweight** with minimal dependencies

## 🚀 Quick Start

### Installation

```bash
# Install globally (recommended)
npm install -g codestat

# Or use npx
npx codestat analyze
```

### Basic Usage

```bash
# Analyze current directory
codestat analyze

# Quick analysis
codestat quick

# Analyze specific path
codestat analyze /path/to/project

# Get help
codestat --help
```

## 🎯 Showcase

### Basic Analysis
```bash
$ codestat analyze
```

<div align="center">

```
╭ CODE ANALYSIS ENGINE ╮
╠══════════════════════════════════════════════════════════╣

[STA] SUMMARY STATISTICS
┌─────────────────────────────────────────────────────────────┐
│ Total Files     :     42                              │
│ Directories     :     12                              │
│ Total Lines     :  8,247                              │
│ Code Lines      :  6,183                              │
│ Comments        :  1,247                              │
│ Blank Lines     :    817                              │
└─────────────────────────────────────────────────────────────┘

[TYP] FILE TYPE ANALYSIS
┌─────────┬───────┬──────────┬──────┬──────────┬───────┐
│ Type    │ Files │   Lines  │ Code │ Comments │ Blank │
├─────────┼───────┼──────────┼──────┼──────────┼───────┤
│ JS      │    24 │    5,234 │ 4123 │      847 │   264 │
│ TS      │     8 │    1,847 │ 1523 │      234 │    90 │
│ JSON    │     6 │      892 │  892 │        0 │     0 │
│ MD      │     4 │      274 │  145 │        0 │   129 │
└─────────┴───────┴──────────┴──────┴──────────┴───────┘
```

</div>

### Quick Analysis
```bash
$ codestat quick
```

<div align="center">

```
╭ QUICK ANALYSIS ╮
╠════════════════════════════════════════════════════╣
│ Files         :     42                      │
│ Total Lines   :  8,247                      │
│ Code Lines    :  6,183                      │
│ Avg Lines/File:    196                      │
╚════════════════════════════════════════════════════╝
```

</div>

### Statistics & Achievements
```bash
$ codestat stats
```

<div align="center">

```
╭ CODESTAT STATISTICS ╮
╠════════════════════════════════════════════════════╣

[STA] YOUR CODING JOURNEY
┌─────────────────────────────────────────────────────┐
│ Projects Analyzed:   12                          │
│ Files Analyzed:      1,247                       │
│ Lines of Code:      89,247                       │
│ Analyses Completed:  156                          │
└─────────────────────────────────────────────────────┘

[ACH] RECENT ACHIEVEMENTS
┌─────────────────────────────────────────────────────┐
│ 🏆 100K Lines Analyzed!                    │
│ ⭐ 50 Projects Analyzed                     │
│ ⭐ 1000 Files Analyzed                      │
└─────────────────────────────────────────────────────┘
```

</div>

## 🛠️ Advanced Usage

### Configuration File

Create a `.codestatrc` file in your project root:

```json
{
  "extensions": ["js", "ts", "jsx", "tsx", "py", "java"],
  "ignore": ["node_modules", ".git", "dist", "build"],
  "maxFileSize": "10MB",
  "output": "fancy",
  "quiet": false,
  "showHidden": false,
  "skipBinaryFiles": true
}
```

### Command Options

```bash
# Custom extensions
codestat analyze -e "js,ts,py,java"

# Ignore patterns
codestat analyze -i "node_modules,.git,dist"

# JSON output
codestat analyze --json > results.json

# Quiet mode
codestat analyze --quiet

# Clear cache
codestat analyze --clear-cache

# Simple output
codestat analyze -o simple
```

### All Commands

```bash
# Analyze directory
codestat analyze [path] [options]

# Quick analysis
codestat quick [path]

# Analyze single file
codestat file <file>

# Cache management
codestat cache --stats
codestat cache --clear

# Your statistics
codestat stats

# Project history
codestat history [path]

# Configuration
codestat config --init
codestat config --show
```

## 🌍 Supported Languages

CodeStat supports **93 programming languages and file types** including:

### Popular Languages
- **JavaScript/TypeScript** (.js, .ts, .jsx, .tsx)
- **Python** (.py)
- **Java** (.java)
- **C/C++** (.c, .cpp, .h)
- **Go** (.go)
- **Rust** (.rs)
- **PHP** (.php)
- **Ruby** (.rb)
- **C#** (.cs)
- **Swift** (.swift)
- **Kotlin** (.kt)
- **Scala** (.scala)

### Web Technologies
- **HTML** (.html, .htm)
- **CSS** (.css, .scss, .sass, .less)
- **Vue** (.vue)
- **Svelte** (.svelte)
- **React** (.jsx, .tsx)

### Data & Configuration
- **JSON** (.json)
- **YAML** (.yaml, .yml)
- **TOML** (.toml)
- **XML** (.xml)
- **SQL** (.sql)

### And Many More...
- Shell scripts, Dockerfiles, Markdown, LaTeX, Assembly, and more!

## 📊 Output Formats

### Fancy Output (Default)
Beautiful ASCII art with colors and progress bars

### Simple Output
Clean, minimal output perfect for scripts

### JSON Output
Machine-readable format for integration:

```json
{
  "totalFiles": 42,
  "totalLines": 8247,
  "codeLines": 6183,
  "commentLines": 1247,
  "blankLines": 817,
  "byFileType": {
    "js": {
      "files": 24,
      "totalLines": 5234,
      "codeLines": 4123,
      "commentLines": 847,
      "blankLines": 264
    }
  },
  "largestFiles": [
    {
      "path": "src/analyzer.js",
      "lines": 764,
      "type": "js"
    }
  ]
}
```

## 🎮 Gamification Features

### Milestones & Achievements
- **Lines Analyzed**: Track your coding journey
- **Files Analyzed**: Monitor file processing
- **Projects Analyzed**: Count unique projects
- **Cache Efficiency**: Track performance optimization

### Progress Tracking
- Real-time progress indicators
- Achievement notifications
- Personal statistics dashboard
- Historical growth trends

## 🔧 API Usage

Use CodeStat as a Node.js module:

```javascript
const { analyzeProject } = require('codestat');

// Basic analysis
const results = await analyzeProject('/path/to/project', ['js', 'ts'], ['node_modules']);
console.log(results);

// Advanced options
const detailedResults = await analyzeProject(
  '/path/to/project',
  ['js', 'ts', 'py'],
  ['node_modules', '.git'],
  {
    maxFileSize: 1024 * 1024 * 10, // 10MB
    verbose: true,
    useCache: true,
    progressCallback: (progress) => {
      console.log(`Progress: ${progress.progress}%`);
    }
  }
);
```

## 🏗️ Development

### Setup
```bash
git clone https://github.com/yourusername/codestat.git
cd codestat
npm install
npm install-global
```

### Testing
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:analyzer
npm run test:cli
npm run test:language
```

### Scripts
```bash
# Development
npm run dev

# Lint (when configured)
npm run lint

# Build (when configured)
npm run build
```

## 🎯 Performance Features

### Intelligent Caching
- **Automatic caching** of analysis results
- **Cache invalidation** on file changes
- **TTL-based expiration** (24 hours)
- **Size management** (100 entries max)

### Large File Support
- **Streaming analysis** for files > 1MB
- **Memory-efficient** processing
- **Configurable size limits**
- **Binary file detection**

### Security Features
- **Path traversal protection**
- **Input sanitization**
- **Command injection prevention**
- **Safe file operations**

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📈 Roadmap

- [ ] **Web Interface** - Beautiful web dashboard
- [ ] **Git Integration** - Blame, history, and commit analysis
- [ ] **Real-time Monitoring** - Watch files as they change
- [ ] **Advanced Metrics** - Complexity, maintainability, technical debt
- [ ] **Plugin System** - Custom analyzers and formatters
- [ ] **Database Export** - Save results to databases
- [ ] **CI/CD Integration** - GitHub Actions, GitLab CI
- [ ] **Team Features** - Collaborative analysis and sharing

## 🐛 Troubleshooting

### Common Issues

**Permission Denied**
```bash
# Ensure read permissions
chmod -R +r /path/to/project
```

**Large Files**
```bash
# Increase file size limit
codestat analyze --max-size 50MB
```

**Memory Issues**
```bash
# Exclude large directories
codestat analyze -i "node_modules,.git,dist,build"
```

### Getting Help

```bash
# Command help
codestat --help
codestat analyze --help

# Cache info
codestat cache --stats

# Configuration help
codestat config --show
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GitHub** for the color scheme inspiration
- **Node.js** community for the amazing ecosystem
- **All contributors** who helped make CodeStat better

## 📞 Support

- 📧 **Email**: support@codestat.dev
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/codestat/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/codestat/discussions)
- 📖 **Documentation**: [Wiki](https://github.com/yourusername/codestat/wiki)

---

<div align="center">

**Made with ❤️ by the CodeStat Team**

[![Website](https://img.shields.io/badge/website-codestat.dev-blue)](https://codestat.dev)

⭐ **Star us on GitHub** if you find CodeStat useful!

</div>