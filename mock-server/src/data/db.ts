import { Counter, Trigger, User } from '../types/api'

const counterNames = [
  'login-attempts',
  'password-reset',
  'sms-verification',
  'api-public-search',
  'api-private-profile',
  'checkout-submit',
  'promo-activation',
  'email-resend',
  'support-ticket',
  'admin-export',
  'comment-create',
  'payment-init',
  'payment-confirm',
  'report-download',
  'webhook-delivery',
  'telegram-bot-send',
  'moira-alert-send',
  'session-refresh',
  'security-check',
  'device-link',
]

export const user: User = {
  id: 'u1',
  name: 'Admin User',
  avatar: 'https://i.pravatar.cc/150?img=3',
  role: 'admin',
}

export const counters: Counter[] = counterNames.map((name, index) => {
  const limit = 100 + (index % 4) * 50
  const currentValue = Math.floor(Math.random() * (limit + 40))
  const isBanned = currentValue > limit && Math.random() > 0.35

  return {
    id: `c-${index + 1}`,
    name,
    limit,
    currentValue,
    isBanned,
    updatedAt: Date.now() - Math.floor(Math.random() * 60_000),
  }
})

export const triggers: Trigger[] = counters.flatMap((counter, index) => {
  const result: Trigger[] = []

  result.push({
    id: `t-${index + 1}-telegram`,
    counterId: counter.id,
    type: 'telegram',
    threshold: Math.max(50, counter.limit - 10),
    enabled: Math.random() > 0.3,
  })

  if (index % 2 === 0) {
    result.push({
      id: `t-${index + 1}-moira`,
      counterId: counter.id,
      type: 'moira',
      threshold: Math.max(70, counter.limit - 20),
      enabled: Math.random() > 0.45,
    })
  }

  return result
})