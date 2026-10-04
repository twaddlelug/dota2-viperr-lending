const EXTERNAL_TIMEOUT_MS = 8000

export const externalTimeout = () => AbortSignal.timeout(EXTERNAL_TIMEOUT_MS)
