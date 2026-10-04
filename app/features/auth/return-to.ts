const SAME_SITE = 'http://same-site.invalid'

export function safeReturnTo(
  value: string | null | undefined,
  fallback = '/me'
) {
  if (!value?.startsWith('/')) return fallback

  let url: URL
  try {
    url = new URL(value, SAME_SITE)
  } catch {
    return fallback
  }

  if (url.origin !== SAME_SITE || url.pathname.startsWith('//')) {
    return fallback
  }
  return url.pathname + url.search + url.hash
}
