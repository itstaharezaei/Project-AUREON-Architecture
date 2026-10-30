import type { Service } from '@/types/service'

export const services: readonly Service[] = [
  { id: 'residential', image: { name: 'expertise-residential', widths: [900, 560] } },
  { id: 'interior', image: { name: 'expertise-interior', widths: [900, 560] } },
  { id: 'commercial', image: { name: 'expertise-commercial', widths: [900, 560] } },
  { id: 'urban', image: { name: 'expertise-urban', widths: [900, 560] } },
]