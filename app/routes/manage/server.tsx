import { Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/admin/button'
import { Card } from '~/components/admin/card'
import { Dialog } from '~/components/admin/dialog'
import { EmptyState } from '~/components/admin/empty-state'
import { PageTitle } from '~/components/admin/page-title'
import { Avatar } from '~/components/ui/avatar'
import {
  managedServer,
  managerContext,
} from '~/features/servers/manager.server'
import { RosterCard } from '~/features/teams/admin/roster-card'
import { TeamNameForm } from '~/features/teams/admin/team-name-form'
import { TeamTitle } from '~/features/teams/admin/team-title'
import { rosterAction } from '~/features/teams/roster-action.server'
import {
  createTeam,
  getTeamOfServer,
  renameTeam,
} from '~/features/teams/teams.server'
import { fail } from '~/lib/action-result'
import { siteUrl } from '~/lib/env.server'
import { text } from '~/lib/form-data'
import type { Route } from './+types/server'

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const server = managedServer(context.get(managerContext), params.serverId)
  return {
    server,
    team: await getTeamOfServer(server.id),
    inviteBase: siteUrl(request, '/invite/'),
  }
}

export async function action({ request, params, context }: Route.ActionArgs) {
  const server = managedServer(context.get(managerContext), params.serverId)
  const form = await request.formData()
  const intent = text(form, 'intent')
  const name = { name: text(form, 'name'), tag: text(form, 'tag') }

  if (intent === 'createTeam') {
    return createTeam({ ...name, serverId: server.id })
  }

  const team = await getTeamOfServer(server.id)
  if (!team) return fail('Сначала создайте команду')
  return intent === 'renameTeam'
    ? renameTeam(team.id, name)
    : rosterAction(team.id, form)
}

export default function ManageServer({ loaderData }: Route.ComponentProps) {
  const { server, team, inviteBase } = loaderData
  const [dialog, setDialog] = useState<'create' | 'rename' | null>(null)
  const closeDialog = () => setDialog(null)

  return (
    <>
      {team ? (
        <>
          <TeamTitle team={team}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDialog('rename')}
            >
              <Pencil /> Переименовать
            </Button>
          </TeamTitle>

          <p className="-mt-4 mb-8 max-w-2xl text-muted text-sm">
            Заполните слоты и отправьте каждому игроку его ссылку-приглашение:
            игрок войдёт через Discord, займёт слот и привяжет Steam. Посев и
            сетку ведут организаторы.
          </p>

          <RosterCard players={team.players} inviteBase={inviteBase} />
        </>
      ) : (
        <>
          <PageTitle
            title={
              <span className="flex items-center gap-4">
                <Avatar
                  src={server.iconUrl ?? undefined}
                  name={server.name}
                  size="md"
                  shape="circle"
                />
                {server.name}
              </span>
            }
          />
          <Card>
            <EmptyState
              title="У сервера пока нет команды"
              action={
                <Button type="button" onClick={() => setDialog('create')}>
                  <Plus /> Создать команду
                </Button>
              }
            />
          </Card>
        </>
      )}

      <Dialog
        open={dialog === 'create'}
        onClose={closeDialog}
        title="Новая команда"
      >
        <TeamNameForm onDone={closeDialog} />
      </Dialog>
      {team && (
        <Dialog
          open={dialog === 'rename'}
          onClose={closeDialog}
          title="Команда"
        >
          <TeamNameForm team={team} onDone={closeDialog} />
        </Dialog>
      )}
    </>
  )
}
