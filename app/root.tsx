import '@fontsource-variable/geist-mono'
import '@fontsource-variable/manrope'
import '@fontsource-variable/unbounded'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'
import { Rise } from '~/components/effects/rise'
import { PageHeader } from '~/components/layout/page-header'
import { ButtonLink } from '~/components/ui/button-link'
import type { Route } from './+types/root'
import './app.css'

export const links: Route.LinksFunction = () => [
  { rel: 'icon', href: '/favicon.ico' },
  {
    rel: 'icon',
    href: '/favicon-32x32.png',
    type: 'image/png',
    sizes: '32x32',
  },
  {
    rel: 'icon',
    href: '/favicon-16x16.png',
    type: 'image/png',
    sizes: '16x16',
  },
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
  { rel: 'manifest', href: '/site.webmanifest' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="overflow-x-hidden">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#050505" />
        <Meta />
        <Links />
      </head>
      <body className="overflow-x-clip">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

const STATUS_MESSAGES: Record<number, string> = {
  403: 'Сюда нужен доступ.',
  404: 'Такой страницы нет.',
}

const FALLBACK_MESSAGE =
  'Что-то сломалось. Обновите страницу или загляните чуть позже.'

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const response = isRouteErrorResponse(error) ? error : null
  const status = response?.status ?? 500
  const ownMessage =
    typeof response?.data === 'string' &&
    !response.data.startsWith('Error:') &&
    !response.data.trimStart().startsWith('<')
      ? response.data
      : null
  const message = ownMessage ?? STATUS_MESSAGES[status] ?? FALLBACK_MESSAGE
  const technical =
    import.meta.env.DEV && error instanceof Error ? error.message.trim() : null

  return (
    <PageHeader title={String(status)}>
      <Rise
        delay={0.3}
        className="mt-6 flex w-full flex-col items-center gap-8 px-6"
      >
        <p className="max-w-md text-balance text-base text-white/80 leading-relaxed">
          {message}
        </p>
        {technical && (
          <pre className="max-h-56 w-full max-w-2xl overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-black/50 p-4 text-left font-mono text-white/60 text-xs leading-relaxed">
            {technical}
          </pre>
        )}
        <ButtonLink href="/">На главную</ButtonLink>
      </Rise>
    </PageHeader>
  )
}
