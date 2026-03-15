import { useCounter } from '@/demo/tanstack/queries/use-counter'
import { useCounters } from '@/demo/tanstack/queries/use-counters'
import { useTriggers } from '@/demo/tanstack/queries/use-triggers'
import { styles } from './styles'

type TanstackDashboardStatusRowProps = {
  search: string
  selectedCounterId: string | null
  isAuthLoading: boolean
  authErrorMessage: string | null
  isRemovingBan: boolean
  isSavingTrigger: boolean
  isTriggerSaveError: boolean
  triggerSaveErrorMessage: string | null
}

export function TanstackDashboardStatusRow({
  search,
  selectedCounterId,
  isAuthLoading,
  authErrorMessage,
  isRemovingBan,
  isSavingTrigger,
  isTriggerSaveError,
  triggerSaveErrorMessage,
}: TanstackDashboardStatusRowProps) {
  const countersQuery = useCounters({ search })
  const counterQuery = useCounter({ counterId: selectedCounterId })
  const triggersQuery = useTriggers({ counterId: selectedCounterId })

  return (
    <div className={styles.statusRow}>
      {isAuthLoading && <div className={styles.status}>Loading auth...</div>}

      {authErrorMessage && (
        <div className={styles.statusError}>{authErrorMessage}</div>
      )}

      {countersQuery.isLoading && (
        <div className={styles.status}>Initial loading...</div>
      )}

      {countersQuery.isFetching && !countersQuery.isLoading && (
        <div className={styles.statusFetching}>Background fetching...</div>
      )}

      {countersQuery.isError && (
        <div className={styles.statusError}>
          {countersQuery.error instanceof Error
            ? countersQuery.error.message
            : 'Unknown error'}
        </div>
      )}

      {counterQuery.isFetching && selectedCounterId && (
        <div className={styles.statusFetching}>Loading selected counter...</div>
      )}

      {triggersQuery.isFetching && selectedCounterId && (
        <div className={styles.statusFetching}>Loading triggers...</div>
      )}

      {isRemovingBan && (
        <div className={styles.statusFetching}>Removing ban...</div>
      )}

      {isSavingTrigger && (
        <div className={styles.statusFetching}>Saving trigger...</div>
      )}

      {isTriggerSaveError && (
        <div className={styles.statusError}>
          {triggerSaveErrorMessage ?? 'Trigger update failed'}
        </div>
      )}

      <div className={styles.status}>
        List size: {countersQuery.data?.length ?? 0}
      </div>
    </div>
  )
}
