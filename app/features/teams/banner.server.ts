import { type ActionResult, fail, ok } from '~/lib/action-result'
import { db } from '~/lib/db.server'
import { BANNER_MAX_BYTES, imageType } from './banner'

export async function saveBanner(
  teamId: string,
  file: FormDataEntryValue | null
): Promise<ActionResult> {
  if (!(file instanceof File) || file.size === 0) {
    return fail('Выберите картинку')
  }
  if (file.size > BANNER_MAX_BYTES) return fail('Картинка больше 4 МБ')

  const data = new Uint8Array(await file.arrayBuffer())
  const contentType = imageType(data)
  if (!contentType) return fail('Подойдёт JPG, PNG, WebP или GIF')

  await db().teamBanner.upsert({
    where: { teamId },
    create: { teamId, data, contentType },
    update: { data, contentType },
  })
  return ok()
}

export async function removeBanner(teamId: string): Promise<ActionResult> {
  await db().teamBanner.deleteMany({ where: { teamId } })
  return ok()
}

export const getBanner = (teamId: string) =>
  db().teamBanner.findUnique({ where: { teamId } })
