"use client"

import Image from "next/image"

import { ImageZoom } from "@/components/kibo-ui/image-zoom"
import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"
import { cn } from "@/lib/utils"

const sizeMap = {
  xs: { className: "size-8", width: 32, height: 32 },
  sm: { className: "size-10", width: 40, height: 40 },
  md: { className: "size-16", width: 64, height: 64 },
  lg: { className: "size-24", width: 96, height: 96 },
} as const

type MediaLike = {
  url: string
  path?: string | null
  name?: string | null
}

type MediaThumbnailProps = {
  media?: MediaLike | null
  alt?: string
  size?: keyof typeof sizeMap
  className?: string
  zoomable?: boolean
  /** Fill the parent container (e.g. grid tile). Parent must be `relative` with defined size. */
  cover?: boolean
}

export function MediaThumbnail({
  media,
  alt,
  size = "sm",
  className,
  zoomable = true,
  cover = false,
}: MediaThumbnailProps) {
  if (!media?.url) {
    return <span className="text-muted-foreground">—</span>
  }

  const src = resolveTenantMediaUrl(media)
  const dimensions = sizeMap[size]

  if (cover) {
    const image = (
      <div className="relative size-full">
        <Image
          src={src}
          alt={alt ?? media.name ?? "Media"}
          fill
          unoptimized
          className="object-cover"
          sizes="160px"
        />
      </div>
    )

    if (!zoomable) {
      return <div className={cn("relative size-full", className)}>{image}</div>
    }

    return (
      <ImageZoom className={cn("relative block size-full", className)}>
        {image}
      </ImageZoom>
    )
  }

  const image = (
    <Image
      src={src}
      alt={alt ?? media.name ?? "Media"}
      width={dimensions.width}
      height={dimensions.height}
      unoptimized
      className={cn("rounded-md object-cover", dimensions.className, className)}
    />
  )

  if (!zoomable) {
    return image
  }

  return (
    <ImageZoom className={cn("inline-block", dimensions.className, className)}>
      {image}
    </ImageZoom>
  )
}
