import { Button } from '~/components/admin/button'
import { Card } from '~/components/admin/card'
import { Field, Input, Textarea } from '~/components/admin/form-controls'
import { PageTitle } from '~/components/admin/page-title'
import { useAdminFetcher } from '~/components/admin/use-admin-fetcher'
import { getSettings, saveSettings } from '~/features/settings/settings.server'
import { text } from '~/lib/form-data'
import type { Route } from './+types/settings'

export async function loader() {
  return { settings: await getSettings() }
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData()
  return saveSettings({
    heroText: text(form, 'heroText'),
    aboutTitle: text(form, 'aboutTitle'),
    aboutText: text(form, 'aboutText'),
    discordEventUrl: text(form, 'discordEventUrl'),
  })
}

export default function AdminSettings({ loaderData }: Route.ComponentProps) {
  const { settings } = loaderData
  const fetcher = useAdminFetcher()

  return (
    <>
      <PageTitle title="Настройки" />

      <Card className="max-w-3xl">
        <fetcher.Form method="post" className="space-y-5 p-5">
          <Field label="Текст на главной">
            <Textarea
              name="heroText"
              defaultValue={settings.heroText}
              rows={4}
              required
            />
          </Field>
          <Field label="Заголовок «О турнире»">
            <Input
              name="aboutTitle"
              defaultValue={settings.aboutTitle}
              required
            />
          </Field>
          <Field label="Текст «О турнире»">
            <Textarea
              name="aboutText"
              defaultValue={settings.aboutText}
              rows={8}
              required
            />
          </Field>
          <Field label="Ссылка на Discord">
            <Input
              name="discordEventUrl"
              type="url"
              defaultValue={settings.discordEventUrl}
              required
            />
          </Field>
          <div className="flex justify-end">
            <Button disabled={fetcher.state !== 'idle'}>Сохранить</Button>
          </div>
        </fetcher.Form>
      </Card>
    </>
  )
}
