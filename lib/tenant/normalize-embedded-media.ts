import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"
import type { TenantMedia } from "@/types/tenant/shared-media"

export function normalizeEmbeddedMedia(
  media?: TenantMedia | null
): TenantMedia | null {
  if (!media) {
    return null
  }

  return {
    ...media,
    url: resolveTenantMediaUrl(media),
    name: media.name ?? media.title ?? media.file_name ?? null,
  }
}
