import { db } from '~/lib/db.server'
import { env } from '~/lib/env.server'
import { externalTimeout } from '~/lib/http.server'

const API = 'https://discord.com/api/v10'

type DiscordUser = {
  id: string
  username: string
  global_name: string | null
  avatar: string | null
}

export function discordAuthorizeUrl(state: string, redirectUri: string) {
  const url = new URL('https://discord.com/oauth2/authorize')
  url.search = new URLSearchParams({
    client_id: env.discordClientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'identify',
    state,
    prompt: 'none',
  }).toString()
  return url.toString()
}

export async function fetchDiscordProfile(code: string, redirectUri: string) {
  const tokenResponse = await fetch(`${API}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: env.discordClientId,
      client_secret: env.discordClientSecret,
    }),
    signal: externalTimeout(),
  })
  if (!tokenResponse.ok) {
    throw new Error(`Discord token exchange failed: ${tokenResponse.status}`)
  }
  const { access_token } = (await tokenResponse.json()) as {
    access_token: string
  }

  const userResponse = await fetch(`${API}/users/@me`, {
    headers: { Authorization: `Bearer ${access_token}` },
    signal: externalTimeout(),
  })
  if (!userResponse.ok) {
    throw new Error(`Discord profile request failed: ${userResponse.status}`)
  }
  const user = (await userResponse.json()) as DiscordUser

  return {
    discordId: user.id,
    username: user.username,
    globalName: user.global_name,
    avatarUrl: avatarUrl(user),
  }
}

export function saveDiscordUser(
  profile: Awaited<ReturnType<typeof fetchDiscordProfile>>
) {
  return db().user.upsert({
    where: { discordId: profile.discordId },
    create: profile,
    update: profile,
  })
}

export function upsertDevUser(discordId: string) {
  return db().user.upsert({
    where: { discordId },
    create: { discordId, username: 'dev', globalName: 'Dev' },
    update: {},
  })
}

function avatarUrl(user: DiscordUser) {
  if (!user.avatar) {
    const index = Number((BigInt(user.id) >> 22n) % 6n)
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`
  }
  const ext = user.avatar.startsWith('a_') ? 'gif' : 'png'
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=256`
}
