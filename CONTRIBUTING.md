# 🤝 Contributing to CodeStat

We love your input! We want to make contributing to CodeStat as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 🚀 Development Process

### 🛠️ Development Workflow

1. **Fork the Repository**
   ```bash
   # Fork the repo on GitHub
   git clone https://github.com/YOUR_USERNAME/codestat.git
   cd codestat
   ```

2. **Set Up Development Environment**
   ```bash
   # Install dependencies
   npm install
   
   # Install globally for testing
   npm run install-global
   
   # Verify installation
   codestat --version
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make Your Changes**
   ```bash
   # Edit files
   # Run tests
   npm test
   
   # Test your changes
   codestat analyze
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

### 📝 Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for our commit messages:

```
type(scope): description

# Examples:
feat(analyzer): add support for Python 3.11
fix(cli): prevent crash on empty directories
docs(readme): update installation instructions
test(analyzer): add tests for new language support
refactor(cache): improve cache performance
build(package): update dependencies
ci(github): add automated testing workflow
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or dependencies
- `ci`: Changes to CI configuration files and scripts

## 🐛 Reporting Bugs

### Bug Report Template

When creating a bug report, please include:

```markdown
## Bug Description
A clear and concise description of what the bug is.

## Environment
- OS: [e.g. Ubuntu 20.04, macOS Big Sur, Windows 10]
- Node.js version: [e.g. 14.17.0, 16.13.0]
- CodeStat version: [e.g. 1.0.2]
- Terminal: [e.g. iTerm2, Windows Terminal, GNOME Terminal]

## Steps to Reproduce
1. Run 'codestat analyze /path/to/project'
2. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Actual Behavior
A clear and concise description of what actually happened.

## Error Messages
```
Paste error messages here
```

## Additional Context
Add any other context about the problem here.
```

## ✨ Feature Requests

### Feature Request Template

```markdown
## Feature Description
A clear and concise description of what you want to happen.

## Problem Statement
What problem would this feature solve? Who would benefit from it?

## Proposed Solution
Describe the solution you'd like to see implemented.

## Alternatives Considered
Describe any alternative solutions or features you've considered.

## Additional Context
Add any other context, mockups, or examples about the feature request.
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:analyzer
npm run test:cli
npm run test:language

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

We use a simple test framework. Please add tests for any new features or bug fixes:

```javascript
// test/example.test.js
const assert = require('assert');
const { analyzeProject } = require('../src/analyzer');

async function testExample() {
  const results = await analyzeProject('./test-files', ['js'], []);
  assert(results.totalFiles > 0, 'Should find files');
}

// Export tests
module.exports = { testExample };
```

### Test Coverage

We aim for high test coverage. Please ensure your changes don't break existing tests and add new tests for new functionality.

## 📚 Documentation

### Updating Documentation

When adding new features, please update:

1. **README.md** - Main documentation
2. **Help text** - Use `--help` flag
3. **Comments** - Add JSDoc comments for public functions
4. **Changelog** - Update CHANGELOG.md

### JSDoc Comment Style

```javascript
/**
 * Analyzes a project directory and counts lines of code
 * @param {string} rootPath - Root directory to analyze
 * @param {string[]} extensions - File extensions to include
 * @param {string[]} ignorePatterns - Patterns to ignore
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Analysis results
 */
async function analyzeProject(rootPath, extensions, ignorePatterns, options = {}) {
  // implementation
}
```

## 🎨 Code Style

### JavaScript Style Guide

- Use 2 spaces for indentation
- Use single quotes for strings
- Use trailing commas in multi-line structures
- Use arrow functions for callbacks
- Use const/let instead of var
- Add JSDoc comments for public functions

### Example Code Style

```javascript
// ✅ Good
const analyzeFile = async (filePath, options = {}) => {
  try {
    const stats = await fs.promises.stat(filePath);
    return processFile(stats, filePath);
  } catch (error) {
    console.error('Error analyzing file:', error);
    throw error;
  }
};

// ❌ Avoid
function analyzeFile(filePath, options) {
  var stats = fs.statSync(filePath);
  return processFile(stats, filePath);
}
```

## 🔧 Development Tools

### Useful Commands

```bash
# Development
npm run dev          # Run in development mode
npm start           # Alias for dev

# Testing
npm test            # Run all tests
npm run test:analyzer # Run analyzer tests
npm run test:cli    # Run CLI tests
npm run test:language # Run language tests

# Installation
npm run install-global # Install globally for testing
npm install -g .     # Alternative global install

# Linting (when configured)
npm run lint        # Run linter
npm run lint:fix    # Fix linting issues
```

