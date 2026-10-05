import { Link } from 'react-router'
import { siDiscord } from 'simple-icons'
import { BrandIcon } from '~/components/ui/brand-icon'
import { ViperrMark } from '~/components/ui/viperr-mark'
import { NAV_LINKS, SITE, SOCIALS, TOURNAMENT } from '~/config/site'

const linkClass = 'font-medium transition-colors hover:text-accent'

export function Footer({ discordUrl }: { discordUrl: string }) {
  const socials = [
    { label: 'Discord', href: discordUrl, icon: siDiscord },
    ...SOCIALS,
  ]
  const columns = [
    {
      title: 'Турнир',
      links: NAV_LINKS.map(link => ({ ...link, external: false })),
    },
    {
      title: 'Сообщество',
      links: [
        { label: 'Discord-ивент', href: discordUrl, external: true },
        ...(__DB_MODE__
          ? [{ label: 'Профиль игрока', href: '/me', external: false }]
          : []),
      ],
    },
  ]

  return (
    <footer className="relative mt-32 overflow-hidden bg-gradient-to-b from-bg via-footer-glow to-footer-end px-6 pt-20 sm:px-10 lg:px-14 lg:pt-24">
      <div className="grid gap-14 lg:grid-cols-2">
        <div className="flex flex-col">
          <Link to="/" aria-label="Viperr — на главную" className="w-fit">
            <ViperrMark className="h-12 w-14" />
          </Link>
          <p className="mt-6 max-w-sm text-muted leading-relaxed">
            Турнир по Dota 2 между Discord-серверами СНГ: один сервер — одна
            команда. Организатор — {TOURNAMENT.organizer}.
          </p>

          <p className="mt-10 text-muted text-sm">Соцсети</p>
          <div className="mt-3 flex gap-5">
            {socials.map(social => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="transition-colors hover:text-accent"
              >
                <BrandIcon icon={social.icon} className="h-6 w-6" />
              </a>
            ))}
          </div>

          <p className="mt-10 text-muted text-xs">
            © {SITE.established} Viperr · Все права защищены
          </p>
        </div>

        <nav className="grid grid-cols-2 gap-10">
          {columns.map(column => (
            <div key={column.title}>
              <p className="text-muted text-sm">{column.title}</p>
              <ul className="mt-5 space-y-4">
                {column.links.map(link => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className={linkClass}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <p
        aria-hidden
        className="mx-auto mt-20 -mb-[0.06em] w-fit -skew-x-12 select-none whitespace-nowrap px-[0.08em] font-black font-display text-[calc((100vw-3rem)/6.8)] text-metal leading-none sm:text-[calc((100vw-5rem)/6.8)] lg:mt-28 lg:text-[calc((100vw-7rem)/6.8)]"
      >
        SERVER TI
      </p>
    </footer>
  )
}
