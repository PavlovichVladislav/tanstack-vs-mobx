import { useEffect, type PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'

import { styles } from './styles'

type ModalProps = PropsWithChildren<{
  open: boolean
  title: string
  description?: string
  onClose: () => void
}>

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return createPortal(
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={styles.content}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <div>
            <div className={styles.title}>{title}</div>
            {description ? (
              <div className={styles.description}>{description}</div>
            ) : null}
          </div>

          <button type="button" onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>,
    document.body,
  )
}