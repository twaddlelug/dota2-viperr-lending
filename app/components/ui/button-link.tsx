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
  primary: 'bg-accent text-black hover:bg-accent-hover',
  ghost: 'text-white hover:text-accent',
}

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  reloadDocument,
  className,
}: ButtonLinkProps) {
  const classes = cn(
    'inline-flex rounded-[20px] p-5 font-bold text-[0.95rem] transition duration-150 hover:scale-[0.98] active:scale-[0.95] sm:text-base',
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
