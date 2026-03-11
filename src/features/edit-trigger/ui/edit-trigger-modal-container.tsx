import type { Trigger } from '@/entities/trigger/types'
import { TriggerEditorModal } from '@/widgets/trigger-editor/ui/trigger-editor-modal'

type EditTriggerModalContainerProps = {
  open: boolean
  trigger: Trigger | null
  isSaving: boolean
  errorMessage: string | null
  onClose: () => void
  onSubmit: (payload: { threshold: number; enabled: boolean }) => void
}

export function EditTriggerModalContainer({
  open,
  trigger,
  isSaving,
  errorMessage,
  onClose,
  onSubmit,
}: EditTriggerModalContainerProps) {
  return (
    <TriggerEditorModal
      open={open}
      trigger={trigger}
      isSaving={isSaving}
      errorMessage={errorMessage}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  )
}