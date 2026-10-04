import { db, isUniqueViolation } from '~/lib/db.server'
import { env } from '~/lib/env.server'
import { externalTimeout } from '~/lib/http.server'

const OPENID_ENDPOINT = 'https://steamcommunity.com/openid/login'
const OPENID_NS = 'http://specs.openid.net/auth/2.0'
const CLAIMED_ID = /^https:\/\/steamcommunity\.com\/openid\/id\/(\d{17})$/

export function steamLoginUrl(returnTo: string) {
  const url = new URL(OPENID_ENDPOINT)
  url.search = new URLSearchParams({
    'openid.ns': OPENID_NS,
    'openid.mode': 'checkid_setup',
    'openid.return_to': returnTo,
    'openid.realm': new URL(returnTo).origin,
    'openid.identity': `${OPENID_NS}/identifier_select`,
    'openid.claimed_id': `${OPENID_NS}/identifier_select`,
  }).toString()
  return url.toString()
}

export async function verifySteamLogin(
  callbackUrl: URL,
  expectedReturnTo: string
) {
  const params = callbackUrl.searchParams
  if (params.get('openid.mode') !== 'id_res') return null

  if (params.get('openid.return_to') !== expectedReturnTo) return null

  const body = new URLSearchParams()
  for (const [key, value] of params) {
    if (key.startsWith('openid.')) body.set(key, value)
  }
  body.set('openid.mode', 'check_authentication')

  try {
    const response = await fetch(OPENID_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: externalTimeout(),
    })
    if (!response.ok || !/is_valid\s*:\s*true/.test(await response.text())) {
      return null
    }
  } catch {
    return null
  }
  return params.get('openid.claimed_id')?.match(CLAIMED_ID)?.[1] ?? null
}

export async function linkSteamAccount(userId: string, steamId: string) {
  try {
    await db().user.update({
      where: { id: userId },
      data: await fetchSteamProfile(steamId),
    })
    return 'linked'
  } catch (error) {
    if (isUniqueViolation(error)) return 'taken'
    throw error
  }
}

async function fetchSteamProfile(steamId: string) {
  const fallback = {
    steamId,
    steamName: steamId,
    steamProfileUrl: `https://steamcommunity.com/profiles/${steamId}`,
    steamAvatarUrl: null as string | null,
  }
  const key = env.steamApiKey
  if (!key) return fallback

  try {
    const url = new URL(
      'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/'
    )
    url.search = new URLSearchParams({ key, steamids: steamId }).toString()
    const response = await fetch(url, { signal: externalTimeout() })
    const json = (await response.json()) as {
      response?: {
        players?: Array<{
          personaname: string
          profileurl: string
          avatarfull: string
        }>
      }
    }
    const player = json.response?.players?.[0]
    if (!player) return fallback
    return {
      steamId,
      steamName: player.personaname,
      steamProfileUrl: player.profileurl,
      steamAvatarUrl: player.avatarfull,
    }
  } catch {
    return fallback
  }
}
