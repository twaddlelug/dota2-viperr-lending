export const DISCORD_CDN = 'https://cdn.discordapp.com/'

const DISCORD_PICTURE =
  /^(?:(?:avatars|icons)\/\d+\/\w+|embed\/avatars\/\d+)\.(?:png|jpe?g|webp|gif)$/

export const isDiscordPicture = (path: string) => DISCORD_PICTURE.test(path)

export function imageSrc(src: string, throughSite = __DB_MODE__) {
  if (!throughSite || !src.startsWith(DISCORD_CDN)) return src
  const { pathname, search } = new URL(src)
  const path = pathname.slice(1)
  return isDiscordPicture(path) ? `/media/${path}${search}` : src
}
