# Turborepo Template

Monorepo with web app, CLI tool, browser extension, desktop app, container, and shared packages using Turborepo.

## Structure

```
├── apps/
│   ├── web/          # Nuxt application
│   ├── cli/          # CLI tool (Bun)
│   ├── browser/      # Browser extension
│   ├── desktop/      # Desktop app (Tauri)
│   └── container/    # Docker/Podman container
├── packages/
│   └── shared/       # Shared code
├── turbo.json
└── package.json
```

## Scripts

- `bun dev` - Start development (all apps)
- `bun build` - Build all packages
- `bun lint` - Lint all packages (turbo)
- `bun lint:direct` - Lint with oxlint directly
- `bun test` - Test all packages (turbo)
- `bun test:run` - Run tests once
- `bun test:coverage` - Run tests with coverage report
- `bun test:ui` - Run tests with UI
- `bun format` - Format all packages (turbo)
- `bun format:direct` - Format with dprint directly
- `bun verify` - Run full verification pipeline
- `bun watch` - Watch mode with verification
- `bun scan` - Scan code with ast-grep
- `bun check:modules` - Check node modules
