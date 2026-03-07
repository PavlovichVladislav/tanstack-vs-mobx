import { useQuery } from '@tanstack/react-query'

import { authApi } from '@/shared/api/auth-api'
import { tanstackQueryKeys } from '../query-keys'

export function useMe() {
  return useQuery({
    queryKey: tanstackQueryKeys.me(),
    queryFn: ({ signal }) => authApi.getMe(signal),
  })
}