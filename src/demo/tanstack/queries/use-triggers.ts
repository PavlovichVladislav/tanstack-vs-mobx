import { useQuery } from '@tanstack/react-query'

import { triggersApi } from '@/shared/api/triggers-api'
import { tanstackQueryKeys } from '../query-keys'

type UseTriggersParams = {
  counterId: string | null
}

export function useTriggers(params: UseTriggersParams) {
  return useQuery({
    queryKey: params.counterId
      ? tanstackQueryKeys.triggers(params.counterId)
      : ['triggers', 'empty'],
    queryFn: ({ signal }) => {
      if (!params.counterId) {
        throw new Error('counterId is required')
      }

      return triggersApi.getList(params.counterId, signal)
    },
    enabled: Boolean(params.counterId),
  })
}