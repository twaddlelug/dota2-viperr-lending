import { Link2Off, Pencil, RefreshCw, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { siDiscord, siSteam } from 'simple-icons'
import { Badge } from '~/components/admin/badge'
import { Button } from '~/components/admin/button'
import { Card } from '~/components/admin/card'
import { ConfirmButton } from '~/components/admin/confirm-button'
import { CopyButton } from '~/components/admin/copy-button'
import { Dialog } from '~/components/admin/dialog'
import { Input } from '~/components/admin/form-controls'
import { useAdminFetcher } from '~/components/admin/use-admin-fetcher'
import { Avatar } from '~/components/ui/avatar'
import { BrandIcon } from '~/components/ui/brand-icon'
import { cn } from '~/lib/cn'
import { SlotMarker } from '../slot-marker'
import {
  NAME_MAX_LENGTH,
  type Position,
  positionLabel,
  ROSTER_SLOTS,
} from '../team'
import type { AdminPlayer } from '../teams.server'
import { PlayerForm } from './player-form'

export function RosterCard({
  players,
  inviteBase,
}: {
  players: AdminPlayer[]
  inviteBase: string
}) {
  const [editing, setEditing] = useState<AdminPlayer | null>(null)

  return (
    <>
      <Card title="Состав">
        <ul className="divide-y divide-line">
          {ROSTER_SLOTS.map(slot => {
            const player = players.find(p => p.position === slot)
            return (
              <li
                key={slot ?? 'coach'}
                className="flex flex-wrap items-center gap-4 px-5 py-4"
              >
                <div className="w-28 shrink-0">
                  <SlotMarker position={slot} className="text-2xl" />
                  <p className="mt-1 text-muted text-xs">
                    {positionLabel(slot)}
                  </p>
                </div>
                {player ? (
                  <PlayerSlot
                    player={player}
                    inviteUrl={
                      player.inviteCode ? inviteBase + player.inviteCode : null
                    }
                    onEdit={() => setEditing(player)}
                  />
                ) : (
                  <AddPlayerForm slot={slot} />
                )}
              </li>
            )
          })}
        </ul>
      </Card>

      <Dialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        title="Игрок"
      >
        {editing && (
          <PlayerForm
            player={editing}
            roster={players}
            onDone={() => setEditing(null)}
          />
        )}
      </Dialog>
    </>
  )
}

function PlayerSlot({
  player,
  inviteUrl,
  onEdit,
}: {
  player: AdminPlayer
  inviteUrl: string | null
  onEdit: () => void
}) {
  const captain = useAdminFetcher({ success: false })
  const invite = useAdminFetcher({ success: 'Ссылка обновлена' })
  const unlink = useAdminFetcher({ success: 'Аккаунт отвязан' })
  const remove = useAdminFetcher({ success: 'Игрок удалён' })
  const submit = (fetcher: typeof captain, intent: string) =>
    fetcher.submit({ intent, playerId: player.id }, { method: 'post' })

  const { user } = player
  const isCaptain =
    captain.state !== 'idle' ? !player.isCaptain : player.isCaptain

  return (
    <>
      <div className="flex min-w-40 flex-1 items-center gap-3">
        <Avatar
          src={user?.avatarUrl ?? undefined}
          name={player.nickname}
          size="sm"
          shape="circle"
        />
        <div className="min-w-0">
          <p className="truncate font-semibold">{player.nickname}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {user ? (
              <Badge tone="green">
                <BrandIcon icon={siDiscord} />@{user.username}
              </Badge>
            ) : (
              <Badge tone="yellow">Инвайт не принят</Badge>
            )}
            {user &&
              (user.steamId ? (
                <Badge tone="green">
                  <BrandIcon icon={siSteam} />
                  {user.steamName ?? user.steamId}
                </Badge>
              ) : (
                <Badge>
                  <BrandIcon icon={siSteam} />
                  Не привязан
                </Badge>
              ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {!user && inviteUrl && (
          <>
            <CopyButton value={inviteUrl} label="Ссылка" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Новая ссылка"
              disabled={invite.state !== 'idle'}
              onClick={() => submit(invite, 'newInvite')}
            >
              <RefreshCw
                className={invite.state !== 'idle' ? 'animate-spin' : undefined}
              />
            </Button>
          </>
        )}
        {player.position !== null && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isCaptain ? 'Снять капитана' : 'Сделать капитаном'}
            aria-pressed={isCaptain}
            onClick={() => submit(captain, 'toggleCaptain')}
          >
            <Star className={cn(isCaptain && 'fill-accent text-accent')} />
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
        {user && (
          <ConfirmButton
            variant="ghost"
            size="icon"
            aria-label="Отвязать аккаунт"
            title="Отвязать аккаунт"
            confirmLabel="Отвязать"
            message={
              <>
                <b>@{user.username}</b> потеряет место в составе, для слота
                будет выпущена новая ссылка.
              </>
            }
            busy={unlink.state !== 'idle'}
            onConfirm={() => submit(unlink, 'unlinkPlayer')}
          >
            <Link2Off />
          </ConfirmButton>
        )}
        <ConfirmButton
          size="icon"
          aria-label="Удалить игрока"
          title="Удалить игрока"
          message={
            <>
              Убрать <b>{player.nickname}</b> из состава?
            </>
          }
          busy={remove.state !== 'idle'}
          onConfirm={() => submit(remove, 'deletePlayer')}
        >
          <Trash2 />
        </ConfirmButton>
      </div>
    </>
  )
}

function AddPlayerForm({ slot }: { slot: Position | null }) {
  const fetcher = useAdminFetcher({ success: 'Игрок добавлен' })

  return (
    <fetcher.Form method="post" className="flex min-w-48 flex-1 gap-2">
      <input type="hidden" name="intent" value="addPlayer" />
      <input type="hidden" name="position" value={slot ?? ''} />
      <Input
        name="nickname"
        placeholder="Ник"
        aria-label={`Ник: ${positionLabel(slot)}`}
        maxLength={NAME_MAX_LENGTH}
        required
        className="max-w-xs border-dashed bg-transparent"
      />
      <Button size="md" variant="secondary" disabled={fetcher.state !== 'idle'}>
        Добавить
      </Button>
    </fetcher.Form>
  )
}
