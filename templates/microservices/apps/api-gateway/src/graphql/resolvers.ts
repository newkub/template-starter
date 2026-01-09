import { createEvent, dispatchWebhook } from '../webhooks/dispatcher.js'
import type { User, Order, LoginResponse } from '../types.js'

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001'
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3002'

async function fetchFromService(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`Service error: ${response.statusText}`)
  }

  return response.json()
}

export const resolvers = {
  Query: {
    health: () => 'API Gateway is healthy!',

    users: async () => {
      const result = await fetchFromService(`${USER_SERVICE_URL}/api/users`)
      return result as User[]
    },

    user: async (_: unknown, { id }: { id: string }) => {
      const result = await fetchFromService(`${USER_SERVICE_URL}/api/users/${id}`)
      return result as User
    },

    orders: async () => {
      const result = await fetchFromService(`${ORDER_SERVICE_URL}/api/orders`)
      return result as Order[]
    },

    order: async (_: unknown, { id }: { id: string }) => {
      const result = await fetchFromService(`${ORDER_SERVICE_URL}/api/orders/${id}`)
      return result as Order
    },

    userOrders: async (_: unknown, { userId }: { userId: string }) => {
      const result = await fetchFromService(`${ORDER_SERVICE_URL}/api/orders?userId=${userId}`)
      return result as Order[]
    },
  },

  Mutation: {
    registerUser: async (_: unknown, { input }: { input: { email: string; password: string; name: string } }) => {
      const user = await fetchFromService(`${USER_SERVICE_URL}/api/users/register`, {
        method: 'POST',
        body: JSON.stringify(input),
      }) as User

      dispatchWebhook(
        createEvent('user.registered', {
          userId: user.id,
          email: user.email,
          name: user.name,
        })
      ).catch(console.error)

      return user
    },

    loginUser: async (_: unknown, { input }: { input: { email: string; password: string } }) => {
      const response = await fetchFromService(`${USER_SERVICE_URL}/api/users/login`, {
        method: 'POST',
        body: JSON.stringify(input),
      }) as LoginResponse

      dispatchWebhook(
        createEvent('user.logged_in', {
          email: input.email,
          timestamp: new Date().toISOString(),
        })
      ).catch(console.error)

      return response.token
    },

    createOrder: async (_: unknown, { input }: { input: { userId: string; items: Array<{ productId: string; quantity: number; price: number }> } }) => {
      const order = await fetchFromService(`${ORDER_SERVICE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      }) as Order

      dispatchWebhook(
        createEvent('order.created', {
          orderId: order.id,
          userId: order.userId,
          total: order.total,
          items: order.items,
        })
      ).catch(console.error)

      return order
    },
  },
}
