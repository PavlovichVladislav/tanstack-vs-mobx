import { observer } from 'mobx-react-lite'

import { useRemoveBan } from '@/demo/tanstack/mutations/use-remove-ban'
import { useUpdateTrigger } from '@/demo/tanstack/mutations/use-update-trigger'
import { useCounters } from '@/demo/tanstack/queries/use-counters'
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

  const removeBanMutation = useRemoveBan() /** onRemoveBan аналог */
  const updateTriggerMutation = useUpdateTrigger() /** onUpdateTrigger аналог */

  const selectedCounter =
    countersQuery.data?.find((counter) => counter.id === uiStore.selectedCounterId) ??
    null

  const handleRemoveBan = (counterId: string) => {
    removeBanMutation.mutate(counterId)
  }

  const handleSubmitTrigger = (payload: {
    threshold: number
    enabled: boolean
  }) => {
    if (!uiStore.editingTriggerId || !uiStore.selectedCounterId) {
      return
    }

    updateTriggerMutation.mutate(
      {
        triggerId: uiStore.editingTriggerId,
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
        search={uiStore.search}
        selectedCounterId={uiStore.selectedCounterId}
        isRemovingBan={removeBanMutation.isPending}
        isSavingTrigger={updateTriggerMutation.isPending}
        isTriggerSaveError={updateTriggerMutation.isError}
        triggerSaveErrorMessage={
          updateTriggerMutation.isError &&
          updateTriggerMutation.error instanceof Error
            ? updateTriggerMutation.error.message
            : null
        }
      />

      <div className={styles.topGrid}>
        <TanstackCountersSection
          search={uiStore.search}
          selectedCounterId={uiStore.selectedCounterId}
          onSelectCounter={(counterId) => uiStore.setSelectedCounterId(counterId)}
        />

        <TanstackSummarySidebar
          search={uiStore.search}
          selectedCounterId={uiStore.selectedCounterId}
        />
      </div>

      <div className={styles.bottomGrid}>
        <TanstackCounterDetailsSection
          selectedCounterId={uiStore.selectedCounterId}
          fallbackCounter={selectedCounter}
          isRemovingBan={removeBanMutation.isPending}
          onRemoveBan={handleRemoveBan}
        />

        <TanstackTriggersSection
          selectedCounterId={uiStore.selectedCounterId}
          onEditTrigger={(triggerId) => uiStore.openTriggerModal(triggerId)}
        />
      </div>

      <EditTriggerModalContainer
        open={uiStore.isTriggerModalOpen}
        selectedCounterId={uiStore.selectedCounterId}
        editingTriggerId={uiStore.editingTriggerId}
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