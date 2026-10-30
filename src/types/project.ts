export type ProjectId = 'sillage' | 'terra' | 'horizon' | 'forma' | 'noma'

export type ProjectCategory = 'residential' | 'cultural' | 'interior'

export interface ImageAsset {
  name: string
  widths: readonly number[]
}

export interface Project {
  id: ProjectId
  year: number
  category: ProjectCategory
  area: number
  image: ImageAsset
  /** Bento / horizontal-gallery footprint */
  size: 'wide' | 'tall' | 'square'
}

export interface ProjectCopy {
  name: string
  location: string
  category: string
  description: string
}