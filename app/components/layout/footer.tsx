import { Link } from 'react-router'
import { BrandIcon } from '~/components/ui/brand-icon'
import { DotaMark } from '~/components/ui/dota-mark'
import { NAV_LINKS, SITE, SOCIALS } from '~/config/site'

const linkClass = 'text-muted transition-colors hover:text-white'

export function Footer() {
  const links = [
    ...NAV_LINKS.filter(link => link.href !== '/'),
    ...(__DB_MODE__ ? [{ label: 'Профиль', href: '/me' }] : []),
  ]

  return (
    <footer className="relative mt-32 overflow-hidden bg-gradient-to-b from-bg via-footer-glow to-footer-end px-6 sm:px-10 lg:px-14">
      <div className="flex flex-col items-center gap-6 pt-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <Link
          to="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <DotaMark className="h-8 w-8" />
          <span>
            <span className="block font-bold font-display text-sm uppercase tracking-wide">
              {SITE.name}
            </span>
            <span className="block text-muted text-xs">
              А также турнир не связаны с Valve Corporation и Discord Inc. и не
              одобрены ими • © {SITE.established}
            </span>
          </span>
        </Link>

        <nav
          aria-label="Ссылки подвала"
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.2em]"
        >
          {links.map(link => (
            <Link key={link.href} to={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
          {SOCIALS.map(social => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className={linkClass}
            >
              <BrandIcon icon={social.icon} />
            </a>
          ))}
        </nav>
      </div>

      <p
        aria-hidden
        className="mx-auto mt-14 -mb-[0.06em] w-fit -skew-x-12 select-none whitespace-nowrap px-[0.08em] font-black font-display text-[calc((100vw-3rem)/7)] text-metal leading-none sm:text-[calc((100vw-5rem)/7)] lg:mt-20 lg:text-[calc((100vw-7rem)/7)]"
      >
        DOTA CUP
      </p>
    </footer>
  )
}
