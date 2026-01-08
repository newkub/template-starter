# Nuxt Starter Template

Nuxt 4 starter template following best practices with modern tooling.

## Features

- **Nuxt 4** - Latest version with App Router
- **TypeScript** - Full type safety
- **UnoCSS** - Atomic CSS engine
- **Pinia** - State management
- **Vitest** - Testing framework
- **Lefthook** - Git hooks
- **Cloudflare Workers** - Deployment ready

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (package manager)
- Node.js 18+

### Installation

```bash
bun install
```

### Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
bun build
```

### Preview

```bash
bun preview
```

## Project Structure

```
app/                      # Client-side application
├── assets/               # Unprocessed files
├── components/           # Reusable Vue components
├── composables/          # Composition functions
│   ├── core/             # Standalone business logic
│   ├── facade/           # UX/flow logic
│   └── services/         # API wrappers
├── layouts/              # Page layouts
├── middleware/           # Route middleware
├── pages/                # Application pages
├── plugins/              # Vue plugins
├── stores/               # Pinia stores
├── utils/                # Utility functions
└── app.vue               # Main component

server/                   # Server-side logic
├── api/                  # API endpoints
├── db/                   # Database queries
├── middleware/           # Server middleware
├── plugins/              # Server plugins
├── routes/               # Custom routes
└── utils/                # Server utilities

shared/                   # Shared code
├── types/                # TypeScript types
└── utils/                # Pure functions

public/                   # Public files
└── .well-known/          # Security & metadata
```

## Scripts

- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview production build
- `lint` - Run type checking
- `format` - Format code
- `test` - Run tests

## Deployment

This template is configured for Cloudflare Workers deployment.

```bash
bun deploy
```

## License

MIT
