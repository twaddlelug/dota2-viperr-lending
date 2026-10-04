import { externalTimeout } from '~/lib/http.server'
import { DISCORD_CDN, isDiscordPicture } from '~/lib/media'
import type { Route } from './+types/media'

const IMAGE_TYPE = /^image\/(?:png|jpeg|webp|gif)$/

export async function loader({ request, params }: Route.LoaderArgs) {
  const path = params['*']
  if (!isDiscordPicture(path)) return new Response(null, { status: 404 })

  const url = new URL(path, DISCORD_CDN)
  url.search = new URL(request.url).search

  const upstream = await fetch(url, { signal: externalTimeout() }).catch(
    () => null
  )
  const type = upstream?.headers.get('content-type') ?? ''
  if (!upstream?.ok || !IMAGE_TYPE.test(type)) {
    return new Response(null, { status: 502 })
  }

  return new Response(upstream.body, {
    headers: {
      'Content-Type': type,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  })
}
