import { useEffect, useRef } from 'react'
import { useFetcher } from 'react-router'
import { isActionResult } from '~/lib/action-result'
import { useToast } from './toast'

export function useAdminFetcher({
  success = 'Сохранено',
  onSuccess,
}: {
  success?: string | false
  onSuccess?: () => void
} = {}) {
  const fetcher = useFetcher()
  const toast = useToast()
  const previousState = useRef(fetcher.state)
  const latest = useRef({ success, onSuccess })
  latest.current = { success, onSuccess }

  useEffect(() => {
    const finished =
      previousState.current !== 'idle' && fetcher.state === 'idle'
    previousState.current = fetcher.state
    if (!finished || !isActionResult(fetcher.data)) return

    if (fetcher.data.ok) {
      if (latest.current.success) toast.success(latest.current.success)
      latest.current.onSuccess?.()
    } else {
      toast.error(fetcher.data.error)
    }
  }, [fetcher.state, fetcher.data, toast])

  return fetcher
}
