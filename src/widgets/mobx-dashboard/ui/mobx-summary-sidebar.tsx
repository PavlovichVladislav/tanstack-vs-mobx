import { observer } from 'mobx-react-lite'

import { useMobxStores } from '@/demo/mobx/stores/store-context'
import { cardStyles } from '@/shared/ui/card.styles'
import { styles } from './styles'

export const MobxSummarySidebar = observer(() => {
  const { countersStore, triggersStore, uiStore } = useMobxStores()

  return (
    <aside className={cardStyles.root}>
      <div className={styles.panelTitle}>Summary</div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Total counters</div>
          <div className={styles.summaryValue}>{countersStore.totalCounters}</div>
          <div className={styles.summaryHint}>
            Сводка читает данные напрямую из counters store.
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Banned counters</div>
          <div className={styles.summaryValue}>{countersStore.bannedCounters}</div>
          <div className={styles.summaryHint}>
            После remove ban store нужно синхронизировать вручную.
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Enabled triggers</div>
          <div className={styles.summaryValue}>
            {triggersStore.getEnabledTriggersCount(uiStore.selectedCounterId)}
          </div>
          <div className={styles.summaryHint}>
            Отдельный store для triggers + ручная загрузка по selected id.
          </div>
        </div>
      </div>
    </aside>
  )
})