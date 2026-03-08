import { useMutation, useQueryClient } from '@tanstack/react-query'

import { triggersApi } from '@/shared/api/triggers-api'
import type { Trigger, UpdateTriggerPayload } from '@/entities/trigger/types'
import { tanstackQueryKeys } from '../query-keys'

type UpdateTriggerArgs = {
  triggerId: string
  counterId: string
  payload: UpdateTriggerPayload
}

export function useUpdateTrigger() {
  const queryClient = useQueryClient()

  /** @todo откуда такая прокидка аргументов? */
  return useMutation({
    mutationFn: ({ triggerId, payload }: UpdateTriggerArgs) =>
      triggersApi.update(triggerId, payload),

    onSuccess: (updatedTrigger, variables) => {
      queryClient.setQueryData<Trigger[] | undefined>(
        tanstackQueryKeys.triggers(variables.counterId),
        (current) => {
          if (!current) {
            return current
          }

          return current.map((trigger) =>
            trigger.id === updatedTrigger.id ? updatedTrigger : trigger,
          )
        },
      )
    },
  })
}