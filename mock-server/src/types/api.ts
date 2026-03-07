export type Counter = {
  id: string
  name: string
  limit: number
  currentValue: number
  isBanned: boolean
  updatedAt: number
}

export type Trigger = {
  id: string
  counterId: string
  type: 'telegram' | 'moira'
  threshold: number
  enabled: boolean
}

export type User = {
  id: string
  name: string
  avatar: string
  role: string
}