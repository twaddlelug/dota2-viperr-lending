import { Link } from 'react-router'
import { Avatar } from '~/components/ui/avatar'
import { CornerFrame } from '~/components/ui/corner-frame'
import { cn } from '~/lib/cn'
import {
  type Player,
  type Position,
  playerAvatar,
  positionLabel,
  ROSTER_SLOTS,
  type Team,
} from './team'

export function TeamCard({
  team,
  status,
  eliminated = false,
}: {
  team: Team
  status: React.ReactNode
  eliminated?: boolean
}) {
  const lineup = ROSTER_SLOTS.map(position => ({
    position,
    player:
      position === null
        ? team.substitute
        : team.players.find(player => player.position === position),
  }))

  return (
    <Link
      to={`/teams/${team.slug}`}
      className={cn(
        'group relative isolate flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[border-color,filter] duration-300 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
        eliminated && 'grayscale hover:grayscale-0'
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(110%_90%_at_0%_0%,var(--color-stage-glow),transparent_65%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -top-5 -right-2 -z-10 select-none font-black font-display text-[8rem] text-white/[0.035] leading-none"
      >
        {team.tag}
      </span>

      <div className="flex items-center gap-5 p-5 sm:p-6">
        <CornerFrame className="shrink-0 p-2">
          <Avatar
            src={team.logoUrl}
            name={team.name}
            initials={team.tag}
            size="lg"
          />
        </CornerFrame>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-muted uppercase tracking-[0.2em]">
            {team.seed !== undefined && (
              <span className="text-accent">Seed {team.seed}</span>
            )}
            <span className="flex min-w-0 items-center gap-1.5">
              <Avatar
                src={team.server.iconUrl}
                name={team.server.name}
                size="2xs"
                shape="circle"
              />
              {team.server.name}
            </span>
          </p>
          <h3 className="mt-2 break-words font-black font-display text-2xl text-metal uppercase leading-tight sm:text-3xl">
            {team.name}
          </h3>
        </div>
      </div>

      <ol
        aria-label="Состав"
        className="grid flex-1 grid-cols-3 gap-px border-line border-y bg-line sm:grid-cols-6"
      >
        {lineup.map(({ position, player }) => (
          <LineupSlot
            key={position ?? 'substitute'}
            position={position}
            player={player}
          />
        ))}
      </ol>

      <div className="flex items-center justify-between gap-4 px-5 py-3 sm:px-6">
        {status}
        <span
          aria-hidden
          className="text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
        >
          →
        </span>
      </div>
    </Link>
  )
}

function LineupSlot({
  position,
  player,
}: {
  position: Position | null
  player: Player | undefined
}) {
  return (
    <li className="flex flex-col items-center bg-surface px-2 pt-4 pb-3 text-center">
      <span className="font-black font-display text-metal text-xl leading-none">
        {position ?? 'S'}
      </span>
      <div className="relative mt-3">
        {player ? (
          <Avatar
            src={playerAvatar(player)}
            name={player.nickname}
            size="md"
            shape="circle"
          />
        ) : (
          <span className="block h-12 w-12 rounded-full border border-line border-dashed" />
        )}
        {player?.captain && (
          <span className="absolute -right-1 -bottom-1 rounded-full bg-accent px-1.5 font-bold text-[10px] text-black leading-4">
            <span aria-hidden>C</span>
            <span className="sr-only">Капитан</span>
          </span>
        )}
      </div>
      <span
        className={cn(
          'mt-2 w-full break-words font-semibold text-sm leading-tight',
          !player && 'text-muted'
        )}
      >
        {player?.nickname ?? '—'}
      </span>
      <span className="mt-1 text-[11px] text-muted uppercase leading-tight tracking-wider">
        {positionLabel(position)}
      </span>
    </li>
  )
}
