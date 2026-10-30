import type { CSSProperties, ReactNode } from 'react'
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

type Variant = 'solid' | 'outline' | 'ghost' | 'light' | 'lightOutline'

interface ButtonProps {
  children: ReactNode
  variant?: Variant
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
  withArrow?: boolean
}

const base =
  'group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-300 focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<Variant, string> = {
  solid: 'bg-ink text-bg hover:bg-accent hover:text-accent-ink',
  outline: 'border border-line-strong text-ink hover:border-accent hover:text-accent',
  ghost: 'text-ink hover:text-accent',
  light: 'bg-[#f2f0e9] text-[#191a18] hover:bg-accent hover:text-accent-ink',
  lightOutline: 'border border-white/40 text-[#f2f0e9] hover:border-accent hover:text-accent',
}

export function Button({
  children,
  variant = 'solid',
  href,
  onClick,
  type = 'button',
  disabled,
  className,
  withArrow = true,
}: ButtonProps) {
  const { isRTL } = useLanguage()
  const Arrow = isRTL ? ArrowUpLeft : ArrowUpRight
  const arrowShift = { '--arrow-x': isRTL ? '-0.2rem' : '0.2rem' } as CSSProperties

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {withArrow && (
        <Arrow
          aria-hidden
          style={arrowShift}
          className="relative z-10 size-4 transition-transform duration-300 ease-out group-hover/btn:translate-x-(--arrow-x) group-hover/btn:-translate-y-0.5"
        />
      )}
    </>
  )

  const classes = cn(base, variants[variant], className)

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes}>
        {content}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  )
}