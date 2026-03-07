import { httpClient } from './http-client'
import type { User } from '@/entities/user/types'

export const authApi = {
  getMe: (signal?: AbortSignal) =>
    httpClient.get<User>('/me', { signal }),
}