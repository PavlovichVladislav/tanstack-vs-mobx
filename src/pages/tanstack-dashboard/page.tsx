import { observer } from 'mobx-react-lite'

import { useRemoveBan } from '@/demo/tanstack/mutations/use-remove-ban'
import { useUpdateTrigger } from '@/demo/tanstack/mutations/use-update-trigger'
import { useCounter } from '@/demo/tanstack/queries/use-counter'
import { useCounters } from '@/demo/tanstack/queries/use-counters'
import { useTriggers } from '@/demo/tanstack/queries/use-triggers'
import {
  TanstackStoresProvider,
  useTanstackUiStore,
} from '@/demo/tanstack/stores/store-context'
import { buttonStyles } from '@/shared/ui/button.styles'
import { cardStyles } from '@/shared/ui/card.styles'
import { inputStyles } from '@/shared/ui/input.styles'
import { TriggerEditorModal } from '@/widgets/trigger-editor/ui/trigger-editor-modal'

import { styles } from './styles'

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString()
}

/**
 * Разделяется серверный и ui стейт.
 * Серверный - все, что приходит/уходит на сервер.
 * Ui - то, с чем взаимодействуем в UI (search string, id счетчика, любые другие артефакты взаимодействий)
 * 
 * @todo рефакторинг - разнести на отдельные компоненты. Мб в слоях завести tanstack/mobx папки и там чет создавать
 * чтоб было и с fsd совместимо и не лепнина из компонент внутри одного файла
 */
const TanstackDashboardContent = observer(() => {
  const uiStore = useTanstackUiStore()

  /** @todo для поиска есть дебаунс? */
  const countersQuery = useCounters({
    search: uiStore.search,
  })

  const counterQuery = useCounter({
    counterId: uiStore.selectedCounterId,
  })

  const triggersQuery = useTriggers({
    counterId: uiStore.selectedCounterId,
  })

  const removeBanMutation = useRemoveBan()
  const updateTriggerMutation = useUpdateTrigger()

  /** @todo а еслиб это был другой компонент? т.е. хочется попробовать раскидать это на разные компоненты */
  const selectedCounter =
    counterQuery.data ??
    countersQuery.data?.find((counter) => counter.id === uiStore.selectedCounterId) ??
    null

  const editingTrigger =
    triggersQuery.data?.find(
      (trigger) => trigger.id === uiStore.editingTriggerId,
    ) ?? null

  const totalCounters = countersQuery.data?.length ?? 0
  const bannedCounters =
    countersQuery.data?.filter((counter) => counter.isBanned).length ?? 0
  const enabledTriggers =
    triggersQuery.data?.filter((trigger) => trigger.enabled).length ?? 0

  const handleRemoveBan = () => {
    if (!selectedCounter) {
      return
    }

    removeBanMutation.mutate(selectedCounter.id)
  }

  const handleSubmitTrigger = (payload: {
    threshold: number
    enabled: boolean
  }) => {
    if (!editingTrigger || !uiStore.selectedCounterId) {
      return
    }

    updateTriggerMutation.mutate(
      {
        triggerId: editingTrigger.id,
        counterId: uiStore.selectedCounterId,
        payload,
      },
      {
        onSuccess: () => {
          uiStore.closeTriggerModal()
        },
      },
    )
  }

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>TanStack dashboard</h1>
          <p className={styles.description}>
            Search и selected state лежат в MobX UI-store, а counters / details /
            triggers — в TanStack Query. Для trigger update используем mutation с
            точечным обновлением query cache.
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
            onClick={() => countersQuery.refetch()}
            className={buttonStyles.secondary}
            disabled={countersQuery.isFetching}
          >
            Refresh
          </button>
        </div>
      </section>

      <div className={styles.statusRow}>
        {countersQuery.isLoading && (
          <div className={styles.status}>Initial loading...</div>
        )}

        {countersQuery.isFetching && !countersQuery.isLoading && (
          <div className={styles.statusFetching}>Background fetching...</div>
        )}

        {countersQuery.isError && (
          <div className={styles.statusError}>
            {countersQuery.error instanceof Error
              ? countersQuery.error.message
              : 'Unknown error'}
          </div>
        )}

        {counterQuery.isFetching && uiStore.selectedCounterId && (
          <div className={styles.statusFetching}>Loading selected counter...</div>
        )}

        {triggersQuery.isFetching && uiStore.selectedCounterId && (
          <div className={styles.statusFetching}>Loading triggers...</div>
        )}

        {removeBanMutation.isPending && (
          <div className={styles.statusFetching}>Removing ban...</div>
        )}

        {updateTriggerMutation.isPending && (
          <div className={styles.statusFetching}>Saving trigger...</div>
        )}

        {updateTriggerMutation.isError && (
          <div className={styles.statusError}>
            {updateTriggerMutation.error instanceof Error
              ? updateTriggerMutation.error.message
              : 'Trigger update failed'}
          </div>
        )}

        <div className={styles.status}>List size: {totalCounters}</div>
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
                {countersQuery.data?.length ? (
                  countersQuery.data.map((counter) => {
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
                      {countersQuery.isLoading
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
      </div>

      {/* Details - отдельный query, triggers уже есть, но при этом грузим детали отдельно для каждого. */}
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
                  disabled={
                    !selectedCounter.isBanned || removeBanMutation.isPending
                  }
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
                <div className={styles.sideValue}>
                  Choose a counter from the table.
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Trigers - показывает композицию query хуков. */}
        <aside className={cardStyles.root}>
          <div className={styles.panelTitle}>Triggers</div>

          {uiStore.selectedCounterId ? (
            triggersQuery.data?.length ? (
              <div className={styles.triggersList}>
                {triggersQuery.data.map((trigger) => (
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
            ) : triggersQuery.isLoading ? (
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
        isSaving={updateTriggerMutation.isPending}
        errorMessage={
          updateTriggerMutation.isError
            ? updateTriggerMutation.error instanceof Error
              ? updateTriggerMutation.error.message
              : 'Failed to update trigger'
            : null
        }
        onClose={() => uiStore.closeTriggerModal()}
        onSubmit={handleSubmitTrigger}
      />
    </div>
  )
})

export function TanstackDashboardPage() {
  return (
    <TanstackStoresProvider>
      <TanstackDashboardContent />
    </TanstackStoresProvider>
  )
}