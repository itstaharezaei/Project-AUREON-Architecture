import { useRef } from 'react'
import { gsap, useGSAP } from '@/animations/gsap'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { statistics } from '@/data/statistics'
import { useLanguage } from '@/hooks/useLanguage'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/utils/cn'
import { formatNumber } from '@/utils/format'

export function Statistics() {
  const { t, language } = useLanguage()
  const reduceMotion = useReducedMotion()
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      const counters = root.querySelectorAll<HTMLElement>('[data-count]')

      counters.forEach((counter, index) => {
        const target = Number(counter.dataset.count)
        if (reduceMotion) {
          counter.textContent = formatNumber(target, language)
          return
        }
        const state = { value: 0 }
        counter.textContent = formatNumber(0, language)
        gsap.to(state, {
          value: target,
          duration: 1.8,
          delay: index * 0.12,
          ease: 'power2.out',
          snap: { value: 1 },
          scrollTrigger: { trigger: counter, start: 'top 88%', once: true },
          onUpdate: () => {
            counter.textContent = formatNumber(Math.round(state.value), language)
          },
        })
      })

      if (reduceMotion) return
      gsap.from(root.querySelectorAll('[data-stat-tile]'), {
        autoAlpha: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: root, start: 'top 78%', once: true },
      })
    },
    { scope, dependencies: [language, reduceMotion] },
  )

  return (
    <section id="stats" ref={scope} className="relative bg-ink py-24 text-bg lg:py-32">
      <Container>
        <SectionHeading
          index={t.stats.index}
          eyebrow={t.stats.eyebrow}
          title={t.stats.title}
          className="max-w-3xl [&_.eyebrow]:text-bg/60 [&_h2]:text-bg"
        />

        <div className="mt-14 grid gap-px bg-bg/15 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {statistics.map((stat, index) => (
            <div
              key={stat.id}
              data-stat-tile
              className={cn(
                'flex flex-col justify-between gap-8 bg-ink p-7 sm:p-9',
                index === 0 && 'sm:col-span-2 sm:row-span-2 lg:p-12',
                index === 3 && 'sm:col-span-2',
              )}
            >
              <span
                data-count={stat.value}
                className={cn(
                  'display-tight tabular-nums text-accent',
                  index === 0 ? 'text-[clamp(4.5rem,12vw,10rem)]' : 'text-[clamp(3rem,6vw,5rem)]',
                )}
              >
                {formatNumber(stat.value, language)}
              </span>
              <span className="flex flex-col gap-2">
                <span className="text-lg font-bold sm:text-xl">{t.stats.items[stat.id].label}</span>
                <span className="text-sm leading-relaxed text-bg/60">
                  {t.stats.items[stat.id].detail}
                </span>
              </span>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-bg/50">{t.stats.note}</p>
      </Container>
    </section>
  )
}