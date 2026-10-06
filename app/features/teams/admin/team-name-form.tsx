import { Button } from '~/components/admin/button'
import { DialogActions } from '~/components/admin/dialog'
import { useAdminFetcher } from '~/components/admin/use-admin-fetcher'
import { TeamNameFields } from './team-name-fields'

export function TeamNameForm({
  team,
  onDone,
}: {
  team?: { name: string; tag: string }
  onDone: () => void
}) {
  const fetcher = useAdminFetcher({
    success: team ? 'Команда сохранена' : 'Команда создана',
    onSuccess: onDone,
  })

  return (
    <fetcher.Form method="post" className="space-y-4">
      <input
        type="hidden"
        name="intent"
        value={team ? 'renameTeam' : 'createTeam'}
      />
      <TeamNameFields team={team} />
      <DialogActions>
        <Button type="button" variant="secondary" onClick={onDone}>
          Отмена
        </Button>
        <Button disabled={fetcher.state !== 'idle'}>
          {team ? 'Сохранить' : 'Создать'}
        </Button>
      </DialogActions>
    </fetcher.Form>
  )
}
