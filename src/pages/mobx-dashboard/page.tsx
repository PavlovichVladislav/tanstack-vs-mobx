import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'

import { MobxStoresProvider, useMobxStores } from '@/demo/mobx/stores/store-context'
import { buttonStyles } from '@/shared/ui/button.styles'
import { cardStyles } from '@/shared/ui/card.styles'
import { inputStyles } from '@/shared/ui/input.styles'
import { TriggerEditorModal } from '@/widgets/trigger-editor/ui/trigger-editor-modal'

import { styles } from './styles'

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString()
}

const MobxDashboardContent = observer(() => {
  const { authStore, countersStore, triggersStore, uiStore } = useMobxStores()

  useEffect(() => {
    void authStore.fetchMe()
  }, [authStore])

  useEffect(() => {
    void countersStore.fetchCounters(uiStore.search)
  }, [countersStore, uiStore.search])

  useEffect(() => {
    countersStore.startPolling()

    return () => {
      countersStore.stopPolling()
    }
  }, [countersStore])

  useEffect(() => {
    if (!uiStore.selectedCounterId) {
      return
    }

    countersStore.setSelectedFromList(uiStore.selectedCounterId)
    void countersStore.fetchCounter(uiStore.selectedCounterId)
    void triggersStore.fetchTriggers(uiStore.selectedCounterId)
  }, [countersStore, triggersStore, uiStore.selectedCounterId])

  const selectedCounter = countersStore.selectedCounter
  const selectedTriggers = triggersStore.getTriggers(uiStore.selectedCounterId)

  const editingTrigger =
    selectedTriggers.find((trigger) => trigger.id === uiStore.editingTriggerId) ??
    null

  const handleRemoveBan = () => {
    if (!selectedCounter) {
      return
    }

    void countersStore.removeBan(selectedCounter.id)
  }

  const handleSubmitTrigger = async (payload: {
    threshold: number
    enabled: boolean
  }) => {
    if (!editingTrigger || !uiStore.selectedCounterId) {
      return
    }

    await triggersStore.updateTrigger(
      uiStore.selectedCounterId,
      editingTrigger.id,
      payload,
    )

    if (!triggersStore.saveError) {
      uiStore.closeTriggerModal()
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>MobX-only dashboard</h1>
          <p className={styles.description}>
            Здесь server state хранится в сторах: counters, selected counter,
            triggers, loading/error/fetching и polling управляются вручную.
          </p>
        </div>

        <div className={styles.controls}>
          <input
            value={uiStore.search}
            onChange={(event) => uiStore.setSearch(event.target.value)}
            placeholder="Search counters..."
            className={inputStyles.root}
          />

          <button
            type="button"
            onClick={() => void countersStore.fetchCounters(uiStore.search)}
            className={buttonStyles.secondary}
            disabled={countersStore.isListFetching}
          >
            Refresh
          </button>
        </div>
      </section>

      <div className={styles.statusRow}>
        {authStore.isLoading && (
          <div className={styles.status}>Loading auth...</div>
        )}

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

      <div className={styles.topGrid}>
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
                {countersStore.counters.length ? (
                  countersStore.counters.map((counter) => {
                    const isSelected = counter.id === uiStore.selectedCounterId

                    return (
                      <tr
                        key={counter.id}
                        className={isSelected ? styles.trActive : styles.tr}
                        onClick={() => uiStore.setSelectedCounterId(counter.id)}
                      >
                        <td className={styles.td}>{counter.name}</td>
                        <td className={styles.td}>{counter.currentValue}</td>
                        <td className={styles.td}>{counter.limit}</td>
                        <td className={styles.td}>
                          {counter.isBanned ? 'Yes' : 'No'}
                        </td>
                        <td className={styles.td}>
                          {formatTime(counter.updatedAt)}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td className={styles.empty} colSpan={5}>
                      {countersStore.isListLoading
                        ? 'Loading...'
                        : 'No counters found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

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
      </div>

      <div className={styles.bottomGrid}>
        <section className={cardStyles.root}>
          <div className={styles.panelTitle}>Counter details</div>

          {selectedCounter ? (
            <>
              <div className={styles.detailsGrid}>
                <div className={styles.detailRow}>
                  <div className={styles.detailKey}>Name</div>
                  <div className={styles.detailValueStrong}>
                    {selectedCounter.name}
                  </div>
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
                  onClick={handleRemoveBan}
                  disabled={!selectedCounter.isBanned || countersStore.isRemovingBan}
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
      </div>

      <TriggerEditorModal
        open={uiStore.isTriggerModalOpen}
        trigger={editingTrigger}
        isSaving={triggersStore.isSaving}
        errorMessage={triggersStore.saveError}
        onClose={() => uiStore.closeTriggerModal()}
        onSubmit={handleSubmitTrigger}
      />
    </div>
  )
})

export function MobxDashboardPage() {
  return (
    <MobxStoresProvider>
      <MobxDashboardContent />
    </MobxStoresProvider>
  )
}