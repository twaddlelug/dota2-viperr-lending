import { Link } from 'react-router'
import { Avatar } from '~/components/ui/avatar'
import { cn } from '~/lib/cn'
import { formatMatchTimeShort } from '~/lib/format'
import {
  type Bracket,
  type Match,
  type Section,
  type Slot,
  type SlotResult,
  slotResult,
} from './bracket'

export function BracketTree({ bracket }: { bracket: Bracket }) {
  const upper = bracket.find(section => section.id === 'upper')
  const lower = bracket.find(section => section.id === 'lower')
  const final = bracket.find(section => section.id === 'final')
  const grandFinal = final?.rounds[0]?.matches[0]

  return (
    <div className="overflow-x-auto pb-2">
      <div className="mx-auto flex w-max items-center gap-6">
        <div className="flex flex-col gap-5">
          {upper && <SectionTree section={upper} />}
          {lower && <SectionTree section={lower} />}
        </div>

        {grandFinal && (
          <div className="w-48">
            <p className="mb-2 text-center font-display text-[11px] text-accent uppercase tracking-[0.25em]">
              Grand Final
            </p>
            <BracketMatch match={grandFinal} />
          </div>
        )}
      </div>
    </div>
  )
}

function SectionTree({ section }: { section: Section }) {
  const { rounds } = section
  const last = rounds.length - 1

  return (
    <section aria-label={section.name}>
      <div className="flex gap-6">
        {rounds.map((round, r) => {
          const merges =
            r < last && rounds[r + 1].matches.length < round.matches.length

          return (
            <div key={round.name} className="flex w-44 flex-col">
              <h3 className="mb-1 truncate text-[10px] text-muted uppercase tracking-[0.15em]">
                {round.name}
              </h3>
              <div className="flex flex-1 flex-col">
                {round.matches.map((match, i) => (
                  <div
                    key={match.id}
                    className="relative flex flex-1 items-center py-1"
                  >
                    {r > 0 && (
                      <span className="absolute top-1/2 right-full h-px w-3 bg-white/15" />
                    )}
                    <BracketMatch match={match} />
                    {r < last && (
                      <span className="absolute top-1/2 left-full h-px w-3 bg-white/15" />
                    )}
                    {merges && (
                      <span
                        className={cn(
                          'absolute left-[calc(100%+0.75rem)] w-px bg-white/15',
                          i % 2 === 0 ? 'top-1/2 bottom-0' : 'top-0 bottom-1/2'
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function BracketMatch({ match }: { match: Match }) {
  const live = match.status === 'live'
  const caption = live
    ? 'Live'
    : match.status === 'upcoming' && match.startsAt
      ? formatMatchTimeShort(match.startsAt)
      : null

  return (
    <div
      className={cn(
        'relative w-full rounded-md border bg-surface',
        live ? 'border-accent/60' : 'border-line'
      )}
    >
      {caption && (
        <span
          className={cn(
            'absolute -top-2 right-2 bg-bg px-1 font-mono text-[10px] uppercase leading-4',
            live ? 'text-accent' : 'text-muted'
          )}
        >
          {caption}
        </span>
      )}
      {match.slots.map((slot, i) => (
        <BracketSlot
          key={i}
          slot={slot}
          result={slotResult(match, i)}
          showScore={match.status !== 'upcoming'}
          className={i === 1 ? 'border-line border-t' : undefined}
        />
      ))}
    </div>
  )
}

function BracketSlot({
  slot,
  result,
  showScore,
  className,
}: {
  slot: Slot
  result: SlotResult
  showScore: boolean
  className?: string
}) {
  const row = cn('flex h-6 items-center gap-2 px-2 text-xs', className)

  if (!slot.team) {
    return (
      <div className={cn(row, 'text-[11px] text-muted italic')}>
        <span className="truncate pr-1">{slot.placeholder}</span>
      </div>
    )
  }

  return (
    <Link
      to={`/teams/${slot.team.slug}`}
      className={cn(
        row,
        'transition-colors hover:bg-white/5',
        result === 'lost' && 'opacity-45'
      )}
    >
      <Avatar
        src={slot.team.logoUrl}
        name={slot.team.name}
        initials={slot.team.tag}
        size="2xs"
      />
      <span
        className={cn('flex-1 truncate', result === 'won' && 'font-semibold')}
      >
        {slot.team.name}
      </span>
      {showScore && (
        <span
          className={cn(
            'font-mono',
            result === 'won' ? 'font-bold text-accent' : 'text-muted'
          )}
        >
          {slot.score ?? '–'}
        </span>
      )}
    </Link>
  )
}
