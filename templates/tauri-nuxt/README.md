# Tauri + Nuxt Template

**A cross-platform desktop application template with Tauri 2, Nuxt 3, UnoCSS, and Pinia**

A starting point for desktop apps that use a Nuxt 3 web frontend and a Rust backend. The frontend `package.json` declares `tauri-nuxt` with the standard `dev`/`build`/`tauri` scripts, the Rust side lives in `src-tauri/` with its own `Cargo.toml` and a separate `tauri.conf.json`.

[![Tauri](https://img.shields.io/badge/Tauri-2.11+-ffc131?logo=tauri)](https://tauri.app)
[![Nuxt](https://img.shields.io/badge/Nuxt-3.15+-00dc82?logo=nuxt.js)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.5+-42b883?logo=vue.js)](https://vuejs.org)

[Quick Start](#quick-start) · [Usage](#usage) · [Reference](#reference) · [Notes](#notes)

---

## Features

| Icon | Feature | Description | Benefit | Usage |
|------|---------|-------------|---------|-------|
| <img src="https://api.iconify.design/lucide:monitor.svg?color=%23ffc131" width="18" height="18"> | **Tauri 2** | Cross-platform desktop framework | Native binaries with a small bundle size | `bun run tauri dev` |
| <img src="https://api.iconify.design/lucide:server.svg?color=%2300dc82" width="18" height="18"> | **Nuxt 3** | Vue 3 meta-framework with SSR | Web stack and dev loop you already know | `bun run dev` |
| <img src="https://api.iconify.design/lucide:atom.svg?color=%2342b883" width="18" height="18"> | **Vue 3.5** | Composition API with auto-imports | Reactive UI development | `import { ref } from "vue"` |
| <img src="https://api.iconify.design/lucide:layers.svg?color=%238b5cf6" width="18" height="18"> | **UnoCSS** | Atomic CSS engine | Rapid styling without CSS files | `class="text-red-500"` |
| <img src="https://api.iconify.design/lucide:code-2.svg?color=%23ec4899" width="18" height="18"> | **Biome** | Single tool for lint and format | Fast, opinionated, no config drift | `bun run lint` |
| <img src="https://api.iconify.design/lucide:test-tube.svg?color=%23f97316" width="18" height="18"> | **Vitest** | Unit tests with watch mode | Verify components and composables | `bun run test` |

---

## Key Concepts

> [!NOTE]
> How the Nuxt frontend talks to the Rust backend

<details>
<summary><strong>Key Concepts</strong></summary>

| Icon | Concept | Benefit |
|------|---------|---------|
| <img src="https://api.iconify.design/lucide:cpu.svg?color=%236366f1" width="18" height="18"> | **Hybrid Architecture** | Web frontend in Nuxt, native backend in Rust |
| <img src="https://api.iconify.design/lucide:shield.svg?color=%238b5cf6" width="18" height="18"> | **Type Safety** | Strict TypeScript on the JS side, the Rust type system on the native side |
| <img src="https://api.iconify.design/lucide:layout.svg?color=%2310b981" width="18" height="18"> | **File-Based Routing** | Folders and files in `app/pages/` become routes |
| <img src="https://api.iconify.design/lucide:git-branch.svg?color=%23f59e0b" width="18" height="18"> | **Auto-Import** | Composables, components, and utilities are picked up by Nuxt automatically |

</details>

<details>
<summary><strong>Principles</strong></summary>

| Icon | Principle | User Impact |
|------|-----------|-------------|
| <img src="https://api.iconify.design/lucide:rocket.svg?color=%23f59e0b" width="18" height="18"> | **Performance First** | Tauri's webview-based shell ships a tiny binary and starts fast |
| <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" width="18" height="18"> | **Type Safety** | `bun run typecheck` covers the JS side; `cargo check` covers the Rust side |
| <img src="https://api.iconify.design/lucide:repeat.svg?color=%236366f1" width="18" height="18"> | **Consistency** | Frontend and backend share conventions; both run through Biome and Clippy |
| <img src="https://api.iconify.design/lucide:book-open.svg?color=%23ec4899" width="18" height="18"> | **Documentation** | Frontend and backend code live next to each other |

</details>

<details>
<summary><strong>FAQs</strong></summary>

| Question | Answer |
|----------|--------|
| What is Tauri? | A framework that wraps a web frontend in a native window, with a Rust backend exposed through commands |
| How do I call Rust from JavaScript? | Define a `#[tauri::command]` in `src-tauri/src/`, register it in `main.rs`, then call it with `invoke()` from the frontend |
| Can I deploy the web side only? | Yes — `bun run generate` produces a static site that runs in any browser |
| How do I add native modules? | Add them to `src-tauri/Cargo.toml` and wire them up in `main.rs` |

</details>

<details>
<summary><strong>Best Practices</strong></summary>

**For Users**

- Run `bun run verify` before committing; it runs lint, typecheck, and tests in order
- Use UnoCSS utility classes for styling — no separate CSS files to manage
- Keep components small and focused
- Use the Vue Composition API (`<script setup>`) for new components
- Test on every desktop platform you ship to before a release

**For Maintainers**

- Stay on the shared task chain: do not introduce a second linter or formatter
- Use `ast-grep scan` to keep patterns consistent
- Keep Rust commands in `src-tauri/src/` and expose only the surface the frontend needs
- Use auto-imports for Vue and Nuxt APIs

</details>

---

## Quick Start

1. **Scaffold the app into a fresh directory**
   ```bash
   templates use tauri-nuxt -o ./my-desktop-app
   cd my-desktop-app
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Run the web dev server** (browser preview of the Nuxt app)
   ```bash
   bun run dev
   ```

4. **Run the Tauri dev shell** (opens a native window with hot-reload)
   ```bash
   bun run tauri dev
   ```

5. **Build a production desktop bundle**
   ```bash
   bun run tauri build
   ```

---

## Usage

### Frontend (Nuxt)

The scripts in `package.json` cover the day-to-day loop:

```bash
# Start the Nuxt dev server (default port 3000)
bun run dev

# Build the Nuxt production bundle
bun run build

# Generate a static site
bun run generate

# Preview the production build
bun run preview

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

### Backend (Tauri + Rust)

Tauri commands live in `src-tauri/`. The `tauri` script delegates to the Tauri CLI:

```bash
# Open a native window with hot-reload
bun run tauri dev

# Build a production desktop bundle
bun run tauri build

# Show the Tauri CLI help
bun run tauri --help
```

You can also drive the Rust side directly with `cargo`:

```bash
# Lint
cargo clippy --all-targets

# Format
cargo fmt

# Test
cargo test
```

### Vue Components

```vue
<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
const increment = () => {
	count.value++;
};
</script>

<template>
	<button type="button" @click="increment">Count: {{ count }}</button>
</template>
```

### Tauri Commands

Define a command in `src-tauri/src/commands.rs` and register it in `src-tauri/src/main.rs`:

```rust
// src-tauri/src/commands.rs
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {name}! You've been greeted from Rust!")
}
```

```rust
// src-tauri/src/main.rs (excerpt)
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

Then call it from Vue with `invoke`:

```typescript
import { invoke } from "@tauri-apps/api/core";

const message = await invoke("greet", { name: "World" });
```

---

## Reference

### Project Structure

| Path | Purpose |
|------|---------|
| `app/` | Nuxt 3 client-side application (pages, components, composables) |
| `app/components/` | Auto-imported Vue components |
| `app/composables/` | Auto-imported composables |
| `app/pages/` | File-based routes |
| `app/stores/` | Pinia stores |
| `app/utils/` | Auto-imported utilities |
| `server/` | Nuxt server-side code (API routes, server middleware) |
| `shared/` | Types and utilities shared between client and server |
| `public/` | Static assets served from the root |
| `src-tauri/` | Rust backend for Tauri |
| `src-tauri/src/` | Rust source: commands, plugins, glue |
| `src-tauri/icons/` | App icons for every platform |
| `src-tauri/capabilities/` | Tauri permission capabilities |

### Path Aliases

| Alias | Resolves To |
|-------|-------------|
| `~/*` | `app/*` |
| `~/server/*` | `server/*` |
| `#shared/*` | `shared/*` |
| `~/composables/*` | `app/composables/*` (auto-imported) |
| `~/components/*` | `app/components/*` (auto-imported) |
| `~/utils/*` | `app/utils/*` (auto-imported) |

### Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `nuxt dev` | Start the Nuxt dev server |
| `build` | `nuxt build` | Build the Nuxt production bundle |
| `generate` | `nuxt generate` | Produce a static site |
| `preview` | `nuxt preview` | Preview the production build |
| `tauri` | `tauri` | Delegate to the Tauri CLI |
| `tauri:dev` | `tauri dev` | Open a native window with hot-reload |
| `tauri:build` | `tauri build` | Build a production desktop bundle |
| `format` | `biome check --write` | Auto-format every file with Biome |
| `lint` | `biome check` | Lint every file with Biome |
| `typecheck` | `nuxt typecheck` | Type-check the Nuxt project |
| `test` | `vitest run` | Run the Vitest suite |
| `verify` | `lint && typecheck && test` | Full quality gate |
| `scan` | `ast-grep scan` | Scan for code patterns |
| `ci` | `verify && build` | Full CI pipeline |
| `postinstall` | `nuxt prepare` | Generate Nuxt types after install |

### Configuration

| File | Purpose |
|------|---------|
| `package.json` | Name, scripts, dependencies |
| `nuxt.config.ts` | Modules, runtime config, app metadata |
| `uno.config.ts` | UnoCSS configuration (presets, shortcuts, theme) |
| `tsconfig.json` | Strict TypeScript settings |
| `tsconfig.node.json` | Node-side TypeScript settings |
| `vite.config.ts` | Vite configuration (used by Tauri) |
| `tauri.conf.json` | Tauri app configuration (window, bundle, security) |
| `src-tauri/Cargo.toml` | Rust crate manifest |
| `src-tauri/tauri.conf.json` | Tauri-specific config (when split) |
| `biome.json` | Lint and format rules |

---

## Notes

> [!TIP]
> Use `bun run tauri dev` for the native dev loop — changes in `app/` hot-reload in the window, changes in `src-tauri/` trigger a Rust rebuild.

> [!IMPORTANT]
> Run `bun run verify` before opening a PR. It runs lint, typecheck, and tests in order; the first failing step is the one to fix.

> [!WARNING]
> Never commit `node_modules`, `.nuxt/`, `dist/`, or anything inside `src-tauri/target/`. They are reproducible from `package.json` and `bun install`.

> [!CAUTION]
> Tauri permissions live in `src-tauri/capabilities/`. Only request the permissions your app actually needs — overly broad capabilities are a security risk.
