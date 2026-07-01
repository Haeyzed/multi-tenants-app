export function parseFilenameFromContentDisposition(
  header: string | null
): string | null {
  if (!header) return null

  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1])
  }

  const match = header.match(/filename="?([^";]+)"?/i)
  return match?.[1] ?? null
}

/** Triggers a browser save for a file returned by the API download response. */
export function triggerBrowserDownload(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
