import { Check, X } from 'lucide-react'
import { createContext, useCallback, useContext, useState } from 'react'
import { cn } from '~/lib/cn'

type Toast = { id: number; kind: 'success' | 'error'; text: string }

type ToastApi = {
  success: (text: string) => void
  error: (text: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

const DURATION = 3500

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((kind: Toast['kind'], text: string) => {
    const id = Date.now() + Math.random()
    setToasts(current => [...current.slice(-3), { id, kind, text }])
    setTimeout(
      () => setToasts(current => current.filter(toast => toast.id !== id)),
      DURATION
    )
  }, [])

  const [api] = useState<ToastApi>(() => ({
    success: text => push('success', text),
    error: text => push('error', text),
  }))

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col gap-2"
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={cn(
              'flex items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur',
              toast.kind === 'success'
                ? 'border-success/40 bg-success-surface/95'
                : 'border-red-500/40 bg-danger-surface/95'
            )}
          >
            {toast.kind === 'success' ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <X className="h-4 w-4 text-red-400" />
            )}
            {toast.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const api = useContext(ToastContext)
  if (!api) throw new Error('useToast must be used inside <ToastProvider>')
  return api
}
