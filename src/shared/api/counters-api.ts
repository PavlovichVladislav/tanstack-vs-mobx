import { httpClient } from './http-client'
import type { Counter } from '@/entities/counter/types'

export const countersApi = {
  getList: (params?: { search?: string }, signal?: AbortSignal) =>
    httpClient.get<Counter[]>('/counters', {
      query: {
        search: params?.search,
      },
      signal,
    }),

  getById: (counterId: string, signal?: AbortSignal) =>
    httpClient.get<Counter>(`/counters/${counterId}`, { signal }),

  removeBan: (counterId: string, signal?: AbortSignal) =>
    httpClient.post<Counter>(`/counters/${counterId}/remove-ban`, undefined, {
      signal,
    }),
}