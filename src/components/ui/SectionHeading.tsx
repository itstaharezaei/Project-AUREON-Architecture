import { useRef } from 'react'
import { gsap, useGSAP } from '@/animations/gsap'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/utils/cn'

interface SectionHeadingProps {
  index: string
  eyebrow: string
  title: string | readonly string[]
  lead?: string
  className?: string
  titleClassName?: string
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  className,
  titleClassName,
}: SectionHeadingProps) {
  const scope = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const lines = typeof title === 'string' ? [title] : title

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      const lineEls = root.querySelectorAll('[data-line]')
      const fadeEls = root.querySelectorAll('[data-fade]')

      if (reduceMotion) {
        gsap.set([lineEls, fadeEls], { clearProps: 'all', autoAlpha: 1, yPercent: 0, y: 0 })
        return
      }

      gsap.set(lineEls, { yPercent: 115 })
      gsap.set(fadeEls, { autoAlpha: 0, y: 18 })

      gsap
        .timeline({
          scrollTrigger: { trigger: root, start: 'top 85%', once: true },
        })
        .to(lineEls, { yPercent: 0, duration: 1.1, stagger: 0.09, ease: 'power4.out' }, 0)
        .to(fadeEls, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.15)
    },
    { scope, dependencies: [reduceMotion] },
  )

  return (
    <div ref={scope} className={cn('flex flex-col gap-6', className)}>
      <div data-fade className="flex items-center gap-4">
        <span className="eyebrow text-accent">{index}</span>
        <span aria-hidden className="h-px w-10 bg-line-strong sm:w-16" />
        <span className="eyebrow">{eyebrow}</span>
      </div>

      <h2 className={cn('display text-[clamp(2.4rem,6.5vw,5.75rem)]', titleClassName)}>
        {lines.map((line) => (
          <span key={line} className="block overflow-hidden pb-[0.08em]">
            <span data-line className="block">
              {line}
            </span>
          </span>
        ))}
      </h2>

      {lead && (
        <p data-fade className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {lead}
        </p>
      )}
    </div>
  )
}