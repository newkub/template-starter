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

## ✨ Design Principles

- **Simplicity**: Designed to be intuitive and easy to use with clear, interactive commands.
- **Speed**: Built on top of Bun, ensuring near-instantaneous command execution and project setup.
- **Extensibility**: Easily configurable to add new templates and manage project-specific settings.

## Installation

```bash
# Install globally using bun
bun install -g @newkub/templates-cli

# Or using npm
npm install -g @newkub/templates-cli
```

## Usage

Once installed, you can run the CLI using the `templates-cli` command.

```bash
templates-cli
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

1. Run `templates-cli`.
2. Select the `use` command.
3. Choose a template (e.g., `next`).
4. Enter your new project name (e.g., `my-next-app`).
5. The CLI will create a new directory `my-next-app` with the Next.js template.

```bash
$ templates-cli

> Select a command: › use
> Select a template to create: › next
> Enter project name: › my-next-app

✔ Project "my-next-app" created successfully!
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
