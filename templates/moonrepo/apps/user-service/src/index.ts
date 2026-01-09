import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())

app.get('/', (c) => {
  return c.json({ service: 'user-service', status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/health', (c) => {
  return c.json({ status: 'healthy' })
})

app.get('/users/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id, name: `User ${id}`, email: `user${id}@example.com` })
})

export default {
  port: 3001,
  fetch: app.fetch,
}
