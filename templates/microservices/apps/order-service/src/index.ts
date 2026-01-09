import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())

app.get('/', (c) => {
  return c.json({ service: 'order-service', status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/health', (c) => {
  return c.json({ status: 'healthy' })
})

app.get('/orders/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id, userId: `user-${id}`, items: ['item1', 'item2'], total: 100 })
})

export default {
  port: 3002,
  fetch: app.fetch,
}
