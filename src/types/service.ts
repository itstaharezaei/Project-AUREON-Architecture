import type { ImageAsset } from './project'

export type ServiceId = 'residential' | 'interior' | 'commercial' | 'urban'

export interface Service {
  id: ServiceId
  image: ImageAsset
}

export interface ServiceCopy {
  title: string
  description: string
}