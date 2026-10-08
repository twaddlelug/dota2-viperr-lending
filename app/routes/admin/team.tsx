import { ArrowLeft, Pencil } from 'lucide-react'
import { useState } from 'react'
import { data, Link, redirect } from 'react-router'
import { Button } from '~/components/admin/button'
import { Dialog } from '~/components/admin/dialog'
import { listServerChoices } from '~/features/servers/servers.server'
import { BannerCard } from '~/features/teams/admin/banner-card'
import { RosterCard } from '~/features/teams/admin/roster-card'
import { TeamForm } from '~/features/teams/admin/team-form'
import { TeamTitle } from '~/features/teams/admin/team-title'
import { teamAction } from '~/features/teams/team-action.server'
import {
  deleteTeam,
  getTeamForAdmin,
  updateTeam,
} from '~/features/teams/teams.server'
import { siteUrl } from '~/lib/env.server'
import { optionalText, text } from '~/lib/form-data'
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
    default:
      return teamAction(teamId, form)
  }
}

export default function AdminTeam({ loaderData }: Route.ComponentProps) {
  const { team, servers, inviteBase } = loaderData
  const [editing, setEditing] = useState(false)

  return (
    <>
      <TeamTitle
        team={team}
        back={
          <Link
            to="/admin/teams"
            className="inline-flex items-center gap-1 text-muted hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Команды
          </Link>
        }
      >
        <Button
          type="button"
          variant="secondary"
          onClick={() => setEditing(true)}
        >
          <Pencil /> Редактировать
        </Button>
      </TeamTitle>

      <BannerCard team={team} />
      <RosterCard players={team.players} inviteBase={inviteBase} />

      <Dialog open={editing} onClose={() => setEditing(false)} title="Команда">
        <TeamForm
          team={team}
          servers={servers}
          onDone={() => setEditing(false)}
        />
      </Dialog>
    </>
  )
}
