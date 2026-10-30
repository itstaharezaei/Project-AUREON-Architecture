import { ArrowUpLeft, ArrowUpRight } from 'lucide-react'
import { ResponsiveImage } from '@/components/ui/ResponsiveImage'
import { useLanguage } from '@/hooks/useLanguage'
import type { Project, ProjectCopy } from '@/types/project'
import { cn } from '@/utils/cn'
import { formatPlainNumber, padIndex } from '@/utils/format'

const sizeClasses: Record<Project['size'], string> = {
  wide: 'h-[58vh] min-h-[380px] w-[82vw] sm:w-[56vw] lg:h-[64vh] lg:w-[44vw]',
  tall: 'h-[64vh] min-h-[420px] w-[70vw] sm:w-[40vw] lg:h-[74vh] lg:w-[26vw]',
  square: 'h-[52vh] min-h-[360px] w-[76vw] sm:w-[46vw] lg:h-[56vh] lg:w-[32vw]',
}

interface ProjectCardProps {
  project: Project
  copy: ProjectCopy
  index: number
  onOpen: (project: Project) => void
}

export function ProjectCard({ project, copy, index, onOpen }: ProjectCardProps) {
  const { t, language, isRTL } = useLanguage()
  const Arrow = isRTL ? ArrowUpLeft : ArrowUpRight

  return (
    <article
      data-card
      className={cn('group relative shrink-0 snap-start', sizeClasses[project.size])}
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-label={`${copy.name} — ${t.projects.view}`}
        className="block h-full w-full text-start"
      >
        <figure className="relative h-full w-full overflow-hidden bg-surface">
          <div data-card-media className="absolute inset-0">
            <ResponsiveImage
              asset={project.image}
              alt={copy.name}
              width={project.image.widths[0]}
              height={Math.round(project.image.widths[0] * 0.75)}
              sizes="(min-width: 1024px) 44vw, 82vw"
              className="scale-110 transition-transform duration-700 ease-out group-hover:scale-[1.17]"
            />
          </div>

          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/10 transition-opacity duration-500 group-hover:opacity-90"
          />

          <span className="eyebrow absolute top-5 start-5 text-white/70">
            {padIndex(index + 1)}
          </span>

          <span className="absolute top-5 end-5 flex translate-y-2 items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-semibold text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            {t.projects.view}
            <Arrow aria-hidden className="size-3.5" />
          </span>

          <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-2.5 p-6 text-[#f2f0e9] lg:p-8">
            <span className="text-xs tracking-wide text-white/70">
              {copy.location} · {formatPlainNumber(project.year, language)} · {copy.category}
            </span>
            <span className="display text-[clamp(1.6rem,3vw,2.6rem)] transition-transform duration-500 ease-out group-hover:-translate-y-1">
              {copy.name}
            </span>
            <span className="max-h-0 overflow-hidden text-sm leading-relaxed text-white/75 opacity-0 transition-all duration-500 group-hover:max-h-28 group-hover:opacity-100">
              {copy.description}
            </span>
          </figcaption>
        </figure>
      </button>
    </article>
  )
}