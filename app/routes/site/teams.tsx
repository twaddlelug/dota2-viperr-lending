import { PageHeader } from '~/components/layout/page-header'
import { SITE } from '~/config/site'
import { getStandings } from '~/features/bracket/bracket'
import { getBracket } from '~/features/bracket/bracket.server'
import { StandingLabel } from '~/features/bracket/standing-label'
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

export default function TeamsPage({ loaderData }: Route.ComponentProps) {
  const { teams, standings } = loaderData

  return (
    <>
      <PageHeader title="Команды" />

      <section className="container mx-auto px-6 pt-6 md:px-8">
        {teams.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {teams.map(team => (
              <TeamCard
                key={team.id}
                team={team}
                status={<StandingLabel standing={standings[team.slug]} />}
                eliminated={standings[team.slug]?.state === 'eliminated'}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">Команды ещё не объявлены.</p>
        )}
      </section>
    </>
  )
}
