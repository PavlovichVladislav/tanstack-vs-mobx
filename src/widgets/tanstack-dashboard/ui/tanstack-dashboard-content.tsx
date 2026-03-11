import { observer } from 'mobx-react-lite'

import { useRemoveBan } from '@/demo/tanstack/mutations/use-remove-ban'
import { useUpdateTrigger } from '@/demo/tanstack/mutations/use-update-trigger'
import { useCounter } from '@/demo/tanstack/queries/use-counter'
import { useCounters } from '@/demo/tanstack/queries/use-counters'
import { useTriggers } from '@/demo/tanstack/queries/use-triggers'
import { useTanstackUiStore } from '@/demo/tanstack/stores/store-context'
import { EditTriggerModalContainer } from '@/features/edit-trigger/ui/edit-trigger-modal-container'

import { styles } from './styles'
import { TanstackCounterDetailsSection } from './tanstack-counter-details-section'
import { TanstackCountersSection } from './tanstack-counters-section'
import { TanstackDashboardHeader } from './tanstack-dashboard-header'
import { TanstackDashboardStatusRow } from './tanstack-dashboard-status-row'
import { TanstackSummarySidebar } from './tanstack-summary-sidebar'
import { TanstackTriggersSection } from './tanstack-triggers-section'

export const TanstackDashboardContent = observer(() => {
  const uiStore = useTanstackUiStore()

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

  const selectedCounter =
    counterQuery.data ??
    countersQuery.data?.find((counter) => counter.id === uiStore.selectedCounterId) ??
    null

  const editingTrigger =
    triggersQuery.data?.find((trigger) => trigger.id === uiStore.editingTriggerId) ??
    null

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
      <TanstackDashboardHeader
        search={uiStore.search}
        isRefreshing={countersQuery.isFetching}
        onSearchChange={(value) => uiStore.setSearch(value)}
        onRefresh={() => {
          void countersQuery.refetch()
        }}
      />

      <TanstackDashboardStatusRow
        isListLoading={countersQuery.isLoading}
        isListFetching={countersQuery.isFetching}
        isListError={countersQuery.isError}
        listErrorMessage={
          countersQuery.isError && countersQuery.error instanceof Error
            ? countersQuery.error.message
            : null
        }
        isCounterFetching={counterQuery.isFetching}
        isTriggersFetching={triggersQuery.isFetching}
        isRemovingBan={removeBanMutation.isPending}
        isSavingTrigger={updateTriggerMutation.isPending}
        isTriggerSaveError={updateTriggerMutation.isError}
        triggerSaveErrorMessage={
          updateTriggerMutation.isError &&
          updateTriggerMutation.error instanceof Error
            ? updateTriggerMutation.error.message
            : null
        }
        hasSelectedCounter={Boolean(uiStore.selectedCounterId)}
        totalCounters={totalCounters}
      />

      <div className={styles.topGrid}>
        <TanstackCountersSection
          counters={countersQuery.data ?? []}
          selectedCounterId={uiStore.selectedCounterId}
          isLoading={countersQuery.isLoading}
          onSelectCounter={(counterId) => uiStore.setSelectedCounterId(counterId)}
        />

        <TanstackSummarySidebar
          totalCounters={totalCounters}
          bannedCounters={bannedCounters}
          enabledTriggers={enabledTriggers}
        />
      </div>

      <div className={styles.bottomGrid}>
        <TanstackCounterDetailsSection
          counter={selectedCounter}
          isRemovingBan={removeBanMutation.isPending}
          onRemoveBan={handleRemoveBan}
        />

        <TanstackTriggersSection
          selectedCounterId={uiStore.selectedCounterId}
          triggers={triggersQuery.data ?? []}
          isLoading={triggersQuery.isLoading}
          onEditTrigger={(triggerId) => uiStore.openTriggerModal(triggerId)}
        />
      </div>

      <EditTriggerModalContainer
        open={uiStore.isTriggerModalOpen}
        trigger={editingTrigger}
        isSaving={updateTriggerMutation.isPending}
        errorMessage={
          updateTriggerMutation.isError &&
          updateTriggerMutation.error instanceof Error
            ? updateTriggerMutation.error.message
            : null
        }
        onClose={() => uiStore.closeTriggerModal()}
        onSubmit={handleSubmitTrigger}
      />
    </div>
  )
})