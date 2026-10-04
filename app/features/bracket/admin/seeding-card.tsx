import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '~/components/admin/badge'
import { Button } from '~/components/admin/button'
import { Card } from '~/components/admin/card'
import { Select } from '~/components/admin/form-controls'
import { useAdminFetcher } from '~/components/admin/use-admin-fetcher'
import { SEED_COUNT, SEED_PAIRS } from '../bracket'
import type { SeedingTeam } from '../bracket.server'

export function SeedingCard({
  teams,
  locked,
}: {
  teams: SeedingTeam[]
  locked: boolean
}) {
  const fetcher = useAdminFetcher({ success: 'Посев сохранён' })
  const saved = Array.from(
    { length: SEED_COUNT },
    (_, i) => teams.find(team => team.seed === i + 1)?.id ?? ''
  )
  const [picks, setPicks] = useState(saved)
  const dirty = picks.some((pick, i) => pick !== saved[i])

  const seedSelect = (seed: number) => (
    <div className="flex items-center gap-2">
      <span className="w-5 shrink-0 text-right font-mono text-muted text-xs">
        {seed}
      </span>
      <Select
        name={`seed-${seed}`}
        value={picks[seed - 1]}
        onChange={event =>
          setPicks(current =>
            current.map((pick, i) =>
              i === seed - 1 ? event.target.value : pick
            )
          )
        }
        aria-label={`Посев ${seed}`}
        disabled={locked}
      >
        <option value="">—</option>
        {teams.map(team => (
          <option
            key={team.id}
            value={team.id}
            disabled={picks.includes(team.id) && picks[seed - 1] !== team.id}
          >
            {team.name}
          </option>
        ))}
      </Select>
    </div>
  )

  return (
    <Card
      title="Посев"
      actions={
        locked ? (
          <Badge>Зафиксирован</Badge>
        ) : (
          dirty && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setPicks(saved)}
            >
              <RotateCcw /> Сбросить
            </Button>
          )
        )
      }
    >
      <fetcher.Form method="post" className="p-5">
        <input type="hidden" name="intent" value="seeds" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {SEED_PAIRS.map(pair => (
            <div
              key={pair.label}
              className="rounded-xl border border-line bg-black/20 p-3"
            >
              <p className="mb-2 font-mono text-muted text-xs">{pair.label}</p>
              <div className="space-y-2">
                {seedSelect(pair.seeds[0])}
                {seedSelect(pair.seeds[1])}
              </div>
            </div>
          ))}
        </div>
        {!locked && (
          <Button
            className="mt-4"
            variant={dirty ? 'primary' : 'secondary'}
            disabled={!dirty || fetcher.state !== 'idle'}
          >
            Сохранить посев
          </Button>
        )}
      </fetcher.Form>
    </Card>
  )
}
