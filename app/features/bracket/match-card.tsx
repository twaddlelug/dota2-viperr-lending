import { Link } from 'react-router'
import { Avatar } from '~/components/ui/avatar'
import { cn } from '~/lib/cn'
import { formatMatchTime } from '~/lib/format'
import { type Match, type Slot, type SlotResult, slotResult } from './bracket'

export function MatchCard({
  match,
  quiet = false,
  className,
}: {
  match: Match
  quiet?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'w-full rounded-xl border bg-surface/95 text-sm',
        match.status === 'live' && !quiet ? 'border-accent/50' : 'border-line',
        className
      )}
    >
      <div className="flex items-center justify-between border-line border-b px-3 py-1.5 text-[11px] text-muted uppercase tracking-wider">
        <span>Bo{match.bestOf}</span>
        <MatchStatusLabel match={match} quiet={quiet} />
      </div>
      {match.slots.map((slot, i) => (
        <SlotRow
          key={i}
          slot={slot}
          result={slotResult(match, i)}
          showScore={match.status !== 'upcoming'}
        />
      ))}
    </div>
  )
}

function MatchStatusLabel({ match, quiet }: { match: Match; quiet: boolean }) {
  if (match.status === 'live') {
    return (
      <span
        className={cn(
          'flex items-center gap-1.5 font-bold',
          !quiet && 'text-accent'
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
        Live
      </span>
    )
  }
  if (match.status === 'finished') return <span>Завершён</span>
  return <span>{match.startsAt ? formatMatchTime(match.startsAt) : 'TBA'}</span>
}

function SlotRow({
  slot,
  result,
  showScore,
}: {
  slot: Slot
  result: SlotResult
  showScore: boolean
}) {
  const { team } = slot

  if (!team) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-muted">
        <span className="h-6 w-6 shrink-0 rounded-[28%] border border-line border-dashed" />
        <span className="truncate pr-1 text-xs italic">{slot.placeholder}</span>
      </div>
    )
  }

  return (
    <Link
      to={`/teams/${team.slug}`}
      className={cn(
        'flex items-center gap-2 px-3 py-2 transition-colors hover:bg-white/5',
        result === 'lost' && 'opacity-45'
      )}
    >
      <Avatar
        src={team.logoUrl}
        name={team.name}
        initials={team.tag}
        size="xs"
      />
      <span
        className={cn('flex-1 truncate', result === 'won' && 'font-semibold')}
      >
        {team.name}
      </span>
      {showScore && (
        <span
          className={cn(
            'font-mono',
            result === 'won' ? 'font-bold text-white' : 'text-muted'
          )}
        >
          {slot.score ?? '–'}
        </span>
      )}
    </Link>
  )
}
