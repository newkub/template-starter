# Order Service

The Order Service handles all order-related operations in the microservices architecture, including order creation, management, status tracking, and integration with other services for order fulfillment.

## Features

- 🛒 Order creation and management
- 📦 Order status tracking and updates
- 💰 Order processing and validation
- 🔗 Integration with user and inventory services
- ⚡ High-performance with Bun runtime
- 📦 Type-safe with TypeScript
- 🐳 Docker support via Railpack

## Goal

- 🎯 Provide comprehensive order management capabilities
- 🎯 Ensure order data accuracy and consistency
- 🎯 Enable seamless order processing workflow
- 🎯 Support scalable order handling

## Design Principles

- 🎯 Order-Centric: Focus on order lifecycle and integrity
- 🔒 Data Consistency: Maintain accurate order state
- 📊 Scalability: Handle increasing order volumes
- 🔄 Reliability: Ensure order processing reliability
- 🧩 Integration: Seamlessly connect with other services

## Installation

### Using Bun (Recommended)

```bash
cd apps/order-service
bun install
```

### Using npm

```bash
cd apps/order-service
npm install
```

## Usage

### Development

```bash
# Run in development mode
bun run dev

# Run with Moonrepo
moon run order-service:dev
```

### Build

```bash
# Build the project
bun run build

# Build with Moonrepo
moon run order-service:build
```

### Production

```bash
# Start the production server
bun run start

# Start with Moonrepo
moon run order-service:start
```

### Docker

```bash
# Build Docker image with Railpack
moon run order-service:build:container

# Run with Docker Compose
docker-compose up order-service
```

## Examples

### Create Order

```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": "user-123",
    "items": [
      {
        "productId": "prod-456",
        "quantity": 2,
        "price": 29.99
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "zipCode": "10001"
    }
  }'
```

### Get Order

```bash
curl http://localhost:3001/api/orders/:id \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Order Status

```bash
curl -X PATCH http://localhost:3001/api/orders/:id/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "shipped"
  }'
```

### List User Orders

```bash
curl http://localhost:3001/api/users/:userId/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Health Check

```bash
curl http://localhost:3001/health
```

## License

MIT License
