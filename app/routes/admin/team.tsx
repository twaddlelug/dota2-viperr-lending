import { ArrowLeft, ExternalLink, Pencil, Server } from 'lucide-react'
import { useState } from 'react'
import { data, Link, redirect } from 'react-router'
import { Badge } from '~/components/admin/badge'
import { Button } from '~/components/admin/button'
import { Dialog } from '~/components/admin/dialog'
import { PageTitle } from '~/components/admin/page-title'
import { Avatar } from '~/components/ui/avatar'
import { listServerChoices } from '~/features/servers/servers.server'
import { PlayerForm } from '~/features/teams/admin/player-form'
import { RosterCard } from '~/features/teams/admin/roster-card'
import { TeamForm } from '~/features/teams/admin/team-form'
import {
  addPlayer,
  deletePlayer,
  renewInvite,
  toggleCaptain,
  unlinkPlayer,
  updatePlayer,
} from '~/features/teams/roster.server'
import { toPosition } from '~/features/teams/team'
import {
  type AdminPlayer,
  deleteTeam,
  getTeamForAdmin,
  updateTeam,
} from '~/features/teams/teams.server'
import { fail } from '~/lib/action-result'
import { siteUrl } from '~/lib/env.server'
import { optionalInt, optionalText, text } from '~/lib/form-data'
import type { Route } from './+types/team'

export async function loader({ request, params }: Route.LoaderArgs) {
  const team = await getTeamForAdmin(params.teamId)
  if (!team) throw data('Команда не найдена', { status: 404 })

  return {
    team,
    servers: await listServerChoices(team.serverId),
    inviteBase: siteUrl(request, '/invite/'),
  }
}

export async function action({ request, params }: Route.ActionArgs) {
  const { teamId } = params
  const form = await request.formData()
  const playerId = text(form, 'playerId')
  const player = {
    nickname: text(form, 'nickname'),
    position: toPosition(optionalInt(form, 'position')),
  }

  switch (text(form, 'intent')) {
    case 'updateTeam':
      return updateTeam(teamId, {
        name: text(form, 'name'),
        tag: text(form, 'tag'),
        serverId: text(form, 'serverId'),
        slug: text(form, 'slug'),
        logoUrl: optionalText(form, 'logoUrl'),
      })
    case 'deleteTeam':
      await deleteTeam(teamId)
      return redirect('/admin/teams')
    case 'addPlayer':
      return addPlayer(teamId, player)
    case 'updatePlayer':
      return updatePlayer(teamId, playerId, player)
    case 'toggleCaptain':
      return toggleCaptain(teamId, playerId)
    case 'newInvite':
      return renewInvite(teamId, playerId)
    case 'unlinkPlayer':
      return unlinkPlayer(teamId, playerId)
    case 'deletePlayer':
      return deletePlayer(teamId, playerId)
    default:
      return fail('Неизвестное действие')
  }
}

export default function AdminTeam({ loaderData }: Route.ComponentProps) {
  const { team, servers, inviteBase } = loaderData
  const [editingTeam, setEditingTeam] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<AdminPlayer | null>(null)

  return (
    <>
      <PageTitle
        back={
          <Link
            to="/admin/teams"
            className="inline-flex items-center gap-1 text-muted hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Команды
          </Link>
        }
        title={
          <span className="flex items-center gap-4">
            <Avatar
              src={team.logoUrl ?? undefined}
              name={team.name}
              initials={team.tag}
              size="md"
            />
            <span>
              {team.name}
              <span className="ml-3 font-mono text-base text-muted">
                {team.tag}
              </span>
            </span>
          </span>
        }
      >
        <Link
          to={`/teams/${team.slug}`}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 font-semibold text-sm transition-colors hover:border-white/30 hover:bg-white/5"
        >
          <ExternalLink className="h-4 w-4" /> На сайте
        </Link>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setEditingTeam(true)}
        >
          <Pencil /> Редактировать
        </Button>
      </PageTitle>

      <div className="-mt-4 mb-8 flex flex-wrap gap-2">
        <Badge>
          <Server />
          {team.server.name}
        </Badge>
        <Badge tone={team.seed ? 'green' : 'gray'}>
          {team.seed ? `Посев ${team.seed}` : 'Без посева'}
        </Badge>
      </div>

      <RosterCard
        players={team.players}
        inviteBase={inviteBase}
        onEditPlayer={setEditingPlayer}
      />

      <Dialog
        open={editingTeam}
        onClose={() => setEditingTeam(false)}
        title="Команда"
      >
        <TeamForm
          team={team}
          servers={servers}
          onDone={() => setEditingTeam(false)}
        />
      </Dialog>

      <Dialog
        open={editingPlayer !== null}
        onClose={() => setEditingPlayer(null)}
        title="Игрок"
      >
        {editingPlayer && (
          <PlayerForm
            player={editingPlayer}
            roster={team.players}
            onDone={() => setEditingPlayer(null)}
          />
        )}
      </Dialog>
    </>
  )
}
