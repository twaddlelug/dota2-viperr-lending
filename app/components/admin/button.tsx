import { cn } from '~/lib/cn'

const VARIANTS = {
  primary: 'bg-accent text-black hover:bg-accent-hover',
  secondary:
    'border border-line text-white hover:border-white/30 hover:bg-white/5',
  ghost: 'text-muted hover:bg-white/5 hover:text-white',
  danger: 'text-red-300/80 hover:bg-red-500/10 hover:text-red-300',
  'danger-solid': 'bg-red-500/90 text-white hover:bg-red-500',
}

const SIZES = {
  sm: 'gap-1.5 px-3 py-1.5 text-xs',
  md: 'gap-2 px-4 py-2 text-sm',
  icon: 'p-2',
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS
  size?: keyof typeof SIZES
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type="submit"
      {...props}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-lg font-semibold transition-colors disabled:cursor-default disabled:opacity-40 [&_svg]:h-4 [&_svg]:w-4',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
    />
  )
}
