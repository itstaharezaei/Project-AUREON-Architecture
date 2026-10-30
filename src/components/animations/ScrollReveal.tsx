import { useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap, useGSAP } from '@/animations/gsap'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/utils/cn'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  start?: string
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 36,
  start = 'top 88%',
}: ScrollRevealProps) {
  const scope = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useGSAP(
    () => {
      const element = scope.current
      if (!element) return

      if (reduceMotion) {
        gsap.set(element, { autoAlpha: 1, y: 0 })
        return
      }

      gsap.fromTo(
        element,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start, once: true },
        },
      )
    },
    { scope, dependencies: [reduceMotion, delay, y, start] },
  )

  return (
    <div ref={scope} className={cn(className)}>
      {children}
    </div>
  )
}