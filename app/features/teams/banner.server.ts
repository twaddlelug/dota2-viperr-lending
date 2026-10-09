import { getCurrentUser, isAdmin } from '~/features/auth/session.server'
import { type ActionResult, fail, ok } from '~/lib/action-result'
import { db } from '~/lib/db.server'
import {
  BANNER_MAX_BYTES,
  BANNER_PART_BYTES,
  byteRange,
  imageType,
  mediaType,
} from './banner'

type StoredFile = { bytes: Uint8Array<ArrayBuffer>; contentType: string }

type Upload = {
  teamId: string
  poster?: Uint8Array
  file?: { parts: Uint8Array[]; count: number; bytes: number }
  expires: number
}

const UPLOAD_LIFETIME = 10 * 60 * 1000
const STAGING_LIMIT = 4 * BANNER_MAX_BYTES
const CACHE_LIMIT = 4 * BANNER_MAX_BYTES
const MAX_PARTS = Math.ceil(BANNER_MAX_BYTES / BANNER_PART_BYTES)
const BROKEN_UPLOAD = 'Загрузка прервалась, попробуйте ещё раз'

const memory = globalThis as {
  bannerUploads?: Map<string, Upload>
  bannerCache?: Map<string, StoredFile>
}
const uploads = () => (memory.bannerUploads ??= new Map())
const cache = () => (memory.bannerCache ??= new Map())

export async function canEditBanner(request: Request, teamId: string) {
  const [user, team] = await Promise.all([
    getCurrentUser(request),
    db().team.findUnique({
      where: { id: teamId },
      select: { server: { select: { managerDiscordId: true } } },
    }),
  ])
  if (!user || !team) return false
  return isAdmin(user) || team.server.managerDiscordId === user.discordId
}

export async function receiveBannerPart(
  teamId: string,
  input: {
    upload: string
    kind: string
    part: number
    parts: number
    bytes: Uint8Array
  }
): Promise<ActionResult<{ done: boolean }>> {
  dropExpiredUploads()
  const { upload, kind, part, parts, bytes } = input
  const wellFormed =
    /^[\w-]{8,64}$/.test(upload) &&
    Number.isInteger(part) &&
    Number.isInteger(parts) &&
    parts >= 1 &&
    parts <= MAX_PARTS &&
    part >= 0 &&
    part < parts &&
    bytes.byteLength > 0 &&
    bytes.byteLength <= BANNER_PART_BYTES
  if (!wellFormed) return fail(BROKEN_UPLOAD)
  if (stagedBytes() + bytes.byteLength > STAGING_LIMIT) {
    return fail('Сервер занят другими загрузками, попробуйте через минуту')
  }

  const entry = uploads().get(upload) ?? {
    teamId,
    expires: Date.now() + UPLOAD_LIFETIME,
  }
  uploads().set(upload, entry)
  if (entry.teamId !== teamId) return fail(BROKEN_UPLOAD)

  if (kind === 'poster' && parts === 1) {
    entry.poster = bytes
    return ok({ done: false })
  }

  entry.file ??= { parts: [], count: parts, bytes: 0 }
  const { file } = entry
  if (kind !== 'file' || part !== file.parts.length || parts !== file.count) {
    uploads().delete(upload)
    return fail(BROKEN_UPLOAD)
  }
  file.parts.push(bytes)
  file.bytes += bytes.byteLength
  if (file.parts.length < file.count) return ok({ done: false })

  uploads().delete(upload)
  const saved = await saveBanner(teamId, joinParts(file), entry.poster)
  return saved.ok ? ok({ done: true }) : saved
}

