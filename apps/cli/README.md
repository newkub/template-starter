# @newkub/templates-cli

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

A CLI tool for managing templates and configurations, built with Bun.

## Introduction

`@newkub/templates-cli` is a command-line interface designed to streamline your development workflow. It allows you to quickly scaffold new projects from a predefined set of templates, manage project configurations, and handle Git submodules with ease.

### Features

- **Project Scaffolding**: Create new projects from various templates (`next`, `nuxt`, `monorepo`, etc.).
- **Interactive Prompts**: User-friendly prompts powered by `@clack/prompts` to guide you through the process.
- **Configuration Syncing**: Sync configuration files from a template to your current project.
- **Submodule Management**: Add and remove Git submodules effortlessly.
- **Type-Safe**: Built with TypeScript and strict type checking enabled.
- **Modular Architecture**: Clean separation of concerns with services, utils, and components.

## ✨ Design Principles

- **Simplicity**: Designed to be intuitive and easy to use with clear, interactive commands.
- **Speed**: Built on top of Bun, ensuring near-instantaneous command execution and project setup.
- **Extensibility**: Easily configurable to add new templates and manage project-specific settings.
- **Type Safety**: Full TypeScript support with strict mode and comprehensive error types.
- **Maintainability**: Modular structure following functional programming principles.

## Architecture

The CLI follows a clean architecture pattern:

```
src/
├── app.ts              # Main application entry point
├── error.ts            # Custom error types
├── components/         # UI components (pure functions)
├── config/            # Application configuration
├── constant/          # Compile-time constants
├── handlers/          # Command handlers
├── lib/               # External library wrappers
├── schemas/           # Zod schemas for validation
├── services/          # Business logic and side effects
├── types/             # TypeScript type definitions
└── utils/             # Pure utility functions
```

### Key Components

- **Handlers**: Command-specific logic for each CLI command (use, list, update, sync, add, remove)
- **Services**: Handle business logic and side effects (file operations, prompts, git operations, config management)
- **Utils**: Pure functions for common operations (path handling, URL opening, file utilities)
- **Config**: Centralized configuration including GitHub settings and template mappings
- **Error Types**: Custom error classes for better error handling and debugging

## Installation

```bash
# Install globally using bun
bun install -g @newkub/templates-cli

# Or using npm
npm install -g @newkub/templates-cli
```

## Development

```bash
# Install dependencies
bun install

# Run in development mode
bun run dev

# Run linting
bun run lint

# Run tests
bun run test

# Build the project
bun run build
```

## Usage

Once installed, you can run the CLI using the `wtemplates` command.

```bash
wtemplates
```

This will open an interactive prompt where you can select the desired command.

### Commands

- `use`: Create a new project from a selected template.
- `list`: Show all available templates and open the selected one in GitHub.
- `update`: Update an existing template in the current directory.
- `sync`: Sync configuration files from a template to the current project.
- `add`: Add a new Git submodule.
- `remove`: Remove an existing Git submodule.

## Examples

### Creating a new project

1. Run `wtemplates`.
2. Select the `use` command.
3. Choose a template (e.g., `next`).
4. Enter your new project name (e.g., `my-next-app`).
5. The CLI will create a new directory `my-next-app` with the Next.js template.

```bash
$ wtemplates

> Select a command: › use
> Select a template to create: › next
> Enter project name: › my-next-app

✔ Project "my-next-app" created successfully!
```

### Syncing configuration files

1. Run `wtemplates`.
2. Select the `sync` command.
3. Choose a template to sync from.
4. The CLI will copy matching configuration files to your current directory.

## Configuration

The CLI configuration is located in `src/config/cli.config.ts`:

```typescript
{
  templateMap: { /* template mappings */ },
  github: {
    owner: 'newkub',
    repository: 'templates',
    branch: 'main',
    templatesPath: 'templates'
  }
}
```

### User Customization

You can customize the CLI by creating a configuration file in your project directory. The CLI will automatically detect and load one of the following files (in order of priority):

- `.templates-cli.config.ts` (recommended)
- `.templates-cli.config.js`
- `.templates-cli.config.json`
- `templates-cli.config.ts`
- `templates-cli.config.js`
- `templates-cli.config.json`

#### Example Configuration

```typescript
// .templates-cli.config.ts
export default {
  // GitHub configuration
  github: {
    owner: 'newkub',
    repository: 'templates',
    branch: 'main',
    templatesPath: 'templates'
  },

  // Add custom templates
  customTemplates: {
    'my-custom-template': 'custom/my-template',
    'another-template': 'templates/another'
  },

  // Default project name
  defaultProjectName: 'my-project',

  // Skip confirmation prompts (useful for automation)
  autoConfirm: false,

  // Automatically open browser when listing templates
  openBrowser: true
}
```

Copy the example configuration from `.templates-cli.config.example.ts` to get started.

## Available Templates

- `my-config`: Configuration templates
- `monorepo`: Monorepo setup
- `next`: Next.js application
- `nuxt`: Nuxt.js application
- `slidev`: Slidev presentation
- `tutorial`: Tutorial template
- `vite-react`: Vite + React application
- `vitepress`: VitePress documentation
- `vscode-vue`: VS Code Vue extension

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