### Debug Mode

Enable debug logging:

```bash
# Set debug environment variable
DEBUG=codestat:* codestat analyze

# Or use verbose flag
codestat analyze --verbose
```

## 🌍 Internationalization

### Adding New Languages

To add support for a new programming language:

1. **Update Language Configuration** (`src/language-config.js`)
   ```javascript
   // Add to singleLine or multiLine patterns
   singleLine: {
     '//': ['js', 'ts', 'NEW_LANGUAGE'],
     '#': ['py', 'NEW_LANGUAGE']
   }
   ```

2. **Add Color Definition** (`src/language-colors.js`)
   ```javascript
   const languageColors = {
     'NEW_LANGUAGE': {
       color: '#ff6b6b',
       bgColor: '#ff6b6b20'
     }
   };
   ```

3. **Add Tests** (`test/language.test.js`)
   ```javascript
   // Test comment detection for new language
   ```

4. **Update Documentation**
   - Add to README.md supported languages list
   - Update help text

## 🚀 Performance Guidelines

### Large File Handling

- Use streaming for files > 1MB
- Implement proper error handling
- Add progress indicators for long operations
- Use async/await for I/O operations

### Memory Management

- Avoid loading entire files into memory
- Use streams for large file processing
- Implement proper cleanup
- Monitor memory usage in development

### Caching Strategy

- Use the existing cache system
- Invalidate cache when files change
- Respect cache size limits
- Provide cache management options

## 🔒 Security Guidelines

### Input Validation

- Always validate user input
- Use existing sanitization functions
- Never trust external input
- Implement proper error handling

### File System Safety

- Use path validation functions
- Check file permissions before access
- Handle symbolic links safely
- Implement proper error handling

### Command Injection Prevention

- Never execute shell commands with user input
- Use existing sanitization functions
- Validate all file paths
- Implement proper error handling

## 📝 Pull Request Process

### PR Checklist

Before submitting a PR, please ensure:

- [ ] All tests pass (`npm test`)
- [ ] Code follows the style guide
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] PR title follows conventions
- [ ] Self-review of code is complete
- [ ] Changes are tested manually
- [ ] Performance impact is considered
- [ ] Security implications are considered

### PR Review Process

1. **Automated Checks**
   - All tests must pass
   - Code must follow style guidelines
   - Documentation must be updated

2. **Code Review**
   - At least one maintainer must approve
   - All feedback must be addressed
   - Changes must be tested

3. **Merge**
   - PR must be approved by at least one maintainer
   - All checks must pass
   - PR must be up-to-date with main branch
   - Merge commit must be signed

## 🎯 Getting Help

### Community Support

- **GitHub Discussions**: Ask questions and share ideas
- **GitHub Issues**: Report bugs and request features
- **Discord Server**: Chat with other developers (coming soon)

### Documentation

- **README.md**: Main documentation and usage examples
- **CLI Help**: `codestat --help` and `codestat [command] --help`
- **API Documentation**: JSDoc comments in source code

### Maintainer Contact

For urgent issues or security concerns, please contact the maintainers directly:

- **Email**: security@codestat.dev
- **GitHub Security**: [Report vulnerability](https://github.com/yourusername/codestat/security/advisories/new)

## 🏆 Becoming a Maintainer

### Requirements

- Active contributor with multiple merged PRs
- Understanding of the codebase architecture
- Participation in code reviews
- Helpful engagement in issues and discussions
- Alignment with project goals and values

### Process

1. Express interest to current maintainers
2. Demonstrate consistent contribution quality
3. Participate in maintainer discussions
4. Receive invitation from current maintainers
5. Accept maintainer responsibilities

### Responsibilities

- Review and merge pull requests
- Triage and respond to issues
- Guide new contributors
- Make technical decisions
- Represent the project professionally

## 📊 Project Governance

### Decision Making

- **Technical Decisions**: Made by maintainers with community input
- **Feature Priorities**: Based on community needs and technical feasibility
- **Breaking Changes**: Discussed with community and documented clearly
- **Code of Conduct**: Enforced by maintainers

### Release Process

1. **Feature Freeze**: No new features during release preparation
2. **Testing**: Comprehensive testing of all features
3. **Documentation**: Update all documentation
4. **Release**: Create release tag and publish to npm
5. **Announcement**: Share release notes and celebrate

---

## 🎉 Thank You!

Thank you for your interest in contributing to CodeStat! Your contributions help make this project better for everyone.

**Happy coding!** 🚀