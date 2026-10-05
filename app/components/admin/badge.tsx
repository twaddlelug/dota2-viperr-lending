import { cn } from '~/lib/cn'

const TONES = {
  green: 'border-success/30 bg-success/10 text-success',
  yellow: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  gray: 'border-line bg-white/5 text-muted',
  red: 'border-red-500/30 bg-red-500/10 text-red-300',
}

export function Badge({
  tone = 'gray',
  children,
  className,
}: {
  tone?: keyof typeof TONES
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs [&_svg]:h-3.5 [&_svg]:w-3.5',
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
