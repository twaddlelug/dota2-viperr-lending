import { isRouteErrorResponse, Link } from 'react-router'

export function ErrorPanel({
  error,
  back,
}: {
  error: unknown
  back: { href: string; label: string }
}) {
  const message =
    isRouteErrorResponse(error) && typeof error.data === 'string'
      ? error.data
      : import.meta.env.DEV && error instanceof Error
        ? error.message
        : 'Что-то сломалось. Попробуйте обновить страницу.'

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-line bg-surface p-8 text-center">
      <p className="font-bold font-display text-lg uppercase">
        {isRouteErrorResponse(error) ? error.status : 'Ошибка'}
      </p>
      <p className="mt-3 text-muted">{message}</p>
      <Link
        to={back.href}
        className="mt-6 inline-block text-accent hover:underline"
      >
        {back.label}
      </Link>
    </div>
  )
}
