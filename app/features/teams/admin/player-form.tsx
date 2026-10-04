import { Button } from '~/components/admin/button'
import { DialogActions } from '~/components/admin/dialog'
import { Field, Input, Select } from '~/components/admin/form-controls'
import { useAdminFetcher } from '~/components/admin/use-admin-fetcher'
import { positionLabel, ROSTER_SLOTS } from '../team'
import type { AdminPlayer } from '../teams.server'

export function PlayerForm({
  player,
  roster,
  onDone,
}: {
  player: AdminPlayer
  roster: AdminPlayer[]
  onDone: () => void
}) {
  const fetcher = useAdminFetcher({ onSuccess: onDone })

  return (
    <fetcher.Form method="post" className="space-y-4">
      <input type="hidden" name="intent" value="updatePlayer" />
      <input type="hidden" name="playerId" value={player.id} />
      <Field label="Ник">
        <Input
          name="nickname"
          defaultValue={player.nickname}
          required
          autoFocus
        />
      </Field>
      <Field label="Позиция">
        <Select name="position" defaultValue={player.position ?? ''}>
          {ROSTER_SLOTS.map(slot => {
            const occupant = roster.find(
              p => p.position === slot && p.id !== player.id
            )
            return (
              <option key={slot ?? 'sub'} value={slot ?? ''}>
                {slot ? `${slot} · ` : ''}
                {positionLabel(slot)}
                {occupant ? ` — ⇄ ${occupant.nickname}` : ''}
              </option>
            )
          })}
        </Select>
      </Field>
      <DialogActions>
        <Button type="button" variant="secondary" onClick={onDone}>
          Отмена
        </Button>
        <Button disabled={fetcher.state !== 'idle'}>Сохранить</Button>
      </DialogActions>
    </fetcher.Form>
  )
}
