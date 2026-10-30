import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { gsap, useGSAP } from '@/animations/gsap'
import { ResponsiveImage } from '@/components/ui/ResponsiveImage'
import { useLanguage } from '@/hooks/useLanguage'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import type { Project } from '@/types/project'
import { formatNumber, formatPlainNumber } from '@/utils/format'

interface ProjectDialogProps {
  project: Project | null
  onClose: () => void
}

export function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  const { t, language } = useLanguage()
  const reduceMotion = useReducedMotion()
  const scope = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)

  useGSAP(
    () => {
      const root = scope.current
      if (!root || !project) return
      if (reduceMotion) {
        gsap.set(root, { autoAlpha: 1 })
        return
      }
      gsap.fromTo(
        root,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.35, ease: 'power2.out' },
      )
      gsap.fromTo(
        root.querySelector('[data-dialog-panel]'),
        { y: 48, clipPath: 'inset(6% 4% 6% 4%)' },
        { y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power4.out' },
      )
    },
    { scope, dependencies: [project, reduceMotion] },
  )

  useEffect(() => {
    if (!project) return
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [project, onClose])

  if (!project) return null

  const copy = t.projects.items[project.id]

  return (
    <div
      ref={scope}
      role="dialog"
      aria-modal="true"
      aria-label={copy.name}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8"
    >
      <button
        type="button"
        aria-label={t.a11y.closeMenu}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-(--scrim) backdrop-blur-sm"
      />

      <div
        data-dialog-panel
        className="relative grid max-h-[88vh] w-full max-w-5xl overflow-y-auto bg-surface shadow-(--shadow-soft) md:grid-cols-[1.15fr_1fr]"
      >
        <figure className="relative aspect-[4/3] md:aspect-auto md:h-full">
          <ResponsiveImage
            asset={project.image}
            alt={copy.name}
            width={project.image.widths[0]}
            height={Math.round(project.image.widths[0] * 0.75)}
            sizes="(min-width: 768px) 55vw, 100vw"
            eager
            className="absolute inset-0"
          />
        </figure>

        <div className="flex flex-col gap-6 p-7 sm:p-10">
          <div className="flex items-start justify-between gap-4">
            <span className="eyebrow text-accent">{copy.category}</span>
            <button
              ref={closeButton}
              type="button"
              onClick={onClose}
              aria-label={t.a11y.closeMenu}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-line transition-colors hover:border-accent hover:text-accent"
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>

          <h3 className="display text-[clamp(2rem,4.5vw,3.2rem)]">{copy.name}</h3>
          <p className="leading-relaxed text-muted">{copy.description}</p>

          <dl className="mt-auto grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 text-sm">
            <div>
              <dt className="eyebrow">{t.featured.specs[0].label}</dt>
              <dd className="mt-1 font-semibold">{copy.location}</dd>
            </div>
            <div>
              <dt className="eyebrow">{t.featured.specs[1].label}</dt>
              <dd className="mt-1 font-semibold">{formatPlainNumber(project.year, language)}</dd>
            </div>
            <div>
              <dt className="eyebrow">{t.featured.specs[2].label}</dt>
              <dd className="mt-1 font-semibold">
                {formatNumber(project.area, language)} {t.units.sqm}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">{t.projects.type}</dt>
              <dd className="mt-1 font-semibold">{copy.category}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}