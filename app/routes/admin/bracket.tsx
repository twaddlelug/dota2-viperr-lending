import { Card } from '~/components/admin/card'
import { PageTitle } from '~/components/admin/page-title'
import { MatchEditor } from '~/features/bracket/admin/match-editor'
import { SeedingCard } from '~/features/bracket/admin/seeding-card'
import {
  type Match,
  SEED_COUNT,
  seedingLocked,
  toMatchStatus,
} from '~/features/bracket/bracket'
import {
  getBracket,
  getSeedingTeams,
  saveMatchResult,
  saveSeeds,
} from '~/features/bracket/bracket.server'
import { fail } from '~/lib/action-result'
import { optionalInt, text } from '~/lib/form-data'
import { fromTournamentLocalInput } from '~/lib/format'
import type { Route } from './+types/bracket'

export async function loader() {
  const [teams, bracket] = await Promise.all([getSeedingTeams(), getBracket()])
  return { teams, bracket }
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData()

  switch (text(form, 'intent')) {
    case 'seeds':
      return saveSeeds(
        Array.from({ length: SEED_COUNT }, (_, i) =>
          text(form, `seed-${i + 1}`)
        )
      )
    case 'match':
      return saveMatchResult({
        matchId: text(form, 'matchId'),
        status: toMatchStatus(text(form, 'status')),
        scoreA: optionalInt(form, 'scoreA'),
        scoreB: optionalInt(form, 'scoreB'),
        startsAt: fromTournamentLocalInput(text(form, 'startsAt')),
      })
    default:
      return fail('Неизвестное действие')
  }
}

export default function AdminBracket({ loaderData }: Route.ComponentProps) {
  const { teams, bracket } = loaderData
  const savedSeedsKey = teams.map(team => `${team.id}:${team.seed}`).join()

  return (
    <>
      <PageTitle title="Сетка" />

      <SeedingCard
        key={savedSeedsKey}
        teams={teams}
        locked={seedingLocked(bracket)}
      />

      {bracket.map(section => (
        <Card key={section.id} title={section.name} className="mt-6">
          <div className="space-y-6 p-5">
            {section.rounds.map(round => (
              <div key={round.name}>
                {section.id !== 'final' && (
                  <p className="mb-3 text-muted text-xs uppercase tracking-wider">
                    {round.name}
                  </p>
                )}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {round.matches.map(match => (
                    <MatchEditor key={savedResultKey(match)} match={match} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </>
  )
}

const savedResultKey = (match: Match) =>
  [
    match.id,
    match.status,
    ...match.slots.map(slot => slot.score),
    match.startsAt,
  ].join(':')
