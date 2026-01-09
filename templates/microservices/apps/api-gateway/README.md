# API Gateway

The API Gateway serves as the single entry point for all client requests in the microservices architecture. It handles request routing, load balancing, and provides a unified interface to the underlying services.

## Features

- 🚀 High-performance HTTP routing with Hono framework
- 🔄 Request forwarding to user and order services
- 🛡️ Centralized error handling and logging
- 🔗 GraphQL API for flexible data queries
- 🔔 Webhook system for event-driven integrations
- ⚡ Built with Bun for maximum performance
- 📦 Type-safe with TypeScript
- 🐳 Docker support via Railpack

## Goal

- 🎯 Provide a unified entry point for all API requests
- 🎯 Abstract backend service complexity from clients
- 🎯 Enable centralized cross-cutting concerns (auth, logging, rate limiting)
- 🎯 Simplify client-side integration

## Design Principles

- 🏗️ Single Responsibility: Focus only on routing and gateway concerns
- 🔒 Security First: Validate and sanitize all incoming requests
- 📊 Observability: Log all requests for monitoring and debugging
- ⚡ Performance: Minimize latency and overhead
- 🔄 Resilience: Handle service failures gracefully

## Installation

### Using Bun (Recommended)

```bash
cd apps/api-gateway
bun install
```

### Using npm

```bash
cd apps/api-gateway
npm install
```

## Usage

### Development

```bash
# Run in development mode
bun run dev

# Run with Moonrepo
moon run api-gateway:dev
```

### Build

```bash
# Build the project
bun run build

# Build with Moonrepo
moon run api-gateway:build
```

### Production

```bash
# Start the production server
bun run start

# Start with Moonrepo
moon run api-gateway:start
```

### Docker

```bash
# Build Docker image with Railpack
moon run api-gateway:build:container

# Run with Docker Compose
docker-compose up api-gateway
```

## Examples

### Basic Request Routing

```bash
# Forward to user service
curl http://localhost:3000/api/users

# Forward to order service
curl http://localhost:3000/api/orders
```

### Health Check

```bash
curl http://localhost:3000/health
```

### GraphQL API

```bash
# Query all users
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ users { id email name } }"}'

# Create a new user via GraphQL
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { registerUser(input: { email: \"test@example.com\", password: \"password123\", name: \"Test User\" }) { id email name } }"
  }'

# Query user orders
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ userOrders(userId: \"user-123\") { id total status } }"}'
```

### Webhook System

```bash
# Register a new webhook
curl -X POST http://localhost:3000/webhooks/register \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/webhooks",
    "events": ["user.registered", "order.created"],
    "secret": "your-webhook-secret-key-min-16-chars"
  }'

# List all webhooks
curl http://localhost:3000/webhooks

# Test a webhook
curl -X POST http://localhost:3000/webhooks/{webhook-id}/test

# Unregister a webhook
curl -X DELETE http://localhost:3000/webhooks/{webhook-id}
```

## License

MIT License
