import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Link, redirect } from 'react-router'
import { Button } from '~/components/admin/button'
import { Card } from '~/components/admin/card'
import { Dialog } from '~/components/admin/dialog'
import { EmptyState } from '~/components/admin/empty-state'
import { PageTitle } from '~/components/admin/page-title'
import { listServerChoices } from '~/features/servers/servers.server'
import { CreateTeamForm } from '~/features/teams/admin/create-team-form'
import { TeamsTable } from '~/features/teams/admin/teams-table'
import { createTeam, listTeamsForAdmin } from '~/features/teams/teams.server'
import { text } from '~/lib/form-data'
import type { Route } from './+types/teams'

export async function loader() {
  const [teams, freeServers] = await Promise.all([
    listTeamsForAdmin(),
    listServerChoices(),
  ])
  return { teams, freeServers }
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData()
  const result = await createTeam({
    name: text(form, 'name'),
    tag: text(form, 'tag'),
    serverId: text(form, 'serverId'),
  })
  return result.ok ? redirect(`/admin/teams/${result.teamId}`) : result
}

export default function AdminTeams({ loaderData }: Route.ComponentProps) {
  const { teams, freeServers } = loaderData
  const [creating, setCreating] = useState(false)

  const createButton = (
    <Button
      type="button"
      onClick={() => setCreating(true)}
      disabled={freeServers.length === 0}
    >
      <Plus /> Новая команда
    </Button>
  )

  return (
    <>
      <PageTitle title="Команды">{teams.length > 0 && createButton}</PageTitle>

      <Card>
        {teams.length > 0 ? (
          <TeamsTable teams={teams} />
        ) : freeServers.length > 0 ? (
          <EmptyState title="Команд пока нет" action={createButton} />
        ) : (
          <EmptyState
            title="Сначала добавьте сервер"
            action={
              <Link
                to="/admin/servers"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-semibold text-black text-sm hover:bg-accent-hover"
              >
                <Plus className="h-4 w-4" /> Добавить сервер
              </Link>
            }
          />
        )}
      </Card>

      <Dialog
        open={creating}
        onClose={() => setCreating(false)}
        title="Новая команда"
      >
        <CreateTeamForm
          servers={freeServers}
          onCancel={() => setCreating(false)}
        />
      </Dialog>
    </>
  )
}
