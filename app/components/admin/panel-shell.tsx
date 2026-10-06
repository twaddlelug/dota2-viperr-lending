import { LogOut, SquareArrowOutUpRight } from 'lucide-react'
import { Form, Link, NavLink } from 'react-router'
import { Avatar } from '~/components/ui/avatar'
import { ViperrMark } from '~/components/ui/viperr-mark'
import { cn } from '~/lib/cn'
import { ToastProvider } from './toast'

type PanelNavItem = {
  label: string
  href: string
  icon: React.ReactNode
  end?: boolean
}

export function PanelShell({
  home,
  homeLabel,
  nav,
  user,
  children,
}: {
  home: string
  homeLabel: string
  nav: PanelNavItem[]
  user: { name: string; avatarUrl: string | null }
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen">
        <header className="sticky top-0 z-40 border-line border-b bg-bg/90 backdrop-blur">
          <div className="container mx-auto flex items-center gap-6 px-4 py-3 sm:px-6">
            <Link to={home} aria-label={homeLabel} className="shrink-0">
              <ViperrMark className="h-6 w-7" />
            </Link>

            <nav className="-mx-1 flex flex-1 gap-1 overflow-x-auto text-sm">
              {nav.map(item => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.end}
                  aria-label={item.label}
                  className={({ isActive }) =>
                    cn(
                      'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 transition-colors [&_svg]:h-4 [&_svg]:w-4',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-muted hover:text-white'
                    )
                  }
                >
                  {item.icon}
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
