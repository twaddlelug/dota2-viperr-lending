import { Link } from 'react-router'
import { siDiscord } from 'simple-icons'
import { Avatar } from '~/components/ui/avatar'
import { BrandIcon } from '~/components/ui/brand-icon'
import { Corners } from '~/components/ui/corners'
import type { Partner } from './partners.server'

export function PartnerCard({ partner }: { partner: Partner }) {
  const { team } = partner

  return (
    <div className="group relative flex h-full flex-col items-center px-4 pt-9 pb-6 text-center transition-colors duration-300 has-[a:focus-visible]:bg-surface has-[a:hover]:bg-surface">
      <Avatar
        src={partner.iconUrl}
        name={partner.name}
        size="lg"
        shape="circle"
        className="transition-transform duration-300 ease-enter group-has-[a:hover]:scale-105"
      />
      <p className="mt-5 break-words font-bold font-display text-sm uppercase leading-tight sm:text-base">
        {partner.name}
      </p>
      {team ? (
        <Link
          to={`/teams/${team.slug}`}
          className="mt-2 font-mono text-[11px] text-muted uppercase tracking-[0.2em] transition-colors after:absolute after:inset-0 hover:text-white focus-visible:text-white focus-visible:outline-none"
        >
          {team.name}
        </Link>
      ) : (
        <p className="mt-2 font-mono text-[11px] text-muted uppercase tracking-[0.2em]">
          Состав собирается
        </p>
      )}

      {partner.inviteUrl && (
        <a
          href={partner.inviteUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Вступить на сервер ${partner.name}`}
          className="relative z-10 mt-auto inline-flex items-center gap-2 pt-6 text-white/70 text-xs transition-colors hover:text-discord focus-visible:text-discord"
        >
          <BrandIcon icon={siDiscord} className="h-3.5 w-3.5" />
          Вступить
        </a>
      )}

      <Corners
        className="inset-2.5 opacity-0 transition-opacity duration-200 group-has-[a:focus-visible]:opacity-100 group-has-[a:hover]:opacity-100"
        cornerClassName="h-3 w-3 border-white/60 sm:h-3 sm:w-3"
      />
    </div>
  )
}
