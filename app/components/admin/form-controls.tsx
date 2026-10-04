import { cn } from '~/lib/cn'

const control =
  'w-full rounded-lg border border-line bg-black/40 px-3 py-2 text-sm outline-none transition-colors placeholder:text-white/50 focus:border-accent/60 disabled:opacity-40'

export function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block text-muted text-xs">{label}</span>
      {children}
    </label>
  )
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(control, className)} />
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(control, 'resize-y', className)} />
}

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(control, 'pr-8', className)} />
}
