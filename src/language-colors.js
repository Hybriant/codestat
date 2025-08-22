/**
 * GitHub-inspired color mapping for programming languages
 * Based on GitHub's language color palette
 */

const languageColors = {
  // JavaScript and TypeScript
  'js': { color: '#f1e05a', bgColor: '#2d2d2d', name: 'JavaScript' },
  'jsx': { color: '#f1e05a', bgColor: '#2d2d2d', name: 'JSX' },
  'ts': { color: '#3178c6', bgColor: '#1e3a5f', name: 'TypeScript' },
  'tsx': { color: '#3178c6', bgColor: '#1e3a5f', name: 'TSX' },
  'mjs': { color: '#f1e05a', bgColor: '#2d2d2d', name: 'JavaScript' },
  'cjs': { color: '#f1e05a', bgColor: '#2d2d2d', name: 'JavaScript' },
  
  // Python
  'py': { color: '#3572A5', bgColor: '#1e3a5f', name: 'Python' },
  
  // Java
  'java': { color: '#b07219', bgColor: '#4a2511', name: 'Java' },
  
  // C Family
  'c': { color: '#555555', bgColor: '#2d2d2d', name: 'C' },
  'cpp': { color: '#f34b7d', bgColor: '#5f1d38', name: 'C++' },
  'cc': { color: '#f34b7d', bgColor: '#5f1d38', name: 'C++' },
  'cxx': { color: '#f34b7d', bgColor: '#5f1d38', name: 'C++' },
  'h': { color: '#555555', bgColor: '#2d2d2d', name: 'C Header' },
  'hpp': { color: '#f34b7d', bgColor: '#5f1d38', name: 'C++ Header' },
  
  // C#
  'cs': { color: '#239120', bgColor: '#1a3d1a', name: 'C#' },
  'csx': { color: '#239120', bgColor: '#1a3d1a', name: 'C#' },
  
  // Go
  'go': { color: '#00ADD8', bgColor: '#004d5f', name: 'Go' },
  
  // Rust
  'rs': { color: '#dea584', bgColor: '#5f3828', name: 'Rust' },
  
  // PHP
  'php': { color: '#4F5D95', bgColor: '#2d3050', name: 'PHP' },
  'php3': { color: '#4F5D95', bgColor: '#2d3050', name: 'PHP' },
  'php4': { color: '#4F5D95', bgColor: '#2d3050', name: 'PHP' },
  'php5': { color: '#4F5D95', bgColor: '#2d3050', name: 'PHP' },
  'phtml': { color: '#4F5D95', bgColor: '#2d3050', name: 'PHP' },
  
  // Ruby
  'rb': { color: '#701516', bgColor: '#3d0a0b', name: 'Ruby' },
  'gemspec': { color: '#701516', bgColor: '#3d0a0b', name: 'Ruby' },
  
  // Swift
  'swift': { color: '#FA7343', bgColor: '#5f2d1f', name: 'Swift' },
  
  // Kotlin
  'kt': { color: '#A97BFF', bgColor: '#3d2d5f', name: 'Kotlin' },
  'kts': { color: '#A97BFF', bgColor: '#3d2d5f', name: 'Kotlin' },
  
  // Scala
  'scala': { color: '#c22d40', bgColor: '#5f1d28', name: 'Scala' },
  'sc': { color: '#c22d40', bgColor: '#5f1d28', name: 'Scala' },
  
  // Dart
  'dart': { color: '#00B4AB', bgColor: '#004d4a', name: 'Dart' },
  
  // Shell/Bash
  'sh': { color: '#89e051', bgColor: '#2d3d1f', name: 'Shell' },
  'bash': { color: '#89e051', bgColor: '#2d3d1f', name: 'Bash' },
  'zsh': { color: '#89e051', bgColor: '#2d3d1f', name: 'Zsh' },
  'fish': { color: '#89e051', bgColor: '#2d3d1f', name: 'Fish' },
  'command': { color: '#89e051', bgColor: '#2d3d1f', name: 'Shell' },
  
  // HTML
  'html': { color: '#e34c26', bgColor: '#5f1a0f', name: 'HTML' },
  'htm': { color: '#e34c26', bgColor: '#5f1a0f', name: 'HTML' },
  'xhtml': { color: '#e34c26', bgColor: '#5f1a0f', name: 'XHTML' },
  
  // CSS
  'css': { color: '#563d7c', bgColor: '#2d1f4a', name: 'CSS' },
  'scss': { color: '#cf649a', bgColor: '#5f1d38', name: 'SCSS' },
  'sass': { color: '#cf649a', bgColor: '#5f1d38', name: 'Sass' },
  'less': { color: '#1d365d', bgColor: '#1a2840', name: 'Less' },
  
  // SQL
  'sql': { color: '#336790', bgColor: '#1a3a4d', name: 'SQL' },
  
  // Markdown
  'md': { color: '#083fa1', bgColor: '#1a1f2d', name: 'Markdown' },
  'markdown': { color: '#083fa1', bgColor: '#1a1f2d', name: 'Markdown' },
  
  // JSON
  'json': { color: '#292929', bgColor: '#1a1a1a', name: 'JSON' },
  'jsonc': { color: '#292929', bgColor: '#1a1a1a', name: 'JSON' },
  
  // YAML
  'yaml': { color: '#cb171e', bgColor: '#5f0f11', name: 'YAML' },
  'yml': { color: '#cb171e', bgColor: '#5f0f11', name: 'YAML' },
  
  // TOML
  'toml': { color: '#9c4221', bgColor: '#4d1f11', name: 'TOML' },
  
  // XML
  'xml': { color: '#0060ac', bgColor: '#1a3a5f', name: 'XML' },
  'xsl': { color: '#0060ac', bgColor: '#1a3a5f', name: 'XSL' },
  'xsd': { color: '#0060ac', bgColor: '#1a3a5f', name: 'XSD' },
  
  // Vue
  'vue': { color: '#2c3e50', bgColor: '#1a252d', name: 'Vue' },
  
  // Svelte
  'svelte': { color: '#ff3e00', bgColor: '#5f1f0a', name: 'Svelte' },
  
  // Astro
  'astro': { color: '#ff5d01', bgColor: '#5f2d0a', name: 'Astro' },
  
  // Groovy
  'groovy': { color: '#4298b8', bgColor: '#1a3d4a', name: 'Groovy' },
  'gvy': { color: '#4298b8', bgColor: '#1a3d4a', name: 'Groovy' },
  
  // Objective-C
  'm': { color: '#438eff', bgColor: '#1a285f', name: 'Objective-C' },
  'mm': { color: '#438eff', bgColor: '#1a285f', name: 'Objective-C++' },
  
  // Perl
  'pl': { color: '#0298c3', bgColor: '#1a4d5f', name: 'Perl' },
  'pm': { color: '#0298c3', bgColor: '#1a4d5f', name: 'Perl' },
  
  // R
  'r': { color: '#198ce7', bgColor: '#1a385f', name: 'R' },
  
  // Lua
  'lua': { color: '#000080', bgColor: '#1a1a2d', name: 'Lua' },
  
  // Visual Basic
  'vb': { color: '#945db7', bgColor: '#3d2d5f', name: 'Visual Basic' },
  'vbs': { color: '#945db7', bgColor: '#3d2d5f', name: 'VBScript' },
  'vba': { color: '#945db7', bgColor: '#3d2d5f', name: 'VBA' },
  'bas': { color: '#945db7', bgColor: '#3d2d5f', name: 'Visual Basic' },
  
  // Batch
  'bat': { color: '#C1F12E', bgColor: '#3d4a1f', name: 'Batch' },
  'cmd': { color: '#C1F12E', bgColor: '#3d4a1f', name: 'Batch' },
  
  // Assembly
  'asm': { color: '#6E4C13', bgColor: '#4d2d0f', name: 'Assembly' },
  's': { color: '#6E4C13', bgColor: '#4d2d0f', name: 'Assembly' },
  'nasm': { color: '#6E4C13', bgColor: '#4d2d0f', name: 'Assembly' },
  'fasm': { color: '#6E4C13', bgColor: '#4d2d0f', name: 'Assembly' },
  
  // Docker
  'dockerfile': { color: '#384d54', bgColor: '#1a282d', name: 'Dockerfile' },
  
  // Git
  'gitignore': { color: '#f14e32', bgColor: '#5f1a0f', name: 'Git Ignore' },
  'gitattributes': { color: '#f14e32', bgColor: '#5f1a0f', name: 'Git Attributes' },
  'gitmodules': { color: '#f14e32', bgColor: '#5f1a0f', name: 'Git Modules' },
  
  // NPM
  'npmignore': { color: '#cb3837', bgColor: '#5f1a1f', name: 'NPM Ignore' },
  
  // Configuration
  'properties': { color: '#7f8c8d', bgColor: '#2d3a3a', name: 'Properties' },
  'conf': { color: '#7f8c8d', bgColor: '#2d3a3a', name: 'Config' },
  'ini': { color: '#7f8c8d', bgColor: '#2d3a3a', name: 'INI' },
  'cfg': { color: '#7f8c8d', bgColor: '#2d3a3a', name: 'Config' },
  
  // Make
  'makefile': { color: '#427819', bgColor: '#2d3d1f', name: 'Makefile' },
  'mk': { color: '#427819', bgColor: '#2d3d1f', name: 'Makefile' },
  
  // Text
  'txt': { color: '#cccccc', bgColor: '#2d2d2d', name: 'Text' },
  
  // F#
  'fsharp': { color: '#b845fc', bgColor: '#3d1d5f', name: 'F#' },
  'fs': { color: '#b845fc', bgColor: '#3d1d5f', name: 'F#' },
  'fsi': { color: '#b845fc', bgColor: '#3d1d5f', name: 'F#' },
  'fsx': { color: '#b845fc', bgColor: '#3d1d5f', name: 'F#' },
  
  // OCaml
  'ml': { color: '#ef7a08', bgColor: '#5f3d0a', name: 'OCaml' },
  'mli': { color: '#ef7a08', bgColor: '#5f3d0a', name: 'OCaml' },
  
  // Haskell
  'haskell': { color: '#5e5086', bgColor: '#2d2540', name: 'Haskell' },
  'hs': { color: '#5e5086', bgColor: '#2d2540', name: 'Haskell' },
  'lhs': { color: '#5e5086', bgColor: '#2d2540', name: 'Literate Haskell' },
  
  // Elm
  'elm': { color: '#60B5CC', bgColor: '#1a4a5f', name: 'Elm' },
  
  // Elixir
  'ex': { color: '#6e4a7e', bgColor: '#3d2540', name: 'Elixir' },
  'exs': { color: '#6e4a7e', bgColor: '#3d2540', name: 'Elixir' },
  
  // Crystal
  'cr': { color: '#000100', bgColor: '#1a1a1a', name: 'Crystal' },
  
  // Clojure
  'clj': { color: '#db5855', bgColor: '#5f1d1f', name: 'Clojure' },
  'cljs': { color: '#db5855', bgColor: '#5f1d1f', name: 'ClojureScript' },
  'cljc': { color: '#db5855', bgColor: '#5f1d1f', name: 'ClojureC' },
  'edn': { color: '#db5855', bgColor: '#5f1d1f', name: 'EDN' },
  
  // Racket
  'racket': { color: '#3c5caa', bgColor: '#1a285f', name: 'Racket' },
  'rkt': { color: '#3c5caa', bgColor: '#1a285f', name: 'Racket' },
  
  // Scheme
  'scheme': { color: '#1e4aec', bgColor: '#1a285f', name: 'Scheme' },
  'scm': { color: '#1e4aec', bgColor: '#1a285f', name: 'Scheme' },
  'ss': { color: '#1e4aec', bgColor: '#1a285f', name: 'Scheme' },
  
  // Common Lisp
  'lisp': { color: '#3fb68b', bgColor: '#1a3d2d', name: 'Common Lisp' },
  
  // Julia
  'julia': { color: '#a270ba', bgColor: '#3d1f4a', name: 'Julia' },
  'jl': { color: '#a270ba', bgColor: '#3d1f4a', name: 'Julia' },
  
  // MATLAB
  'matlab': { color: '#e16737', bgColor: '#5f2d1a', name: 'MATLAB' },
  'm': { color: '#e16737', bgColor: '#5f2d1a', name: 'MATLAB' },
  
  // Fortran
  'fortran': { color: '#4d41b1', bgColor: '#1a1f4a', name: 'Fortran' },
  'f90': { color: '#4d41b1', bgColor: '#1a1f4a', name: 'Fortran' },
  'f95': { color: '#4d41b1', bgColor: '#1a1f4a', name: 'Fortran' },
  'f03': { color: '#4d41b1', bgColor: '#1a1f4a', name: 'Fortran' },
  
  // Ada
  'ada': { color: '#02f88c', bgColor: '#1a4d3a', name: 'Ada' },
  'adb': { color: '#02f88c', bgColor: '#1a4d3a', name: 'Ada' },
  'ads': { color: '#02f88c', bgColor: '#1a4d3a', name: 'Ada' },
  
  // VHDL
  'vhdl': { color: '#adb2cb', bgColor: '#3a3d4a', name: 'VHDL' },
  'vhd': { color: '#adb2cb', bgColor: '#3a3d4a', name: 'VHDL' },
  
  // Verilog
  'verilog': { color: '#019833', bgColor: '#1a4d25', name: 'Verilog' },
  'v': { color: '#019833', bgColor: '#1a4d25', name: 'Verilog' },
  'sv': { color: '#019833', bgColor: '#1a4d25', name: 'SystemVerilog' },
  'svh': { color: '#019833', bgColor: '#1a4d25', name: 'SystemVerilog' },
  
  // Prolog
  'prolog': { color: '#74283c', bgColor: '#4d1a25', name: 'Prolog' },
  'pl': { color: '#74283c', bgColor: '#4d1a25', name: 'Prolog' },
  'swi': { color: '#74283c', bgColor: '#4d1a25', name: 'SWI-Prolog' },
  'swipl': { color: '#74283c', bgColor: '#4d1a25', name: 'SWI-Prolog' },
  
  // Erlang
  'erlang': { color: '#B83998', bgColor: '#5f1a4a', name: 'Erlang' },
  'erl': { color: '#B83998', bgColor: '#5f1a4a', name: 'Erlang' },
  'hrl': { color: '#B83998', bgColor: '#5f1a4a', name: 'Erlang Header' },
  
  // Eiffel
  'eiffel': { color: '#946d57', bgColor: '#4d2d25', name: 'Eiffel' },
  'e': { color: '#946d57', bgColor: '#4d2d25', name: 'Eiffel' },
  
  // COBOL
  'cobol': { color: '#363e92', bgColor: '#1a1f4a', name: 'COBOL' },
  'cbl': { color: '#363e92', bgColor: '#1a1f4a', name: 'COBOL' },
  'cob': { color: '#363e92', bgColor: '#1a1f4a', name: 'COBOL' },
  
  // CoffeeScript
  'coffee': { color: '#244776', bgColor: '#1a2840', name: 'CoffeeScript' },
  'coffeelitre': { color: '#244776', bgColor: '#1a2840', name: 'CoffeeScript' },
  
  // TypeScript Definitions
  'd.ts': { color: '#3178c6', bgColor: '#1e3a5f', name: 'TypeScript Declaration' },
  
  // WebAssembly
  'wat': { color: '#04133b', bgColor: '#1a1a2d', name: 'WebAssembly Text' },
  'wasm': { color: '#04133b', bgColor: '#1a1a2d', name: 'WebAssembly' },
  
  // GraphQL
  'graphql': { color: '#e10098', bgColor: '#5f0a4a', name: 'GraphQL' },
  'gql': { color: '#e10098', bgColor: '#5f0a4a', name: 'GraphQL' },
  
  // Protocol Buffers
  'proto': { color: '#0855bf', bgColor: '#1a2d5f', name: 'Protocol Buffers' },
  
  // Thrift
  'thrift': { color: '#D12127', bgColor: '#5f0f1a', name: 'Thrift' },
  
  // Avro
  'avdl': { color: '#007AC1', bgColor: '#1a3d5f', name: 'Avro IDL' },
  'avpr': { color: '#007AC1', bgColor: '#1a3d5f', name: 'Avro Protocol' },
  'avsc': { color: '#007AC1', bgColor: '#1a3d5f', name: 'Avro Schema' },
  
  // HCL
  'hcl': { color: '#6232c9', bgColor: '#2d1a5f', name: 'HCL' },
  'tf': { color: '#5f42e4', bgColor: '#2d1a5f', name: 'Terraform' },
  'tfvars': { color: '#5f42e4', bgColor: '#2d1a5f', name: 'Terraform' },
  
  // LaTeX
  'latex': { color: '#3d6117', bgColor: '#2d3a1f', name: 'LaTeX' },
  'tex': { color: '#3d6117', bgColor: '#2d3a1f', name: 'TeX' },
  'sty': { color: '#3d6117', bgColor: '#2d3a1f', name: 'LaTeX Style' },
  'cls': { color: '#3d6117', bgColor: '#2d3a1f', name: 'LaTeX Class' },
  
  // Handlebars
  'hbs': { color: '#f7931e', bgColor: '#5f3d0a', name: 'Handlebars' },
  'handlebars': { color: '#f7931e', bgColor: '#5f3d0a', name: 'Handlebars' },
  
  // Pug
  'pug': { color: '#a86454', bgColor: '#4d251f', name: 'Pug' },
  'jade': { color: '#a86454', bgColor: '#4d251f', name: 'Pug' },
  
  // Haml
  'haml': { color: '#e2ae9b', bgColor: '#5f2d25', name: 'Haml' },
  
  // Slim
  'slim': { color: '#ff8f77', bgColor: '#5f1a1f', name: 'Slim' },
  
  // Stylus
  'styl': { color: '#ff6347', bgColor: '#5f1a1f', name: 'Stylus' },
  'stylus': { color: '#ff6347', bgColor: '#5f1a1f', name: 'Stylus' },
  
  // Sass
  'sass': { color: '#a53b70', bgColor: '#5f1d38', name: 'Sass' },
  
  // Less
  'less': { color: '#1d365d', bgColor: '#1a2840', name: 'Less' },
  
  // ASP.NET
  'asp': { color: '#640400', bgColor: '#4d0a0a', name: 'ASP' },
  'aspx': { color: '#640400', bgColor: '#4d0a0a', name: 'ASP.NET' },
  'ascx': { color: '#640400', bgColor: '#4d0a0a', name: 'ASP.NET' },
  'ashx': { color: '#640400', bgColor: '#4d0a0a', name: 'ASP.NET' },
  'asmx': { color: '#640400', bgColor: '#4d0a0a', name: 'ASP.NET' },
  
  // ColdFusion
  'cfm': { color: '#ed2cd6', bgColor: '#5f0a4a', name: 'ColdFusion' },
  'cfc': { color: '#ed2cd6', bgColor: '#5f0a4a', name: 'ColdFusion Component' },
  
  // Nim
  'nim': { color: '#ffc200', bgColor: '#4d3d0a', name: 'Nim' },
  'nims': { color: '#ffc200', bgColor: '#4d3d0a', name: 'Nim Script' },
  
  // Zig
  'zig': { color: '#ec915c', bgColor: '#5f2d1a', name: 'Zig' },
  
  // V
  'v': { color: '#5d87bd', bgColor: '#1a2840', name: 'V' },
  'vsh': { color: '#5d87bd', bgColor: '#1a2840', name: 'V Script' },
  
  // Pony
  'pony': { color: '#ff69b4', bgColor: '#5f1a3d', name: 'Pony' },
  
  // Idris
  'idr': { color: '#b30000', bgColor: '#4d0a0a', name: 'Idris' },
  'lidr': { color: '#b30000', bgColor: '#4d0a0a', name: 'Idris Literate' },
  
  // PureScript
  'purs': { color: '#1d222d', bgColor: '#1a1a2d', name: 'PureScript' },
  
  // ReasonML
  're': { color: '#ff5847', bgColor: '#5f1a1f', name: 'Reason' },
  'rei': { color: '#ff5847', bgColor: '#5f1a1f', name: 'Reason Interface' },
  
  // Nimble
  'nimble': { color: '#ffc200', bgColor: '#4d3d0a', name: 'Nimble' },
  
  // ActionScript
  'as': { color: '#882b0f', bgColor: '#4d1a0a', name: 'ActionScript' },
  'mxml': { color: '#882b0f', bgColor: '#4d1a0a', name: 'MXML' },
  
  // Haxe
  'hx': { color: '#df7900', bgColor: '#5f3d0a', name: 'Haxe' },
  'hxml': { color: '#df7900', bgColor: '#5f3d0a', name: 'HXML' },
  
  // Vala
  'vala': { color: '#fbe5cd', bgColor: '#5f3d2d', name: 'Vala' },
  'vapi': { color: '#fbe5cd', bgColor: '#5f3d2d', name: 'VAPI' },
  
  // Chapel
  'chpl': { color: '#8dc451', bgColor: '#2d4a1f', name: 'Chapel' },
  
  // Pony
  'pony': { color: '#ff69b4', bgColor: '#5f1a3d', name: 'Pony' },
  
  // Ada
  'ada': { color: '#02f88c', bgColor: '#1a4d3a', name: 'Ada' },
  'adb': { color: '#02f88c', bgColor: '#1a4d3a', name: 'Ada' },
  'ads': { color: '#02f88c', bgColor: '#1a4d3a', name: 'Ada' },
  
  // D
  'd': { color: '#ba595e', bgColor: '#5f1a28', name: 'D' },
  'di': { color: '#ba595e', bgColor: '#5f1a28', name: 'D Interface' },
  
  // Nim
  'nim': { color: '#ffc200', bgColor: '#4d3d0a', name: 'Nim' },
  'nims': { color: '#ffc200', bgColor: '#4d3d0a', name: 'Nim Script' },
  'nimble': { color: '#ffc200', bgColor: '#4d3d0a', name: 'Nimble' },
  
  // Zig
  'zig': { color: '#ec915c', bgColor: '#5f2d1a', name: 'Zig' },
  
  // V
  'v': { color: '#5d87bd', bgColor: '#1a2840', name: 'V' },
  'vsh': { color: '#5d87bd', bgColor: '#1a2840', name: 'V Script' },
  
  // Pony
  'pony': { color: '#ff69b4', bgColor: '#5f1a3d', name: 'Pony' },
  
  // Idris
  'idr': { color: '#b30000', bgColor: '#4d0a0a', name: 'Idris' },
  'lidr': { color: '#b30000', bgColor: '#4d0a0a', name: 'Idris Literate' },
  
  // PureScript
  'purs': { color: '#1d222d', bgColor: '#1a1a2d', name: 'PureScript' },
  
  // ReasonML
  're': { color: '#ff5847', bgColor: '#5f1a1f', name: 'Reason' },
  'rei': { color: '#ff5847', bgColor: '#5f1a1f', name: 'Reason Interface' },
  
  // E
  'e': { color: '#ccce35', bgColor: '#4d4d1f', name: 'E' },
  
  // Factor
  'factor': { color: '#6767cf', bgColor: '#2d2d5f', name: 'Factor' },
  
  // Forth
  'forth': { color: '#341708', bgColor: '#4d0f0a', name: 'Forth' },
  'fth': { color: '#341708', bgColor: '#4d0f0a', name: 'Forth' },
  '4th': { color: '#341708', bgColor: '#4d0f0a', name: 'Forth' },
  
  // J
  'j': { color: '#9EEDFF', bgColor: '#1a4d5f', name: 'J' },
  
  // K
  'k': { color: '#9F3FFF', bgColor: '#3d1a5f', name: 'K' },
  
  // Q
  'q': { color: '#0040cd', bgColor: '#1a285f', name: 'Q' },
  
  // REXX
  'rexx': { color: '#d90e09', bgColor: '#5f0a0a', name: 'REXX' },
  
  // Smalltalk
  'smalltalk': { color: '#596706', bgColor: '#3d3d0a', name: 'Smalltalk' },
  'st': { color: '#596706', bgColor: '#3d3d0a', name: 'Smalltalk' },
  
  // Tcl
  'tcl': { color: '#e4cc98', bgColor: '#5f4d2d', name: 'Tcl' },
  'tk': { color: '#e4cc98', bgColor: '#5f4d2d', name: 'Tcl/Tk' },
  
  // AutoHotkey
  'ahk': { color: '#6594b9', bgColor: '#1a3a4d', name: 'AutoHotkey' },
  
  // AutoIt
  'au3': { color: '#1C3552', bgColor: '#1a2840', name: 'AutoIt' },
  
  // AppleScript
  'applescript': { color: '#101F1F', bgColor: '#1a1a1a', name: 'AppleScript' },
  'scpt': { color: '#101F1F', bgColor: '#1a1a1a', name: 'AppleScript' },
  
  // PowerShell
  'ps1': { color: '#012456', bgColor: '#1a1a4d', name: 'PowerShell' },
  'psm1': { color: '#012456', bgColor: '#1a1a4d', name: 'PowerShell Module' },
  'psd1': { color: '#012456', bgColor: '#1a1a4d', name: 'PowerShell Data' },
  
  // Batch
  'bat': { color: '#C1F12E', bgColor: '#3d4a1f', name: 'Batch' },
  'cmd': { color: '#C1F12E', bgColor: '#3d4a1f', name: 'Batch' },
  
  // Fish
  'fish': { color: '#4aae47', bgColor: '#1a4d25', name: 'Fish' },
  
  // Zsh
  'zsh': { color: '#89e051', bgColor: '#2d3d1f', name: 'Zsh' },
  
  // Bash
  'bash': { color: '#89e051', bgColor: '#2d3d1f', name: 'Bash' },
  
  // Shell
  'sh': { color: '#89e051', bgColor: '#2d3d1f', name: 'Shell' },
  
  // F#
  'fsharp': { color: '#b845fc', bgColor: '#3d1d5f', name: 'F#' },
  'fs': { color: '#b845fc', bgColor: '#3d1d5f', name: 'F#' },
  'fsi': { color: '#b845fc', bgColor: '#3d1d5f', name: 'F#' },
  'fsx': { color: '#b845fc', bgColor: '#3d1d5f', name: 'F#' },
  'fsproj': { color: '#b845fc', bgColor: '#3d1d5f', name: 'F# Project' },
  
  // OCaml
  'ml': { color: '#ef7a08', bgColor: '#5f3d0a', name: 'OCaml' },
  'mli': { color: '#ef7a08', bgColor: '#5f3d0a', name: 'OCaml' },
  'ml4': { color: '#ef7a08', bgColor: '#5f3d0a', name: 'OCaml' },
  'mll': { color: '#ef7a08', bgColor: '#5f3d0a', name: 'OCamllex' },
  'mly': { color: '#ef7a08', bgColor: '#5f3d0a', name: 'Menhir' },
  
  // Haskell
  'haskell': { color: '#5e5086', bgColor: '#2d2540', name: 'Haskell' },
  'hs': { color: '#5e5086', bgColor: '#2d2540', name: 'Haskell' },
  'lhs': { color: '#5e5086', bgColor: '#2d2540', name: 'Literate Haskell' },
  
  // Elm
  'elm': { color: '#60B5CC', bgColor: '#1a4a5f', name: 'Elm' },
  
  // Purescript
  'purs': { color: '#1d222d', bgColor: '#1a1a2d', name: 'PureScript' },
  
  // ReasonML
  're': { color: '#ff5847', bgColor: '#5f1a1f', name: 'Reason' },
  'rei': { color: '#ff5847', bgColor: '#5f1a1f', name: 'Reason Interface' },
  
  // Gleam
  'gleam': { color: '#ffaff3', bgColor: '#5f1a4d', name: 'Gleam' },
  
  // Unison
  'u': { color: '#ed207b', bgColor: '#5f0a3d', name: 'Unison' },
  
  // Roc
  'roc': { color: '#ff8a3d', bgColor: '#5f2d1a', name: 'Roc' },
  
  // Dark
  'dark': { color: '#141414', bgColor: '#1a1a1a', name: 'Dark' },
  
  // Carp
  'carp': { color: '#000000', bgColor: '#1a1a1a', name: 'Carp' },
  
  // Janet
  'janet': { color: '#000000', bgColor: '#1a1a1a', name: 'Janet' },
  
  // Nu
  'nu': { color: '#000000', bgColor: '#1a1a1a', name: 'Nu' },
  
  // Default color for unknown languages
  'default': { color: '#858585', bgColor: '#2d2d2d', name: 'Unknown' }
};

