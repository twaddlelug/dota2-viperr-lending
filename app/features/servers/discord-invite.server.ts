import { externalTimeout } from '~/lib/http.server'

const API = 'https://discord.com/api/v10'
const INVITE_CODE = /(?:discord\.gg|discord(?:app)?\.com\/invite)\/([\w-]+)/

export async function fetchGuildFromInvite(inviteUrl: string) {
  const code = inviteUrl.match(INVITE_CODE)?.[1]
  if (!code) return null
  try {
    const response = await fetch(`${API}/invites/${code}`, {
      signal: externalTimeout(),
    })
    if (!response.ok) return null
    const invite = (await response.json()) as {
      guild?: { id: string; name: string; icon: string | null }
    }
    if (!invite.guild) return null
    const { id, name, icon } = invite.guild
    return {
      name,
      iconUrl: icon
        ? `https://cdn.discordapp.com/icons/${id}/${icon}.png?size=256`
        : null,
    }
  } catch {
    return null
  }
}
