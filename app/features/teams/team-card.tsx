import { Link } from 'react-router'
import { Avatar } from '~/components/ui/avatar'
import { Corners } from '~/components/ui/corners'
import { cn } from '~/lib/cn'
import type { Team } from './team'

export function TeamCard({
  team,
  badge,
  eliminated = false,
}: {
  team: Team
  badge?: string
  eliminated?: boolean
}) {
  const cover =
    team.banner?.kind === 'video' ? team.banner.posterUrl : team.banner?.url

  return (
    <Link
      to={`/teams/${team.slug}`}
      className={cn(
        'group relative isolate flex aspect-[4/5] flex-col justify-between overflow-hidden p-4 transition-[background-color,filter,opacity] duration-300 hover:bg-surface focus-visible:bg-surface focus-visible:outline-none sm:p-5 lg:aspect-square',
        eliminated &&
          'opacity-60 grayscale hover:opacity-100 hover:grayscale-0 focus-visible:opacity-100 focus-visible:grayscale-0'
      )}
    >
      {cover && (
        <>
          <img
            src={cover}
            alt=""
            loading="lazy"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35 transition-opacity duration-300 group-hover:opacity-60 group-focus-visible:opacity-60"
          />
          <span className="absolute inset-0 -z-10 bg-gradient-to-t from-bg via-bg/50 to-bg/10" />
        </>
      )}

      <span className="flex items-start justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.2em]">
        <span className="text-muted">
          {team.seed !== undefined && String(team.seed).padStart(2, '0')}
        </span>
        {badge && <span className="text-accent">{badge}</span>}
      </span>

      <Avatar
        src={team.logoUrl}
        name={team.name}
        initials={team.tag}
        size="lg"
        className="self-center transition-transform duration-300 ease-enter group-hover:scale-105 sm:h-28 sm:w-28 sm:text-2xl"
      />

      <span className="break-words font-black font-display text-base uppercase leading-tight sm:text-xl">
        {team.name}
        {eliminated && <span className="sr-only"> — выбыла</span>}
      </span>

      <Corners
        className="inset-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        cornerClassName="h-3 w-3 border-white/60 sm:h-3 sm:w-3"
      />
    </Link>
  )
}
