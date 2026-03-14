import { observer } from 'mobx-react-lite'

import { useMobxStores } from '@/demo/mobx/stores/store-context'
import { TriggerEditorModal } from '@/widgets/trigger-editor/ui/trigger-editor-modal'

type MobxEditTriggerModalContainerProps = {
  onSubmit: (payload: { threshold: number; enabled: boolean }) => void
}

export const MobxEditTriggerModalContainer = observer(
  ({ onSubmit }: MobxEditTriggerModalContainerProps) => {
    const { triggersStore, uiStore } = useMobxStores()

    const selectedTriggers = triggersStore.getTriggers(uiStore.selectedCounterId)

    const editingTrigger =
      selectedTriggers.find(
        (trigger) => trigger.id === uiStore.editingTriggerId,
      ) ?? null

    return (
      <TriggerEditorModal
        open={uiStore.isTriggerModalOpen}
        trigger={editingTrigger}
        isSaving={triggersStore.isSaving}
        errorMessage={triggersStore.saveError}
        onClose={() => uiStore.closeTriggerModal()}
        onSubmit={onSubmit}
      />
    )
  },
)