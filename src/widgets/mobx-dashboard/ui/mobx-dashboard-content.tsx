import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'

import { useMobxStores } from '@/demo/mobx/stores/store-context'
import { MobxEditTriggerModalContainer } from '@/features/edit-trigger/ui/mobx-edit-trigger-modal-container'

import { styles } from './styles'
import { MobxCounterDetailsSection } from './mobx-counter-details-section'
import { MobxCountersSection } from './mobx-counters-section'
import { MobxDashboardHeader } from './mobx-dashboard-header'
import { MobxDashboardStatusRow } from './mobx-dashboard-status-row'
import { MobxSummarySidebar } from './mobx-summary-sidebar'
import { MobxTriggersSection } from './mobx-triggers-section'

export const MobxDashboardContent = observer(() => {
  const { authStore, countersStore, triggersStore, uiStore } = useMobxStores()

  useEffect(() => {
    authStore.fetchMe()
  }, [authStore])

  /** порефачить */
  useEffect(() => {
    countersStore.fetchCounters(uiStore.search)
  }, [countersStore, uiStore.search])

  useEffect(() => {
    countersStore.startPolling()

    /** При смене страницы не позволяем менять state неактуального экрана.
     * 
     * Польза также в том, что не держим лишние сетевые подключения, к-е уже не актуальны.
     * Не делаем старые async flows, не работате лишний js.
     * Убираем риск странных побочных эффектов, т.к. у вкладок могут шариться данные.
     * В данном проекте при смене вкладке provider размонитруются, а сторы выпадут из памяти.
    */
    return () => {
      countersStore.stopPolling()
      countersStore.abortPending()
      triggersStore.abortPending()
      authStore.abortPending()
    }
  }, [authStore, countersStore, triggersStore])

  useEffect(() => {
    if (!uiStore.selectedCounterId) {
      return
    }

    countersStore.setSelectedFromList(uiStore.selectedCounterId)
    countersStore.fetchCounter(uiStore.selectedCounterId)
    triggersStore.fetchTriggers(uiStore.selectedCounterId)
  }, [countersStore, triggersStore, uiStore.selectedCounterId])

  const handleRemoveBan = (counterId: string) => {
    countersStore.removeBan(counterId)
  }

  const handleSubmitTrigger = async (payload: {
    threshold: number
    enabled: boolean
  }) => {
    if (!uiStore.editingTriggerId || !uiStore.selectedCounterId) {
      return
    }

    await triggersStore.updateTrigger(
      uiStore.selectedCounterId,
      uiStore.editingTriggerId,
      payload,
    )

    if (!triggersStore.saveError) {
      uiStore.closeTriggerModal()
    }
  }

  return (
    <div className={styles.page}>
      <MobxDashboardHeader
        search={uiStore.search}
        isRefreshing={countersStore.isListFetching}
        user={authStore.user ?? undefined}
        isUserLoading={authStore.isLoading}
        userError={authStore.error}
        onSearchChange={(value) => uiStore.setSearch(value)}
        onRefresh={() => {
          countersStore.fetchCounters(uiStore.search)
        }}
      />

      <MobxDashboardStatusRow />

      <div className={styles.topGrid}>
        <MobxCountersSection />
        <MobxSummarySidebar />
      </div>

      <div className={styles.bottomGrid}>
        <MobxCounterDetailsSection onRemoveBan={handleRemoveBan} />
        <MobxTriggersSection />
      </div>

      <MobxEditTriggerModalContainer onSubmit={handleSubmitTrigger} />
    </div>
  )
})
