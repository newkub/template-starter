# Tauri + Nuxt + TypeScript

A desktop application template combining Tauri with Nuxt 3 for modern cross-platform development.

## Structure

```
app/
├── components/        # Vue components
├── composables/      # Vue composables
├── layouts/          # Nuxt layouts
├── pages/            # Nuxt pages
├── stores/           # Pinia stores
├── utils/            # Utility functions
├── assets/           # Static assets
├── app.vue           # Root component
└── app.config.ts     # App configuration

server/               # Server-side code
shared/               # Shared utilities
public/               # Static files
src-tauri/            # Tauri Rust backend
```

## Libraries

- **Frontend**: Nuxt 3, Vue 3, UnoCSS
- **Desktop**: Tauri 2, @tauri-apps/api
- **TypeScript**: TypeScript 5.6+
- **Styling**: UnoCSS with preset-icons

## Commands

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run tauri dev` - Start Tauri development
- `bun run tauri build` - Build Tauri application
- `bun run typecheck` - Type check code
- `bun run lint` - Lint code
- `bun run test` - Run tests

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
