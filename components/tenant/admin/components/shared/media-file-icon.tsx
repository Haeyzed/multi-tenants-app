"use client"

import { FileIcon, defaultStyles } from "react-file-icon"

import {
  getMediaFileExtension,
  type MediaFileLike,
} from "@/lib/tenant/media-file-kind"
import { cn } from "@/lib/utils"

const sizeMap = {
  xs: "h-8 w-6",
  sm: "h-10 w-8",
  md: "h-14 w-11",
  lg: "h-20 w-16",
} as const

function resolveFileIconStyles(item: MediaFileLike) {
  const extension = getMediaFileExtension(item)

  if (extension && defaultStyles[extension]) {
    return defaultStyles[extension]
  }

  const mime = item.mime_type?.toLowerCase() ?? ""

  if (mime.startsWith("video/")) return defaultStyles.mp4
  if (mime.startsWith("audio/")) return defaultStyles.mp3
  if (mime.includes("pdf")) return defaultStyles.pdf
  if (mime.includes("spreadsheet") || mime.includes("excel")) {
    return defaultStyles.xlsx
  }
  if (mime.includes("word")) return defaultStyles.docx
  if (mime.includes("presentation") || mime.includes("powerpoint")) {
    return defaultStyles.pptx
  }
  if (mime.startsWith("text/")) return defaultStyles.txt
  if (mime.includes("zip") || mime.includes("compressed")) {
    return defaultStyles.zip
  }

  return defaultStyles.txt
}

type MediaFileIconProps = {
  item: MediaFileLike
  size?: keyof typeof sizeMap
  className?: string
}

export function MediaFileIcon({
  item,
  size = "md",
  className,
}: MediaFileIconProps) {
  const extension = getMediaFileExtension(item)
  const styles = resolveFileIconStyles(item)

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center",
        sizeMap[size],
        className
      )}
    >
      <FileIcon extension={extension || undefined} {...styles} />
    </div>
  )
}
