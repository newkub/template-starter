# Turborepo Template

A monorepo template with Turborepo containing multiple applications:

- **nuxt** - Nuxt 4 web application
- **next** - Next.js 15 web application
- **web-extensions** - Browser extensions (Chrome/Firefox)
- **desktop** - Desktop application (Tauri + Nuxt)
- **vscode-extensions** - VSCode extension

## Getting Started

### Prerequisites

- Bun >= 1.3.5
- Node.js (for some dependencies)

### Installation

```bash
bun install
```

### Initial Setup

Run the prepare command to set up development tools:

```bash
bun run prepare
```

This will prompt you to select which tools to install:
- **Vitest** - Testing framework with coverage
- **Oxlint** - Fast JavaScript/TypeScript linter
- **Dprint** - Code formatter
- **Lefthook** - Git hooks manager

You can select individual tools or choose "All tools" to install everything.

### Development

Run all apps in development mode:

```bash
bun run dev
```

Run specific app:

```bash
# Nuxt
cd apps/nuxt && bun run dev

# Next.js
cd apps/next && bun run dev

# Web Extensions
cd apps/web-extensions && bun run dev

# Desktop
cd apps/desktop && bun run tauri:dev

# VSCode Extension
cd apps/vscode-extensions && bun run dev
```

### Build

Build all apps:

```bash
bun run build
```

Build specific app:

```bash
cd apps/<app-name> && bun run build
```

### Package Extensions

```bash
# Web Extensions
cd apps/web-extensions && bun run package

# VSCode Extension
cd apps/vscode-extensions && bun run package
```

## Project Structure

```
.
├── apps/
│   ├── nuxt/              # Nuxt 4 web app
│   ├── next/              # Next.js 15 web app
│   ├── web-extensions/    # Browser extensions
│   ├── desktop/           # Desktop app (Tauri)
│   └── vscode-extensions/ # VSCode extension
├── packages/
│   └── shared/            # Shared code
├── package.json           # Root package.json
├── turbo.json             # Turborepo config
└── tsconfig.json          # TypeScript config
```

## Scripts

- `dev` - Run all apps in dev mode
- `build` - Build all apps
- `lint` - Lint all apps
- `test` - Test all apps
- `format` - Format all apps
- `verify` - Run format, lint, test, and build
- `watch` - Watch mode for development

## Technology Stack

### Nuxt App
- Nuxt 4
- UnoCSS
- Pinia
- VueUse
- Nuxt Icon

### Next.js App
- Next.js 15
- React 19
- TailwindCSS
- VueUse

### Web Extensions
- WXT
- Reactive VSCode

### Desktop App
- Tauri 2
- Nuxt 4
- UnoCSS
- Pinia

### VSCode Extension
- VSCode API
- Reactive VSCode
- TypeScript

## Development Tools

### Vitest
- Testing framework with built-in coverage
- Type checking support
- UI mode for interactive testing

### Oxlint
- Fast JavaScript/TypeScript linter
- Type-aware linting
- Auto-fix support

### Dprint
- Fast code formatter
- Support for TypeScript, JSON, Markdown
- Configurable formatting rules

### Lefthook
- Git hooks manager
- Pre-commit hooks for linting and formatting
- Pre-push hooks for build verification
