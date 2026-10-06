import { ExternalLink, Pencil, RefreshCw, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '~/components/admin/badge'
import { Button } from '~/components/admin/button'
import { ConfirmButton } from '~/components/admin/confirm-button'
import { useAdminFetcher } from '~/components/admin/use-admin-fetcher'
import { Avatar } from '~/components/ui/avatar'
import type { AdminServer } from '../servers.server'

export function ServerListItem({
  server,
  onEdit,
}: {
  server: AdminServer
  onEdit: () => void
}) {
  const refresher = useAdminFetcher({ success: 'Обновлено из Discord' })
  const remover = useAdminFetcher({ success: 'Сервер удалён' })
  const refreshing = refresher.state !== 'idle'
  const busy = refreshing || remover.state !== 'idle'

  return (
    <li className="flex flex-wrap items-center gap-4 px-5 py-4">
      <Avatar
        src={server.iconUrl ?? undefined}
        name={server.name}
        shape="circle"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{server.name}</p>
        {server.inviteUrl && (
          <a
            href={server.inviteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex max-w-full items-center gap-1 truncate text-muted text-xs hover:text-white"
          >
            {server.inviteUrl.replace(/^https?:\/\//, '')}
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {server.team ? (
          <Link to={`/admin/teams/${server.team.id}`}>
            <Badge tone="green">{server.team.name}</Badge>
          </Link>
        ) : (
          <Badge>Без команды</Badge>
        )}
        <ManagerBadge server={server} />
      </div>

      <div className="flex items-center gap-1">
        {server.inviteUrl && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Обновить из Discord"
            disabled={busy}
            onClick={() =>
              refresher.submit(
                { intent: 'refresh', id: server.id },
                { method: 'post' }
              )
            }
          >
            <RefreshCw className={refreshing ? 'animate-spin' : undefined} />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Изменить"
          onClick={onEdit}
        >
          <Pencil />
        </Button>
        <ConfirmButton
          variant="danger"
          size="icon"
          aria-label="Удалить"
          busy={busy || Boolean(server.team)}
          title="Удалить сервер"
          message={
            <>
              Сервер <b>{server.name}</b> будет удалён.
            </>
          }
          onConfirm={() =>
            remover.submit(
              { intent: 'delete', id: server.id },
              { method: 'post' }
            )
          }
        >
          <Trash2 />
        </ConfirmButton>
      </div>
    </li>
  )
}

function ManagerBadge({ server }: { server: AdminServer }) {
  if (server.manager) {
    return <Badge tone="green">Менеджер @{server.manager.username}</Badge>
  }
  if (server.managerDiscordId) {
    return <Badge tone="yellow">Менеджер ещё не входил</Badge>
  }
  return <Badge>Без менеджера</Badge>
}
