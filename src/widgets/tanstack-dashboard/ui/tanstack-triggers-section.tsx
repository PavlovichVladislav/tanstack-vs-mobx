import type { Trigger } from '@/entities/trigger/types'
import { buttonStyles } from '@/shared/ui/button.styles'
import { cardStyles } from '@/shared/ui/card.styles'
import { styles } from './styles'

type TanstackTriggersSectionProps = {
  selectedCounterId: string | null
  triggers: Trigger[]
  isLoading: boolean
  onEditTrigger: (triggerId: string) => void
}

export function TanstackTriggersSection({
  selectedCounterId,
  triggers,
  isLoading,
  onEditTrigger,
}: TanstackTriggersSectionProps) {
  return (
    <aside className={cardStyles.root}>
      <div className={styles.panelTitle}>Triggers</div>

      {selectedCounterId ? (
        triggers.length ? (
          <div className={styles.triggersList}>
            {triggers.map((trigger) => (
              <div key={trigger.id} className={styles.triggerItem}>
                <div className={styles.triggerHeader}>
                  <div className={styles.triggerTitle}>
                    {trigger.type} / threshold {trigger.threshold}
                  </div>

                  <div
                    className={
                      trigger.enabled
                        ? styles.triggerStatusOn
                        : styles.triggerStatusOff
                    }
                  >
                    {trigger.enabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>

                <div className={styles.triggerMeta}>
                  triggerId: {trigger.id} · counterId: {trigger.counterId}
                </div>

                <div className={styles.triggerActions}>
                  <button
                    type="button"
                    className={buttonStyles.secondary}
                    onClick={() => onEditTrigger(trigger.id)}
                  >
                    Edit trigger
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : isLoading ? (
          <div className={styles.sideList}>
            <div className={styles.sideItem}>
              <div className={styles.sideValue}>Loading triggers...</div>
            </div>
          </div>
        ) : (
          <div className={styles.sideList}>
            <div className={styles.sideItem}>
              <div className={styles.sideValue}>No triggers found.</div>
            </div>
          </div>
        )
      ) : (
        <div className={styles.sideList}>
          <div className={styles.sideItem}>
            <div className={styles.sideValue}>
              Select a counter to load triggers.
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}