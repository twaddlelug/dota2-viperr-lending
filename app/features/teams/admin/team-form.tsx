import { Trash2 } from 'lucide-react'
import { Button } from '~/components/admin/button'
import { ConfirmButton } from '~/components/admin/confirm-button'
import { Field, Input, Select } from '~/components/admin/form-controls'
import { useAdminFetcher } from '~/components/admin/use-admin-fetcher'
import type { AdminTeam } from '../teams.server'

export function TeamForm({
  team,
  servers,
  onDone,
}: {
  team: AdminTeam
  servers: Array<{ id: string; name: string }>
  onDone: () => void
}) {
  const fetcher = useAdminFetcher({ onSuccess: onDone })
  const remover = useAdminFetcher({ success: false })

  return (
    <fetcher.Form method="post" className="space-y-4">
      <input type="hidden" name="intent" value="updateTeam" />
      <div className="grid grid-cols-[1fr_7rem] gap-4">
        <Field label="Название">
          <Input name="name" defaultValue={team.name} required autoFocus />
        </Field>
        <Field label="Тег">
          <Input
            name="tag"
            defaultValue={team.tag}
            maxLength={5}
            required
            className="uppercase"
          />
        </Field>
      </div>
      <Field label="Сервер">
        <Select name="serverId" defaultValue={team.serverId}>
          {servers.map(server => (
            <option key={server.id} value={server.id}>
              {server.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Адрес страницы">
        <Input name="slug" defaultValue={team.slug} />
      </Field>
      <Field label="Логотип (URL)">
        <Input name="logoUrl" defaultValue={team.logoUrl ?? ''} />
      </Field>
      <div className="mt-6 flex items-center justify-between gap-3">
        <ConfirmButton
          size="md"
          title="Удалить команду"
          message={
            <>
              Команда <b>{team.name}</b> и весь её состав будут удалены.
            </>
          }
          busy={remover.state !== 'idle'}
          onConfirm={() =>
            remover.submit({ intent: 'deleteTeam' }, { method: 'post' })
          }
        >
          <Trash2 /> Удалить
        </ConfirmButton>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onDone}>
            Отмена
          </Button>
          <Button disabled={fetcher.state !== 'idle'}>Сохранить</Button>
        </div>
      </div>
    </fetcher.Form>
  )
}
