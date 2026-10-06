import { Button } from '~/components/admin/button'
import { DialogActions } from '~/components/admin/dialog'
import { Field, Input } from '~/components/admin/form-controls'
import { useAdminFetcher } from '~/components/admin/use-admin-fetcher'
import type { AdminServer } from '../servers.server'

export function ServerForm({
  server,
  onDone,
}: {
  server?: AdminServer
  onDone: () => void
}) {
  const fetcher = useAdminFetcher({
    success: server ? 'Сервер сохранён' : 'Сервер добавлен',
    onSuccess: onDone,
  })

  return (
    <fetcher.Form method="post" className="space-y-4">
      <input type="hidden" name="intent" value={server ? 'update' : 'create'} />
      <input type="hidden" name="id" value={server?.id ?? ''} />
      <Field label="Инвайт-ссылка">
        <Input
          name="inviteUrl"
          defaultValue={server?.inviteUrl ?? ''}
          placeholder="https://discord.gg/…"
          autoFocus
        />
      </Field>
      <Field label="Название">
        <Input name="name" defaultValue={server?.name ?? ''} />
      </Field>
      <Field label="Иконка (URL)">
        <Input name="iconUrl" defaultValue={server?.iconUrl ?? ''} />
      </Field>
      <Field label="Discord ID менеджера команды">
        <Input
          name="managerDiscordId"
          defaultValue={server?.managerDiscordId ?? ''}
          inputMode="numeric"
          pattern="[0-9]{17,20}"
          title="Число из 17–20 цифр"
          placeholder="Например, 1094839240352071711"
        />
      </Field>
      <DialogActions>
        <Button type="button" variant="secondary" onClick={onDone}>
          Отмена
        </Button>
        <Button disabled={fetcher.state !== 'idle'}>
          {server ? 'Сохранить' : 'Добавить'}
        </Button>
      </DialogActions>
    </fetcher.Form>
  )
}
