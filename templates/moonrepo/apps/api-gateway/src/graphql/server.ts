import { createServer } from 'graphql-yoga'
import { typeDefs } from './schema.js'
import { resolvers } from './resolvers.js'

export const yoga = createServer({
  schema: {
    typeDefs,
    resolvers,
  },
  graphqlEndpoint: '/graphql',
  landingPage: false,
})
