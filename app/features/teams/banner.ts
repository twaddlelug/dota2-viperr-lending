export const BANNER_MAX_BYTES = 4 * 1024 * 1024

export const BANNER_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'

export const bannerUrl = (teamId: string, updatedAt: Date) =>
  `/media/banners/${teamId}?v=${updatedAt.getTime()}`

const SIGNATURES = [
  { type: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  {
    type: 'image/png',
    bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  },
  { type: 'image/gif', bytes: [0x47, 0x49, 0x46, 0x38] },
]

export function imageType(bytes: Uint8Array) {
  const startsWith = (signature: number[], offset = 0) =>
    signature.every((byte, i) => bytes[offset + i] === byte)

  if (
    startsWith([0x52, 0x49, 0x46, 0x46]) &&
    startsWith([0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return 'image/webp'
  }
  return SIGNATURES.find(({ bytes }) => startsWith(bytes))?.type ?? null
}
