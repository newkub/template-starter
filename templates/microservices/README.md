# Moonrepo Microservices Monorepo

A modern microservices template built with Bun, Moonrepo, and TypeScript. This monorepo provides a scalable architecture for building distributed systems with best practices for development, testing, and deployment.

## Introduction

This template is designed to help developers quickly set up a microservices architecture with a focus on developer experience, type safety, and modern tooling. It includes three core services (API Gateway, User Service, Order Service) and shared packages for common functionality. The project leverages Moonrepo for monorepo management, Bun for high-performance runtime, and Railpack for automated Docker image generation.

## Features

- 🚀 **High Performance**: Built with Bun for lightning-fast JavaScript execution
- 🏗️ **Monorepo Management**: Moonrepo for efficient workspace and task management
- 📦 **Type Safety**: Full TypeScript support across all services and packages
- 🐳 **Docker Support**: Automated Dockerfile generation with Railpack
- 🔧 **Modern Tooling**: Oxlint for linting, Dprint for formatting
- 🔄 **Shared Packages**: Reusable types, utilities, and configuration
- 🎯 **Service Isolation**: Each service is independently deployable
- ⚡ **Hot Reload**: Fast development with instant feedback
- 🛡️ **Best Practices**: Follows industry standards for microservices

## Goal

- 🎯 Provide a production-ready microservices template
- 🎯 Enable rapid development and deployment of distributed systems
- 🎯 Maintain code quality and consistency across services
- 🎯 Simplify monorepo management and CI/CD integration
- 🎯 Support both Docker and Podman for containerization

## Design Principles

- 🏗️ **Modularity**: Each service is self-contained and independently deployable
- 🔒 **Type Safety**: Leverage TypeScript for compile-time error checking
- 📊 **Scalability**: Architecture designed to handle growing workloads
- 🔄 **Maintainability**: Clean code structure and shared utilities
- ⚡ **Performance**: Optimize for speed and resource efficiency
- 🛡️ **Security**: Follow security best practices for authentication and data handling
- 🧪 **Testability**: Structure code for easy testing and validation

## Installation

### Prerequisites

- Node.js 18+ or Bun 1.3+
- Docker or Podman (for containerization)
- Git

### Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd microservices

# Install dependencies
bun install
```

### Alternative Installation Methods

<details>
<summary>Using npm</summary>

```bash
npm install
```
</details>

<details>
<summary>Using yarn</summary>

```bash
yarn install
```
</details>

<details>
<summary>Using pnpm</summary>

```bash
pnpm install
```
</details>

## Usage

### Development

```bash
# Run all services in development mode
bun run dev

# Run specific service
moon run api-gateway:dev
moon run user-service:dev
moon run order-service:dev
```

### Build

```bash
# Build all services
bun run build

# Build specific service
moon run api-gateway:build
```

### Testing

```bash
# Run all tests
bun run test

# Run tests for specific service
moon run api-gateway:test
```

### Linting and Formatting

```bash
# Lint all code
bun run lint

# Format all code
bun run format

# Lint specific service
moon run api-gateway:lint
```

### Docker

```bash
# Build all Docker images
moon run :build:container

# Build specific service image
moon run api-gateway:build:container

# Run all services with Docker Compose
docker-compose up -d

# Run specific service
docker-compose up api-gateway
```

## Examples

### Starting the Development Environment

```bash
# Install dependencies
bun install

# Start all services
bun run dev

# Services will be available at:
# - API Gateway: http://localhost:3000
# - User Service: http://localhost:3001
# - Order Service: http://localhost:3002
```

### Building and Running with Docker

```bash
# Build Docker images
moon run :build:container

# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### API Gateway Usage

```bash
# Forward to user service
curl http://localhost:3000/api/users

# Forward to order service
curl http://localhost:3000/api/orders

# Health check
curl http://localhost:3000/health
```

### User Service Usage

```bash
# Register user
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepassword","name":"John Doe"}'

# Login
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepassword"}'
```

### Order Service Usage

```bash
# Create order
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"userId":"user-123","items":[{"productId":"prod-456","quantity":2,"price":29.99}]}'

# Get order
curl http://localhost:3001/api/orders/:id \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
microservices/
├── apps/
│   ├── api-gateway/       # API Gateway (Port 3000)
│   ├── user-service/      # User Service (Port 3001)
│   └── order-service/     # Order Service (Port 3002)
├── packages/
│   ├── types/             # Shared TypeScript types
│   ├── database/          # Database utilities
│   ├── utils/             # Shared utilities
│   └── config/            # Configuration management
├── .moon/                 # Moonrepo configuration
├── .oxlintrc.json         # Oxlint configuration
├── dprint.json            # Dprint configuration
└── docker-compose.yml     # Docker compose configuration
```

## Environment Variables

Create a `.env` file at the root:

```env
NODE_ENV=development
API_GATEWAY_PORT=3000
USER_SERVICE_PORT=3001
ORDER_SERVICE_PORT=3002
USER_SERVICE_URL=http://localhost:3001
ORDER_SERVICE_URL=http://localhost:3002
DATABASE_URL=memory://
JWT_SECRET=dev-secret
JWT_EXPIRES_IN=1d
```

## Tech Stack

- **Runtime**: Bun
- **Monorepo**: Moonrepo
- **Web Framework**: Hono
- **Language**: TypeScript
- **Package Manager**: Bun
- **Linting**: Oxlint
- **Formatting**: Dprint
- **Containerization**: Docker / Podman
- **Build Tool**: Railpack

## Shared Packages

- `@moonrepo/types` - Shared TypeScript types and interfaces
- `@moonrepo/config` - Configuration management utilities
- `@moonrepo/database` - Database connection and utilities
- `@moonrepo/utils` - Shared utility functions

## Best Practices

1. 📦 Use shared packages (types, utils, config) to reduce code duplication
2. 🔗 Define service dependencies clearly in `moon.yml`
3. 🏷️ Use workspace protocol (`workspace:*`) for internal dependencies
4. 📖 Follow `/follow-moonrepo` for additional best practices
5. 🔍 Use oxlint for linting and dprint for formatting
6. 🐳 Use Docker for deployment and development environment
7. 🧪 Write tests for all services and shared packages
8. 📝 Keep documentation up to date

## License

MIT License
