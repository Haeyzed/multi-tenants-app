"use client"

import * as React from "react"

import { MediaPickerDialog } from "@/components/tenant/admin/components/media/media-picker-dialog"
import { MediaFileIcon } from "@/components/tenant/admin/components/shared/media-file-icon"
import { MediaThumbnail } from "@/components/tenant/admin/components/shared/media-thumbnail"
import { Button } from "@/components/ui/button"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { isMediaImage, type MediaFileLike } from "@/lib/tenant/media-file-kind"
import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"
import type { MediaItem } from "@/types/tenant/media"

interface MediaPickerFieldProps {
  label?: string
  value: number | null
  previewUrl?: string | null
  previewTitle?: string | null
  onChange: (mediaId: number | null, media?: MediaItem | null) => void
  accept?: string
}

export function MediaPickerField({
  label = "Media",
  value,
  previewUrl,
  previewTitle,
  onChange,
  accept = "image/*",
}: MediaPickerFieldProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedMedia, setSelectedMedia] = React.useState<MediaItem | null>(
    null
  )

  const displayUrl = previewUrl
    ? resolveTenantMediaUrl({ url: previewUrl, path: null })
    : selectedMedia?.url
      ? resolveTenantMediaUrl(selectedMedia)
      : null
  const previewItem =
    selectedMedia ??
    (displayUrl ? { url: displayUrl, name: previewTitle ?? undefined } : null)
  const previewLabel =
    previewTitle ??
    (selectedMedia
      ? (selectedMedia.title ?? selectedMedia.name)
      : previewTitle) ??
    previewItem?.name
  const showImagePreview = Boolean(
    displayUrl &&
    (accept?.startsWith("image") ||
      !previewItem ||
      isMediaImage(previewItem as MediaFileLike))
  )

  return (
    <>
      <Field>
        <FieldLabel>{label}</FieldLabel>
        <FieldContent>
          <div className="flex items-start gap-3 rounded-lg border p-3">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
              {showImagePreview && displayUrl ? (
                <MediaThumbnail
                  media={{
                    url: displayUrl,
                    name: previewTitle ?? previewItem?.name,
                  }}
                  alt={previewTitle ?? previewItem?.name ?? "Selected media"}
                  size="sm"
                  className="size-16"
                />
              ) : previewItem ? (
                <MediaFileIcon item={previewItem} size="md" />
              ) : (
                <span className="text-xs text-muted-foreground">No file</span>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              {previewItem && !showImagePreview ? (
                <p className="truncate text-sm font-medium">{previewLabel}</p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(true)}
                >
                  {value ? "Change" : "Choose from library"}
                </Button>
                {value ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      setSelectedMedia(null)
                      onChange(null, null)
                    }}
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </FieldContent>
      </Field>

      <MediaPickerDialog
        open={open}
        onOpenChange={setOpen}
        value={value}
        onSelect={(item) => {
          setSelectedMedia(item)
          onChange(item?.id ?? null, item)
        }}
        accept={accept}
      />
    </>
  )
}
