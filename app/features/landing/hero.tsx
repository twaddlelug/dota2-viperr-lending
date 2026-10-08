import { ArrowRight } from 'lucide-react'
import { Rise, RiseWords } from '~/components/effects/rise'
import { Navbar } from '~/components/layout/navbar'
import { Stage } from '~/components/layout/stage'
import { ButtonLink } from '~/components/ui/button-link'
import { CornerFrame } from '~/components/ui/corner-frame'
import { NAV_LINKS, SITE } from '~/config/site'

export function Hero() {
  return (
    <header className="p-4 sm:p-10">
      <Stage
        overlay={<CornerCaptions />}
        className="min-h-[780px] xl:h-[91vh] xl:max-h-[920px]"
      >
        <div className="mt-7 lg:mt-10 xl:mt-16">
          <Navbar links={NAV_LINKS} />
        </div>

        <div className="flex flex-col items-center pt-20 pb-28 text-center 2xl:pt-28">
          <Rise>
            <p className="-skew-x-12 font-bold font-display text-2xl text-metal tracking-wide sm:text-4xl">
              VIPERR
            </p>
          </Rise>

          <CornerFrame className="mt-4 px-4 py-3 sm:px-10 sm:py-5">
            <h1 className="font-black font-display text-[clamp(1.5rem,7.5vw,7rem)] uppercase leading-[1.05]">
              <RiseWords delay={0.1} wordClassName="text-metal">
                Tournament
              </RiseWords>
            </h1>
          </CornerFrame>

          <Rise delay={0.25}>
            <p className="mt-8 max-w-2xl px-8 font-light font-mono text-[0.8rem] leading-[22px] opacity-80 sm:text-sm sm:leading-[24px] lg:p-0">
              {SITE.description}
            </p>
          </Rise>

          <Rise
            delay={0.4}
            className="mt-12 flex w-full max-w-xs flex-col gap-4 sm:w-auto sm:max-w-none sm:flex-row sm:gap-5"
          >
            <ButtonLink href="/bracket">
              Турнирная сетка
              <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
            </ButtonLink>
          </Rise>
        </div>
      </Stage>
    </header>
  )
}

function CornerCaptions() {
  const caption =
    'pointer-events-none absolute bottom-10 z-10 hidden font-light text-[11px] text-white/60 uppercase leading-[1.4] tracking-wide xl:block'

  return (
    <>
      <div className={`${caption} left-10`}>
        <p>Estd</p>
        <p>{SITE.established}</p>
      </div>
      <div className={`${caption} right-10 text-right`}>
        <p>All</p>
        <p>rights</p>
        <p>reserved</p>
      </div>
    </>
  )
}
