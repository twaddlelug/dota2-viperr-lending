import type { Config } from '@react-router/dev/config'
import { DEMO_TEAMS } from './app/features/teams/demo-teams.ts'
import { isDbBuild } from './build-mode.ts'

const publicHost = URL.parse(process.env.PUBLIC_URL ?? '')?.host

export default (isDbBuild
  ? { ssr: true, allowedActionOrigins: publicHost ? [publicHost] : undefined }
  : {
      ssr: false,
      prerender: [
        '/',
        '/bracket',
        '/teams',
        '/partners',
        '/sitemap.xml',
        '/robots.txt',
        ...DEMO_TEAMS.map(team => `/teams/${team.slug}`),
      ],
    }) satisfies Config
