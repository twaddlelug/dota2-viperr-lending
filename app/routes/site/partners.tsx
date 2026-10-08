import { Rise } from '~/components/effects/rise'
import { PageHeader } from '~/components/layout/page-header'
import { Board } from '~/components/ui/board'
import { SITE } from '~/config/site'
import { PartnerCard } from '~/features/servers/partner-card'
import { getPartners } from '~/features/servers/partners.server'
import type { Route } from './+types/partners'

export async function loader() {
  return { partners: await getPartners() }
}

export function meta() {
  return [
    { title: `Партнеры — ${SITE.name}` },
    {
      name: 'description',
      content: `Discord-серверы, которые выставили свои команды на турнир ${SITE.name}.`,
    },
  ]
}

export default function PartnersPage({ loaderData }: Route.ComponentProps) {
  const { partners } = loaderData

  return (
    <>
      <PageHeader title="Партнеры">
        <Rise delay={0.2}>
          <p className="mt-6 max-w-xl px-6 font-mono text-sm opacity-80">
            Discord-серверы, которые выставили свои команды. Заходите поболеть
            за своих.
          </p>
        </Rise>
      </PageHeader>

      <section className="container mx-auto px-6 pt-6 md:px-8">
        {partners.length > 0 ? (
          <Board count={partners.length} label="Серверы-участники">
            {partners.map(partner => (
              <li key={partner.id}>
                <PartnerCard partner={partner} />
              </li>
            ))}
          </Board>
        ) : (
          <p className="text-center text-muted">Партнеры ещё не объявлены.</p>
        )}
      </section>
    </>
  )
}
