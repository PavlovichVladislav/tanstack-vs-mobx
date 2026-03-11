import { styles } from './styles'

type TanstackDashboardStatusRowProps = {
  isListLoading: boolean
  isListFetching: boolean
  isListError: boolean
  listErrorMessage: string | null
  isCounterFetching: boolean
  isTriggersFetching: boolean
  isRemovingBan: boolean
  isSavingTrigger: boolean
  isTriggerSaveError: boolean
  triggerSaveErrorMessage: string | null
  hasSelectedCounter: boolean
  totalCounters: number
}

export function TanstackDashboardStatusRow({
  isListLoading,
  isListFetching,
  isListError,
  listErrorMessage,
  isCounterFetching,
  isTriggersFetching,
  isRemovingBan,
  isSavingTrigger,
  isTriggerSaveError,
  triggerSaveErrorMessage,
  hasSelectedCounter,
  totalCounters,
}: TanstackDashboardStatusRowProps) {
  return (
    <div className={styles.statusRow}>
      {isListLoading && <div className={styles.status}>Initial loading...</div>}

      {isListFetching && !isListLoading && (
        <div className={styles.statusFetching}>Background fetching...</div>
      )}

      {isListError && (
        <div className={styles.statusError}>
          {listErrorMessage ?? 'Unknown error'}
        </div>
      )}

      {isCounterFetching && hasSelectedCounter && (
        <div className={styles.statusFetching}>Loading selected counter...</div>
      )}

      {isTriggersFetching && hasSelectedCounter && (
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

      <div className={styles.status}>List size: {totalCounters}</div>
    </div>
  )
}