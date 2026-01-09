export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: string
  createdAt: string
}

export interface OrderItem {
  productId: string
  quantity: number
  price: number
}

export interface LoginResponse {
  token: string
}
