import { PageHeader } from '~/components/layout/page-header'
import { SITE } from '~/config/site'
import { getBracket } from '~/features/bracket/bracket.server'
import { BracketTree } from '~/features/bracket/bracket-tree'
import type { Route } from './+types/bracket'

export async function loader() {
  return { bracket: await getBracket() }
}

export function meta() {
  return [
    { title: `Сетка — ${SITE.name}` },
    {
      name: 'description',
      content: `Плей-офф ${SITE.name}: Upper и Lower Bracket, все серии и результаты.`,
    },
  ]
}

export default function BracketPage({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <PageHeader title="Сетка" />

      <section className="container mx-auto px-4 md:px-8">
        <BracketTree bracket={loaderData.bracket} />
      </section>
    </>
  )
}
