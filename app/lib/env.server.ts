import { loadEnv } from '../../load-env'

loadEnv()

const optional = (name: string) => process.env[name]?.trim() || undefined

const required = (name: string) => {
  const value = optional(name)
  if (!value) throw new Error(`Missing environment variable ${name}`)
  return value
}

export const env = {
  get databaseUrl() {
    return required('DATABASE_URL')
  },
  get sessionSecret() {
    return required('SESSION_SECRET')
  },
  get discordClientId() {
    return required('DISCORD_CLIENT_ID')
  },
  get discordClientSecret() {
    return required('DISCORD_CLIENT_SECRET')
  },
  get adminDiscordIds() {
    return (optional('ADMIN_DISCORD_IDS') ?? '')
      .split(',')
      .map(id => id.trim())
      .filter(Boolean)
  },
  get steamApiKey() {
    return optional('STEAM_API_KEY')
  },
  get publicUrl() {
    const vercelHost = optional('VERCEL_PROJECT_PRODUCTION_URL')
    return optional('PUBLIC_URL') ?? (vercelHost && `https://${vercelHost}`)
  },
  get devLoginDiscordId() {
    return optional('DEV_LOGIN_DISCORD_ID')
  },
}

export function siteUrl(request: Request, path: string) {
  return new URL(path, env.publicUrl ?? new URL(request.url).origin).toString()
}
