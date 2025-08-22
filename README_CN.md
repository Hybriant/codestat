# CodeStat

一个强大的命令行工具，用于分析项目组成和统计代码行数，具有受 GitHub 启发的精美彩色输出。

![CodeStat Demo](https://img.shields.io/badge/Node.js-%3E%3D14-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 功能特性

- 🎨 **受 GitHub 启发的颜色**为每种编程语言提供
- 📊 **全面分析**包括代码、注释和空行
- 🚀 **快速高效**支持大文件流式处理
- 🗂️ **智能缓存**加速重复分析
- 🏆 **里程碑成就**追踪您的编码进度
- 📈 **进度跟踪**实时分析指示器
- 📊 **分析历史**项目增长趋势
- 🔄 **对比视图**查看分析之间的变化
- 🔧 **灵活配置**支持自定义扩展名和忽略模式
- 📈 **丰富的可视化输出**进度条和精美边框
- 🔍 **详细洞察**包括最大文件和语言分布
- 📄 **JSON 输出**支持与其他工具集成
- ⚡ **快速分析**模式快速反馈

## 安装

### 全局安装

```bash
npm install -g codestat
```

### 本地安装

```bash
npm install codestat
```

### 从源码安装

```bash
git clone <repository-url>
cd codestat
npm install
npm link
```

## 使用方法

### 基本用法

分析当前目录：

```bash
codestat analyze
```

分析特定目录：

```bash
codestat analyze /path/to/project
```

### 快速分析

获取快速概览：

```bash
codestat quick
codestat quick /path/to/project
```

### 高级选项

```bash
# 指定要分析的文件扩展名
codestat analyze -e "js,ts,py,java"

# 忽略特定模式
codestat analyze -i "node_modules,.git,dist,build"

# 输出为 JSON
codestat analyze --json > results.json

# 静默模式（无进度指示器）
codestat analyze --quiet

# 此次分析禁用缓存
codestat analyze --no-cache

# 分析前清除缓存
codestat analyze --clear-cache
```

### 配置文件

在项目根目录创建 `.codestatrc` 文件：

```json
{
  "extensions": ["js", "ts", "jsx", "tsx", "py", "java"],
  "ignore": ["node_modules", ".git", "dist"],
  "maxFileSize": "5MB",
  "output": "fancy"
}
```

## 命令参考

### `analyze` 命令

分析目录并提供详细统计信息。

```bash
codestat analyze [path] [options]
```

**选项：**
- `-e, --extensions <extensions>` - 包含的文件扩展名（逗号分隔）
- `-i, --ignore <patterns>` - 忽略的模式（逗号分隔）
- `-j, --json` - 输出结果为 JSON
- `-q, --quiet` - 禁止进度指示器
- `-o, --output <format>` - 输出格式：fancy、simple 或 json
- `--no-cache` - 此次分析禁用缓存
- `--clear-cache` - 运行前清除分析缓存

### `quick` 命令

使用默认设置提供快速分析。

```bash
codestat quick [path]
```

**选项：**
- `--no-cache` - 此次分析禁用缓存

### `cache` 命令

管理分析缓存。

```bash
codestat cache [options]
```

**选项：**
- `-c, --clear` - 清除缓存
- `-s, --stats` - 显示缓存统计信息

### `stats` 命令

显示您的 CodeStat 统计信息和成就。

```bash
codestat stats
```

### `history` 命令

显示项目的分析历史。

```bash
codestat history [path] [options]
```

**选项：**
- `-n, --number <count>` - 显示历史记录条目数（默认：10）

## 支持的语言

CodeStat 支持 50+ 种编程语言，包括：

- JavaScript/TypeScript (.js, .ts, .jsx, .tsx)
- Python (.py)
- Java (.java)
- C/C++ (.c, .cpp, .h)
- Go (.go)
- Rust (.rs)
- PHP (.php)
- Ruby (.rb)
- C# (.cs)
- Swift (.swift)
- Kotlin (.kt)
- Scala (.scala)
- 等等...

## 输出示例

### 精美输出

```
╭ CODE ANALYSIS ENGINE ╮

╠══════════════════════════════════════════════════════════╣

[DIR]PROJECT ANALYSIS COMPLETE
────────────────────────────────────────

[STA]SUMMARY STATISTICS
┌──────────────────────────────────────┐
│ [DIR] Total Files               42 │
│ [FOL] Directories               12 │
│ [DOC] Total Lines           1,234 │
│ [COD] Code Lines              987 │
│ [COM] Comments                156 │
│ [BLK] Blank Lines              91 │
└──────────────────────────────────────┘
```

### JSON 输出

```json
{
  "totalFiles": 42,
  "totalDirectories": 12,
  "totalLines": 1234,
  "codeLines": 987,
  "commentLines": 156,
  "blankLines": 91,
  "byFileType": {
    "js": {
      "files": 15,
      "totalLines": 456,
      "codeLines": 378,
      "commentLines": 56,
      "blankLines": 22
    }
  },
  "largestFiles": [...]
}
```

## API 使用

CodeStat 也可以用作 Node.js 模块：

```javascript
const { analyzeProject } = require('codestat');

const results = await analyzeProject('/path/to/project', ['js', 'ts'], ['node_modules']);
console.log(results);
```

## 开发

### 前置要求

- Node.js >= 14
- npm >= 6

### 设置

```bash
git clone <repository-url>
cd codestat
npm install
```

### 运行测试

```bash
npm test
```

### 代码检查

```bash
npm run lint
```

## 缓存

CodeStat 包含智能缓存以加速重复分析：

- **自动缓存**：每次分析后自动缓存结果
- **缓存失效**：文件修改时缓存自动失效
- **基于 TTL 的过期**：缓存条目 24 小时后过期
- **大小管理**：缓存限制为 100 个条目以防止过度磁盘使用

### 管理缓存

```bash
# 查看缓存统计信息
codestat cache --stats

# 清除缓存
codestat cache --clear

# 单次分析禁用缓存
codestat analyze --no-cache

# 分析前清除缓存
codestat analyze --clear-cache
```

### 缓存位置

缓存文件存储在 `~/.codestat/cache/` 中，自动管理。

## 里程碑和成就

CodeStat 追踪您的编码进度并庆祝里程碑：

- **分析行数**：跨所有项目分析的总代码行数
- **分析文件数**：处理的总文件数
- **分析项目数**：分析的唯一项目计数

随着您分析更多代码，里程碑会自动解锁，提供游戏化体验以增强开发者信心。

## 分析历史和对比

CodeStat 自动维护您的分析历史：

- **项目历史**：追踪项目随时间的演变
- **增长趋势**：查看日/周增长率
- **变更检测**：将当前分析与之前的分析进行对比
- **文件类型演变**：监控技术栈的变化

每次分析后，CodeStat 显示：
- 自上次分析以来的变化
- 新增的文件类型
- 整体项目增长
- 生产力趋势

## 配置

### 环境变量

- `CODESTAT_MAX_FILE_SIZE` - 分析的最大文件大小（默认：10MB）
- `CODESTAT_IGNORE_PATTERNS` - 默认忽略模式
- `CODESTAT_EXTENSIONS` - 默认文件扩展名

### 配置文件

创建 JSON 格式的 `.codestatrc` 文件：

```json
{
  "extensions": ["js", "ts", "py"],
  "ignore": ["node_modules", ".git", "dist"],
  "maxFileSize": "5MB",
  "output": "simple",
  "showHidden": false
}
```

## 故障排除

### 常见问题

1. **权限被拒绝**：确保您对目标目录中的所有文件具有读取权限
2. **文件过大**：使用 `--max-size` 选项或分割大文件
3. **内存问题**：使用 `--ignore` 模式排除不必要的目录

### 获取帮助

```bash
codestat --help
codestat analyze --help
codestat quick --help
```

## 贡献

1. Fork 仓库
2. 创建功能分支
3. 进行更改
4. 为新功能添加测试
5. 运行测试套件
6. 提交拉取请求

## 许可证

MIT 许可证 - 详情请参阅 LICENSE 文件。

## 更新日志

### v1.0.0
- 初始发布
- 支持 50+ 种编程语言
- 受 GitHub 启发的彩色输出
- JSON 导出功能
- 配置文件支持
- 单个文件分析

## 路线图

- [ ] 网络可视化界面
- [ ] Git 集成（blame、历史）
- [ ] 实时监控
- [ ] 高级指标（复杂度、可维护性）
- [ ] 自定义分析器插件系统
- [ ] 数据库导出功能

## 支持

- 在 GitHub 上创建问题以报告错误或请求功能
- 查看文档了解常见问题
- 加入我们的社区讨论