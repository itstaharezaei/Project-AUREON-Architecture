import { useRef, useState } from 'react'
import { MoveHorizontal } from 'lucide-react'
import { gsap, useGSAP } from '@/animations/gsap'
import {
  cardParallax,
  galleryEntrance,
  horizontalGallery,
} from '@/animations/projectAnimations'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { projects } from '@/data/projects'
import { useLanguage } from '@/hooks/useLanguage'
import { useDesktop, useFinePointer, useReducedMotion } from '@/hooks/useMediaQuery'
import type { Project } from '@/types/project'
import { cn } from '@/utils/cn'
import { padIndex } from '@/utils/format'
import { ProjectCard } from './ProjectCard'
import { ProjectDialog } from './ProjectDialog'

export function Projects() {
  const { t, isRTL } = useLanguage()
  const desktop = useDesktop()
  const finePointer = useFinePointer()
  const reduceMotion = useReducedMotion()
  const [openProject, setOpenProject] = useState<Project | null>(null)

  const scope = useRef<HTMLElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const lastIndex = useRef(0)
  const rtlRef = useRef(isRTL)
  rtlRef.current = isRTL

  const pinned = desktop && !reduceMotion

  useGSAP(
    () => {
      const section = scope.current
      const wrapEl = wrap.current
      const trackEl = track.current
      if (!section || !wrapEl || !trackEl) return

      const cards = trackEl.querySelectorAll('[data-card]')
      lastIndex.current = 0

      const report = (progress: number) => {
        if (bar.current) {
          bar.current.style.transform = `scaleX(${progress})`
        }
        const index = Math.min(projects.length - 1, Math.round(progress * (projects.length - 1)))
        if (index !== lastIndex.current && counter.current) {
          lastIndex.current = index
          counter.current.textContent = padIndex(index + 1)
        }
      }

      if (pinned) {
        const getRTL = () => rtlRef.current
        const { tween } = horizontalGallery(wrapEl, trackEl, getRTL, report)
        cards.forEach((card) => cardParallax(card as HTMLElement, tween, getRTL))
        galleryEntrance(section, cards)
      } else {
        const onScroll = () => {
          const max = wrapEl.scrollWidth - wrapEl.clientWidth
          report(max > 0 ? Math.abs(wrapEl.scrollLeft) / max : 0)
        }
        onScroll()
        wrapEl.addEventListener('scroll', onScroll, { passive: true })
        return () => wrapEl.removeEventListener('scroll', onScroll)
      }
    },
    { scope, dependencies: [pinned] },
  )

  useGSAP(
    () => {
      const section = scope.current
      const cursorEl = cursor.current
      const trackEl = track.current
      if (!section || !cursorEl || !trackEl || !pinned || !finePointer) return

      gsap.set(cursorEl, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 })
      const moveX = gsap.quickTo(cursorEl, 'x', { duration: 0.5, ease: 'power3.out' })
      const moveY = gsap.quickTo(cursorEl, 'y', { duration: 0.5, ease: 'power3.out' })

      const onMove = (event: MouseEvent) => {
        moveX(event.clientX)
        moveY(event.clientY)
      }
      const show = () => gsap.to(cursorEl, { scale: 1, autoAlpha: 1, duration: 0.35 })
      const hide = () => gsap.to(cursorEl, { scale: 0, autoAlpha: 0, duration: 0.3 })

      const cards = trackEl.querySelectorAll('[data-card]')
      cards.forEach((card) => {
        card.addEventListener('mouseenter', show)
        card.addEventListener('mouseleave', hide)
      })
      section.addEventListener('mousemove', onMove)

      return () => {
        section.removeEventListener('mousemove', onMove)
        cards.forEach((card) => {
          card.removeEventListener('mouseenter', show)
          card.removeEventListener('mouseleave', hide)
        })
      }
    },
    { scope, dependencies: [pinned, finePointer] },
  )

  const meter = (
    <div className="flex items-center gap-5">
      <p className="text-sm font-semibold tracking-wide text-muted" dir="ltr">
        <span ref={counter} className="text-ink">
          {padIndex(1)}
        </span>
        <span className="mx-2 text-line-strong">/</span>
        {padIndex(projects.length)}
      </p>
      <span className="relative block h-px w-28 overflow-hidden bg-line sm:w-44">
        <span
          ref={bar}
          className="absolute inset-0 bg-accent"
          style={{ transform: 'scaleX(0)', transformOrigin: isRTL ? 'right' : 'left' }}
        />
      </span>
    </div>
  )

  const hint = (
    <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-muted uppercase">
      <MoveHorizontal aria-hidden className="size-4 text-accent" />
      {pinned ? t.projects.hint : t.projects.hintTouch}
    </p>
  )

  return (
    <section id="projects" ref={scope} className="relative bg-bg py-24 lg:py-28">
      <Container>
        <SectionHeading
          index={t.projects.index}
          eyebrow={t.projects.eyebrow}
          title={t.projects.title}
          lead={t.projects.lead}
          className="max-w-2xl"
        />
      </Container>

      <div
        ref={wrap}
        className={cn(
          'relative mt-12 lg:mt-16',
          pinned
            ? 'lg:flex lg:h-screen lg:items-center lg:overflow-hidden'
            : 'scrollbar-none snap-x snap-mandatory overflow-x-auto',
        )}
      >
        <div
          ref={track}
          className="flex w-max items-center gap-5 px-5 sm:gap-8 sm:px-8 lg:gap-10 lg:px-12"
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              copy={t.projects.items[project.id]}
              index={index}
              onOpen={setOpenProject}
            />
          ))}
        </div>

        {pinned && (
          <div className="absolute inset-x-0 bottom-8 hidden items-center justify-between gap-6 px-5 sm:px-8 lg:flex lg:px-12">
            {meter}
            {hint}
          </div>
        )}
      </div>

      {!pinned && (
        <Container className="mt-6 flex flex-wrap items-center justify-between gap-4">
          {meter}
          {hint}
        </Container>
      )}

      <div
        ref={cursor}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-40 hidden rounded-full bg-accent px-5 py-3 text-xs font-bold tracking-wide text-accent-ink opacity-0 lg:block"
      >
        {t.projects.view}
      </div>

      <ProjectDialog project={openProject} onClose={() => setOpenProject(null)} />
    </section>
  )
}