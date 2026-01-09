# Nuxt Template

Modern Nuxt 4 template with best practices and comprehensive tooling.

## Features

- **Nuxt 4** - Latest Nuxt framework with App Router
- **TypeScript** - Full type safety with strict mode
- **UnoCSS** - Atomic CSS engine for rapid styling
- **Pinia** - State management solution
- **VueUse** - Composition utility library
- **Color Mode** - Dark/Light mode support
- **Scalar** - API documentation
- **Vitest** - Unit testing framework
- **Vite Plugin Checker** - Real-time type checking and linting

## Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Project Structure

```
nuxt/
├── app/                      # Client-side application
│   ├── assets/               # Unprocessed files (styles, fonts)
│   ├── components/           # Reusable Vue components
│   ├── composables/          # Reusable composition functions
│   │   ├── core/             # Standalone business logic
│   │   ├── facade/           # UX/flow logic
│   │   └── services/         # API wrappers
│   ├── layouts/              # Page layouts
│   ├── middleware/           # Client-side route middleware
│   ├── pages/                # Application pages (routes)
│   ├── plugins/              # Vue plugins
│   ├── stores/               # Pinia stores
│   ├── utils/                # Client-side utility functions
│   ├── app.config.ts         # App configuration
│   └── app.vue               # Main application component
├── public/                   # Publicly accessible files
├── server/                   # Server-side logic (Nitro)
│   ├── api/                  # API endpoints
│   ├── db/                   # Database queries
│   ├── middleware/           # Server-side middleware
│   ├── plugins/              # Server plugins
│   ├── routes/               # Custom server routes
│   └── utils/                # Server-side business logic
├── shared/                   # Code shared between client and server
│   ├── types/                # TypeScript types and schemas
│   └── utils/                # Pure utility functions
├── nuxt.config.ts            # Nuxt configuration
├── uno.config.ts             # UnoCSS configuration
└── package.json
```

## Scripts

- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview production build
- `format` - Format code with dprint
- `lint` - Type check with vue-tsc

## Deployment

This template is configured for Cloudflare Workers deployment.

```bash
# Deploy to Cloudflare
bun run build
wrangler deploy
```

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example` for environment-specific configuration.

### Path Aliases

- `~/server/*` - Server-side code
- `~/shared/*` - Shared code between client and server
- `~/composables/*` - Auto-imported composables
- `~/components/*` - Auto-imported components
- `~/utils/*` - Auto-imported utilities

## Best Practices

- Use auto-imports for composables, components, and utilities
- Keep business logic in `composables/core`
- Use `composables/facade` for orchestrating core logic
- Store shared types in `shared/types`
- Keep server-side queries in `server/db`
- Use Pinia for complex state management