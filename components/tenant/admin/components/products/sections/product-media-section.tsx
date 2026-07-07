"use client"

import * as React from "react"
import Image from "next/image"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"
import { MediaPickerDialog } from "@/components/tenant/admin/components/media/media-picker-dialog"
import { MediaPickerField } from "@/components/tenant/admin/components/media/media-picker-field"
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
  const [galleryPickerOpen, setGalleryPickerOpen] = React.useState(false)

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
      <CardContent className="space-y-6">
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

        <Field>
          <FieldLabel>Gallery</FieldLabel>
          <FieldContent>
            <div className="mb-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setGalleryPickerOpen(true)}
              >
                <Plus className="mr-1 size-3.5" />
                Add image
              </Button>
            </div>
            {gallery.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No gallery images yet.
              </p>
            ) : (
              <ItemGroup className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {gallery.map((item, index) => {
                  const preview = galleryPreviews[item.media_id]
                  return (
                    <Item
                      key={`${item.media_id}-${index}`}
                      variant="outline"
                      size="sm"
                      className="relative"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="absolute top-2 right-2 z-10 size-7 text-destructive"
                        onClick={() => removeGalleryItem(index)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                      <ItemHeader>
                        {preview?.url ? (
                          <Image
                            src={preview.url}
                            alt={item.alt_text ?? preview.name ?? "Gallery image"}
                            width={72}
                            height={72}
                            className="aspect-square w-full rounded-sm object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex aspect-square w-full items-center justify-center rounded-sm bg-muted text-[10px] text-muted-foreground">
                            No image
                          </div>
                        )}
                      </ItemHeader>
                      <ItemContent>
                        <ItemTitle className="text-xs">#{index + 1}</ItemTitle>
                        <ItemDescription className="line-clamp-2 text-[10px]">
                          {preview?.name ?? item.alt_text ?? "Gallery image"}
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  )
                })}
              </ItemGroup>
            )}
          </FieldContent>
        </Field>

        <MediaPickerDialog
          open={galleryPickerOpen}
          onOpenChange={setGalleryPickerOpen}
          value={null}
          onSelect={(item) => {
            addGalleryItem(item?.id ?? null, item)
            setGalleryPickerOpen(false)
          }}
          accept="image/*"
        />
      </CardContent>
    </Card>
  )
}
