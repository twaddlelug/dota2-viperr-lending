import { isActionResult } from '~/lib/action-result'
import { BANNER_MAX_BYTES, BANNER_PART_BYTES } from '../banner'

const IMAGE_SIDE = 1920
const POSTER_SIDE = 1280
const SOURCE_IMAGE_LIMIT = 40 * 1024 * 1024
const VIDEO_TIMEOUT = 15_000

type PreparedBanner = { file: Blob; poster?: Blob }

export async function prepareBanner(file: File): Promise<PreparedBanner> {
  if (file.type.startsWith('video/')) {
    if (file.size > BANNER_MAX_BYTES) {
      throw new Error(
        'Видео больше 16 МБ — укоротите ролик или снизьте качество'
      )
    }
    return { file, poster: await posterFrame(file) }
  }
  if (!file.type.startsWith('image/')) {
    throw new Error('Подойдёт картинка JPG, PNG, WebP, GIF или видео MP4, WebM')
  }
  if (file.type === 'image/gif') {
    if (file.size > BANNER_MAX_BYTES) throw new Error('GIF больше 16 МБ')
    return { file }
  }
  if (file.size > SOURCE_IMAGE_LIMIT)
    throw new Error('Картинка слишком большая')
  return { file: await shrinkImage(file) }
}

export async function uploadBanner(
  teamId: string,
  { file, poster }: PreparedBanner,
  onProgress: (share: number) => void
) {
  const upload =
    crypto.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`

  const send = async (
    kind: 'file' | 'poster',
    body: Blob,
    part: number,
    parts: number
  ) => {
    const query = new URLSearchParams({
      upload,
      kind,
      part: String(part),
      parts: String(parts),
    })
    const response = await fetch(`/media/banners/${teamId}?${query}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body,
    })
    const result: unknown = await response.json().catch(() => null)
    if (!isActionResult(result)) {
      throw new Error(`Сервер не принял файл (ошибка ${response.status})`)
    }
    if (!result.ok) throw new Error(result.error)
  }

  if (poster) await send('poster', poster, 0, 1)
  const parts = Math.max(1, Math.ceil(file.size / BANNER_PART_BYTES))
  for (let part = 0; part < parts; part++) {
    const start = part * BANNER_PART_BYTES
    await send(
      'file',
      file.slice(start, start + BANNER_PART_BYTES),
      part,
      parts
    )
    onProgress((part + 1) / parts)
  }
}

async function shrinkImage(file: File) {
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error(
      'Не получилось открыть картинку — сохраните её как JPG или PNG'
    )
  })
  const scale = Math.min(1, IMAGE_SIDE / Math.max(bitmap.width, bitmap.height))
  const jpeg = await toJpeg(
    bitmap,
    bitmap.width * scale,
    bitmap.height * scale,
    0.85
  )
  bitmap.close()
  return scale === 1 && file.size <= jpeg.size ? file : jpeg
}

async function posterFrame(file: File) {
  const url = URL.createObjectURL(file)
  const video = document.createElement('video')
  video.muted = true
  video.playsInline = true
  video.preload = 'auto'
  video.src = url
  try {
    await videoEvent(video, 'loadeddata')
    video.currentTime = Number.isFinite(video.duration)
      ? Math.min(0.2, video.duration / 2)
      : 0.2
    await videoEvent(video, 'seeked')
    const scale = Math.min(
      1,
      POSTER_SIDE / Math.max(video.videoWidth, video.videoHeight)
    )
    const width = video.videoWidth * scale
    const height = video.videoHeight * scale
    const poster = await toJpeg(video, width, height, 0.82)
    return poster.size <= BANNER_PART_BYTES
      ? poster
      : await toJpeg(video, width, height, 0.6)
  } catch {
    throw new Error(
      'Браузер не смог прочитать видео — нужен MP4 (H.264) или WebM'
    )
  } finally {
    URL.revokeObjectURL(url)
  }
}

function videoEvent(video: HTMLVideoElement, event: 'loadeddata' | 'seeked') {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(event)), VIDEO_TIMEOUT)
    video.addEventListener(
      event,
      () => {
        clearTimeout(timer)
        resolve()
      },
      { once: true }
    )
    video.addEventListener(
      'error',
      () => {
        clearTimeout(timer)
        reject(new Error(event))
      },
      { once: true }
    )
  })
}

function toJpeg(
  source: CanvasImageSource,
  width: number,
  height: number,
  quality: number
) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width))
  canvas.height = Math.max(1, Math.round(height))
  canvas.getContext('2d')?.drawImage(source, 0, 0, canvas.width, canvas.height)
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      blob =>
        blob
          ? resolve(blob)
          : reject(new Error('Не получилось обработать картинку')),
      'image/jpeg',
      quality
    )
  )
}