async function saveBanner(
  teamId: string,
  data: Uint8Array<ArrayBuffer>,
  poster: Uint8Array | undefined
): Promise<ActionResult> {
  if (data.byteLength > BANNER_MAX_BYTES) return fail('Файл больше 16 МБ')
  const contentType = mediaType(data)
  if (!contentType) {
    return fail('Подойдёт картинка JPG, PNG, WebP, GIF или видео MP4, WebM')
  }

  const isVideo = contentType.startsWith('video/')
  const posterType = isVideo && poster ? imageType(poster) : null
  if (isVideo && !posterType) {
    return fail('Не получилось сохранить кадр для превью, попробуйте ещё раз')
  }

  const values = {
    data,
    contentType,
    poster: isVideo && poster ? new Uint8Array(poster) : null,
    posterType,
  }
  await db().teamBanner.upsert({
    where: { teamId },
    create: { teamId, ...values },
    update: values,
  })
  return ok()
}

export async function removeBanner(teamId: string): Promise<ActionResult> {
  await db().teamBanner.deleteMany({ where: { teamId } })
  return ok()
}

export async function getBannerFile(
  teamId: string,
  part: 'file' | 'poster'
): Promise<StoredFile | null> {
  const version = await db().teamBanner.findUnique({
    where: { teamId },
    select: { updatedAt: true },
  })
  if (!version) return null
  const key = `${teamId}:${part}:${version.updatedAt.getTime()}`
  const cached = cache().get(key)
  if (cached) return cached

  const stored =
    part === 'poster' ? await loadPoster(teamId) : await loadFile(teamId)
  if (!stored) return null
  const file = { bytes: stored.bytes, contentType: stored.contentType }
  remember(`${teamId}:${part}:${stored.updatedAt.getTime()}`, file)
  return file
}

async function loadFile(teamId: string) {
  const row = await db().teamBanner.findUnique({
    where: { teamId },
    select: { data: true, contentType: true, updatedAt: true },
  })
  return (
    row && {
      bytes: row.data,
      contentType: row.contentType,
      updatedAt: row.updatedAt,
    }
  )
}

async function loadPoster(teamId: string) {
  const row = await db().teamBanner.findUnique({
    where: { teamId },
    select: { poster: true, posterType: true, updatedAt: true },
  })
  return row?.poster && row.posterType
    ? {
        bytes: row.poster,
        contentType: row.posterType,
        updatedAt: row.updatedAt,
      }
    : null
}

export function bannerResponse(request: Request, file: StoredFile | null) {
  if (!file) return new Response(null, { status: 404 })

  const size = file.bytes.byteLength
  const versioned = new URL(request.url).searchParams.has('v')
  const headers = new Headers({
    'Content-Type': file.contentType,
    'X-Content-Type-Options': 'nosniff',
    'Accept-Ranges': 'bytes',
    'Cache-Control': versioned
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=60',
  })

  const range = byteRange(request.headers.get('range'), size)
  if (range === 'unsatisfiable') {
    headers.set('Content-Range', `bytes */${size}`)
    return new Response(null, { status: 416, headers })
  }

  const body = range
    ? file.bytes.subarray(range.start, range.end + 1)
    : file.bytes
  headers.set('Content-Length', String(body.byteLength))
  if (range) {
    headers.set('Content-Range', `bytes ${range.start}-${range.end}/${size}`)
  }
  return new Response(body, { status: range ? 206 : 200, headers })
}

function joinParts(file: { parts: Uint8Array[]; bytes: number }) {
  const data = new Uint8Array(file.bytes)
  let offset = 0
  for (const part of file.parts) {
    data.set(part, offset)
    offset += part.byteLength
  }
  return data
}

function stagedBytes() {
  let total = 0
  for (const entry of uploads().values()) {
    total += (entry.poster?.byteLength ?? 0) + (entry.file?.bytes ?? 0)
  }
  return total
}

function dropExpiredUploads() {
  const now = Date.now()
  for (const [id, entry] of uploads()) {
    if (entry.expires < now) uploads().delete(id)
  }
}

function remember(key: string, file: StoredFile) {
  const files = cache()
  files.set(key, file)
  let total = 0
  for (const stored of files.values()) total += stored.bytes.byteLength
  for (const [oldKey, stored] of files) {
    if (total <= CACHE_LIMIT) break
    files.delete(oldKey)
    total -= stored.bytes.byteLength
  }
}
