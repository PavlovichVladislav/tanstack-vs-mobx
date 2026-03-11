export type Counter = {
  id: string
  name: string
  limit: number
  currentValue: number
  isBanned: boolean
  updatedAt: number
}

export type TriggerType = 'telegram' | 'moira'

export type Trigger = {
  id: string
  counterId: string
  type: TriggerType
  threshold: number
  enabled: boolean
}

export type User = {
  id: string
  name: string
  avatar: string
  role: 'admin' | 'viewer'
}

export type ErrorResponse = {
  message: string
  code: string
  details?: Record<string, unknown>
}

export type ServerStats = {
  requestsTotal: number
  failedRequestsTotal: number
  countersUpdatedTotal: number
  startedAt: number
}