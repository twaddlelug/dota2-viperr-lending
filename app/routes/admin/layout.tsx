import { LayoutDashboard, Server, Swords, Users } from 'lucide-react'
import { createContext, Outlet, useRouteLoaderData } from 'react-router'
import { ErrorPanel } from '~/components/admin/error-panel'
import { PanelShell } from '~/components/admin/panel-shell'
import { SITE } from '~/config/site'
import { type CurrentUser, requireAdmin } from '~/features/auth/session.server'
import type { Route } from './+types/layout'

const NAV = [
  { label: 'Обзор', href: '/admin', icon: <LayoutDashboard />, end: true },
  { label: 'Серверы', href: '/admin/servers', icon: <Server /> },
  { label: 'Команды', href: '/admin/teams', icon: <Users /> },
  { label: 'Сетка', href: '/admin/bracket', icon: <Swords /> },
]

const adminUser = createContext<CurrentUser>()

export const middleware: Route.MiddlewareFunction[] = [
  async ({ request, context }) => {
    context.set(adminUser, await requireAdmin(request))
  },
]

export function loader({ context }: Route.LoaderArgs) {
  const user = context.get(adminUser)
  return {
    user: {
      name: user.globalName ?? user.username,
      avatarUrl: user.avatarUrl,
    },
  }
}

export const meta = () => [
  { title: `Админка — ${SITE.name}` },
  { name: 'robots', content: 'noindex' },
]

type AdminUser = Awaited<ReturnType<typeof loader>>['user']

export default function AdminLayout({ loaderData }: Route.ComponentProps) {
  return (
    <AdminShell user={loaderData.user}>
      <Outlet />
    </AdminShell>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const data = useRouteLoaderData<typeof loader>('routes/admin/layout')

  if (!data) {
    return (
      <main className="flex min-h-screen items-center p-4">
        <ErrorPanel error={error} back={{ href: '/', label: 'На главную' }} />
      </main>
    )
  }
  return (
    <AdminShell user={data.user}>
      <ErrorPanel error={error} back={{ href: '/admin', label: 'В админку' }} />
    </AdminShell>
  )
}

function AdminShell({
  user,
  children,
}: {
  user: AdminUser
  children: React.ReactNode
}) {
  return (
    <PanelShell home="/admin" homeLabel="Админка" nav={NAV} user={user}>
      {children}
    </PanelShell>
  )
}
