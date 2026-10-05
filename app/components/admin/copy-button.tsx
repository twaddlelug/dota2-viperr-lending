import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Button, type ButtonProps } from './button'

export function CopyButton({
  value,
  label = 'Копировать',
  size = 'sm',
  variant = 'secondary',
}: {
  value: string
  label?: string
  size?: ButtonProps['size']
  variant?: ButtonProps['variant']
}) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      aria-label={size === 'icon' ? label : undefined}
      onClick={async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? <Check className="text-success" /> : <Copy />}
      {size !== 'icon' && (copied ? 'Скопировано' : label)}
    </Button>
  )
}
