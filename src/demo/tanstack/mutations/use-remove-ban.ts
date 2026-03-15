import { useMutation, useQueryClient } from '@tanstack/react-query'

import { countersApi } from '@/shared/api/counters-api'
import { tanstackQueryKeys } from '../query-keys'

export function useRemoveBan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (counterId: string) => countersApi.removeBan(counterId),

    onSuccess: (updatedCounter) => {
      queryClient.setQueryData(
        tanstackQueryKeys.counter(updatedCounter.id),
        updatedCounter,
      )

      queryClient.invalidateQueries({
        queryKey: ['counters'],
      })
    },
  })
}
