import { useState } from 'react'
import { Button, type ButtonProps } from './button'
import { Dialog, DialogActions } from './dialog'

export function ConfirmButton({
  title,
  message,
  confirmLabel = 'Удалить',
  onConfirm,
  busy,
  children,
  className,
  variant = 'danger',
  size,
  'aria-label': ariaLabel,
}: {
  title: string
  message: React.ReactNode
  confirmLabel?: string
  onConfirm: () => void
  busy?: boolean
  children: React.ReactNode
  className?: string
  variant?: 'danger' | 'ghost' | 'secondary'
  size?: ButtonProps['size']
  'aria-label'?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        disabled={busy}
        aria-label={ariaLabel}
        onClick={() => setOpen(true)}
      >
        {children}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title={title}>
        <div className="text-sm text-white/80">{message}</div>
        <DialogActions>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Отмена
          </Button>
          <Button
            type="button"
            variant="danger-solid"
            onClick={() => {
              setOpen(false)
              onConfirm()
            }}
          >
            {confirmLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
