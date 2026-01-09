import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { webhookStore } from './store.js'
import { createEvent, dispatchWebhook } from './dispatcher.js'

const webhookRouter = new Hono()

const registerSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).min(1),
  secret: z.string().min(16),
})

webhookRouter.post('/register', zValidator('json', registerSchema), async (c) => {
  const { url, events, secret } = c.req.valid('json')

  const webhook = webhookStore.register({
    url,
    events,
    secret,
    active: true,
  })

  await dispatchWebhook(
    createEvent('webhook.registered', {
      webhookId: webhook.id,
      url: webhook.url,
      events: webhook.events,
    })
  )

  return c.json(webhook, 201)
})

webhookRouter.delete('/:id', (c) => {
  const id = c.req.param('id')
  const deleted = webhookStore.unregister(id)

  if (!deleted) {
    return c.json({ error: 'Webhook not found' }, 404)
  }

  dispatchWebhook(
    createEvent('webhook.unregistered', {
      webhookId: id,
    })
  ).catch(console.error)

  return c.json({ message: 'Webhook unregistered successfully' })
})

webhookRouter.get('/', (c) => {
  const webhooks = webhookStore.getAll()
  return c.json(webhooks)
})

webhookRouter.get('/:id', (c) => {
  const id = c.req.param('id')
  const webhook = webhookStore.get(id)

  if (!webhook) {
    return c.json({ error: 'Webhook not found' }, 404)
  }

  return c.json(webhook)
})

webhookRouter.patch('/:id', zValidator('json', registerSchema.partial()), async (c) => {
  const id = c.req.param('id')
  const updates = c.req.valid('json')

  const updated = webhookStore.update(id, updates)

  if (!updated) {
    return c.json({ error: 'Webhook not found' }, 404)
  }

  await dispatchWebhook(
    createEvent('webhook.updated', {
      webhookId: id,
      updates,
    })
  )

  return c.json(updated)
})

webhookRouter.post('/:id/test', async (c) => {
  const id = c.req.param('id')
  const webhook = webhookStore.get(id)

  if (!webhook) {
    return c.json({ error: 'Webhook not found' }, 404)
  }

  await dispatchWebhook(
    createEvent('webhook.test', {
      webhookId: id,
      message: 'This is a test webhook event',
    })
  )

  return c.json({ message: 'Test webhook sent successfully' })
})

export default webhookRouter
