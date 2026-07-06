"use client"

import * as React from "react"
import { GripVertical, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldLabel } from "@/components/ui/field"
import { MediaPickerField } from "@/components/tenant/admin/components/media/media-picker-field"
import { MediaThumbnail } from "@/components/tenant/admin/components/shared/media-thumbnail"
import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"
import { type MediaItem } from "@/types/tenant/media"
import { type StoreProductFormValues } from "@/schemas/tenant/product-schema"
import { type Product } from "@/types/tenant/product"
import { type ProductFormSectionProps } from "./product-form-shared"

type ProductMediaSectionProps = ProductFormSectionProps & {
  product?: Product
}

export function ProductMediaSection({ form, product }: ProductMediaSectionProps) {
  const [primaryPreviewUrl, setPrimaryPreviewUrl] = React.useState<
    string | null
  >(() =>
    product?.primary_image_media?.url
      ? resolveTenantMediaUrl(product.primary_image_media)
      : null
  )
  const [primaryPreviewTitle, setPrimaryPreviewTitle] = React.useState<
    string | null
  >(() => product?.primary_image_media?.name ?? product?.name ?? null)
  const [galleryPreviews, setGalleryPreviews] = React.useState<
    Record<number, { url: string; name?: string | null }>
  >(() => {
    const previews: Record<number, { url: string; name?: string | null }> = {}
    for (const item of product?.gallery ?? []) {
      const mediaId = item.media_id ?? item.media?.id
      if (!mediaId || !item.media?.url) continue
      previews[mediaId] = {
        url: resolveTenantMediaUrl(item.media),
        name: item.media.name ?? item.alt_text,
      }
    }
    return previews
  })

  const gallery = form.watch("gallery") || []

  const addGalleryItem = (mediaId: number | null, media?: MediaItem | null) => {
    if (!mediaId || !media) return
    const next: StoreProductFormValues["gallery"] = [
      ...gallery,
      {
        media_id: mediaId,
        sort_order: gallery.length,
        alt_text: media.title ?? media.name ?? null,
        is_primary: gallery.length === 0,
      },
    ]
    form.setValue("gallery", next, { shouldDirty: true })
    setGalleryPreviews((current) => ({
      ...current,
      [mediaId]: {
        url: resolveTenantMediaUrl(media),
        name: media.title ?? media.name,
      },
    }))
  }

  const removeGalleryItem = (index: number) => {
    const removed = gallery[index]
    form.setValue(
      "gallery",
      gallery.filter((_, i) => i !== index),
      { shouldDirty: true }
    )
    if (removed?.media_id) {
      setGalleryPreviews((current) => {
        const next = { ...current }
        delete next[removed.media_id]
        return next
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <MediaPickerField
          label="Primary image"
          value={form.watch("primary_image_media_id") ?? null}
          previewUrl={primaryPreviewUrl}
          previewTitle={primaryPreviewTitle}
          onChange={(mediaId, media) => {
            form.setValue("primary_image_media_id", mediaId)
            setPrimaryPreviewUrl(
              media?.url ? resolveTenantMediaUrl(media) : null
            )
            setPrimaryPreviewTitle(media?.title ?? media?.name ?? null)
          }}
          accept="image/*"
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <FieldLabel>Gallery</FieldLabel>
            <MediaPickerField
              label=""
              value={null}
              onChange={(mediaId, media) => addGalleryItem(mediaId, media)}
              accept="image/*"
            />
          </div>
          {gallery.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No gallery images yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {gallery.map((item, index) => (
                <div
                  key={`${item.media_id}-${index}`}
                  className="relative rounded-lg border p-2"
                >
                  <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <GripVertical className="size-3" />
                      #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                  <MediaThumbnail
                    media={
                      galleryPreviews[item.media_id]
                        ? {
                            url: galleryPreviews[item.media_id].url,
                            name:
                              galleryPreviews[item.media_id].name ??
                              item.alt_text,
                          }
                        : null
                    }
                    alt={item.alt_text ?? "Gallery image"}
                    size="md"
                    zoomable={false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
