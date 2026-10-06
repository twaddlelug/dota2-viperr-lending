import { Link } from 'react-router'
import { siDiscord } from 'simple-icons'
import { BrandIcon } from '~/components/ui/brand-icon'
import { DotaMark } from '~/components/ui/dota-mark'
import { NAV_LINKS, SITE, SOCIALS, TOURNAMENT } from '~/config/site'

const linkClass = 'text-muted transition-colors hover:text-white'

export function Footer({ discordUrl }: { discordUrl: string }) {
  const links = [
    ...NAV_LINKS.filter(link => link.href !== '/'),
    ...(__DB_MODE__ ? [{ label: 'Профиль', href: '/me' }] : []),
  ]

  return (
    <footer className="relative mt-32 overflow-hidden bg-gradient-to-b from-bg via-footer-glow to-footer-end px-6 sm:px-10 lg:px-14">
      <div className="flex flex-col items-center gap-6 border-white/10 border-t pt-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <DotaMark className="h-8 w-8" />
          <div>
            <Link
              to="/"
              className="font-bold font-display text-sm uppercase tracking-wide transition-colors hover:text-accent"
            >
              {SITE.name}
            </Link>
            <p className="mt-0.5 text-muted text-xs">
              © {SITE.established} · Организатор — {TOURNAMENT.organizer}
            </p>
          </div>
        </div>

        <nav
          aria-label="Ссылки подвала"
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.2em]"
        >
          {links.map(link => (
            <Link key={link.href} to={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
          <a
            href={discordUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-accent transition-colors hover:text-accent-hover"
          >
            <BrandIcon icon={siDiscord} className="h-3.5 w-3.5" />
            Discord-ивент
          </a>
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
        className="mx-auto mt-16 -mb-[0.06em] w-fit -skew-x-12 select-none whitespace-nowrap px-[0.08em] font-black font-display text-[calc((100vw-3rem)/6.8)] text-metal leading-none sm:text-[calc((100vw-5rem)/6.8)] lg:mt-24 lg:text-[calc((100vw-7rem)/6.8)]"
      >
        SERVER TI
      </p>
    </footer>
  )
}
