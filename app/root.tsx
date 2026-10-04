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

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = 'Ошибка'
  let details = 'Что-то пошло не так.'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) title = '404'
    if (error.status === 403) title = '403'
    const ownMessage =
      typeof error.data === 'string' && !error.data.startsWith('Error:')
        ? error.data
        : null
    details =
      ownMessage ||
      (error.status === 404 ? 'Такой страницы нет.' : error.statusText) ||
      details
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message
  }

  return (
    <PageHeader title={title}>
      <Rise delay={0.3} className="mt-6 flex flex-col items-center gap-10">
        <p className="max-w-xl px-6 font-mono text-sm opacity-80">{details}</p>
        <ButtonLink href="/">На главную</ButtonLink>
      </Rise>
    </PageHeader>
  )
}
