import { useRef } from 'react'
import { useGSAP } from '@/animations/gsap'
import { heroIntro, heroPointer, heroScroll } from '@/animations/heroAnimations'
import { scrollToSection } from '@/animations/scrollAnimations'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { ResponsiveImage } from '@/components/ui/ResponsiveImage'
import { useLanguage } from '@/hooks/useLanguage'
import { useFinePointer, useReducedMotion } from '@/hooks/useMediaQuery'

const heroImage = { name: 'hero', widths: [1792, 1280, 768] } as const

export function Hero() {
  const { t } = useLanguage()
  const reduceMotion = useReducedMotion()
  const finePointer = useFinePointer()
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return

      if (reduceMotion) return

      const intro = heroIntro(root)
      heroScroll(root)
      const disposePointer = finePointer ? heroPointer(root) : undefined

      return () => {
        intro.kill()
        disposePointer?.()
      }
    },
    { scope, dependencies: [reduceMotion, finePointer] },
  )

  return (
    <section
      id="hero"
      ref={scope}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-bg"
    >
      <div data-hero-media className="absolute inset-0 overflow-hidden">
        <ResponsiveImage
          asset={heroImage}
          alt={t.hero.caption}
          width={1792}
          height={1024}
          sizes="100vw"
          eager
          className="absolute inset-0"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundImage: 'var(--hero-veil)' }}
        />
      </div>

      <div aria-hidden className="mesh pointer-events-none absolute inset-0 opacity-25 mix-blend-soft-light" />

      <Container className="pointer-events-none absolute inset-x-0 top-24 z-10 flex items-start justify-between gap-6 sm:top-28">
        <p data-hero-decor className="eyebrow text-[#f2f0e9]/75">
          {t.hero.eyebrow}
        </p>
        <p data-hero-decor className="eyebrow hidden text-[#f2f0e9]/60 sm:block" dir="ltr">
          {t.hero.coordinates}
        </p>
      </Container>

      <span
        data-hero-decor
        aria-hidden
        className="absolute top-1/3 end-4 z-10 hidden text-[11rem] leading-none font-extrabold text-[#f2f0e9]/8 xl:block"
      >
        {t.hero.index}
      </span>

      <span
        data-hero-decor
        aria-hidden
        className="absolute top-1/2 start-5 z-10 hidden -translate-y-1/2 text-[0.65rem] font-bold tracking-[0.42em] text-[#f2f0e9]/50 uppercase [writing-mode:vertical-rl] lg:block"
      >
        AUREON — Architectural Studio
      </span>

      <Container className="relative z-10 flex flex-1 flex-col justify-end pt-32 pb-10 sm:pb-14">
        <div data-hero-content className="flex flex-col gap-8">
          <h1 className="display-tight max-w-[14ch] text-[clamp(3rem,10.5vw,9rem)] text-[#f2f0e9]">
            {t.hero.title.map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <span data-hero-line className="block">
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p data-hero-fade className="max-w-md text-base leading-relaxed text-[#f2f0e9]/80 sm:text-lg">
              {t.hero.lead}
            </p>

            <div data-hero-fade className="flex flex-wrap items-center gap-3">
              <Button
                variant="light"
                onClick={() => scrollToSection('#projects')}
              >
                {t.hero.primary}
              </Button>
              <Button variant="lightOutline" onClick={() => scrollToSection('#about')}>
                {t.hero.secondary}
              </Button>
            </div>
          </div>

          <div data-hero-fade className="hairline flex items-center justify-between gap-6 border-t-white/20 pt-5">
            <p className="text-xs tracking-wide text-[#f2f0e9]/60 sm:text-sm">{t.hero.caption}</p>
            <button
              type="button"
              onClick={() => scrollToSection('#philosophy')}
              className="group flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-[#f2f0e9]/70 uppercase transition-colors hover:text-accent"
            >
              <span className="hidden sm:inline">{t.hero.scroll}</span>
              <span aria-hidden className="relative block h-8 w-px overflow-hidden bg-white/25">
                <span className="scroll-line absolute inset-0 bg-accent" />
              </span>
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}