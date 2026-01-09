import type { User, Order } from '@moonrepo/types'

export class Database {
  private users: Map<string, User> = new Map()
  private orders: Map<string, Order> = new Map()

  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null
  }

  async createUser(user: User): Promise<User> {
    this.users.set(user.id, user)
    return user
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.orders.get(id) || null
  }

  async createOrder(order: Order): Promise<Order> {
    this.orders.set(order.id, order)
    return order
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter((order) => order.userId === userId)
  }
}

export const db = new Database()
