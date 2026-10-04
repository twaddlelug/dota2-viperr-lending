import {
  index,
  layout,
  type RouteConfig,
  route,
} from '@react-router/dev/routes'

export default [
  layout('routes/site/layout.tsx', [
    index('routes/site/home.tsx'),
    route('bracket', 'routes/site/bracket.tsx'),
    route('teams', 'routes/site/teams.tsx'),
    route('teams/:slug', 'routes/site/team.tsx'),
  ]),
] satisfies RouteConfig
