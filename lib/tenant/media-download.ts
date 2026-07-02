import type { MediaItem } from "@/types/tenant/media"

export async function downloadMediaItem(item: MediaItem): Promise<void> {
  const filename = item.file_name || item.name || "download"

  try {
    const response = await fetch(item.url)

    if (!response.ok) {
      throw new Error("Download failed")
    }

    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = objectUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(objectUrl)
  } catch {
    const link = document.createElement("a")
    link.href = item.url
    link.download = filename
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
}
