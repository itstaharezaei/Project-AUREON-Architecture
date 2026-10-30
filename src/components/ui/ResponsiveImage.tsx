import type { ImageAsset } from '@/types/project'
import { imageSrcSet, imageUrl } from '@/utils/images'
import { cn } from '@/utils/cn'

interface ResponsiveImageProps {
  asset: ImageAsset
  alt: string
  width: number
  height: number
  sizes?: string
  eager?: boolean
  className?: string
}

export function ResponsiveImage({
  asset,
  alt,
  width,
  height,
  sizes = '100vw',
  eager = false,
  className,
}: ResponsiveImageProps) {
  return (
    <img
      src={imageUrl(asset.name, asset.widths[0])}
      srcSet={imageSrcSet(asset)}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'sync' : 'async'}
      fetchPriority={eager ? 'high' : 'auto'}
      className={cn('h-full w-full object-cover', className)}
    />
  )
}