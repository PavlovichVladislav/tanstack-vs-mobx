import { observer } from 'mobx-react-lite'

import { useMobxStores } from '@/demo/mobx/stores/store-context'
import { styles } from './styles'

export const MobxDashboardStatusRow = observer(() => {
  const { authStore, countersStore, triggersStore, uiStore } = useMobxStores()

  return (
    <div className={styles.statusRow}>
      {authStore.isLoading && <div className={styles.status}>Loading auth...</div>}

      {countersStore.isListLoading && (
        <div className={styles.status}>Initial loading...</div>
      )}

      {countersStore.isListFetching && !countersStore.isListLoading && (
        <div className={styles.statusFetching}>Background fetching...</div>
      )}

      {countersStore.listError && (
        <div className={styles.statusError}>{countersStore.listError}</div>
      )}

      {countersStore.isDetailsLoading && uiStore.selectedCounterId && (
        <div className={styles.statusFetching}>Loading selected counter...</div>
      )}

      {triggersStore.isLoading && uiStore.selectedCounterId && (
        <div className={styles.statusFetching}>Loading triggers...</div>
      )}

      {countersStore.isRemovingBan && (
        <div className={styles.statusFetching}>Removing ban...</div>
      )}

      {triggersStore.isSaving && (
        <div className={styles.statusFetching}>Saving trigger...</div>
      )}

      {triggersStore.saveError && (
        <div className={styles.statusError}>{triggersStore.saveError}</div>
      )}

      <div className={styles.status}>List size: {countersStore.totalCounters}</div>

      <div className={styles.status}>
        Polling: {countersStore.hasPolling ? 'manual timer active' : 'off'}
      </div>
    </div>
  )
})