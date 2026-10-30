import { useRef } from 'react'
import { gsap, useGSAP } from '@/animations/gsap'
import { featuredFlow, featuredStatic, featuredStory } from '@/animations/featuredAnimations'
import { Container } from '@/components/ui/Container'
import { ResponsiveImage } from '@/components/ui/ResponsiveImage'
import { featuredProjectId } from '@/data/projects'
import { useLanguage } from '@/hooks/useLanguage'

const wide = { name: 'featured-wide', widths: [1792, 1280, 768] } as const
const detailAssets = [
  { name: 'featured-detail-material', widths: [1000, 640] },
  { name: 'featured-detail-geometry', widths: [1000, 640] },
  { name: 'featured-detail-stair', widths: [1000, 640] },
] as const

export function FeaturedProject() {
  const { t, isRTL } = useLanguage()
  const scope = useRef<HTMLElement>(null)
  const rtlRef = useRef(isRTL)
  rtlRef.current = isRTL
  const copy = t.projects.items[featuredProjectId]

  useGSAP(
    () => {
      const stage = scope.current?.querySelector<HTMLElement>('[data-feat-stage]')
      if (!stage) return

      const media = gsap.matchMedia()
      media.add(
        {
          desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
          reduce: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const conditions = context.conditions as Record<string, boolean>
          if (conditions.desktop) featuredStory(stage, () => rtlRef.current)
          else if (conditions.mobile) featuredFlow(stage)
          else featuredStatic(stage)
        },
      )

      return () => media.revert()
    },
    { scope },
  )

  return (
    <section id="featured" ref={scope} className="relative bg-bg-alt">
      <div data-feat-stage className="relative lg:h-screen lg:overflow-hidden">
        <figure
          data-feat-media
          className="relative aspect-[16/10] overflow-hidden lg:absolute lg:inset-0 lg:aspect-auto"
        >
          <ResponsiveImage
            asset={wide}
            alt={copy.name}
            width={1792}
            height={1024}
            sizes="100vw"
            className="absolute inset-0"
          />
          <div
            aria-hidden
            className="absolute inset-0 hidden bg-gradient-to-t from-black/70 via-black/10 to-black/30 lg:block"
          />
        </figure>

        <div
          data-feat-intro
          className="relative flex flex-col gap-5 px-5 py-12 sm:px-8 lg:absolute lg:bottom-14 lg:start-14 lg:max-w-xl lg:p-0 lg:text-[#f2f0e9]"
        >
          <p className="eyebrow text-accent">
            {t.featured.index} — {t.featured.eyebrow}
          </p>
          <h2 className="display text-[clamp(2.4rem,6vw,5rem)]">{t.featured.title}</h2>
          <p className="text-sm font-semibold tracking-wide text-muted lg:text-[#f2f0e9]/70">
            {t.featured.location}
          </p>
          <p className="leading-relaxed text-muted lg:text-[#f2f0e9]/85">{t.featured.intro}</p>
        </div>

        <div
          data-feat-details
          className="grid gap-8 px-5 pb-12 sm:grid-cols-3 sm:px-8 lg:absolute lg:top-16 lg:end-0 lg:flex lg:h-[54%] lg:w-[46%] lg:flex-col lg:justify-center lg:gap-6 lg:p-10 lg:pe-14"
        >
          {t.featured.chapters.map((chapter, index) => (
            <article
              key={chapter.title}
              data-feat-detail
              className="flex gap-4 lg:items-center lg:rounded-sm lg:border lg:border-line lg:bg-surface lg:p-4 lg:shadow-[var(--shadow-soft)]"
            >
              <figure className="relative size-20 shrink-0 overflow-hidden lg:size-24">
                <ResponsiveImage
                  asset={detailAssets[index]}
                  alt={t.featured.materials[index]}
                  width={1000}
                  height={index === 1 ? 1000 : 1250}
                  sizes="(min-width: 1024px) 8vw, 30vw"
                  className="absolute inset-0"
                />
              </figure>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-bold">{chapter.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{chapter.body}</p>
              </div>
            </article>
          ))}
        </div>

        <dl
          data-feat-specs
          className="grid grid-cols-2 gap-x-8 gap-y-5 border-t border-line px-5 py-10 sm:grid-cols-3 sm:px-8 lg:absolute lg:bottom-12 lg:end-14 lg:w-[42%] lg:p-0"
        >
          {t.featured.specs.map((spec) => (
            <div key={spec.label}>
              <dt className="eyebrow text-muted">{spec.label}</dt>
              <dd className="mt-1 text-sm font-semibold">{spec.value}</dd>
            </div>
          ))}
        </dl>

        <div
          data-feat-closing
          className="px-5 py-16 text-center sm:px-8 lg:absolute lg:inset-0 lg:grid lg:place-items-center lg:p-0"
        >
          <p className="display mx-auto max-w-3xl text-[clamp(1.6rem,3.6vw,3rem)] text-ink lg:text-[#f2f0e9]">
            {t.featured.closing}
          </p>
        </div>
      </div>

      <Container className="flex flex-wrap items-center gap-x-8 gap-y-3 py-10 lg:py-12">
        <span className="eyebrow">{t.featured.materialsTitle}</span>
        {t.featured.materials.map((material) => (
          <span key={material} className="flex items-center gap-3 text-sm text-muted">
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            {material}
          </span>
        ))}
      </Container>
    </section>
  )
}