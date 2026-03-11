import type { Counter } from '@/entities/counter/types'
import { cardStyles } from '@/shared/ui/card.styles'
import { styles } from './styles'

type TanstackCountersSectionProps = {
  counters: Counter[]
  selectedCounterId: string | null
  isLoading: boolean
  onSelectCounter: (counterId: string) => void
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString()
}

export function TanstackCountersSection({
  counters,
  selectedCounterId,
  isLoading,
  onSelectCounter,
}: TanstackCountersSectionProps) {
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
                  {isLoading ? 'Loading...' : 'No counters found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}