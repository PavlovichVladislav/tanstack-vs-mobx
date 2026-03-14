import { observer } from 'mobx-react-lite'

import { useMobxStores } from '@/demo/mobx/stores/store-context'
import { buttonStyles } from '@/shared/ui/button.styles'
import { cardStyles } from '@/shared/ui/card.styles'
import { styles } from './styles'

export const MobxTriggersSection = observer(() => {
  const { triggersStore, uiStore } = useMobxStores()

  const selectedTriggers = triggersStore.getTriggers(uiStore.selectedCounterId)

  return (
    <aside className={cardStyles.root}>
      <div className={styles.panelTitle}>Triggers</div>

      {uiStore.selectedCounterId ? (
        selectedTriggers.length ? (
          <div className={styles.triggersList}>
            {selectedTriggers.map((trigger) => (
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
                    onClick={() => uiStore.openTriggerModal(trigger.id)}
                  >
                    Edit trigger
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : triggersStore.isLoading ? (
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
})