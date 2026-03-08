import { useEffect, useMemo, useState } from 'react'

import type { Trigger } from '@/entities/trigger/types'
import { Modal } from '@/shared/ui/modal/modal'
import { buttonStyles } from '@/shared/ui/button.styles'
import { inputStyles } from '@/shared/ui/input.styles'
import { styles } from './styles'

type TriggerEditorModalProps = {
  trigger: Trigger | null
  open: boolean
  isSaving?: boolean
  errorMessage?: string | null
  onClose: () => void
  onSubmit: (payload: { threshold: number; enabled: boolean }) => void
}

export function TriggerEditorModal({
  trigger,
  open,
  isSaving = false,
  errorMessage = null,
  onClose,
  onSubmit,
}: TriggerEditorModalProps) {
  const [threshold, setThreshold] = useState('')
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!trigger) {
      return
    }

    setThreshold(String(trigger.threshold))
    setEnabled(trigger.enabled)
  }, [trigger])

  const parsedThreshold = useMemo(() => Number(threshold), [threshold])
  const isThresholdValid =
    Number.isFinite(parsedThreshold) && parsedThreshold >= 0

  const canSubmit = Boolean(trigger) && isThresholdValid && !isSaving

  return (
    <Modal
      open={open}
      title="Edit trigger"
      description="Редактируем локальный form state, а после сохранения обновляем query cache."
      onClose={onClose}
    >
      {trigger ? (
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault()

            if (!canSubmit) {
              return
            }

            onSubmit({
              threshold: parsedThreshold,
              enabled,
            })
          }}
        >
          <div className={styles.meta}>
            triggerId: {trigger.id} · counterId: {trigger.counterId} · type:{' '}
            {trigger.type}
          </div>

          {errorMessage ? <div className={styles.error}>{errorMessage}</div> : null}

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="trigger-threshold">
                Threshold
              </label>
              <input
                id="trigger-threshold"
                type="number"
                min={0}
                value={threshold}
                onChange={(event) => setThreshold(event.target.value)}
                className={inputStyles.root}
              />
              <div className={styles.helper}>
                Для демо меняем только threshold и enabled.
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Enabled</label>
              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(event) => setEnabled(event.target.checked)}
                  className={styles.checkbox}
                />
                <span>{enabled ? 'Enabled' : 'Disabled'}</span>
              </label>
            </div>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={buttonStyles.secondary}
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={buttonStyles.primary}
              disabled={!canSubmit}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      ) : null}
    </Modal>
  )
}