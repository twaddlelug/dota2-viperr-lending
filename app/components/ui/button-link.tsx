import { Link } from 'react-router'
import { cn } from '~/lib/cn'

type ButtonLinkProps = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'ghost'
  reloadDocument?: boolean
  className?: string
}

const VARIANTS = {
  primary: 'text-black before:bg-accent hover:before:bg-accent-hover',
  ghost:
    'text-white before:border before:border-white/25 before:bg-white/[0.04] hover:before:border-white/60 hover:before:bg-white/[0.08]',
}

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  reloadDocument,
  className,
}: ButtonLinkProps) {
  const classes = cn(
    'group relative isolate inline-flex h-14 items-center justify-center gap-3 px-9 font-bold font-display text-[13px] uppercase tracking-[0.08em] transition-transform duration-150 before:absolute before:inset-0 before:-z-10 before:-skew-x-12 before:rounded-md before:transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 active:scale-[0.97] [&_svg]:h-4 [&_svg]:w-4',
    VARIANTS[variant],
    className
  )

  if (href.startsWith('/')) {
    return (
      <Link to={href} reloadDocument={reloadDocument} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={classes}>
      {children}
    </a>
  )
}
