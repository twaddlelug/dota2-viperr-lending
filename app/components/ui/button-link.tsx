import { Link } from 'react-router'
import { cn } from '~/lib/cn'

const ctaClass =
  'inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-6 font-semibold text-[15px] text-black shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_10px_30px_-14px_var(--color-accent)] transition-[background-color,box-shadow,scale] duration-200 hover:bg-accent-hover hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_14px_36px_-12px_var(--color-accent)] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 active:scale-[0.98] disabled:cursor-default disabled:opacity-50 [&_svg]:h-4 [&_svg]:w-4'

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
  if (href.startsWith('/')) {
    return (
      <Link
        to={href}
        reloadDocument={reloadDocument}
        className={cn(ctaClass, className)}
      >
        {children}
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
      {children}
    </a>
  )
}

export function CtaButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="submit" {...props} className={cn(ctaClass, className)} />
}
