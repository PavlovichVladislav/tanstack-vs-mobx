import { useTriggers } from '@/demo/tanstack/queries/use-triggers'
import { TriggerEditorModal } from '@/widgets/trigger-editor/ui/trigger-editor-modal'

type EditTriggerModalContainerProps = {
  open: boolean
  selectedCounterId: string | null
  editingTriggerId: string | null
  isSaving: boolean
  errorMessage: string | null
  onClose: () => void
  onSubmit: (payload: { threshold: number; enabled: boolean }) => void
}

export function EditTriggerModalContainer({
  open,
  selectedCounterId,
  editingTriggerId,
  isSaving,
  errorMessage,
  onClose,
  onSubmit,
}: EditTriggerModalContainerProps) {
  const triggersQuery = useTriggers({
    counterId: selectedCounterId,
  })

  const editingTrigger =
    triggersQuery.data?.find((trigger) => trigger.id === editingTriggerId) ?? null

  return (
    <TriggerEditorModal
      open={open}
      trigger={editingTrigger}
      isSaving={isSaving}
      errorMessage={errorMessage}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  )
}