import { useQuery } from '@tanstack/react-query'

import { countersApi } from '@/shared/api/counters-api'
import { tanstackQueryKeys } from '../query-keys'

type UseCountersParams = {
  search: string
}

export function useCounters(params: UseCountersParams) {
  return useQuery({
    queryKey: tanstackQueryKeys.counters(params.search),
    queryFn: ({ signal }) =>
      countersApi.getList(
        {
          search: params.search || undefined,
        },
        signal,
      ),
    refetchInterval: 10_000,
  })
}