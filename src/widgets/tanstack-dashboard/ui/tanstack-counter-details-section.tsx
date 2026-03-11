import type { Counter } from '@/entities/counter/types'
import { buttonStyles } from '@/shared/ui/button.styles'
import { cardStyles } from '@/shared/ui/card.styles'
import { styles } from './styles'

type TanstackCounterDetailsSectionProps = {
  counter: Counter | null
  isRemovingBan: boolean
  onRemoveBan: () => void
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString()
}

export function TanstackCounterDetailsSection({
  counter,
  isRemovingBan,
  onRemoveBan,
}: TanstackCounterDetailsSectionProps) {
  return (
    <section className={cardStyles.root}>
      <div className={styles.panelTitle}>Counter details</div>

      {counter ? (
        <>
          <div className={styles.detailsGrid}>
            <div className={styles.detailRow}>
              <div className={styles.detailKey}>Name</div>
              <div className={styles.detailValueStrong}>{counter.name}</div>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailKey}>Counter id</div>
              <div className={`${styles.detailValue} ${styles.mono}`}>
                {counter.id}
              </div>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailKey}>Current value</div>
              <div className={styles.detailValue}>{counter.currentValue}</div>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailKey}>Limit</div>
              <div className={styles.detailValue}>{counter.limit}</div>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailKey}>Ban status</div>
              <div className={styles.detailValueStrong}>
                {counter.isBanned ? 'Banned' : 'Active'}
              </div>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailKey}>Updated at</div>
              <div className={styles.detailValue}>{formatTime(counter.updatedAt)}</div>
            </div>
          </div>

          <div className={styles.actionRow}>
            <button
              type="button"
              className={buttonStyles.primary}
              onClick={onRemoveBan}
              disabled={!counter.isBanned || isRemovingBan}
            >
              Remove ban
            </button>

            <div className={styles.infoText}>
              Remove ban использует mutation + invalidate list/details.
            </div>
          </div>
        </>
      ) : (
        <div className={styles.sideList}>
          <div className={styles.sideItem}>
            <div className={styles.sideLabel}>Selection</div>
            <div className={styles.sideValue}>Choose a counter from the table.</div>
          </div>
        </div>
      )}
    </section>
  )
}