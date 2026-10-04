import { data, Link } from 'react-router'
import { PageHeader } from '~/components/layout/page-header'
import { SectionHeading } from '~/components/ui/section-heading'
import { SITE } from '~/config/site'
import { getTeamMatches } from '~/features/bracket/bracket'
import { getBracket } from '~/features/bracket/bracket.server'
import { MatchCard } from '~/features/bracket/match-card'
import { PlayerCard } from '~/features/teams/player-card'
import { getTeam } from '~/features/teams/teams.server'
import type { Route } from './+types/team'

export async function loader({ params }: Route.LoaderArgs) {
  const [team, bracket] = await Promise.all([
    getTeam(params.slug),
    getBracket(),
  ])
  if (!team) throw data('Такой команды нет', { status: 404 })

  return { team, matches: getTeamMatches(bracket, team.slug) }
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) return [{ title: SITE.name }]
  const { team } = loaderData
  return [
    { title: `${team.name} — ${SITE.name}` },
    {
      name: 'description',
      content: `${team.name} (${team.server.name}): состав и матчи на ${SITE.name}.`,
    },
  ]
}

export default function TeamPage({ loaderData }: Route.ComponentProps) {
  const { team, matches } = loaderData

  return (
    <>
      <PageHeader title={team.name} />

      <section className="container mx-auto px-6 pt-6 md:px-8">
        <Link
          to="/teams"
          className="text-muted text-xs uppercase tracking-wider transition-colors hover:text-accent"
        >
          ← Все команды
        </Link>
      </section>

      <section className="container mx-auto px-6 pt-10 md:px-8">
        <SectionHeading title="Состав" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {team.players.map(player => (
            <PlayerCard key={player.id} player={player} />
          ))}
          {team.substitute && <PlayerCard player={team.substitute} />}
        </div>
      </section>

      <section className="container mx-auto px-6 pt-16 md:px-8">
        <SectionHeading title="Матчи" />
        {matches.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map(match => (
              <div key={match.id}>
                <p className="mb-3 text-[11px] text-muted uppercase tracking-[0.2em]">
                  {match.roundName}
                </p>
                <MatchCard match={match} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">Матчей пока нет.</p>
        )}
      </section>
    </>
  )
}
