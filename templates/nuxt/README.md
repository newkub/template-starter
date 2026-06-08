# Nuxt Template

**A Nuxt 4 application with Vue 3, UnoCSS, Pinia, Oxlint, and Vitest**

A starting point for full-stack Vue applications. The default `package.json` declares `nuxt`, wires the standard `dev`/`build`/`preview`/`typecheck`/`lint`/`test`/`verify` scripts, and ships with UnoCSS, Pinia, and the official icon and color-mode modules pre-installed.

[![Nuxt](https://img.shields.io/badge/Nuxt-4.2.2+-00dc82?logo=nuxt.js)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.5.34+-42b883?logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178c6?logo=typescript)](https://www.typescriptlang.org)

[Quick Start](#quick-start) · [Usage](#usage) · [Reference](#reference) · [Notes](#notes)

---

## Features

| Icon | Feature | Description | Benefit | Usage |
|------|---------|-------------|---------|-------|
| <img src="https://api.iconify.design/lucide:server.svg?color=%2300dc82" width="18" height="18"> | **Nuxt 4** | Vue meta-framework with file-based routing and SSR | Server-rendered apps with sensible defaults | `bun run dev` |
| <img src="https://api.iconify.design/lucide:atom.svg?color=%2342b883" width="18" height="18"> | **Vue 3.5** | Composition API with auto-imports | Reactive UI development | `import { ref } from "vue"` |
| <img src="https://api.iconify.design/lucide:layers.svg?color=%238b5cf6" width="18" height="18"> | **UnoCSS** | Atomic CSS engine | Rapid styling without CSS files | `class="text-red-500"` |
| <img src="https://api.iconify.design/lucide:database.svg?color=%23f97316" width="18" height="18"> | **Pinia** | Vue's official state management | Type-safe stores for shared state | `useStore()` |
| <img src="https://api.iconify.design/lucide:zap.svg?color=%236366f1" width="18" height="18"> | **Oxlint + dprint** | Fast linting and formatting | Consistent code style without slow config | `bun run lint` |
| <img src="https://api.iconify.design/lucide:test-tube.svg?color=%2310b981" width="18" height="18"> | **Vitest** | Unit tests with watch mode | Verify components and composables | `bun run test` |

---

## Key Concepts

> [!NOTE]
> How Nuxt 4 organises the project and what the auto-imports cover

<details>
<summary><strong>Key Concepts</strong></summary>

| Icon | Concept | Benefit |
|------|---------|---------|
| <img src="https://api.iconify.design/lucide:cpu.svg?color=%236366f1" width="18" height="18"> | **Server-Side Rendering** | SEO-friendly with fast initial load |
| <img src="https://api.iconify.design/lucide:shield.svg?color=%238b5cf6" width="18" height="18"> | **Type Safety** | `nuxt typecheck` covers both client and server code |
| <img src="https://api.iconify.design/lucide:layout.svg?color=%2310b981" width="18" height="18"> | **File-Based Routing** | Folders and files in `app/pages/` become routes automatically |
| <img src="https://api.iconify.design/lucide:git-branch.svg?color=%23f59e0b" width="18" height="18"> | **Auto-Import** | Composables, components, and utilities are picked up by Nuxt without explicit imports |

</details>

<details>
<summary><strong>Principles</strong></summary>

| Icon | Principle | User Impact |
|------|-----------|-------------|
| <img src="https://api.iconify.design/lucide:rocket.svg?color=%23f59e0b" width="18" height="18"> | **Performance First** | SSR, code splitting, and Nitro tuning come for free |
| <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" width="18" height="18"> | **Type Safety** | `nuxt typecheck` exercises `.vue`, server, and shared code |
| <img src="https://api.iconify.design/lucide:repeat.svg?color=%236366f1" width="18" height="18"> | **Consistency** | Same scripts and options across the monorepo |
| <img src="https://api.iconify.design/lucide:book-open.svg?color=%23ec4899" width="18" height="18"> | **Documentation** | Conventions live next to the code they document |

</details>

<details>
<summary><strong>FAQs</strong></summary>

| Question | Answer |
|----------|--------|
| What is Nuxt 4? | A Vue 3 meta-framework that bundles routing, SSR, build, and dev tools |
| How do I add a new page? | Create `app/pages/<route>.vue`. Folders become nested segments |
| How do I define an API route? | Drop a handler into `server/api/`. Files become endpoints automatically |
| How do I deploy? | Nuxt 4 outputs a Nitro build; deploy to Cloudflare Workers, Node, or any Nitro preset |

</details>

<details>
<summary><strong>Best Practices</strong></summary>

**For Users**

- Run `bun run verify` before committing; it runs lint, typecheck, and tests in order
- Rely on auto-imports for composables, components, and utilities — they cut down on noise
- Keep business logic in `app/composables/core/` and orchestrate it from `app/composables/facade/`
- Store shared types in `shared/types/` so the server and client see the same shapes

**For Maintainers**

- Stay on the shared task chain: do not introduce a second linter or formatter
- Use `ast-grep scan` to keep patterns consistent
- Put server-only code in `server/` and let Nuxt's auto-imports stay client-safe
- Configure a Nitro preset in `nuxt.config.ts` per deployment target

</details>

---

## Quick Start

1. **Scaffold the app into a fresh directory**
   ```bash
   templates use nuxt -o ./my-app
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start the dev server**
   ```bash
   bun run dev
   ```

4. **Build a production bundle**
   ```bash
   bun run build
   ```

5. **Preview the production bundle**
   ```bash
   bun run preview
   ```

---

## Usage

### Development

The scripts in `package.json` cover the day-to-day loop:

```bash
# Start the dev server (default port 3000)
bun run dev

# Build a production bundle with the Nitro preset from nuxt.config.ts
bun run build

# Preview the production bundle locally
bun run preview

# Run nuxt typecheck (covers .vue, server, and shared code)
bun run typecheck

# Lint the source tree
bun run lint

# Auto-format every file
bun run format

# Run the Vitest suite
bun run test

# Run lint, typecheck, and tests together
bun run verify

# Run the full CI pipeline
bun run ci

# Scan for code patterns with ast-grep
bun run scan
```

### Vue Components and Composables

Use the Composition API. The setup script is auto-imported and tree-shaken.

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

### Server API

API routes live in `server/api/`. Each file exports a handler built with `defineEventHandler`:

```typescript
// server/api/hello.ts
export default defineEventHandler(() => {
	return { message: "Hello from Nitro!" };
});
```

---

## Reference

### Project Structure

| Directory | Purpose |
|-----------|---------|
| `app/` | Client-side application (components, pages, composables, stores, middleware) |
| `app/components/` | Auto-imported Vue components |
| `app/composables/core/` | Pure business logic |
| `app/composables/facade/` | Orchestration of core logic |
| `app/composables/services/` | Side-effecting services |
| `app/pages/` | File-based routes |
| `app/stores/` | Pinia stores |
| `app/middleware/` | Route middleware |
| `server/` | Server-side code (API routes, database, middleware, plugins) |
| `server/api/` | HTTP endpoints |
| `server/db/` | Database access |
| `shared/` | Types and utilities shared between client and server |
| `public/` | Static assets served from the root |
| `modules/` | Local Nuxt modules |
| `module/` | Single bundled module (when present) |

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
| `dev` | `nuxt dev` | Start the dev server |
| `build` | `nuxt build` | Build a production bundle |
| `preview` | `nuxt preview` | Preview the production bundle |
| `generate` | `nuxt generate` | Produce a static export (when applicable) |
| `format` | `biome check --write` | Auto-format every file |
| `lint` | `biome check` | Lint every file |
| `typecheck` | `nuxt typecheck` | Type-check the whole project |
| `test` | `vitest run` | Run the Vitest suite |
| `verify` | `lint && typecheck && test` | Full quality gate |
| `scan` | `ast-grep scan` | Scan for code patterns |
| `ci` | `verify && build` | Full CI pipeline |
| `postinstall` | `nuxt prepare` | Generate Nuxt types after install |

### Configuration

| File | Purpose |
|------|---------|
| `package.json` | Name, scripts, dependencies |
| `nuxt.config.ts` | Modules, runtime config, Nitro preset, app metadata |
| `uno.config.ts` | UnoCSS configuration (presets, shortcuts, theme) |
| `tsconfig.json` | Strict TypeScript settings |
| `biome.json` | Lint and format rules |
| `vitest.config.ts` | Vitest configuration |

### Deployment

The default Nitro preset is **cloudflare**. To deploy:

```bash
# Build the production bundle
bun run build

# Deploy to Cloudflare Workers
bunx wrangler deploy
```

To switch targets, set `nitro.preset` in `nuxt.config.ts` (for example `node-server`, `vercel`, or `netlify`).

---

## Notes

> [!TIP]
> Rely on Nuxt's auto-imports for composables, components, and utilities — they keep the code free of boilerplate.

> [!IMPORTANT]
> Run `bun run verify` before opening a PR. It runs lint, typecheck, and tests in order; the first failing step is the one to fix.

> [!WARNING]
> Never commit `node_modules` or anything inside `.nuxt/`. Both are reproducible from `package.json` and `bun install`.

> [!CAUTION]
> Server-only modules (filesystem, env secrets, heavy SDKs) belong in `server/` so they are not pulled into the client bundle.
