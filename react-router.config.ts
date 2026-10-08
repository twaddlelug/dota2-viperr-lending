import type { Config } from '@react-router/dev/config'
import { DEMO_TEAMS } from './app/features/teams/demo-teams.ts'
import { isDbBuild } from './build-mode.ts'

export default (isDbBuild
  ? { ssr: true }
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
