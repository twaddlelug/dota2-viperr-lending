import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/admin/button'
import { Card } from '~/components/admin/card'
import { Dialog } from '~/components/admin/dialog'
import { EmptyState } from '~/components/admin/empty-state'
import { PageTitle } from '~/components/admin/page-title'
import { ServerForm } from '~/features/servers/admin/server-form'
import { ServerListItem } from '~/features/servers/admin/server-list-item'
import {
  type AdminServer,
  deleteServer,
  listServers,
  refreshServer,
  saveServer,
} from '~/features/servers/servers.server'
import { fail } from '~/lib/action-result'
import { optionalText, text } from '~/lib/form-data'
import type { Route } from './+types/servers'

export async function loader() {
  return { servers: await listServers() }
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData()
  const id = text(form, 'id')
  const details = {
    name: text(form, 'name'),
    iconUrl: optionalText(form, 'iconUrl'),
    inviteUrl: optionalText(form, 'inviteUrl'),
    managerDiscordId: optionalText(form, 'managerDiscordId'),
  }

  switch (text(form, 'intent')) {
    case 'create':
      return saveServer(null, details)
    case 'update':
      return saveServer(id, details)
    case 'refresh':
      return refreshServer(id)
    case 'delete':
      return deleteServer(id)
    default:
      return fail('Неизвестное действие')
  }
}

export default function AdminServers({ loaderData }: Route.ComponentProps) {
  const { servers } = loaderData
  const [editing, setEditing] = useState<AdminServer | 'new' | null>(null)

  return (
    <>
      <PageTitle title="Серверы">
        <Button type="button" onClick={() => setEditing('new')}>
          <Plus /> Добавить сервер
        </Button>
      </PageTitle>

      <Card>
        {servers.length === 0 ? (
          <EmptyState title="Серверов пока нет" />
        ) : (
          <ul className="divide-y divide-line">
            {servers.map(server => (
              <ServerListItem
                key={server.id}
                server={server}
                onEdit={() => setEditing(server)}
              />
            ))}
          </ul>
        )}
      </Card>

      <Dialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Новый сервер' : 'Сервер'}
      >
        {editing !== null && (
          <ServerForm
            server={editing === 'new' ? undefined : editing}
            onDone={() => setEditing(null)}
          />
        )}
      </Dialog>
    </>
  )
}
