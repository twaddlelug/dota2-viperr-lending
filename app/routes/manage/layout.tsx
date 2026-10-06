import { Outlet, useRouteLoaderData } from 'react-router'
import { ErrorPanel } from '~/components/admin/error-panel'
import { PanelShell } from '~/components/admin/panel-shell'
import { Avatar } from '~/components/ui/avatar'
import { SITE } from '~/config/site'
import {
  managerContext,
  requireManager,
} from '~/features/servers/manager.server'
import type { Route } from './+types/layout'

export const middleware: Route.MiddlewareFunction[] = [
  async ({ request, context }) => {
    context.set(managerContext, await requireManager(request))
  },
]

export function loader({ context }: Route.LoaderArgs) {
  const { user, servers } = context.get(managerContext)
  return {
    user: {
      name: user.globalName ?? user.username,
      avatarUrl: user.avatarUrl,
    },
    servers,
  }
}

export const meta = () => [
  { title: `Управление командой — ${SITE.name}` },
  { name: 'robots', content: 'noindex' },
]

type ShellData = ReturnType<typeof loader>

export default function ManageLayout({ loaderData }: Route.ComponentProps) {
  return (
    <ManageShell {...loaderData}>
      <Outlet />
    </ManageShell>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const data = useRouteLoaderData<typeof loader>('routes/manage/layout')

  if (!data) {
    return (
      <main className="flex min-h-screen items-center p-4">
        <ErrorPanel error={error} back={{ href: '/', label: 'На главную' }} />
      </main>
    )
  }
  return (
    <ManageShell {...data}>
      <ErrorPanel
        error={error}
        back={{ href: '/manage', label: 'К своей команде' }}
      />
    </ManageShell>
  )
}

function ManageShell({
  user,
  servers,
  children,
}: ShellData & { children: React.ReactNode }) {
  return (
    <PanelShell
      home="/manage"
      homeLabel="Управление командой"
      nav={servers.map(server => ({
        label: server.name,
        href: `/manage/${server.id}`,
        icon: (
          <Avatar
            src={server.iconUrl ?? undefined}
            name={server.name}
            size="2xs"
            shape="circle"
          />
        ),
      }))}
      user={user}
    >
      {children}
    </PanelShell>
  )
}
