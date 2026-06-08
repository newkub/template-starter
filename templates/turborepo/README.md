# Turborepo Monorepo Template

**A multi-app monorepo with Turborepo, Nuxt, Next.js, Tauri, WXT, and Reactive VSCode**

A starting point for a workspace that ships several apps from one repository. It comes with a Nuxt web app, a Next.js web app, a Tauri desktop app, a WXT web extension, and a Reactive VSCode extension, all sharing a single `packages/shared/` workspace and orchestrated by Turborepo.

[![Turborepo](https://img.shields.io/badge/Turborepo-2.9.16+-ef4444?logo=turborepo)](https://turbo.build)
[![Bun](https://img.shields.io/badge/Bun-1.3.14+-fbf0df?logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178c6?logo=typescript)](https://www.typescriptlang.org)

[Quick Start](#quick-start) · [Usage](#usage) · [Reference](#reference) · [Notes](#notes)

---

## Features

| Icon | Feature | Description | Benefit | Usage |
|------|---------|-------------|---------|-------|
| <img src="https://api.iconify.design/lucide:layers.svg?color=%23ef4444" width="18" height="18"> | **Turborepo** | High-performance build system with task caching | One command runs every project in topological order | `bun run dev` |
| <img src="https://api.iconify.design/lucide:zap.svg?color=%23fbf0df" width="18" height="18"> | **Bun Workspace** | Single install for every app and package | One lockfile, one cache, no duplication | `bun install` |
| <img src="https://api.iconify.design/lucide:globe.svg?color=%2300dc82" width="18" height="18"> | **Nuxt Web App** | Vue 3 full-stack with SSR | Ship a website from the same repo as the desktop and extensions | `cd apps/nuxt && bun run dev` |
| <img src="https://api.iconify.design/lucide:layout.svg?color=%23000000" width="18" height="18"> | **Next.js Web App** | React 19 with App Router | SEO-friendly React app | `cd apps/next && bun run dev` |
| <img src="https://api.iconify.design/lucide:monitor.svg?color=%23ffc131" width="18" height="18"> | **Tauri Desktop App** | Nuxt frontend with Rust backend | Cross-platform desktop with a small bundle | `cd apps/desktop && bun run tauri:dev` |
| <img src="https://api.iconify.design/lucide:box.svg?color=%236366f1" width="18" height="18"> | **WXT + Reactive VSCode** | Cross-browser and cross-IDE extensions | One mental model for every extension target | `cd apps/web-extensions && bun run dev` |

---

## Key Concepts

> [!NOTE]
> How the workspace is wired together

<details>
<summary><strong>Key Concepts</strong></summary>

| Icon | Concept | Benefit |
|------|---------|---------|
| <img src="https://api.iconify.design/lucide:cpu.svg?color=%236366f1" width="18" height="18"> | **Polyglot Apps** | One repo, many targets: web, desktop, browser, IDE |
| <img src="https://api.iconify.design/lucide:shield.svg?color=%238b5cf6" width="18" height="18"> | **Type Safety** | Strict TypeScript across every app and the shared package |
| <img src="https://api.iconify.design/lucide:layout.svg?color=%2310b981" width="18" height="18"> | **Shared Package** | `@workspace/shared` exports types and utils every app can import |
| <img src="https://api.iconify.design/lucide:git-branch.svg?color=%23f59e0b" width="18" height="18"> | **Task Pipeline** | `turbo.json` declares `format → lint → test → build → verify` with proper `^` cross-project ordering |

</details>

<details>
<summary><strong>Principles</strong></summary>

| Icon | Principle | User Impact |
|------|-----------|-------------|
| <img src="https://api.iconify.design/lucide:rocket.svg?color=%23f59e0b" width="18" height="18"> | **Performance First** | Turborepo caches task outputs; cache hits skip the work entirely |
| <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" width="18" height="18"> | **Type Safety** | `tsgo --noEmit` covers every app and the shared package |
| <img src="https://api.iconify.design/lucide:repeat.svg?color=%236366f1" width="18" height="18"> | **Consistency** | Same scripts and Biome rules across every project |
| <img src="https://api.iconify.design/lucide:book-open.svg?color=%23ec4899" width="18" height="18"> | **Documentation** | Each app has its own folder and a known set of scripts |

</details>

<details>
<summary><strong>FAQs</strong></summary>

| Question | Answer |
|----------|--------|
| What is Turborepo? | A build system that runs tasks across a monorepo with caching and dependency ordering |
| How do I add a new app? | Drop a directory under `apps/`, give it a `package.json` that declares `workspaces`-compatible name, and pick a framework |
| How do I share code? | Add it to `packages/shared/`. Every workspace can import `@workspace/shared` |
| What is `cli` in the root dependencies? | A workspace alias for the monorepo's own CLI, used in `prepare` to bootstrap the project |

</details>

<details>
<summary><strong>Best Practices</strong></summary>

**For Users**

- Run `bun run verify` before committing; it runs lint, typecheck, and tests in order
- Use `@workspace/shared` for any type or helper that crosses app boundaries
- Use `workspace:*` for internal dependencies, never a published version
- When you change the shared package, re-run `bun install` so other apps pick it up

**For Maintainers**

- Stay on the shared task chain: do not introduce a second linter or formatter
- Use `ast-grep scan` to keep patterns consistent across apps
- Keep each app small and focused on one target
- Define app dependencies in `turbo.json` so Turborepo can order them

</details>

---

## Quick Start

1. **Scaffold the monorepo into a fresh directory**
   ```bash
   templates use turborepo -o ./my-monorepo
   cd my-monorepo
   ```

2. **Bootstrap the workspace**
   ```bash
   bun run prepare
   ```

3. **Install dependencies**
   ```bash
   bun install
   ```

4. **Run every app in dev mode**
   ```bash
   bun run dev
   ```

5. **Build every app**
   ```bash
   bun run build
   ```

---

## Usage

### Turborepo

Turborepo runs the same task name in every project, in the order declared by `turbo.json`. The `^` prefix means "run in dependencies first":

```bash
# Run a task in every project
bun run dev
bun run build
bun run test

# Watch mode across every project
bun run watch

# Lint and format the whole monorepo
bun run lint
bun run format

# Run the full verify pipeline
bun run verify

# Inspect tasks and dependencies
bun run devtools

# Scan for code patterns with ast-grep
bun run scan

# Audit the dependency tree
bun run check:modules
```

### Per-App

Drop into an individual app to run framework-specific commands:

```bash
# Nuxt web app
cd apps/nuxt && bun run dev

# Next.js web app
cd apps/next && bun run dev

# Tauri desktop app
cd apps/desktop && bun run tauri:dev

# Web extension (WXT)
cd apps/web-extensions && bun run dev

# VSCode extension
cd apps/vscode-extensions && bun run watch
```

### Quality Checks

Every project supports the same quality pipeline:

```bash
# Lint every project
bun run lint

# Format every project
bun run format

# Run tests in every project
bun run test

# Run tests with coverage
bun run test:coverage

# Run tests in interactive UI mode
bun run test:ui

# Run lint, typecheck, and tests together
bun run verify
```

### Extensions

The web extension and VSCode extension projects ship packaging scripts:

```bash
# Web extension
cd apps/web-extensions
bun run dev                 # Dev mode
bun run build               # Build for Chrome
bun run build:firefox       # Build for Firefox
bun run zip                 # Package for Chrome
bun run zip:firefox         # Package for Firefox
bun run publish             # Publish to the relevant store

# VSCode extension
cd apps/vscode-extensions
bun run dev                 # Dev mode
bun run build               # Build the extension bundle
bun run package             # Produce a .vsix
bun run publish             # Publish to the marketplace
```

---

## Reference

### Project Structure

| Path | Purpose |
|------|---------|
| `apps/desktop/` | Tauri desktop application (Nuxt + Rust) |
| `apps/next/` | Next.js 15 web application |
| `apps/nuxt/` | Nuxt 4 web application |
| `apps/vscode-extensions/` | Reactive VSCode extension |
| `apps/web-extensions/` | WXT cross-browser extension |
| `packages/shared/` | Types, utils, and constants shared by every app |
| `turbo.json` | Turborepo task pipeline |
| `lefthook.yml` | Git hooks configuration |
| `vitest.config.ts` | Root Vitest configuration |
| `.oxlintrc.json` | Oxlint configuration |
| `dprint.json` | dprint formatting rules |

### Applications

| App | Framework | Description |
|-----|-----------|-------------|
| `@workspace/desktop` | Tauri + Nuxt 4 | Cross-platform desktop app with a Rust backend |
| `@workspace/next` | Next.js 15 + React 19 | SEO-friendly web app with the App Router |
| `@workspace/nuxt` | Nuxt 4 | Full-stack Vue app with UnoCSS and Pinia |
| `@workspace/vscode-extensions` | Reactive VSCode | Type-safe VSCode extension |
| `@workspace/web-extensions` | WXT | Cross-browser web extension |
| `@workspace/shared` | TypeScript | Types, utils, and constants shared by every app |

### Turborepo Tasks

Defined in `turbo.json` and run for every project that declares them in `package.json`:

| Task | Depends On | Cacheable | Persistent |
|------|------------|-----------|------------|
| `watch` | — | no | yes |
| `dev` | — | no | yes |
| `prepare` | — | no | no |
| `format` | `^prepare` | yes (by default) | no |
| `lint` | `^format` | no | no |
| `test` | `^lint` | yes | no |
| `build` | `^lint` | no | no |
| `verify` | `^test` | no | no |
| `preview` | `^verify` | no | no |

### Configuration

| File | Purpose | Location |
|------|---------|----------|
| `package.json` | Workspace list and root scripts | `./package.json` |
| `turbo.json` | Task pipeline and global dependencies | Root |
| `tsconfig.json` | Strict TypeScript settings | Root |
| `vitest.config.ts` | Vitest configuration | Root |
| `lefthook.yml` | Git hooks | Root |
| `.oxlintrc.json` | Oxlint rules | Root |
| `dprint.json` | dprint rules | Root |
| `.env.example` | Environment variable starter | Root |

### Turborepo Options

| Option | Description | Example |
|--------|-------------|---------|
| `--filter` | Run only projects matching a glob | `turbo run build --filter=@workspace/next` |
| `--affected` | Run tasks only on projects changed since the base branch | `turbo run test --affected` |
| `--force` | Ignore the cache and re-run everything | `turbo run build --force` |
| `--ui=tui` | Open the interactive TUI | `bun run watch` (uses `--ui=tui`) |
| `--parallel` | Run tasks across projects in parallel | `turbo run lint --parallel` |

---

## Notes

> [!TIP]
> Use `bun run dev` once to launch every app; the dependency graph in `turbo.json` decides the order.

> [!IMPORTANT]
> Run `bun run verify` before opening a PR. It runs lint, typecheck, and tests in order; the first failing step is the one to fix.

> [!WARNING]
> Never commit `node_modules`, `dist/`, or framework build outputs like `.next/`, `.nuxt/`, or `out/`. They are reproducible from `package.json` and `bun install`.

> [!CAUTION]
> If you add a dependency that an app needs at runtime, declare it in that app's `dependencies`, not in the root `devDependencies`.
