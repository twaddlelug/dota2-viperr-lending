export const BANNER_MAX_BYTES = 16 * 1024 * 1024

export const BANNER_PART_BYTES = 512 * 1024

export const BANNER_ACCEPT =
  'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm'

export type Banner = {
  kind: 'image' | 'video'
  url: string
  posterUrl?: string
}

export function toBanner(
  teamId: string,
  stored: { updatedAt: Date; contentType: string; posterType: string | null }
): Banner {
  const version = `v=${stored.updatedAt.getTime()}`
  return {
    kind: stored.contentType.startsWith('video/') ? 'video' : 'image',
    url: `/media/banners/${teamId}?${version}`,
    posterUrl: stored.posterType
      ? `/media/banners/${teamId}/poster?${version}`
      : undefined,
  }
}

const IMAGE_SIGNATURES = [
  { type: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  {
    type: 'image/png',
    bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  },
  { type: 'image/gif', bytes: [0x47, 0x49, 0x46, 0x38] },
]

const STILL_IMAGE_BRANDS = ['heic', 'heix', 'mif1', 'msf1', 'avif', 'avis']

const ascii = (bytes: Uint8Array, start: number, end: number) =>
  String.fromCharCode(...bytes.subarray(start, end))

const startsWith = (bytes: Uint8Array, signature: number[], offset = 0) =>
  signature.every((byte, i) => bytes[offset + i] === byte)

export function imageType(bytes: Uint8Array) {
  if (ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 12) === 'WEBP') {
    return 'image/webp'
  }
  return (
    IMAGE_SIGNATURES.find(({ bytes: signature }) =>
      startsWith(bytes, signature)
    )?.type ?? null
  )
}

function videoType(bytes: Uint8Array) {
  if (startsWith(bytes, [0x1a, 0x45, 0xdf, 0xa3])) return 'video/webm'
  if (ascii(bytes, 4, 8) !== 'ftyp') return null
  return STILL_IMAGE_BRANDS.includes(ascii(bytes, 8, 12)) ? null : 'video/mp4'
}

export const mediaType = (bytes: Uint8Array) =>
  imageType(bytes) ?? videoType(bytes)

export function byteRange(header: string | null, size: number) {
  const match = header?.trim().match(/^bytes=(\d*)-(\d*)$/)
  if (!match || (!match[1] && !match[2])) return null

  const [, first, last] = match
  const start = first ? Number(first) : Math.max(0, size - Number(last))
  const end = first && last ? Math.min(Number(last), size - 1) : size - 1
  if (size === 0 || start > end || (!first && Number(last) === 0)) {
    return 'unsatisfiable' as const
  }
  return { start, end }
}
