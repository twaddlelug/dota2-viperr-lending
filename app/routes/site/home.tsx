import { SITE } from '~/config/site'
import { getFeaturedMatch } from '~/features/bracket/bracket'
import { getBracket } from '~/features/bracket/bracket.server'
import { Hero } from '~/features/landing/hero'
import { TournamentIntro } from '~/features/landing/tournament-intro'
import { getSettings } from '~/features/settings/settings.server'
import type { Route } from './+types/home'

export async function loader() {
  const [bracket, settings] = await Promise.all([getBracket(), getSettings()])
  return { featuredMatch: getFeaturedMatch(bracket) ?? null, settings }
}

export function meta({ loaderData }: Route.MetaArgs) {
  const description = loaderData?.settings.heroText ?? SITE.description
  return [
    { title: SITE.name },
    { name: 'description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE.name },
    { property: 'og:title', content: SITE.name },
    { property: 'og:description', content: description },
  ]
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const { featuredMatch, settings } = loaderData

  return (
    <>
      <Hero
        description={settings.heroText}
        discordUrl={settings.discordEventUrl}
      />
      <TournamentIntro
        featuredMatch={featuredMatch}
        about={{ title: settings.aboutTitle, text: settings.aboutText }}
      />
    </>
  )
}
