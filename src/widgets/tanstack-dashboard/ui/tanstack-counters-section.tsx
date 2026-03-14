import { useCounters } from '@/demo/tanstack/queries/use-counters'
import { cardStyles } from '@/shared/ui/card.styles'
import { styles } from './styles'

type TanstackCountersSectionProps = {
  search: string
  selectedCounterId: string | null
  onSelectCounter: (counterId: string) => void
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString()
}

export function TanstackCountersSection({
  search,
  selectedCounterId,
  onSelectCounter,
}: TanstackCountersSectionProps) {
  const countersQuery = useCounters({ search })

  const counters = countersQuery.data ?? []

  return (
    <section className={cardStyles.root}>
      <div className={styles.panelTitle}>Counters</div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Current</th>
              <th className={styles.th}>Limit</th>
              <th className={styles.th}>Banned</th>
              <th className={styles.th}>Updated</th>
            </tr>
          </thead>

          <tbody>
            {counters.length ? (
              counters.map((counter) => {
                const isSelected = counter.id === selectedCounterId

                return (
                  <tr
                    key={counter.id}
                    className={isSelected ? styles.trActive : styles.tr}
                    onClick={() => onSelectCounter(counter.id)}
                  >
                    <td className={styles.td}>{counter.name}</td>
                    <td className={styles.td}>{counter.currentValue}</td>
                    <td className={styles.td}>{counter.limit}</td>
                    <td className={styles.td}>{counter.isBanned ? 'Yes' : 'No'}</td>
                    <td className={styles.td}>{formatTime(counter.updatedAt)}</td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td className={styles.empty} colSpan={5}>
                  {countersQuery.isLoading ? 'Loading...' : 'No counters found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}