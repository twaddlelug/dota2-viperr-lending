import { describe, expect, it } from 'vitest'
import { bannerUrl, imageType } from './banner'

const bytes = (...values: number[]) => new Uint8Array(values)
const ascii = (text: string) => [...text].map(char => char.charCodeAt(0))

describe('imageType', () => {
  it('recognises JPEG, PNG, GIF and WebP by their signatures', () => {
    expect(imageType(bytes(0xff, 0xd8, 0xff, 0xe0, 0, 0x10))).toBe('image/jpeg')
    expect(
      imageType(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0))
    ).toBe('image/png')
    expect(imageType(bytes(...ascii('GIF89a'), 1, 0))).toBe('image/gif')
    expect(
      imageType(bytes(...ascii('RIFF'), 0x24, 0, 0, 0, ...ascii('WEBPVP8 ')))
    ).toBe('image/webp')
  })

  it('rejects everything else, whatever the file is called', () => {
    expect(imageType(bytes())).toBeNull()
    expect(
      imageType(bytes(...ascii('<svg xmlns="http://www.w3.org/2000/svg">')))
    ).toBeNull()
    expect(
      imageType(bytes(...ascii('RIFF'), 0x24, 0, 0, 0, ...ascii('WAVEfmt ')))
    ).toBeNull()
    expect(imageType(bytes(0x25, 0x50, 0x44, 0x46))).toBeNull()
  })
})

describe('bannerUrl', () => {
  it('versions the address so browsers can cache it forever', () => {
    expect(bannerUrl('team1', new Date('2026-10-08T12:00:00Z'))).toBe(
      '/media/banners/team1?v=1791460800000'
    )
  })
})