/**
 * Gets the color information for a given file extension
 * @param {string} extension - File extension
 * @returns {Object} Color information including color, bgColor, and name
 */
function getLanguageColor(extension) {
  const ext = extension.toLowerCase();
  return languageColors[ext] || languageColors.default;
}

/**
 * Creates a chalk-style color function from a hex color
 * @param {string} hexColor - Hex color code
 * @returns {Function} Function that returns text wrapped in ANSI color codes
 */
function createColorFunction(hexColor) {
  return function(text) {
    return `\x1b[38;2;${parseInt(hexColor.substr(1, 2), 16)};${parseInt(hexColor.substr(3, 2), 16)};${parseInt(hexColor.substr(5, 2), 16)}m${text}\x1b[0m`;
  };
}

/**
 * Creates a chalk-style background color function from a hex color
 * @param {string} hexColor - Hex color code
 * @returns {Function} Function that returns text wrapped in ANSI background color codes
 */
function createBgColorFunction(hexColor) {
  return function(text) {
    return `\x1b[48;2;${parseInt(hexColor.substr(1, 2), 16)};${parseInt(hexColor.substr(3, 2), 16)};${parseInt(hexColor.substr(5, 2), 16)}m${text}\x1b[0m`;
  };
}

/**
 * Gets color functions for a language
 * @param {string} extension - File extension
 * @returns {Object} Object with color and bgColor functions
 */
function getLanguageColors(extension) {
  const colorInfo = getLanguageColor(extension);
  return {
    color: createColorFunction(colorInfo.color),
    bgColor: createBgColorFunction(colorInfo.bgColor),
    hexColor: colorInfo.color,
    hexBgColor: colorInfo.bgColor,
    name: colorInfo.name
  };
}

module.exports = {
  languageColors,
  getLanguageColor,
  getLanguageColors,
  createColorFunction,
  createBgColorFunction
};