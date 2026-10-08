import { Link } from 'react-router'
import { cn } from '~/lib/cn'
import { Corners } from './corners'

const ctaClass =
  'group relative inline-flex h-14 cursor-pointer items-center justify-center gap-3 bg-accent px-9 font-mono font-semibold text-black text-sm uppercase tracking-[0.14em] transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 active:translate-y-px disabled:cursor-default disabled:opacity-50 [&_svg]:h-4 [&_svg]:w-4'

function Reticle() {
  return (
    <Corners
      lockOn
      className="-inset-2"
      cornerClassName="h-2.5 w-2.5 border-white sm:h-2.5 sm:w-2.5"
    />
  )
}

export function ButtonLink({
  href,
  children,
  reloadDocument,
  className,
}: {
  href: string
  children: React.ReactNode
  reloadDocument?: boolean
  className?: string
}) {
  const content = (
    <>
      {children}
      <Reticle />
    </>
  )

  if (href.startsWith('/')) {
    return (
      <Link
        to={href}
        reloadDocument={reloadDocument}
        className={cn(ctaClass, className)}
      >
        {content}
      </Link>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(ctaClass, className)}
    >
      {content}
    </a>
  )
}

export function CtaButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="submit" {...props} className={cn(ctaClass, className)}>
      {children}
      <Reticle />
    </button>
  )
}
