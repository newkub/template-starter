import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { yoga } from './graphql/server.js'
import webhookRouter from './webhooks/routes.js'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())

app.get('/', (c) => {
  return c.json({ service: 'api-gateway', status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/health', (c) => {
  return c.json({ status: 'healthy' })
})

app.route('/graphql', yoga)
app.route('/webhooks', webhookRouter)

export default {
  port: 3000,
  fetch: app.fetch,
}
