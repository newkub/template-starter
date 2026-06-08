# Web Extension Template

**A WXT + Vue 3 web extension template with UnoCSS, Biome, and Vitest**

A starting point for cross-browser web extensions. WXT handles the boilerplate (manifest, build, hot reload), Vue 3 powers the popup and options pages, and UnoCSS keeps the styles atomic. The dev server is per-browser, the build targets Chrome by default, and a separate script targets Firefox.

[![WXT](https://img.shields.io/badge/WXT-0.20.26-6366f1?logo=wxt)](https://wxt.dev)
[![Vue](https://img.shields.io/badge/Vue-3.5.35-42b883?logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178c6?logo=typescript)](https://www.typescriptlang.org)

[Quick Start](#quick-start) · [Usage](#usage) · [Reference](#reference) · [Notes](#notes)

---

## Features

| Icon | Feature | Description | Benefit | Usage |
|------|---------|-------------|---------|-------|
| <img src="https://api.iconify.design/lucide:box.svg?color=%236366f1" width="18" height="18"> | **WXT** | Modern web extension framework | One codebase, every major browser | `bun run dev` |
| <img src="https://api.iconify.design/lucide:globe.svg?color=%2310b981" width="18" height="18"> | **Cross-Browser** | Chrome by default, Firefox with one flag | Same source, different manifest | `bun run build:firefox` |
| <img src="https://api.iconify.design/lucide:atom.svg?color=%2342b883" width="18" height="18"> | **Vue 3** | Progressive JavaScript framework | Reactive popup and options pages | `import { ref } from "vue"` |
| <img src="https://api.iconify.design/lucide:layers.svg?color=%238b5cf6" width="18" height="18"> | **UnoCSS** | Atomic CSS engine | Rapid styling without CSS files | `class="text-red-500"` |
| <img src="https://api.iconify.design/lucide:code-2.svg?color=%23ec4899" width="18" height="18"> | **Biome** | Single tool for lint and format | Fast, opinionated, no config drift | `bun run lint` |
| <img src="https://api.iconify.design/lucide:test-tube.svg?color=%23f97316" width="18" height="18"> | **Vitest** | Unit tests with watch mode | Verify the extension's behaviour | `bun run test` |

---

## Key Concepts

> [!NOTE]
> How WXT shapes a web extension project

<details>
<summary><strong>Key Concepts</strong></summary>

| Icon | Concept | Benefit |
|------|---------|---------|
| <img src="https://api.iconify.design/lucide:globe.svg?color=%236366f1" width="18" height="18"> | **Cross-Browser** | One codebase for Chrome, Firefox, Edge, and other Chromium-based browsers |
| <img src="https://api.iconify.design/lucide:shield.svg?color=%238b5cf6" width="18" height="18"> | **Type Safety** | Strict TypeScript across the popup, content scripts, and background |
| <img src="https://api.iconify.design/lucide:layout.svg?color=%2310b981" width="18" height="18"> | **Atomic CSS** | Utility-first styling with UnoCSS |
| <img src="https://api.iconify.design/lucide:git-branch.svg?color=%23f59e0b" width="18" height="18"> | **Auto-Import** | `unplugin-auto-import` and `unplugin-vue-components` keep Vue APIs out of the way |

</details>

<details>
<summary><strong>Principles</strong></summary>

| Icon | Principle | User Impact |
|------|-----------|-------------|
| <img src="https://api.iconify.design/lucide:rocket.svg?color=%23f59e0b" width="18" height="18"> | **Performance First** | WXT's dev mode hot-reloads in the browser without a manual refresh |
| <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" width="18" height="18"> | **Type Safety** | Errors surface at compile time, never at extension activation |
| <img src="https://api.iconify.design/lucide:repeat.svg?color=%236366f1" width="18" height="18"> | **Consistency** | Same scripts and options across the monorepo |
| <img src="https://api.iconify.design/lucide:book-open.svg?color=%23ec4899" width="18" height="18"> | **Documentation** | Conventions live next to the code they document |

</details>

<details>
<summary><strong>FAQs</strong></summary>

| Question | Answer |
|----------|--------|
| What is WXT? | A web extension framework that handles the manifest, build, and dev server for Chrome, Firefox, and other browsers |
| How do I add an entrypoint? | Drop a file in `entrypoints/`. WXT picks up `background.ts`, `content.ts`, and any folder with an `index.html` |
| How do I target Firefox? | `bun run build:firefox` builds the Firefox flavour; `bun run dev:firefox` runs the dev server for it |
| How do I test the extension? | Load `output/chrome-mv3` as an unpacked extension in `chrome://extensions` with Developer mode on |

</details>

<details>
<summary><strong>Best Practices</strong></summary>

**For Users**

- Run `bun run verify` before committing; it runs lint, typecheck, and tests in order
- Use UnoCSS utility classes for styling — no separate CSS files to manage
- Keep components small and focused
- Use the Vue Composition API (`<script setup>`) for new components
- Test the extension in every browser you ship to

**For Maintainers**

- Stay on the shared task chain: do not introduce a second linter or formatter
- Use `ast-grep scan` to keep patterns consistent
- Keep entrypoints in the `entrypoints/` directory
- Use auto-imports for Vue and Nuxt APIs

</details>

---

## Quick Start

1. **Scaffold the extension into a fresh directory**
   ```bash
   templates use web-extension-wxt-nuxt -o ./my-extension
   cd my-extension
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start the Chrome dev server**
   ```bash
   bun run dev
   ```

4. **Load the unpacked extension** in `chrome://extensions` (Developer mode on) pointing at `output/chrome-mv3/`

5. **Package the extension**
   ```bash
   bun run zip
   ```

---

## Usage

### Development

The scripts in `package.json` cover the day-to-day loop:

```bash
# Start the Chrome dev server
bun run dev

# Start the Firefox dev server
bun run dev:firefox

# Build for Chrome
bun run build

# Build for Firefox
bun run build:firefox

# Package Chrome into a .zip
bun run zip

# Package Firefox into a .zip
bun run zip:firefox

# Compile without bundling (quick type check)
bun run compile

# Lint the source tree
bun run lint

# Format the source tree
bun run format

# Type-check the project
bun run typecheck

# Run the Vitest suite
bun run test

# Run lint, typecheck, and tests together
bun run verify

# Run the full CI pipeline
bun run ci

# Scan for code patterns with ast-grep
bun run scan
```

### Vue Components

Write components in `components/`. They are auto-imported by `unplugin-vue-components`:

```vue
<!-- components/Counter.vue -->
<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
</script>

<template>
	<button type="button" @click="count++">Count: {{ count }}</button>
</template>
```

Drop `<Counter />` straight into a popup or options page.

### Content Scripts

Content scripts live in `entrypoints/` and follow WXT's `defineContentScript` convention:

```typescript
// entrypoints/content.ts
export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    console.log("Content script loaded");
  },
});
```

### Background Scripts

The service worker or background page lives in `entrypoints/background.ts` and runs as soon as the browser starts the extension.

---

## Reference

### Project Structure

| Path | Purpose |
|------|---------|
| `entrypoints/background.ts` | Service worker or background page |
| `entrypoints/content.ts` | Content script injected into pages |
| `entrypoints/popup/` | Popup UI (Vue app with `index.html` and `main.ts`) |
| `components/` | Auto-imported Vue components |
| `assets/` | Imported assets (fonts, images) |
| `public/` | Static assets copied to the build output |
| `public/icon/` | Extension icons in every required size (16, 32, 48, 96, 128) |
| `wxt.config.ts` | WXT configuration (manifest, modules) |
| `uno.config.ts` | UnoCSS configuration (presets, shortcuts, theme) |
| `.output/` | WXT build output (generated, gitignored) |

### Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `bun run src/index.ts` | Start the WXT dev server (Chrome by default) |
| `dev:firefox` | `wxt -b firefox` | Start the WXT dev server for Firefox |
| `build` | `bun build` | Build for Chrome |
| `build:firefox` | `wxt build -b firefox` | Build for Firefox |
| `zip` | `wxt zip` | Package Chrome into a .zip |
| `zip:firefox` | `wxt zip -b firefox` | Package Firefox into a .zip |
| `compile` | `vue-tsc --noEmit` | Type-check the project |
| `format` | `biome check --write` | Auto-format every file with Biome |
| `lint` | `biome check` | Lint every file with Biome |
| `typecheck` | `tsgo --noEmit` | Type-check the project |
| `test` | `vitest run` | Run the Vitest suite |
| `verify` | `lint && typecheck && test` | Full quality gate |
| `scan` | `ast-grep scan` | Scan for code patterns |
| `ci` | `verify && build` | Full CI pipeline |
| `postinstall` | `wxt prepare` | Regenerate WXT types after install |

### Configuration

| File | Purpose |
|------|---------|
| `package.json` | Name, scripts, dependencies |
| `wxt.config.ts` | WXT configuration (manifest, modules, Vite plugins) |
| `uno.config.ts` | UnoCSS configuration |
| `tsconfig.json` | Strict TypeScript settings |
| `biome.json` | Lint and format rules |
| `dprint.json` | dprint formatting rules |
| `.oxlintrc.json` | Oxlint rules |

### Browser Targets

| Target | Build Command | Output |
|--------|---------------|--------|
| Chrome (default) | `bun run build` | `.output/chrome-mv3/` |
| Firefox | `bun run build:firefox` | `.output/firefox-mv2/` |

### WXT Options

| Option | Description | Default |
|--------|-------------|---------|
| `--browser` / `-b` | Target browser (`chrome`, `firefox`, `edge`, …) | `chrome` |
| `--mode` | Build mode (`development` or `production`) | `production` |
| `--debug` | Start with the browser devtools open | `false` |

---

## Notes

> [!TIP]
> Use `bun run dev` for the Chrome dev loop and `bun run dev:firefox` for Firefox. WXT hot-reloads the extension in the browser without a manual reload.

> [!IMPORTANT]
> Run `bun run verify` before opening a PR. It runs lint, typecheck, and tests in order; the first failing step is the one to fix.

> [!WARNING]
> Never commit `node_modules` or anything inside `.output/`. Both are reproducible from `package.json` and `bun install`.

> [!CAUTION]
> Web extension permissions live in `wxt.config.ts`. Only request the permissions and host permissions your extension actually needs — overly broad permissions are rejected by the stores.
