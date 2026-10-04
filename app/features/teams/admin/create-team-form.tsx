import { Button } from '~/components/admin/button'
import { DialogActions } from '~/components/admin/dialog'
import { Field, Input, Select } from '~/components/admin/form-controls'
import { useAdminFetcher } from '~/components/admin/use-admin-fetcher'

export function CreateTeamForm({
  servers,
  onCancel,
}: {
  servers: Array<{ id: string; name: string }>
  onCancel: () => void
}) {
  const fetcher = useAdminFetcher()

  return (
    <fetcher.Form method="post" className="space-y-4">
      <Field label="Сервер">
        <Select name="serverId" required>
          {servers.map(server => (
            <option key={server.id} value={server.id}>
              {server.name}
            </option>
          ))}
        </Select>
      </Field>
      <div className="grid grid-cols-[1fr_7rem] gap-4">
        <Field label="Название">
          <Input name="name" required autoFocus />
        </Field>
        <Field label="Тег">
          <Input name="tag" maxLength={5} required className="uppercase" />
        </Field>
      </div>
      <DialogActions>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Отмена
        </Button>
        <Button disabled={fetcher.state !== 'idle'}>Создать</Button>
      </DialogActions>
    </fetcher.Form>
  )
}
