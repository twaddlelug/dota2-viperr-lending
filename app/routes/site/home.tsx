import { SITE } from '~/config/site'
import { getFeaturedMatch } from '~/features/bracket/bracket'
import { getBracket } from '~/features/bracket/bracket.server'
import { Hero } from '~/features/landing/hero'
import { TournamentIntro } from '~/features/landing/tournament-intro'
import type { Route } from './+types/home'

export async function loader() {
  return { featuredMatch: getFeaturedMatch(await getBracket()) ?? null }
}

export const meta = () => [
  { title: SITE.name },
  { name: 'description', content: SITE.description },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: SITE.name },
  { property: 'og:title', content: SITE.name },
  { property: 'og:description', content: SITE.description },
]

export default function HomePage({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Hero />
      <TournamentIntro featuredMatch={loaderData.featuredMatch} />
    </>
  )
}
