export type MediaFileLike = {
  mime_type?: string | null
  file_name?: string | null
  name?: string | null
}

const PREVIEWABLE_EXTENSIONS = new Set([
  "pdf",
  "doc",
  "docx",
  "dot",
  "dotx",
  "xls",
  "xlsx",
  "xlsm",
  "csv",
  "ods",
  "ppt",
  "pptx",
  "odp",
  "txt",
  "rtf",
  "md",
  "html",
  "htm",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "bmp",
  "tif",
  "tiff",
  "svg",
  "mp4",
  "webm",
  "mov",
  "avi",
  "mkv",
  "m4v",
  "mp3",
  "wav",
  "ogg",
  "m4a",
])

const MIME_EXTENSION_MAP: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "text/csv": "csv",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "pptx",
  "text/plain": "txt",
  "application/rtf": "rtf",
  "text/html": "html",
  "text/markdown": "md",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "audio/ogg": "ogg",
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
}

export function getMediaFileExtension(item: MediaFileLike): string {
  const fileName = item.file_name ?? item.name ?? ""
  const dotIndex = fileName.lastIndexOf(".")

  if (dotIndex >= 0) {
    return fileName.slice(dotIndex + 1).toLowerCase()
  }

  const mime = item.mime_type?.toLowerCase()
  if (!mime) return ""

  return (
    MIME_EXTENSION_MAP[mime] ?? mime.split("/").pop()?.split("+").pop() ?? ""
  )
}

export function isMediaImage(item: MediaFileLike): boolean {
  return item.mime_type?.startsWith("image/") ?? false
}

export function mediaMatchesAccept(
  item: MediaFileLike,
  accept?: string
): boolean {
  if (!accept) {
    return true
  }

  const mime = item.mime_type?.toLowerCase() ?? ""
  const extension = getMediaFileExtension(item)

  return accept.split(",").some((pattern) => {
    const trimmed = pattern.trim().toLowerCase()
    if (!trimmed) {
      return false
    }

    if (trimmed.endsWith("/*")) {
      const prefix = trimmed.slice(0, -1)
      return mime.startsWith(prefix)
    }

    if (trimmed.startsWith(".")) {
      return extension === trimmed.slice(1)
    }

    return mime === trimmed
  })
}

/** Accept string for document pickers (PDF, Word, Excel, PowerPoint, text, CSV). */
export const DOCUMENT_MEDIA_ACCEPT = [
  "application/pdf",
  ".pdf",
  "application/msword",
  ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".docx",
  "application/vnd.ms-excel",
  ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xlsx",
  "application/vnd.ms-powerpoint",
  ".ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".pptx",
  "text/plain",
  ".txt",
  "text/csv",
  ".csv",
  "application/rtf",
  ".rtf",
].join(",")

export function isMediaPreviewable(item: MediaFileLike): boolean {
  if (isMediaImage(item)) return true

  const extension = getMediaFileExtension(item)
  if (PREVIEWABLE_EXTENSIONS.has(extension)) return true

  const mime = item.mime_type?.toLowerCase() ?? ""
  if (mime.startsWith("video/") || mime.startsWith("audio/")) return true

  return (
    mime.startsWith("text/") ||
    mime.includes("pdf") ||
    mime.includes("word") ||
    mime.includes("excel") ||
    mime.includes("spreadsheet") ||
    mime.includes("powerpoint") ||
    mime.includes("presentation")
  )
}
