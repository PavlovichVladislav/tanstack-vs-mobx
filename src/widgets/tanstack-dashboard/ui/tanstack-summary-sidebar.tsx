import { useCounters } from '@/demo/tanstack/queries/use-counters'
import { useTriggers } from '@/demo/tanstack/queries/use-triggers'
import { cardStyles } from '@/shared/ui/card.styles'
import { styles } from './styles'

type TanstackSummarySidebarProps = {
  search: string
  selectedCounterId: string | null
}

export function TanstackSummarySidebar({
  search,
  selectedCounterId,
}: TanstackSummarySidebarProps) {
  const countersQuery = useCounters({ search })
  const triggersQuery = useTriggers({ counterId: selectedCounterId })

  const totalCounters = countersQuery.data?.length ?? 0
  const bannedCounters =
    countersQuery.data?.filter((counter) => counter.isBanned).length ?? 0
  const enabledTriggers =
    triggersQuery.data?.filter((trigger) => trigger.enabled).length ?? 0

  return (
    <aside className={cardStyles.root}>
      <div className={styles.panelTitle}>Summary</div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Total counters</div>
          <div className={styles.summaryValue}>{totalCounters}</div>
          <div className={styles.summaryHint}>
            Этот виджет сам вызывает useCounters и читает shared cache.
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Banned counters</div>
          <div className={styles.summaryValue}>{bannedCounters}</div>
          <div className={styles.summaryHint}>
            Нет отдельного store только ради второго потребителя тех же данных.
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Enabled triggers</div>
          <div className={styles.summaryValue}>{enabledTriggers}</div>
          <div className={styles.summaryHint}>
            Для выбранного counter этот блок сам вызывает useTriggers.
          </div>
        </div>
      </div>
    </aside>
  )
}