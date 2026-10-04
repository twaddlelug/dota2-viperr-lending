import { type ActionResult, fail, ok } from '~/lib/action-result'
import { db } from '~/lib/db.server'
import { SETTINGS_DEFAULTS, type SiteSettings } from './settings'

export async function getSettings(): Promise<SiteSettings> {
  if (!__DB_MODE__) return SETTINGS_DEFAULTS
  const row = await db().settings.findUnique({ where: { id: 1 } })
  return {
    heroText: row?.heroText || SETTINGS_DEFAULTS.heroText,
    aboutTitle: row?.aboutTitle || SETTINGS_DEFAULTS.aboutTitle,
    aboutText: row?.aboutText || SETTINGS_DEFAULTS.aboutText,
    discordEventUrl: row?.discordEventUrl || SETTINGS_DEFAULTS.discordEventUrl,
  }
}

export async function saveSettings(
  settings: SiteSettings
): Promise<ActionResult> {
  if (Object.values(settings).some(value => !value)) {
    return fail('Заполните все поля')
  }
  if (URL.parse(settings.discordEventUrl)?.protocol !== 'https:') {
    return fail('Ссылка на Discord должна начинаться с https://')
  }

  await db().settings.upsert({
    where: { id: 1 },
    create: settings,
    update: settings,
  })
  return ok()
}
