import { useRef } from 'react'
import { gsap, useGSAP } from '@/animations/gsap'
import {
  philosophyFlow,
  philosophyPin,
  philosophyStatic,
} from '@/animations/philosophyAnimations'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { Container } from '@/components/ui/Container'
import { ResponsiveImage } from '@/components/ui/ResponsiveImage'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useLanguage } from '@/hooks/useLanguage'

const facade = { name: 'philosophy-facade', widths: [1024, 700, 460] } as const
const courtyard = { name: 'philosophy-courtyard', widths: [1400, 900, 560] } as const

export function Philosophy() {
  const { t } = useLanguage()
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const panel = scope.current?.querySelector<HTMLElement>('[data-phil-panel]')
      if (!panel) return

      const media = gsap.matchMedia()
      media.add(
        {
          desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
          reduce: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const conditions = context.conditions as Record<string, boolean>
          if (conditions.desktop) philosophyPin(panel)
          else if (conditions.mobile) philosophyFlow(panel)
          else philosophyStatic(panel)
        },
      )

      return () => media.revert()
    },
    { scope },
  )

  return (
    <section id="philosophy" ref={scope} className="relative bg-bg-alt py-24 lg:py-32">
      <Container>
        <SectionHeading
          index={t.philosophy.index}
          eyebrow={t.philosophy.eyebrow}
          title={t.philosophy.title}
          lead={t.philosophy.lead}
        />
      </Container>

      <div data-phil-panel className="mt-16 lg:mt-10 lg:flex lg:h-screen lg:items-center">
        <Container className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-24">
          <div className="relative flex flex-col gap-14 lg:block lg:h-[26rem]">
            <span
              aria-hidden
              className="absolute -start-6 top-0 hidden h-full w-px bg-line lg:block"
            >
              <span data-phil-progress className="block h-full w-px origin-top bg-accent" />
            </span>

            {t.philosophy.statements.map((statement) => (
              <article
                key={statement.kicker}
                data-statement
                className="flex flex-col gap-5 lg:absolute lg:inset-0 lg:justify-center"
              >
                <span className="eyebrow text-accent">{statement.kicker}</span>
                <h3 className="display max-w-[18ch] text-[clamp(1.9rem,4vw,3.4rem)]">
                  {statement.title}
                </h3>
                <p className="max-w-md leading-relaxed text-muted">{statement.body}</p>
              </article>
            ))}
          </div>

          <div className="relative h-[26rem] sm:h-[32rem] lg:h-[34rem]">
            <figure
              data-phil-a
              className="absolute top-0 end-0 h-[76%] w-[68%] overflow-hidden shadow-(--shadow-soft)"
            >
              <ResponsiveImage
                asset={facade}
                alt={t.philosophy.statements[0].title}
                width={1024}
                height={1280}
                sizes="(min-width: 1024px) 34vw, 68vw"
                className="absolute inset-0 scale-110"
              />
            </figure>
            <figure
              data-phil-b
              className="absolute bottom-0 start-0 h-[52%] w-[62%] overflow-hidden border-8 border-bg-alt shadow-(--shadow-soft)"
            >
              <ResponsiveImage
                asset={courtyard}
                alt={t.philosophy.statements[1].title}
                width={1400}
                height={933}
                sizes="(min-width: 1024px) 30vw, 62vw"
                className="absolute inset-0 scale-110"
              />
            </figure>
          </div>
        </Container>
      </div>

      <Container className="mt-24 lg:mt-32">
        <ScrollReveal>
          <blockquote className="quote display max-w-5xl text-[clamp(1.5rem,3.4vw,2.9rem)]">
            {t.philosophy.quote}
          </blockquote>
          <p className="eyebrow mt-7">{t.philosophy.quoteAuthor}</p>
        </ScrollReveal>
      </Container>
    </section>
  )
}