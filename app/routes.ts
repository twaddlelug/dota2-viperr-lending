import {
  index,
  layout,
  prefix,
  type RouteConfig,
  route,
} from '@react-router/dev/routes'
import { isDbBuild } from '../build-mode'

const accountRoutes = [
  route('invite/:code', 'routes/site/invite.tsx'),
  route('me', 'routes/site/profile.tsx'),
]

const serverRoutes = [
  ...prefix('auth', [
    route('discord', 'routes/auth/discord.ts'),
    route('discord/callback', 'routes/auth/discord-callback.ts'),
    route('steam', 'routes/auth/steam.ts'),
    route('steam/callback', 'routes/auth/steam-callback.ts'),
    route('logout', 'routes/auth/logout.ts'),
  ]),
  route('media/*', 'routes/media.ts'),

  route('admin', 'routes/admin/layout.tsx', [
    index('routes/admin/overview.tsx'),
    route('servers', 'routes/admin/servers.tsx'),
    route('teams', 'routes/admin/teams.tsx'),
    route('teams/:teamId', 'routes/admin/team.tsx'),
    route('bracket', 'routes/admin/bracket.tsx'),
  ]),

  route('manage', 'routes/manage/layout.tsx', [
    index('routes/manage/index.tsx'),
    route(':serverId', 'routes/manage/server.tsx'),
  ]),
]

export default [
  layout('routes/site/layout.tsx', [
    index('routes/site/home.tsx'),
    route('bracket', 'routes/site/bracket.tsx'),
    route('teams', 'routes/site/teams.tsx'),
    route('teams/:slug', 'routes/site/team.tsx'),
    route('partners', 'routes/site/partners.tsx'),
    ...(isDbBuild ? accountRoutes : []),
  ]),

  ...(isDbBuild ? serverRoutes : []),
] satisfies RouteConfig
