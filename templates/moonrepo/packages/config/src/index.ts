export const config = {
  env: process.env.NODE_ENV || 'development',
  port: {
    apiGateway: parseInt(process.env.API_GATEWAY_PORT || '3000', 10),
    userService: parseInt(process.env.USER_SERVICE_PORT || '3001', 10),
    orderService: parseInt(process.env.ORDER_SERVICE_PORT || '3002', 10),
  },
  services: {
    userService: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    orderService: process.env.ORDER_SERVICE_URL || 'http://localhost:3002',
  },
  database: {
    url: process.env.DATABASE_URL || 'memory://',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
} as const

export type Config = typeof config
