# User Service

The User Service is responsible for managing user-related operations including authentication, registration, profile management, and user data persistence in the microservices architecture.

## Features

- 👤 User registration and authentication
- 🔐 JWT-based authentication
- 📝 User profile management
- 🔍 User data retrieval and updates
- ⚡ High-performance with Bun runtime
- 📦 Type-safe with TypeScript
- 🐳 Docker support via Railpack

## Goal

- 🎯 Provide secure user management capabilities
- 🎯 Handle user authentication and authorization
- 🎯 Maintain user data integrity and consistency
- 🎯 Enable seamless user experience across the platform

## Design Principles

- 🔒 Security First: Protect user data with encryption and secure authentication
- 🎯 User-Centric: Focus on user experience and data privacy
- 📊 Scalability: Handle growing user base efficiently
- 🔄 Reliability: Ensure consistent user data access
- 🧩 Modularity: Keep user logic isolated and maintainable

## Installation

### Using Bun (Recommended)

```bash
cd apps/user-service
bun install
```

### Using npm

```bash
cd apps/user-service
npm install
```

## Usage

### Development

```bash
# Run in development mode
bun run dev

# Run with Moonrepo
moon run user-service:dev
```

### Build

```bash
# Build the project
bun run build

# Build with Moonrepo
moon run user-service:build
```

### Production

```bash
# Start the production server
bun run start

# Start with Moonrepo
moon run user-service:start
```

### Docker

```bash
# Build Docker image with Railpack
moon run user-service:build:container

# Run with Docker Compose
docker-compose up user-service
```

## Examples

### User Registration

```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe"
  }'
```

### User Login

```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

### Get User Profile

```bash
curl http://localhost:3001/api/users/:id \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Health Check

```bash
curl http://localhost:3001/health
```

## License

MIT License
