import { webhookStore, type WebhookEvent } from './store.js'

export async function dispatchWebhook(event: WebhookEvent): Promise<void> {
  const subscriptions = webhookStore.findByEvent(event.eventType)

  for (const subscription of subscriptions) {
    try {
      const signature = await generateSignature(event, subscription.secret)

      const response = await fetch(subscription.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Event': event.eventType,
          'X-Webhook-Signature': signature,
          'X-Webhook-Timestamp': event.timestamp,
        },
        body: JSON.stringify(event),
      })

      if (!response.ok) {
        console.error(`Webhook delivery failed for ${subscription.url}: ${response.statusText}`)
      }
    } catch (error) {
      console.error(`Error delivering webhook to ${subscription.url}:`, error)
    }
  }
}

async function generateSignature(event: WebhookEvent, secret: string): Promise<string> {
  const payload = JSON.stringify(event)
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(payload))
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function createEvent(eventType: string, data: unknown): WebhookEvent {
  return {
    id: crypto.randomUUID(),
    eventType,
    data,
    timestamp: new Date().toISOString(),
  }
}
