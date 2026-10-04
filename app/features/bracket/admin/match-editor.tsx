import { useState } from 'react'
import { Button } from '~/components/admin/button'
import { Input } from '~/components/admin/form-controls'
import { useAdminFetcher } from '~/components/admin/use-admin-fetcher'
import { Avatar } from '~/components/ui/avatar'
import { cn } from '~/lib/cn'
import { toTournamentLocalInput } from '~/lib/format'
import {
  type Match,
  type MatchStatus,
  teamsKnown,
  winsNeeded,
} from '../bracket'

const STATUS_OPTIONS: Array<{ value: MatchStatus; label: string }> = [
  { value: 'upcoming', label: 'Не начат' },
  { value: 'live', label: 'Live' },
  { value: 'finished', label: 'Завершён' },
]

export function MatchEditor({ match }: { match: Match }) {
  const fetcher = useAdminFetcher({ success: `${match.label} сохранён` })
  const initial = {
    scoreA: match.slots[0].score?.toString() ?? '',
    scoreB: match.slots[1].score?.toString() ?? '',
    status: match.status,
    startsAt: toTournamentLocalInput(match.startsAt),
  }
  const [values, setValues] = useState(initial)
  const set = (patch: Partial<typeof values>) =>
    setValues(current => ({ ...current, ...patch }))

  const dirty = (Object.keys(initial) as Array<keyof typeof initial>).some(
    key => values[key] !== initial[key]
  )
  const playable = teamsKnown(match)
  const max = winsNeeded(match.bestOf)
  const a = Number(values.scoreA)
  const b = Number(values.scoreB)
  const leader =
    values.status === 'finished' && values.scoreA && values.scoreB && a !== b
      ? a > b
        ? 0
        : 1
      : null

  return (
    <fetcher.Form
      method="post"
      className={cn(
        'flex flex-col rounded-xl border bg-black/20 p-3',
        values.status === 'live' ? 'border-accent/40' : 'border-line'
      )}
    >
      <input type="hidden" name="intent" value="match" />
      <input type="hidden" name="matchId" value={match.id} />

      <div className="mb-3 flex items-center justify-between font-mono text-muted text-xs">
        <span>{match.label}</span>
        <span>Bo{match.bestOf}</span>
      </div>

      {match.slots.map((slot, i) => (
        <div key={i} className="flex items-center gap-2 py-1">
          {slot.team ? (
            <>
              <Avatar
                src={slot.team.logoUrl}
                name={slot.team.name}
                initials={slot.team.tag}
                size="xs"
              />
              <span
                className={cn(
                  'min-w-0 flex-1 truncate text-sm',
                  leader === i && 'font-semibold text-accent',
                  leader !== null && leader !== i && 'text-muted'
                )}
              >
                {slot.team.name}
              </span>
            </>
          ) : (
            <span className="min-w-0 flex-1 truncate text-muted text-xs italic">
              {slot.placeholder}
            </span>
          )}
          <div className="w-14 shrink-0">
            <Input
              name={i === 0 ? 'scoreA' : 'scoreB'}
              type="number"
              inputMode="numeric"
              min={0}
              max={max}
              value={i === 0 ? values.scoreA : values.scoreB}
              onChange={event =>
                set(
                  i === 0
                    ? { scoreA: event.target.value }
                    : { scoreB: event.target.value }
                )
              }
              disabled={!playable}
              aria-label={`Счёт: ${slot.team?.name ?? slot.placeholder}`}
              className="px-2 text-center"
            />
          </div>
        </div>
      ))}

      <fieldset className="mt-3 grid grid-cols-3 rounded-lg border border-line p-0.5 text-xs">
        <legend className="sr-only">Статус</legend>
        {STATUS_OPTIONS.map(option => {
          const checked = values.status === option.value
          const disabled = !playable && option.value !== 'upcoming'
          return (
            <label
              key={option.value}
              className={cn(
                'cursor-pointer rounded-md py-1.5 text-center transition-colors has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-accent',
                checked
                  ? option.value === 'live'
                    ? 'bg-accent text-black'
                    : 'bg-white/15 text-white'
                  : 'text-muted hover:text-white',
                disabled && 'cursor-default opacity-30 hover:text-muted'
              )}
            >
              <input
                type="radio"
                name="status"
                value={option.value}
                checked={checked}
                disabled={disabled}
                onChange={() => set({ status: option.value })}
                className="sr-only"
              />
              {option.label}
            </label>
          )
        })}
      </fieldset>

      <Input
        type="datetime-local"
        name="startsAt"
        value={values.startsAt}
        onChange={event => set({ startsAt: event.target.value })}
        aria-label="Начало (МСК)"
        className="mt-2 text-xs"
      />

      <Button
        size="sm"
        className="mt-3"
        variant={dirty ? 'primary' : 'secondary'}
        disabled={!dirty || fetcher.state !== 'idle'}
      >
        Сохранить
      </Button>
    </fetcher.Form>
  )
}
