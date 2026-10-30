import { useRef } from 'react'
import { gsap, useGSAP } from '@/animations/gsap'
import { ResponsiveImage } from '@/components/ui/ResponsiveImage'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import type { ImageAsset } from '@/types/project'
import { cn } from '@/utils/cn'

interface ParallaxImageProps {
  asset: ImageAsset
  alt: string
  width: number
  height: number
  sizes?: string
  /** Vertical travel of the image across the scroll pass, in percent. */
  speed?: number
  reveal?: boolean
  eager?: boolean
  className?: string
  imageClassName?: string
}

export function ParallaxImage({
  asset,
  alt,
  width,
  height,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  speed = 7,
  reveal = true,
  eager = false,
  className,
  imageClassName,
}: ParallaxImageProps) {
  const scope = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  useGSAP(
    () => {
      const figure = scope.current
      if (!figure) return
      const image = figure.querySelector('img')
      if (!image) return

      if (reduceMotion) {
        gsap.set(figure, { clipPath: 'inset(0% 0% 0% 0%)' })
        gsap.set(image, { yPercent: 0, scale: 1 })
        return
      }

      gsap.set(image, { scale: 1.16 })
      gsap.fromTo(
        image,
        { yPercent: -speed },
        {
          yPercent: speed,
          ease: 'none',
          scrollTrigger: { trigger: figure, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )

      if (reveal) {
        gsap.fromTo(
          figure,
          { clipPath: 'inset(14% 10% 14% 10%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.3,
            ease: 'power4.out',
            scrollTrigger: { trigger: figure, start: 'top 86%', once: true },
          },
        )
      }
    },
    { scope, dependencies: [reduceMotion, speed, reveal] },
  )

  return (
    <figure ref={scope} className={cn('relative overflow-hidden', className)}>
      <ResponsiveImage
        asset={asset}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        eager={eager}
        className={cn('absolute inset-0', imageClassName)}
      />
    </figure>
  )
}