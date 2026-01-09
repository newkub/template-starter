import { gql } from 'graphql-tag'

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    createdAt: String!
  }

  type Order {
    id: ID!
    userId: ID!
    items: [OrderItem!]!
    total: Float!
    status: String!
    createdAt: String!
  }

  type OrderItem {
    productId: ID!
    quantity: Int!
    price: Float!
  }

  type Query {
    health: String!
    users: [User!]!
    user(id: ID!): User
    orders: [Order!]!
    order(id: ID!): Order
    userOrders(userId: ID!): [Order!]!
  }

  type Mutation {
    registerUser(input: RegisterUserInput!): User!
    loginUser(input: LoginInput!): String!
    createOrder(input: CreateOrderInput!): Order!
  }

  input RegisterUserInput {
    email: String!
    password: String!
    name: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateOrderInput {
    userId: ID!
    items: [OrderItemInput!]!
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
    price: Float!
  }
`
