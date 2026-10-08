import { SectionHeading } from '~/components/ui/section-heading'
import type { Match } from '~/features/bracket/bracket'
import { MatchCard } from '~/features/bracket/match-card'

const ABOUT_TITLE = 'а нахуя эта залупа типо?'

const ABOUT_TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

const STEPS = [
  {
    title: 'Сосали?',
    text: 'Да. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    title: 'Лизали?',
    text: 'Неа. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    title: 'Дота для геев?',
    text: 'Да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да, да.',
  },
]

export function TournamentIntro({
  featuredMatch,
}: {
  featuredMatch: Match | null
}) {
  return (
    <section className="container mx-auto px-6 pt-10 md:px-8">
      <SectionHeading title="О турнире" />

      <div className="grid gap-12 lg:grid-cols-[1fr_18rem]">
        <div>
          <p className="font-bold font-display text-2xl uppercase leading-tight sm:text-3xl">
            Viperr Tournament —{' '}
            <span className="text-accent">{ABOUT_TITLE}</span>
          </p>
          <p className="mt-5 max-w-3xl text-lg text-white/75 leading-relaxed">
            {ABOUT_TEXT}
          </p>
        </div>

        {featuredMatch && (
          <div className="self-start opacity-60 transition-opacity hover:opacity-100">
            <p className="mb-3 text-muted text-xs uppercase tracking-[0.2em]">
              {featuredMatch.status === 'live'
                ? 'Сейчас идёт'
                : 'Следующий матч'}
            </p>
            <MatchCard match={featuredMatch} quiet />
          </div>
        )}
      </div>

      <ol className="mt-14 grid gap-5 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            className="rounded-2xl border border-line bg-surface p-6"
          >
            <span className="font-black font-display text-3xl text-metal">
              0{i + 1}
            </span>
            <h3 className="mt-4 font-bold font-display uppercase">
              {step.title}
            </h3>
            <p className="mt-2 text-muted text-sm leading-relaxed">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
