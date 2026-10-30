import { useRef, useState } from 'react'
import { Armchair, Building2, Home, Map, Plus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { gsap, useGSAP } from '@/animations/gsap'
import { Container } from '@/components/ui/Container'
import { ResponsiveImage } from '@/components/ui/ResponsiveImage'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { services } from '@/data/services'
import { useLanguage } from '@/hooks/useLanguage'
import { useFinePointer, useReducedMotion } from '@/hooks/useMediaQuery'
import type { ServiceId } from '@/types/service'
import { cn } from '@/utils/cn'
import { padIndex } from '@/utils/format'

const icons: Record<ServiceId, LucideIcon> = {
  residential: Home,
  interior: Armchair,
  commercial: Building2,
  urban: Map,
}

export function Expertise() {
  const { t } = useLanguage()
  const finePointer = useFinePointer()
  const reduceMotion = useReducedMotion()
  const [openId, setOpenId] = useState<ServiceId | null>(null)
  const [previewId, setPreviewId] = useState<ServiceId | null>(null)

  const scope = useRef<HTMLElement>(null)
  const preview = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = scope.current
      const previewEl = preview.current
      if (!section || !previewEl || !finePointer || reduceMotion) return

      gsap.set(previewEl, { xPercent: -50, yPercent: -110, scale: 0.85, autoAlpha: 0, rotate: -3 })
      const moveX = gsap.quickTo(previewEl, 'x', { duration: 0.6, ease: 'power3.out' })
      const moveY = gsap.quickTo(previewEl, 'y', { duration: 0.6, ease: 'power3.out' })

      const onMove = (event: MouseEvent) => {
        moveX(event.clientX)
        moveY(event.clientY)
      }
      const rows = section.querySelectorAll('[data-service-row]')
      const enter = (event: Event) => {
        const id = (event.currentTarget as HTMLElement).dataset.serviceRow as ServiceId
        setPreviewId(id)
        gsap.to(previewEl, { scale: 1, autoAlpha: 1, rotate: 2, duration: 0.45, ease: 'power3.out' })
      }
      const leave = () => {
        gsap.to(previewEl, { scale: 0.85, autoAlpha: 0, duration: 0.35, ease: 'power2.in' })
      }

      rows.forEach((row) => {
        row.addEventListener('mouseenter', enter)
        row.addEventListener('mouseleave', leave)
      })
      section.addEventListener('mousemove', onMove)

      return () => {
        section.removeEventListener('mousemove', onMove)
        rows.forEach((row) => {
          row.removeEventListener('mouseenter', enter)
          row.removeEventListener('mouseleave', leave)
        })
      }
    },
    { scope, dependencies: [finePointer, reduceMotion] },
  )

  const previewService = services.find((service) => service.id === previewId) ?? services[0]

  return (
    <section id="expertise" ref={scope} className="relative bg-bg-alt py-24 lg:py-32">
      <Container>
        <SectionHeading
          index={t.expertise.index}
          eyebrow={t.expertise.eyebrow}
          title={t.expertise.title}
          lead={t.expertise.lead}
          className="max-w-2xl"
        />

        <div className="mt-14 border-t border-line lg:mt-20">
          {services.map((service, index) => {
            const Icon = icons[service.id]
            const copy = t.expertise.items[service.id]
            const open = openId === service.id

            return (
              <div key={service.id} className="border-b border-line">
                <button
                  type="button"
                  data-service-row={service.id}
                  onClick={() => setOpenId(open ? null : service.id)}
                  aria-expanded={open}
                  className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-5 py-7 text-start sm:gap-8 lg:py-9"
                >
                  <span className="eyebrow transition-colors duration-300 group-hover:text-accent">
                    {padIndex(index + 1)}
                  </span>
                  <span className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
                    <span className="display text-[clamp(1.6rem,4vw,3.2rem)] transition-colors duration-300 group-hover:text-accent">
                      {copy.title}
                    </span>
                  </span>
                  <span className="flex items-center gap-4 text-muted">
                    <Icon aria-hidden className="hidden size-6 sm:block" />
                    <Plus
                      aria-hidden
                      className={cn(
                        'size-5 transition-transform duration-500',
                        open && 'rotate-45 text-accent',
                      )}
                    />
                  </span>
                </button>

                <div
                  className={cn(
                    'grid transition-[grid-template-rows] duration-500 ease-out',
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-6 pb-8 sm:grid-cols-[1.2fr_1fr] sm:items-center lg:gap-12">
                      <p className="max-w-xl leading-relaxed text-muted">{copy.description}</p>
                      <figure className="relative aspect-[16/9] overflow-hidden">
                        <ResponsiveImage
                          asset={service.image}
                          alt={copy.title}
                          width={900}
                          height={675}
                          sizes="(min-width: 640px) 40vw, 100vw"
                          className="absolute inset-0"
                        />
                      </figure>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>

      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-40 hidden w-64 overflow-hidden rounded-sm shadow-(--shadow-soft) opacity-0 lg:block"
      >
        <figure className="relative aspect-[4/3]">
          <ResponsiveImage
            asset={previewService.image}
            alt=""
            width={900}
            height={675}
            sizes="256px"
            className="absolute inset-0"
          />
        </figure>
      </div>
    </section>
  )
}