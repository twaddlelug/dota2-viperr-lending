import { Rise, RiseWords } from '~/components/effects/rise'
import { CornerFrame } from '~/components/ui/corner-frame'
import { NAV_LINKS } from '~/config/site'
import { Navbar } from './navbar'
import { Stage } from './stage'

export function PageHeader({
  title,
  media,
  background,
  children,
}: {
  title: string
  media?: React.ReactNode
  background?: string
  children?: React.ReactNode
}) {
  return (
    <header className="p-4 sm:p-10">
      <Stage image={background} className="pb-12 sm:pb-16">
        <div className="mt-7 lg:mt-10">
          <Navbar links={NAV_LINKS} />
        </div>

        <div className="flex flex-col items-center pt-12 text-center sm:pt-16">
          {media && <Rise className="mb-6">{media}</Rise>}
          <CornerFrame className="px-4 py-2 sm:px-8 sm:py-3">
            <h1
              key={title}
              className="font-black font-display text-[clamp(1.5rem,5vw,3.75rem)] uppercase leading-[1.1]"
            >
              <RiseWords wordClassName="text-metal">{title}</RiseWords>
            </h1>
          </CornerFrame>
          {children}
        </div>
      </Stage>
    </header>
  )
}
