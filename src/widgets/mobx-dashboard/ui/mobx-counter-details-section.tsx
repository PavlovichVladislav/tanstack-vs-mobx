import { observer } from 'mobx-react-lite'

import { useMobxStores } from '@/demo/mobx/stores/store-context'
import { buttonStyles } from '@/shared/ui/button.styles'
import { cardStyles } from '@/shared/ui/card.styles'
import { styles } from './styles'

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString()
}

type MobxCounterDetailsSectionProps = {
  onRemoveBan: (counterId: string) => void
}

export const MobxCounterDetailsSection = observer(
  ({ onRemoveBan }: MobxCounterDetailsSectionProps) => {
    const { countersStore } = useMobxStores()
    const selectedCounter = countersStore.selectedCounter

    return (
      <section className={cardStyles.root}>
        <div className={styles.panelTitle}>Counter details</div>

        {selectedCounter ? (
          <>
            <div className={styles.detailsGrid}>
              <div className={styles.detailRow}>
                <div className={styles.detailKey}>Name</div>
                <div className={styles.detailValueStrong}>{selectedCounter.name}</div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.detailKey}>Counter id</div>
                <div className={`${styles.detailValue} ${styles.mono}`}>
                  {selectedCounter.id}
                </div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.detailKey}>Current value</div>
                <div className={styles.detailValue}>
                  {selectedCounter.currentValue}
                </div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.detailKey}>Limit</div>
                <div className={styles.detailValue}>{selectedCounter.limit}</div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.detailKey}>Ban status</div>
                <div className={styles.detailValueStrong}>
                  {selectedCounter.isBanned ? 'Banned' : 'Active'}
                </div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.detailKey}>Updated at</div>
                <div className={styles.detailValue}>
                  {formatTime(selectedCounter.updatedAt)}
                </div>
              </div>
            </div>

            <div className={styles.actionRow}>
              <button
                type="button"
                className={buttonStyles.primary}
                onClick={() => onRemoveBan(selectedCounter.id)}
                disabled={
                  !selectedCounter.isBanned || countersStore.isRemovingBan
                }
              >
                Remove ban
              </button>

              <div className={styles.infoText}>
                Здесь синхронизацию list/details после mutation делает store.
              </div>
            </div>
          </>
        ) : (
          <div className={styles.sideList}>
            <div className={styles.sideItem}>
              <div className={styles.sideLabel}>Selection</div>
              <div className={styles.sideValue}>
                Choose a counter from the table.
              </div>
            </div>
          </div>
        )}
      </section>
    )
  },
)