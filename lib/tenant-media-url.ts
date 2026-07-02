import { resolveTenantApiBaseUrl } from "@/lib/tenant-api-url"

type MediaUrlInput = {
  url: string
  path?: string | null
}

function resolveTenantAssetOrigin(): string {
  return resolveTenantApiBaseUrl().replace(/\/api\/v1\/tenant\/?$/, "")
}

export function resolveTenantMediaUrl(media: MediaUrlInput): string {
  const path = media.path?.replace(/^\//, "")

  if (path) {
    return `${resolveTenantAssetOrigin()}/tenancy/assets/${path}`
  }

  const tenancyMatch = media.url.match(/\/tenancy\/assets\/(.+)$/)
  if (tenancyMatch?.[1]) {
    return `${resolveTenantAssetOrigin()}/tenancy/assets/${tenancyMatch[1]}`
  }

  // Fix malformed URLs missing the platform domain (e.g. http://softmaxtech/...)
  if (media.url.startsWith("http://") || media.url.startsWith("https://")) {
    try {
      const parsed = new URL(media.url)
      if (!parsed.hostname.includes(".")) {
        return `${resolveTenantAssetOrigin()}${parsed.pathname}${parsed.search}`
      }
    } catch {
      return media.url
    }
  }

  return media.url
}
