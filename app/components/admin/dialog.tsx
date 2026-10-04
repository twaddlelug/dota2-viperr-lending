import { X } from 'lucide-react'
import { useModalDialog } from '~/lib/use-modal-dialog'

export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  const ref = useModalDialog(open)
  const closeOnBackdrop = (event: React.MouseEvent) =>
    event.target === ref.current && onClose()

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onMouseDown={closeOnBackdrop}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-line bg-surface p-0 text-white shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="font-bold font-display text-lg uppercase">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="cursor-pointer rounded-lg p-1 text-muted transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}

export function DialogActions({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 flex justify-end gap-3">{children}</div>
}
