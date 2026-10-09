import { describe, expect, it } from 'vitest'
import { byteRange, imageType, mediaType, toBanner } from './banner'

const bytes = (...values: number[]) => new Uint8Array(values)
const ascii = (text: string) => [...text].map(char => char.charCodeAt(0))
const mp4 = (brand: string) => bytes(0, 0, 0, 0x24, ...ascii(`ftyp${brand}`), 0)

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

describe('mediaType', () => {
  it('adds MP4 and WebM video to the images', () => {
    expect(mediaType(mp4('isom'))).toBe('video/mp4')
    expect(mediaType(mp4('mp42'))).toBe('video/mp4')
    expect(mediaType(bytes(0x1a, 0x45, 0xdf, 0xa3, 0x9f))).toBe('video/webm')
    expect(mediaType(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe('image/jpeg')
  })

  it('turns away HEIC and AVIF stills that share the MP4 container', () => {
    expect(mediaType(mp4('heic'))).toBeNull()
    expect(mediaType(mp4('mif1'))).toBeNull()
    expect(mediaType(mp4('avif'))).toBeNull()
  })
})

describe('byteRange', () => {
  it('reads open, closed and suffix ranges', () => {
    expect(byteRange('bytes=0-', 1000)).toEqual({ start: 0, end: 999 })
    expect(byteRange('bytes=0-1', 1000)).toEqual({ start: 0, end: 1 })
    expect(byteRange('bytes=500-2000', 1000)).toEqual({ start: 500, end: 999 })
    expect(byteRange('bytes=-100', 1000)).toEqual({ start: 900, end: 999 })
  })

  it('serves the whole file when there is no usable range', () => {
    expect(byteRange(null, 1000)).toBeNull()
    expect(byteRange('bytes=0-1,5-6', 1000)).toBeNull()
    expect(byteRange('items=0-1', 1000)).toBeNull()
  })

  it('flags ranges outside the file', () => {
    expect(byteRange('bytes=1000-', 1000)).toBe('unsatisfiable')
    expect(byteRange('bytes=5-2', 1000)).toBe('unsatisfiable')
    expect(byteRange('bytes=-0', 1000)).toBe('unsatisfiable')
  })
})

describe('toBanner', () => {
  const updatedAt = new Date('2026-10-08T12:00:00Z')

  it('versions the addresses so browsers can cache them forever', () => {
    expect(
      toBanner('team1', {
        updatedAt,
        contentType: 'image/jpeg',
        posterType: null,
      })
    ).toEqual({
      kind: 'image',
      url: '/media/banners/team1?v=1791460800000',
      posterUrl: undefined,
    })
  })

  it('points videos to their poster frame', () => {
    expect(
      toBanner('team1', {
        updatedAt,
        contentType: 'video/mp4',
        posterType: 'image/jpeg',
      })
    ).toEqual({
      kind: 'video',
      url: '/media/banners/team1?v=1791460800000',
      posterUrl: '/media/banners/team1/poster?v=1791460800000',
    })
  })
})
