import { cardStyles } from '@/shared/ui/card.styles'
import { styles } from './styles'

type TanstackSummarySidebarProps = {
  totalCounters: number
  bannedCounters: number
  enabledTriggers: number
}

export function TanstackSummarySidebar({
  totalCounters,
  bannedCounters,
  enabledTriggers,
}: TanstackSummarySidebarProps) {
  return (
    <aside className={cardStyles.root}>
      <div className={styles.panelTitle}>Summary</div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Total counters</div>
          <div className={styles.summaryValue}>{totalCounters}</div>
          <div className={styles.summaryHint}>
            Берётся из того же query cache, что и таблица.
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Banned counters</div>
          <div className={styles.summaryValue}>{bannedCounters}</div>
          <div className={styles.summaryHint}>
            После remove ban значение обновляется без отдельного store.
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Enabled triggers</div>
          <div className={styles.summaryValue}>{enabledTriggers}</div>
          <div className={styles.summaryHint}>
            Для выбранного counter загружается отдельный query.
          </div>
        </div>
      </div>
    </aside>
  )
}