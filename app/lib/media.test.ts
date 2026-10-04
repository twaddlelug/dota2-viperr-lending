import { describe, expect, it } from 'vitest'
import { imageSrc, isDiscordPicture } from './media'

describe('isDiscordPicture', () => {
  it('accepts avatars and server icons', () => {
    expect(isDiscordPicture('avatars/80351110224678912/a1b2c3.png')).toBe(true)
    expect(isDiscordPicture('avatars/80351110224678912/a_a1b2c3.gif')).toBe(
      true
    )
    expect(isDiscordPicture('icons/81384788765712384/f00ba4.webp')).toBe(true)
    expect(isDiscordPicture('embed/avatars/3.png')).toBe(true)
  })

  it('rejects uploads, other formats and path tricks', () => {
    expect(isDiscordPicture('attachments/1/2/logo.png')).toBe(false)
    expect(isDiscordPicture('avatars/1/a1b2c3.svg')).toBe(false)
    expect(isDiscordPicture('avatars/1/../../attachments/1/2/x.png')).toBe(
      false
    )
    expect(isDiscordPicture('avatars/1/a1b2c3.png/x')).toBe(false)
    expect(isDiscordPicture('')).toBe(false)
  })
})

describe('imageSrc', () => {
  const avatar = 'https://cdn.discordapp.com/avatars/1/a1b2c3.png?size=256'

  it('routes Discord pictures through the site', () => {
    expect(imageSrc(avatar, true)).toBe('/media/avatars/1/a1b2c3.png?size=256')
    expect(
      imageSrc('https://cdn.discordapp.com/embed/avatars/0.png', true)
    ).toBe('/media/embed/avatars/0.png')
  })

  it('leaves everything else as is', () => {
    const steam = 'https://avatars.steamstatic.com/abc_full.jpg'
    const upload = 'https://cdn.discordapp.com/attachments/1/2/logo.png'
    expect(imageSrc(steam, true)).toBe(steam)
    expect(imageSrc(upload, true)).toBe(upload)
    expect(imageSrc(avatar, false)).toBe(avatar)
  })
})
