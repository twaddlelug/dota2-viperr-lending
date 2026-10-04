import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '~/components/admin/badge'
import { Card } from '~/components/admin/card'
import { CopyButton } from '~/components/admin/copy-button'
import { EmptyState } from '~/components/admin/empty-state'
import { PageTitle } from '~/components/admin/page-title'
import { Avatar } from '~/components/ui/avatar'
import { getAgenda } from '~/features/bracket/bracket'
import { getBracket } from '~/features/bracket/bracket.server'
import { countServers } from '~/features/servers/servers.server'
import {
  getRosterProgress,
  listPendingInvites,
} from '~/features/teams/roster.server'
import { positionLabel } from '~/features/teams/team'
import { countTeams } from '~/features/teams/teams.server'
import { cn } from '~/lib/cn'
import { siteUrl } from '~/lib/env.server'
import { formatMatchTime } from '~/lib/format'
import type { Route } from './+types/overview'

export async function loader({ request }: Route.LoaderArgs) {
  const [servers, teams, roster, invites, bracket] = await Promise.all([
    countServers(),
    countTeams(),
    getRosterProgress(),
    listPendingInvites(),
    getBracket(),
  ])

  return {
    stats: { servers, teams: teams.total, seeded: teams.seeded, ...roster },
    invites: invites.map(({ inviteCode, ...player }) => ({
      ...player,
      inviteUrl: siteUrl(request, `/invite/${inviteCode}`),
    })),
    agenda: getAgenda(bracket),
  }
}

type LoaderData = Route.ComponentProps['loaderData']

export default function AdminOverview({ loaderData }: Route.ComponentProps) {
  const { stats, invites, agenda } = loaderData

  return (
    <>
      <PageTitle title="Обзор" />
      <StatCards stats={stats} />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AgendaCard agenda={agenda} />
        <PendingInvitesCard invites={invites} stats={stats} />
      </div>
    </>
  )
}

function StatCards({ stats }: { stats: LoaderData['stats'] }) {
  const cards = [
    { label: 'Серверы', value: stats.servers, href: '/admin/servers' },
    { label: 'Команды', value: stats.teams, href: '/admin/teams' },
    { label: 'Посев', value: stats.seeded, total: 8, href: '/admin/bracket' },
    { label: 'Игроки', value: stats.players, href: '/admin/teams' },
    {
      label: 'Инвайт принят',
      value: stats.linked,
      total: stats.players,
      href: '/admin/teams',
    },
    {
      label: 'Steam привязан',
      value: stats.steam,
      total: stats.players,
      href: '/admin/teams',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {cards.map(card => {
        const complete =
          card.total !== undefined &&
          card.total > 0 &&
          card.value === card.total
        return (
          <Link
            key={card.label}
            to={card.href}
            className="group rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-white/20"
          >
            <p className="text-muted text-xs">{card.label}</p>
            <p className="mt-2 font-bold font-display text-2xl">
              <span className={cn(complete && 'text-accent')}>
                {card.value}
              </span>
              {card.total !== undefined && (
                <span className="text-base text-muted"> / {card.total}</span>
              )}
            </p>
          </Link>
        )
      })}
    </div>
  )
}

function AgendaCard({ agenda }: { agenda: LoaderData['agenda'] }) {
  return (
    <Card
      title="Матчи"
      actions={
        <Link
          to="/admin/bracket"
          className="text-muted text-sm hover:text-white"
        >
          Сетка <ArrowRight className="inline h-3.5 w-3.5" />
        </Link>
      }
    >
      {agenda.length === 0 ? (
        <EmptyState title="Нет запланированных матчей" />
      ) : (
        <ul className="divide-y divide-line">
          {agenda.map(match => (
            <li
              key={match.id}
              className="flex items-center gap-4 px-5 py-3 text-sm"
            >
              <span className="w-20 shrink-0 font-mono text-muted text-xs">
                {match.label}
              </span>
              <span className="min-w-0 flex-1 truncate">
                {match.slots[0].team?.name ?? (
                  <span className="text-muted">
                    {match.slots[0].placeholder}
                  </span>
                )}
                <span className="mx-2 text-muted">vs</span>
                {match.slots[1].team?.name ?? (
                  <span className="text-muted">
                    {match.slots[1].placeholder}
                  </span>
                )}
              </span>
              {match.status === 'live' ? (
                <Badge tone="green">
                  {match.slots[0].score ?? 0} : {match.slots[1].score ?? 0} ·
                  Live
                </Badge>
              ) : (
                <span className="shrink-0 text-muted text-xs">
                  {match.startsAt
                    ? formatMatchTime(match.startsAt)
                    : 'Без даты'}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

function PendingInvitesCard({
  invites,
  stats,
}: {
  invites: LoaderData['invites']
  stats: LoaderData['stats']
}) {
  return (
    <Card
      title="Ждут инвайт"
      actions={
        stats.pending > 0 && <Badge tone="yellow">{stats.pending}</Badge>
      }
    >
      {invites.length === 0 ? (
        <EmptyState
          title={
            stats.players === 0 ? 'Игроков пока нет' : 'Все приглашения приняты'
          }
        />
      ) : (
        <ul className="divide-y divide-line">
          {invites.map(player => (
            <li
              key={player.id}
              className="flex items-center gap-3 px-5 py-3 text-sm"
            >
              <Avatar
                src={player.team.logoUrl ?? undefined}
                name={player.team.name}
                initials={player.team.tag}
                size="xs"
              />
              <Link
                to={`/admin/teams/${player.team.id}`}
                className="min-w-0 flex-1 truncate hover:text-accent"
              >
                {player.nickname}
                <span className="ml-2 text-muted">
                  {player.team.name} · {positionLabel(player.position)}
                </span>
              </Link>
              <CopyButton value={player.inviteUrl} label="Ссылка" />
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
