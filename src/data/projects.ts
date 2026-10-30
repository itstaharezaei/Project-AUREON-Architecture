import type { Project } from '@/types/project'

export const projects: readonly Project[] = [
  {
    id: 'sillage',
    year: 2024,
    category: 'residential',
    area: 420,
    size: 'wide',
    image: { name: 'project-sillage', widths: [1400, 900, 560] },
  },
  {
    id: 'terra',
    year: 2023,
    category: 'residential',
    area: 310,
    size: 'tall',
    image: { name: 'project-terra', widths: [1000, 640, 420] },
  },
  {
    id: 'horizon',
    year: 2023,
    category: 'residential',
    area: 280,
    size: 'wide',
    image: { name: 'project-horizon', widths: [1400, 900, 560] },
  },
  {
    id: 'forma',
    year: 2022,
    category: 'cultural',
    area: 160,
    size: 'square',
    image: { name: 'project-forma', widths: [1024, 700, 460] },
  },
  {
    id: 'noma',
    year: 2024,
    category: 'interior',
    area: 190,
    size: 'tall',
    image: { name: 'project-noma', widths: [1000, 640, 420] },
  },
]

export const featuredProjectId = 'sillage' as const