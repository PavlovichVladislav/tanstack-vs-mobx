import { useQuery } from '@tanstack/react-query'

import { countersApi } from '@/shared/api/counters-api'
import { tanstackQueryKeys } from '../query-keys'

type UseCounterParams = {
  counterId: string | null
}

export function useCounter(params: UseCounterParams) {
  return useQuery({
    queryKey: params.counterId
      ? tanstackQueryKeys.counter(params.counterId)
      : ['counter', 'empty'],
    queryFn: ({ signal }) => {
      if (!params.counterId) {
        throw new Error('counterId is required')
      }

      return countersApi.getById(params.counterId, signal)
    },
    enabled: Boolean(params.counterId), /** @todo зачем? */
  })
}