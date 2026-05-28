# Templates

**Modern project templates with best practices and comprehensive tooling**

A collection of production-ready project templates following modern development workflows. Managed with Moonrepo for efficient monorepo orchestration across multiple applications and shared packages.

[![Bun](https://img.shields.io/badge/Bun-1.1.38+-ff69b4?logo=bun)](https://bun.sh)
[![Moonrepo](https://img.shields.io/badge/Moonrepo-2.2.6-blue?logo=moonrepo)](https://moonrepo.dev)

---

## Features

| Icon | Feature | Description | Benefit | Usage |
|------|---------|-------------|---------|-------|
| <img src="https://api.iconify.design/lucide:layers.svg?color=%23818cf8" width="18" height="18"> | **Monorepo Architecture** | Moonrepo-powered workspace with shared tasks and configuration | Consistent tooling across all projects | `moon run <task>` |
| <img src="https://api.iconify.design/lucide:zap.svg?color=%23f59e0b" width="18" height="18"> | **Fast Build System** | Bun runtime with intelligent caching | 10x faster builds with cache hits | `moon run build --affected` |
| <img src="https://api.iconify.design/lucide:shield-check.svg?color=%2310b981" width="18" height="18"> | **Quality Assurance** | Automated linting, type checking, and testing | Catch issues before they reach production | `moon run verify` |
| <img src="https://api.iconify.design/lucide:git-branch.svg?color=%236366f1" width="18" height="18"> | **Git Hooks** | Pre-commit and pre-push automation | Enforce code quality standards | `bun run prepare` |
| <img src="https://api.iconify.design/lucide:package.svg?color=%23ec4899" width="18" height="18"> | **Package Management** | Workspaces with shared dependencies | Reduced duplication and consistent versions | `bun install` |
| <img src="https://api.iconify.design/lucide:layout.svg?color=%238b5cf6" width="18" height="18"> | **Multiple Templates** | 15+ project templates for various use cases | Start projects faster with best practices | `bun add @wrikka/<template>` |

---

## Key Concepts

> Learn the core concepts and principles behind this template collection

<details>
<summary>Key Concepts</summary>

| Icon | Concept | Benefit |
|------|---------|---------|
| <img src="https://api.iconify.design/lucide:database.svg?color=%236366f1" width="18" height="18"> | **Workspace Orchestration** | Centralized task management across all projects |
| <img src="https://api.iconify.design/lucide:cpu.svg?color=%238b5cf6" width="18" height="18"> | **Task Caching** | Intelligent caching for faster builds |
| <img src="https://api.iconify.design/lucide:git-commit.svg?color=%2310b981" width="18" height="18"> | **Affected Tasks** | Run tasks only on changed projects |
| <img src="https://api.iconify.design/lucide:settings.svg?color=%23f59e0b" width="18" height="18"> | **Toolchain Management** | Consistent Node.js and Bun versions |
| <img src="https://api.iconify.design/lucide:file-code.svg?color=%23ec4899" width="18" height="18"> | **Shared Configuration** | Reusable task definitions |
| <img src="https://api.iconify.design/lucide:workflow.svg?color=%23818cf8" width="18" height="18"> | **Task Dependencies** | Automatic task ordering and execution |

</details>

<details>
<summary>Principles</summary>

| Icon | Principle | User Impact |
|------|-----------|-------------|
| <img src="https://api.iconify.design/lucide:rocket.svg?color=%23f59e0b" width="18" height="18"> | **Performance First** | Faster development cycles with caching |
| <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" width="18" height="18"> | **Quality Gates** | Automated quality checks prevent bad code |
| <img src="https://api.iconify.design/lucide:repeat.svg?color=%236366f1" width="18" height="18"> | **Consistency** | Uniform tooling across all projects |
| <img src="https://api.iconify.design/lucide:sliders.svg?color=%238b5cf6" width="18" height="18"> | **Flexibility** | Easy to customize per project needs |
| <img src="https://api.iconify.design/lucide:book-open.svg?color=%23ec4899" width="18" height="18"> | **Documentation** | Clear instructions and examples |
| <img src="https://api.iconify.design/lucide:users.svg?color=%23818cf8" width="18" height="18"> | **Team Collaboration** | Shared workflows for teams |

</details>

<details>
<summary>FAQs</summary>

| Question | Answer |
|----------|--------|
| What is Moonrepo? | A task orchestration tool for monorepos with caching and dependency management |
| How do I add a new template? | Create a new directory in `templates/` with a `moon.yml` configuration |
| Can I use different Node versions? | Yes, configure in `.moon/toolchains.yml` per project |
| How does caching work? | Moonrepo hashes inputs and caches outputs for deterministic tasks |
| What if a task fails? | Check the error output and run with `--verbose` flag for details |

</details>

<details>
<summary>Best Practices</summary>

**For Users:**

- Always run `moon check` before committing to ensure configuration is valid
- Use `--affected` flag to run tasks only on changed projects
- Keep dependencies updated with `bun install`
- Review git hook output before pushing
- Use the template that best matches your use case
- Read the template-specific README for detailed instructions

**For Developers:**

- Follow the task dependency chain: format → lint → typecheck → test → build
- Use persistent tasks for dev servers (dev, watch)
- Configure cache appropriately for each task type
- Keep moon.yml configurations consistent across projects
- Test tasks locally before pushing
- Document custom tasks in project README

</details>

---

## Quick Start

Get started with the templates collection in minutes:

1. **Clone the repository**
   ```bash
   git clone https://github.com/wrikka/templates.git
   cd templates
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Setup git hooks**
   ```bash
   bun run prepare
   ```

4. **Verify installation**
   ```bash
   moon check
   ```

5. **Run your first task**
   ```bash
   moon run :prepare
   ```

---

## Usage

### Moonrepo CLI

Run tasks across the entire workspace or specific projects:

```bash
# Run task for all projects
moon run build

# Run task for specific project
moon run templates/bun-lib:build

# Run task for affected projects only
moon run build --affected

# Run task with verbose output
moon run build --verbose

# Check workspace configuration
moon check

# Run CI pipeline
moon ci
```

### Available Tasks

All projects share these common tasks defined in `.moon/tasks/all.yml`:

```bash
# Install dependencies
moon run prepare

# Format code
moon run format

# Lint code
moon run lint

# Type check code
moon run typecheck

# Run tests
moon run test

# Build projects
moon run build

# Full verification (lint + typecheck + test)
moon run verify

# Start development server
moon run dev

# Watch for changes
moon run watch
```

### Template Installation

Install individual templates for new projects:

```bash
# Install a template
bun add @wrikka/bun-lib

# Install specific version
bun add @wrikka/next@latest

# Install multiple templates
bun add @wrikka/nuxt @wrikka/vite-react
```

### Workspace Management

Manage workspaces and projects:

```bash
# List all projects
moon project list

# Show project details
moon project info templates/bun-lib

# Sync VCS hooks
moon sync
```

---

## Reference

### Templates

| Template | Description | Used In |
|----------|-------------|---------|
| bun-lib | Bun library template with benchmarks and examples | Library projects |
| moonrepo | Moonrepo monorepo template with workspace configuration | Monorepo projects |
| next | Next.js application with App Router and TypeScript | Web applications |
| node-lib | Node.js library template with TypeScript | Library projects |
| nuxt | Nuxt 3 application with server-side rendering | Web applications |
| rust-clean | Rust Clean Architecture template with Vertical Slice Architecture | Rust applications |
| rust-layered | Rust Layered Architecture template for medium-scale systems | Rust applications |
| slidev | Slidev presentation template with developer-friendly features | Presentations |
| tauri-nuxt | Tauri desktop application with Nuxt frontend | Desktop applications |
| turborepo | Turborepo monorepo template (legacy) | Legacy monorepo projects |
| tutorial | Tutorial template for learning purposes | Educational projects |
| vite-react | Vite + React application with TypeScript | Web applications |
| vitepress | VitePress documentation site with UnoCSS | Documentation sites |
| vscode-vue | VS Code extension with Vue 3 | VS Code extensions |
| web-extension-wxt-nuxt | Web extension with WXT and Nuxt | Browser extensions |

### Configuration

| File | Purpose | Location |
|------|---------|----------|
| `workspace.yml` | Workspace settings and VCS hooks | `.moon/workspace.yml` |
| `toolchains.yml` | Toolchain versions (Node, Bun) | `.moon/toolchains.yml` |
| `all.yml` | Shared task definitions | `.moon/tasks/all.yml` |
| `moon.yml` | Project-specific configuration | Each project root |

### Options

**Moonrepo CLI Options:**

| Option | Description | Example |
|--------|-------------|---------|
| `--affected` | Run tasks only on changed projects | `moon run build --affected` |
| `--verbose` | Show detailed output | `moon run build --verbose` |
| `--dry-run` | Show what would run without executing | `moon run build --dry-run` |
| `--force` | Force task execution, ignore cache | `moon run build --force` |

**Task Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `cache` | Enable/disable task caching | Varies by task |
| `persistent` | Keep task running for dev servers | false |
| `dependsOn` | Task dependencies | Defined in task config |

### Commands

**Workspace Commands:**

```bash
# Check configuration
moon check

# Sync VCS hooks
moon sync

# Run CI pipeline
moon ci

# List projects
moon project list
```

**Task Commands:**

```bash
# Run specific task
moon run <task>

# Run task for specific project
moon run <project>:<task>

# Run multiple tasks
moon run :format :lint
```

**Development Commands:**

```bash
# Start development server
moon run dev

# Watch for changes
moon run watch

# Build for production
moon run build
```

---

## Notes

[!TIP]
Use `--affected` flag to run tasks only on changed projects for faster development cycles.

[!IMPORTANT]
Always run `moon check` after modifying configuration files to ensure validity.

[!WARNING]
Never commit `.moon/cache/` directory as it contains build artifacts and should be gitignored.

[!CAUTION]
Be careful when using `--force` flag as it bypasses cache and may slow down builds.

---

## History

[![Star History Chart](https://api.star-history.com/svg?repos=wrikka/templates&type=Date)](https://star-history.com/#wrikka/templates&Date)
