import { data } from 'react-router'
import { PageHeader } from '~/components/layout/page-header'
import { Avatar } from '~/components/ui/avatar'
import { SectionHeading } from '~/components/ui/section-heading'
import { SITE } from '~/config/site'
import { getTeamMatches } from '~/features/bracket/bracket'
import { getBracket } from '~/features/bracket/bracket.server'
import { MatchCard } from '~/features/bracket/match-card'
import { RosterList } from '~/features/teams/roster-list'
import type { Team } from '~/features/teams/team'
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
      <PageHeader
        title={team.name}
        media={
          <Avatar
            src={team.logoUrl}
            name={team.name}
            initials={team.tag}
            size="xl"
          />
        }
      >
        <TeamFacts team={team} />
      </PageHeader>

      <section className="container mx-auto px-6 pt-10 md:px-8">
        <SectionHeading title="Состав" />
        <RosterList
          players={team.coach ? [...team.players, team.coach] : team.players}
        />
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

function TeamFacts({ team }: { team: Team }) {
  const { server } = team
  const serverLabel = (
    <>
      <Avatar
        src={server.iconUrl}
        name={server.name}
        size="2xs"
        shape="circle"
      />
      {server.name}
    </>
  )

  return (
    <p className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-white/70 uppercase tracking-[0.2em]">
      {team.seed !== undefined && (
        <span className="text-accent">Seed {team.seed}</span>
      )}
      <span>{team.tag}</span>
      {server.inviteUrl ? (
        <a
          href={server.inviteUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 transition-colors hover:text-white"
        >
          {serverLabel} ↗
        </a>
      ) : (
        <span className="flex items-center gap-2">{serverLabel}</span>
      )}
    </p>
  )
}
