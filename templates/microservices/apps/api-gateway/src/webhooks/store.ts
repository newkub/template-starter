export interface WebhookEvent {
  id: string
  eventType: string
  data: unknown
  timestamp: string
}

export interface WebhookSubscription {
  id: string
  url: string
  events: string[]
  secret: string
  active: boolean
  createdAt: string
}

class WebhookStore {
  private webhooks: Map<string, WebhookSubscription> = new Map()

  register(subscription: Omit<WebhookSubscription, 'id' | 'createdAt'>): WebhookSubscription {
    const id = crypto.randomUUID()
    const webhook: WebhookSubscription = {
      ...subscription,
      id,
      createdAt: new Date().toISOString(),
    }
    this.webhooks.set(id, webhook)
    return webhook
  }

  unregister(id: string): boolean {
    return this.webhooks.delete(id)
  }

  get(id: string): WebhookSubscription | undefined {
    return this.webhooks.get(id)
  }

  getAll(): WebhookSubscription[] {
    return Array.from(this.webhooks.values())
  }

  findByEvent(eventType: string): WebhookSubscription[] {
    return Array.from(this.webhooks.values()).filter(
      (webhook) => webhook.active && webhook.events.includes(eventType)
    )
  }

  update(id: string, updates: Partial<Omit<WebhookSubscription, 'id' | 'createdAt'>>): WebhookSubscription | null {
    const webhook = this.webhooks.get(id)
    if (!webhook) return null

    const updated = { ...webhook, ...updates }
    this.webhooks.set(id, updated)
    return updated
  }
}

export const webhookStore = new WebhookStore()
