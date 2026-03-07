import { httpClient } from './http-client'
import type { Trigger, UpdateTriggerPayload } from '@/entities/trigger/types'

export const triggersApi = {
  getList: (counterId: string, signal?: AbortSignal) =>
    httpClient.get<Trigger[]>(`/triggers/${counterId}`, { signal }),

  update: (
    triggerId: string,
    payload: UpdateTriggerPayload,
    signal?: AbortSignal,
  ) =>
    httpClient.patch<Trigger, UpdateTriggerPayload>(
      `/triggers/${triggerId}`,
      payload,
      { signal },
    ),
}