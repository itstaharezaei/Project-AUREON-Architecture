import { useRef } from 'react'
import { gsap, useGSAP } from '@/animations/gsap'
import { ParallaxImage } from '@/components/animations/ParallaxImage'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useLanguage } from '@/hooks/useLanguage'
import { useReducedMotion } from '@/hooks/useMediaQuery'

const studio = { name: 'about-studio', widths: [1400, 900, 560] } as const
const model = { name: 'about-model', widths: [1000, 640] } as const

export function About() {
  const { t } = useLanguage()
  const reduceMotion = useReducedMotion()
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mark = scope.current?.querySelector('[data-about-mark]')
      if (!mark || reduceMotion) return
      gsap.fromTo(
        mark,
        { rotate: -18, scale: 0.9 },
        {
          rotate: 24,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: {
            trigger: scope.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    },
    { scope, dependencies: [reduceMotion] },
  )

  return (
    <section id="about" ref={scope} className="relative overflow-x-clip bg-bg py-24 lg:py-32">
      <Container className="grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-9 lg:col-span-6">
          <SectionHeading
            index={t.about.index}
            eyebrow={t.about.eyebrow}
            title={t.about.title}
          />
          {t.about.paragraphs.map((paragraph) => (
            <ScrollReveal key={paragraph.slice(0, 24)}>
              <p className="max-w-xl leading-relaxed text-muted">{paragraph}</p>
            </ScrollReveal>
          ))}
          <ScrollReveal>
            <blockquote className="quote display max-w-xl text-[clamp(1.3rem,2.4vw,1.9rem)]">
              {t.about.quote}
            </blockquote>
          </ScrollReveal>
        </div>

        <div className="relative lg:col-span-6">
          <svg
            data-about-mark
            aria-hidden
            viewBox="0 0 200 200"
            className="absolute -top-10 end-0 z-10 size-32 text-accent/50 sm:-end-6 sm:size-40 lg:-end-10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <circle cx="100" cy="100" r="88" />
            <circle cx="100" cy="100" r="56" strokeDasharray="4 6" />
            <rect x="44" y="44" width="112" height="112" />
            <path d="M100 12v176M12 100h176" />
          </svg>

          <ParallaxImage
            asset={studio}
            alt={t.about.studioCaption}
            width={1400}
            height={933}
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="aspect-[4/3] w-[86%]"
          />
          <ParallaxImage
            asset={model}
            alt={t.about.modelCaption}
            width={1000}
            height={1000}
            sizes="(min-width: 1024px) 22vw, 55vw"
            speed={9}
            className="absolute -bottom-10 end-0 aspect-square w-[46%] border-8 border-bg shadow-(--shadow-soft)"
          />
          <p className="eyebrow mt-14 lg:mt-16">{t.about.studioCaption}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-12">
          {t.about.values.map((value, index) => (
            <ScrollReveal key={value.title} delay={index * 0.1}>
              <div className="group flex h-full flex-col gap-3 border border-line bg-surface p-7 transition-colors duration-500 hover:border-accent sm:p-9">
                <span className="eyebrow text-accent">{`0${index + 1}`}</span>
                <h3 className="text-xl font-bold sm:text-2xl">{value.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{value.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  )
}