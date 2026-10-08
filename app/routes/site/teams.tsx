import { PageHeader } from '~/components/layout/page-header'
import { Board } from '~/components/ui/board'
import { SITE } from '~/config/site'
import { getStandings, type Standing } from '~/features/bracket/bracket'
import { getBracket } from '~/features/bracket/bracket.server'
import { TeamCard } from '~/features/teams/team-card'
import { getTeams } from '~/features/teams/teams.server'
import type { Route } from './+types/teams'

export async function loader() {
  const [teams, bracket] = await Promise.all([getTeams(), getBracket()])
  return { teams, standings: Object.fromEntries(getStandings(bracket)) }
}

export function meta() {
  return [
    { title: `Команды — ${SITE.name}` },
    {
      name: 'description',
      content: `Команды ${SITE.name}: каждый Discord-сервер выставляет своих лучших игроков.`,
    },
  ]
}

const BADGES: Partial<Record<Standing['state'], string>> = {
  champion: 'Чемпион',
  'runner-up': 'Финалист',
}

export default function TeamsPage({ loaderData }: Route.ComponentProps) {
  const { teams, standings } = loaderData

  return (
    <>
      <PageHeader title="Команды" />

      <section className="container mx-auto px-6 pt-6 md:px-8">
        {teams.length > 0 ? (
          <Board count={teams.length} label="Команды">
            {teams.map(team => {
              const state = standings[team.slug]?.state
              return (
                <li key={team.id}>
                  <TeamCard
                    team={team}
                    badge={state && BADGES[state]}
                    eliminated={state === 'eliminated'}
                  />
                </li>
              )
            })}
          </Board>
        ) : (
          <p className="text-center text-muted">Команды ещё не объявлены.</p>
        )}
      </section>
    </>
  )
}
