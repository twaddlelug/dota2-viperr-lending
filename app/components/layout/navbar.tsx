import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { ShineText } from '~/components/effects/shine-text'
import { SpotlightCard } from '~/components/effects/spotlight-card'
import { DotaMark } from '~/components/ui/dota-mark'
import type { NavItem } from '~/config/site'
import { cn } from '~/lib/cn'
import { MobileMenu } from './mobile-menu'

export function Navbar({ links }: { links: NavItem[] }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <SpotlightCard className="mx-auto max-w-3xl rounded-[16px] sm:rounded-[32px]">
        <div className="nav-panel relative flex items-center justify-between rounded-[16px] bg-black/60 px-6 py-5 sm:rounded-[32px]">
          <Link
            to="/"
            aria-label="На главную"
            className="transition-opacity hover:opacity-80"
          >
            <DotaMark className="h-8 w-8" />
          </Link>

          <nav
            className="hidden font-medium text-base lg:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {links.map(link => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === '/'}
                onMouseEnter={() => setHovered(link.href)}
                className={({ isActive }) =>
                  cn(
                    'px-5 transition-[opacity,filter] duration-300',
                    isActive && 'text-accent',
                    hovered && hovered !== link.href && 'opacity-50 blur-[1px]'
                  )
                }
              >
                {hovered === link.href ? (
                  <ShineText>{link.label}</ShineText>
                ) : (
                  link.label
                )}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="relative h-5 w-6 cursor-pointer lg:hidden"
          >
            <span className="absolute top-0 left-0 h-[2px] w-full rounded bg-white" />
            <span className="absolute top-1/2 left-0 h-[2px] w-full rounded bg-white" />
            <span className="absolute bottom-0 left-0 h-[2px] w-full rounded bg-white" />
          </button>
        </div>
      </SpotlightCard>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={links}
      />
    </>
  )
}
