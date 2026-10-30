import type { ImageAsset } from '@/types/project'

export const imageUrl = (name: string, width: number): string => `/images/${name}-${width}.webp`

export const imageSrcSet = (asset: ImageAsset): string =>
  asset.widths.map((width) => `${imageUrl(asset.name, width)} ${width}w`).join(', ')

export const smallestImage = (asset: ImageAsset): string =>
  imageUrl(asset.name, asset.widths[asset.widths.length - 1])