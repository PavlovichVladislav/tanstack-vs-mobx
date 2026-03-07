export type TriggerType = 'telegram' | 'moira'

export type Trigger = {
  id: string
  counterId: string
  type: TriggerType
  threshold: number
  enabled: boolean
}

export type UpdateTriggerPayload = {
  threshold?: number
  enabled?: boolean
}