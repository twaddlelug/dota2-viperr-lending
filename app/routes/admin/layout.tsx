import {
  LayoutDashboard,
  LogOut,
  Server,
  Settings,
  SquareArrowOutUpRight,
  Swords,
  Users,
} from 'lucide-react'
import {
  createContext,
  Form,
  isRouteErrorResponse,
  Link,
  NavLink,
  Outlet,
  useRouteLoaderData,
} from 'react-router'
import { ToastProvider } from '~/components/admin/toast'
import { Avatar } from '~/components/ui/avatar'
import { ViperrMark } from '~/components/ui/viperr-mark'
import { SITE } from '~/config/site'
import { type CurrentUser, requireAdmin } from '~/features/auth/session.server'
import { cn } from '~/lib/cn'
import type { Route } from './+types/layout'

const NAV = [
  { label: 'Обзор', href: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Серверы', href: '/admin/servers', icon: Server },
  { label: 'Команды', href: '/admin/teams', icon: Users },
  { label: 'Сетка', href: '/admin/bracket', icon: Swords },
  { label: 'Настройки', href: '/admin/settings', icon: Settings },
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

  const message =
    isRouteErrorResponse(error) && typeof error.data === 'string'
      ? error.data
      : import.meta.env.DEV && error instanceof Error
        ? error.message
        : 'Что-то сломалось. Попробуйте обновить страницу.'

  const panel = (
    <div className="mx-auto max-w-lg rounded-2xl border border-line bg-surface p-8 text-center">
      <p className="font-bold font-display text-lg uppercase">
        {isRouteErrorResponse(error) ? error.status : 'Ошибка'}
      </p>
      <p className="mt-3 text-muted">{message}</p>
      <Link
        to={data ? '/admin' : '/'}
        className="mt-6 inline-block text-accent hover:underline"
      >
        {data ? 'В админку' : 'На главную'}
      </Link>
    </div>
  )

  if (!data) {
    return <main className="flex min-h-screen items-center p-4">{panel}</main>
  }
  return <AdminShell user={data.user}>{panel}</AdminShell>
}

function AdminShell({
  user,
  children,
}: {
  user: AdminUser
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen">
        <header className="sticky top-0 z-40 border-line border-b bg-bg/90 backdrop-blur">
          <div className="container mx-auto flex items-center gap-6 px-4 py-3 sm:px-6">
            <Link to="/admin" aria-label="Админка" className="shrink-0">
              <ViperrMark className="h-6 w-7" />
            </Link>

            <nav className="-mx-1 flex flex-1 gap-1 overflow-x-auto text-sm">
              {NAV.map(item => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 transition-colors',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-muted hover:text-white'
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-1 text-sm">
              <Link
                to="/"
                target="_blank"
                aria-label="Открыть сайт"
                className="rounded-lg p-2 text-muted transition-colors hover:bg-white/5 hover:text-white"
              >
                <SquareArrowOutUpRight className="h-4 w-4" />
              </Link>
              <span className="ml-2 hidden items-center gap-2 md:flex">
                <Avatar
                  src={user.avatarUrl ?? undefined}
                  name={user.name}
                  size="xs"
                  shape="circle"
                />
                {user.name}
              </span>
              <Form method="post" action="/auth/logout">
                <button
                  type="submit"
                  aria-label="Выйти"
                  className="cursor-pointer rounded-lg p-2 text-muted transition-colors hover:bg-white/5 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </Form>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>
      </div>
    </ToastProvider>
  )
}
