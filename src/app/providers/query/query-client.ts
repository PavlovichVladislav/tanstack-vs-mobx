import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/shared/api/api-error'

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) {
    return false
  }

  if (error instanceof ApiError) {
    if (error.isAborted) {
      return false
    }

    if (error.status !== null && error.status < 500) {
      return false
    }
  }

  return true
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10_000,  /** если ошиблись и кинули 2 запроса */
      gcTime: 5 * 60_000, /** если закрыли страницу, то её query становятся инактивными, данные через 5 минут сотрутся */
      retry: shouldRetry,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})