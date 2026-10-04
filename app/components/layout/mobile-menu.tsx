import { useEffect } from 'react'
import { NavLink } from 'react-router'
import { ViperrMark } from '~/components/ui/viperr-mark'
import type { NavItem } from '~/config/site'
import { cn } from '~/lib/cn'
import { useModalDialog } from '~/lib/use-modal-dialog'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
  links: NavItem[]
}

export function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  const ref = useModalDialog(open)
  useCloseOnDesktop(open, onClose)

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label="Меню"
      className="mobile-menu fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none flex-col justify-center bg-bg p-8 text-white open:flex"
    >
      <ViperrMark className="absolute top-5 left-8 h-7 w-8" />
      <button
        type="button"
        aria-label="Закрыть меню"
        onClick={onClose}
        className="absolute top-6 right-6 h-6 w-6 cursor-pointer"
      >
        <span className="absolute top-1/2 left-0 h-[2px] w-full rotate-45 bg-white" />
        <span className="absolute top-1/2 left-0 h-[2px] w-full -rotate-45 bg-white" />
      </button>

      <nav className="flex flex-col font-display font-semibold text-3xl uppercase">
        {links.map((link, i) => (
          <NavLink
            key={link.href}
            to={link.href}
            end={link.href === '/'}
            onClick={onClose}
            style={{ animationDelay: `${0.1 + i * 0.06}s` }}
            className={({ isActive }) =>
              cn(
                'mb-3 flex items-end motion-safe:animate-rise',
                isActive && 'text-accent'
              )
            }
          >
            <span>{link.label}</span>
            <span className="ml-2 font-normal font-sans text-muted text-sm">
              {i + 1}
            </span>
          </NavLink>
        ))}
      </nav>
    </dialog>
  )
}

function useCloseOnDesktop(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    const desktop = window.matchMedia('(min-width: 1024px)')
    const onChange = () => desktop.matches && onClose()
    desktop.addEventListener('change', onChange)
    return () => desktop.removeEventListener('change', onChange)
  }, [open, onClose])
}
