# VS Code Extension Template

**A VS Code extension template with Reactive VSCode, Tsdown, and Biome**

A starting point for VS Code extensions that use the Reactive VSCode framework. The `package.json` declares a minimal `Your Extension` manifest with one `helloWorld` command, the `tsdown.config.ts` builds a CommonJS bundle, and `vsce` packages the result into a `.vsix`.

[![VS Code](https://img.shields.io/badge/VS_Code-1.118+-007acc?logo=visual-studio-code)](https://code.visualstudio.com)
[![Reactive VSCode](https://img.shields.io/badge/Reactive-VSCode-0.2+-007acc?logo=visual-studio-code)](https://kermanx.github.io/reactive-vscode/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178c6?logo=typescript)](https://www.typescriptlang.org)

[Quick Start](#quick-start) · [Usage](#usage) · [Reference](#reference) · [Notes](#notes)

---

## Features

| Icon | Feature | Description | Benefit | Usage |
|------|---------|-------------|---------|-------|
| <img src="https://api.iconify.design/lucide:code.svg?color=%23007acc" width="18" height="18"> | **Reactive VSCode** | Reactive framework for type-safe extensions | Compose extension behaviour like any other Vue/React app | `import { registerCommand } from "reactive-vscode"` |
| <img src="https://api.iconify.design/lucide:package.svg?color=%23f59e0b" width="18" height="18"> | **Tsdown** | Fast TypeScript bundler | Optimised CommonJS bundle ready for VS Code | `bun run build` |
| <img src="https://api.iconify.design/lucide:shield-check.svg?color=%2310b981" width="18" height="18"> | **Strict TypeScript** | TSGO type checking with `tsgo --noEmit` | Catch errors before they ship | `bun run typecheck` |
| <img src="https://api.iconify.design/lucide:code-2.svg?color=%23ec4899" width="18" height="18"> | **Biome** | Single tool for lint and format | Fast, opinionated, no config drift | `bun run lint` |
| <img src="https://api.iconify.design/lucide:test-tube.svg?color=%23f97316" width="18" height="18"> | **Vitest** | Unit tests with watch mode | Verify the extension's behaviour | `bun run test` |
| <img src="https://api.iconify.design/lucide:package.svg?color=%238b5cf6" width="18" height="18"> | **VSCE** | VS Code Extension Manager | Package and publish to the marketplace | `bun run package` |

---

## Key Concepts

> [!NOTE]
> How Reactive VSCode shapes an extension

<details>
<summary><strong>Key Concepts</strong></summary>

| Icon | Concept | Benefit |
|------|---------|---------|
| <img src="https://api.iconify.design/lucide:cpu.svg?color=%236366f1" width="18" height="18"> | **Reactive Patterns** | Model extension state as React/Vue-style reactivity |
| <img src="https://api.iconify.design/lucide:shield.svg?color=%238b5cf6" width="18" height="18"> | **Type Safety** | Strict TypeScript covers commands, configs, and the API surface |
| <img src="https://api.iconify.design/lucide:layout.svg?color=%2310b981" width="18" height="18"> | **Command API** | Register and handle VS Code commands in a single source of truth |
| <img src="https://api.iconify.design/lucide:git-branch.svg?color=%23f59e0b" width="18" height="18"> | **Hot Reload** | `bun --watch` rebuilds on every save during development |

</details>

<details>
<summary><strong>Principles</strong></summary>

| Icon | Principle | User Impact |
|------|-----------|-------------|
| <img src="https://api.iconify.design/lucide:rocket.svg?color=%23f59e0b" width="18" height="18"> | **Performance First** | Tsdown builds a tiny CommonJS bundle that loads fast in VS Code |
| <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" width="18" height="18"> | **Type Safety** | Errors surface at compile time, never at activation |
| <img src="https://api.iconify.design/lucide:repeat.svg?color=%236366f1" width="18" height="18"> | **Consistency** | Same scripts and options across the monorepo |
| <img src="https://api.iconify.design/lucide:book-open.svg?color=%23ec4899" width="18" height="18"> | **Documentation** | Each command and setting is documented in `package.json` |

</details>

<details>
<summary><strong>FAQs</strong></summary>

| Question | Answer |
|----------|--------|
| What is Reactive VSCode? | A reactive framework that wraps the VS Code API in composables and commands, the way Pinia wraps Vue's state |
| How do I add a command? | Add a `contributes.commands` entry in `package.json`, then register a handler in `src/extension.ts` with `registerCommand` |
| How do I publish? | `bun run package` produces a `.vsix`, `bun run publish` uploads it to the marketplace |
| How do I debug? | Press `F5` in VS Code to launch the extension host with the extension loaded |

</details>

<details>
<summary><strong>Best Practices</strong></summary>

**For Users**

- Run `bun run verify` before committing; it runs lint, typecheck, and tests in order
- Follow the VS Code UX guidelines for consistent UI
- Test the extension in multiple VS Code versions before each release
- Use semantic versioning for releases
- Document every command and setting in `package.json` so they appear in the settings UI

**For Maintainers**

- Stay on the shared task chain: do not introduce a second linter or formatter
- Use `ast-grep scan` to keep patterns consistent
- Keep extension logic in `src/extension.ts` (or split into modules under `src/`)
- Use reactive patterns for state instead of mutable globals

</details>

---

## Quick Start

1. **Scaffold the extension into a fresh directory**
   ```bash
   templates use vscode-vue -o ./my-extension
   cd my-extension
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Open the project in VS Code**
   ```bash
   code .
   ```

4. **Start the watch build**
   ```bash
   bun run watch
   ```

5. **Debug the extension** by pressing `F5` in VS Code to launch the extension host

---

## Usage

### Development

The scripts in `package.json` cover the day-to-day loop:

```bash
# Watch mode: rebuild on every change
bun run watch

# Run the source file through Bun
bun run dev

# Build a CommonJS bundle into dist/
bun run build

# Format every file with Biome
bun run format

# Lint every file with Biome
bun run lint

# Type-check the project
bun run typecheck

# Run the Vitest suite
bun run test

# Run lint, typecheck, and tests together
bun run verify

# Package the extension into a .vsix
bun run package

# Publish to the VS Code marketplace
bun run publish

# Run the full CI pipeline
bun run ci

# Scan for code patterns with ast-grep
bun run scan
```

### Extension Commands

The default manifest in `package.json` declares one command and one setting. Replace the placeholder name (`your-extension`) and the command ID with your own:

```json
{
  "contributes": {
    "commands": [
      {
        "command": "your-extension.helloWorld",
        "title": "Hello World"
      }
    ],
    "configuration": {
      "title": "Your Extension",
      "properties": {
        "your-extension.message": {
          "type": "string",
          "default": "Hello World",
          "description": "The message to show in the notification"
        }
      }
    }
  }
}
```

### Command Handlers

Register handlers with `registerCommand` in `src/extension.ts`:

```typescript
import { registerCommand, useConfig } from "reactive-vscode";
import { commands, window } from "vscode";

const config = useConfig("your-extension");

export const activate = () => {
  registerCommand("your-extension.helloWorld", () => {
    const message = config.message || "Hello World";
    window.showInformationMessage(message);
  });
};
```

### Publishing

```bash
# Build a .vsix
bun run package

# Publish to the marketplace (requires a Personal Access Token)
bun run publish
```

---

## Reference

### Project Structure

| Path | Purpose |
|------|---------|
| `src/extension.ts` | Extension entry point; declares `activate` and `deactivate` |
| `src/configs.ts` | Reactive VSCode config bindings |
| `src/utils.ts` | Extension utility helpers |
| `test/extension.test.ts` | Vitest suite for the extension |
| `tsdown.config.ts` | Tsdown bundler configuration |
| `dist/extension.cjs` | Build output (the loadable extension) |
| `.vscode/launch.json` | Debug launch configuration for the extension host |
| `.vscodeignore` | Files excluded from the packaged `.vsix` |

### Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `watch` | `bun --watch ./src/extension.ts` | Rebuild on every save |
| `dev` | `bun run src/index.ts` | Run the source file through Bun |
| `format` | `biome check --write` | Auto-format every file with Biome |
| `lint` | `biome check` | Lint every file with Biome |
| `build` | `bun build` | Produce `dist/extension.cjs` |
| `test` | `vitest run` | Run the Vitest suite |
| `verify` | `lint && typecheck && test` | Full quality gate |
| `package` | `vsce package` | Produce a `.vsix` |
| `publish` | `vsce publish` | Upload to the VS Code marketplace |
| `vscode:prepublish` | `bun run build` | Run automatically before `publish` |
| `typecheck` | `tsgo --noEmit` | Type-check the project |
| `scan` | `ast-grep scan` | Scan for code patterns |
| `ci` | `verify && build` | Full CI pipeline |

### Configuration

| File | Purpose |
|------|---------|
| `package.json` | Extension manifest, contributes, scripts, dependencies |
| `tsconfig.json` | Strict TypeScript settings |
| `tsdown.config.ts` | Tsdown bundler configuration |
| `.vscode/launch.json` | Debug launch configuration |
| `.vscodeignore` | Files excluded from the packaged `.vsix` |
| `biome.json` | Lint and format rules |
| `dprint.json` | dprint formatting rules |
| `.oxlintrc.json` | Oxlint rules |

### Manifest Fields

| Field | Purpose |
|-------|---------|
| `main` | The entry file VS Code loads (`./dist/extension.cjs`) |
| `engines.vscode` | Minimum VS Code version the extension supports |
| `activationEvents` | When the extension activates (e.g. `onStartupFinished`) |
| `contributes.commands` | Commands the extension contributes to the palette |
| `contributes.configuration` | Settings shown in VS Code's settings UI |
| `categories` | Marketplace categories |
| `displayName` | Human-readable name shown in the marketplace |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `VSCE_PAT` | Personal Access Token for `vsce publish` |

---

## Notes

> [!TIP]
> Use `bun run watch` while you develop. It rebuilds the bundle on every save, and pressing `F5` in VS Code reloads the extension host with the new bundle.

> [!IMPORTANT]
> Run `bun run verify` before opening a PR. It runs lint, typecheck, and tests in order; the first failing step is the one to fix.

> [!WARNING]
> Never commit `node_modules` or anything inside `dist/`. Both are reproducible from `package.json` and `bun install`.

> [!CAUTION]
> Replace the placeholder publisher name and extension ID (`your-extension`, `your-extension.helloWorld`) before publishing — a `vsce package` run will fail if the manifest still references them.
