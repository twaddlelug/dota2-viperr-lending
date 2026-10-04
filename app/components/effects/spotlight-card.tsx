import { useRef } from 'react'
import { cn } from '~/lib/cn'

export function SpotlightCard({
  children,
  className,
  color = 'rgba(255, 255, 255, 0.25)',
}: {
  children: React.ReactNode
  className?: string
  color?: string
}) {
  const overlayRef = useRef<HTMLDivElement>(null)

  const setOpacity = (value: string) => {
    if (overlayRef.current) overlayRef.current.style.opacity = value
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!overlayRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    overlayRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, ${color}, transparent 60%)`
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setOpacity('0.6')}
      onMouseLeave={() => setOpacity('0')}
    >
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-120 ease-in-out"
      />
      {children}
    </div>
  )
}
