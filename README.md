# Templates

Collection of project templates following best practices.

## Structure

```
templates/
├── apps/              # Application templates
│   ├── cli/          # CLI application
│   └── web/          # Web application
└── templates/        # Project templates
    ├── bun-package/           # Bun package template
    ├── fullstack-monorepo/    # Full-stack monorepo with Turborepo
    ├── microservices/         # Microservices architecture with Moonrepo
    └── my-config/             # Personal configuration files
```

## Available Scripts

- `bun run dev` - Start development servers
- `bun run build` - Build all workspaces
- `bun run test` - Run tests
- `bun run lint` - Run linting
- `bun run format` - Format code
- `bun run verify` - Run all checks
- `bun run watch` - Watch mode with TUI
- `bun run devtools` - Open Turborepo devtools

## Templates

### Bun Package
Modern Bun package template with TypeScript, testing, and best practices.

### Fullstack Monorepo
Full-stack monorepo using Turborepo with multiple apps and shared packages.

### Microservices
Microservices architecture using Moonrepo with API Gateway and multiple services.

### My Config
Personal configuration files including ESLint, Prettier, TypeScript, and more.

## Development

```bash
# Install dependencies
bun install

# Start development
bun run dev

# Run tests
bun run test

# Build
bun run build
```

## License

MIT