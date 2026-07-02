"use client"

import * as React from "react"

import { MediaPickerDialog } from "@/components/tenant/admin/components/media/media-picker-dialog"
import { MediaThumbnail } from "@/components/tenant/admin/components/shared/media-thumbnail"
import { Button } from "@/components/ui/button"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
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

  const displayUrl = previewUrl
    ? resolveTenantMediaUrl({ url: previewUrl, path: null })
    : null

  return (
    <>
      <Field>
        <FieldLabel>{label}</FieldLabel>
        <FieldContent>
          <div className="flex items-start gap-3 rounded-lg border p-3">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
              {displayUrl ? (
                <MediaThumbnail
                  media={{ url: displayUrl, name: previewTitle }}
                  alt={previewTitle ?? "Selected media"}
                  size="sm"
                  className="size-16"
                />
              ) : (
                <span className="text-xs text-muted-foreground">No file</span>
              )}
            </div>
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
                  onClick={() => onChange(null, null)}
                >
                  Remove
                </Button>
              ) : null}
            </div>
          </div>
        </FieldContent>
      </Field>

      <MediaPickerDialog
        open={open}
        onOpenChange={setOpen}
        value={value}
        onSelect={(item) => onChange(item?.id ?? null, item)}
        accept={accept}
      />
    </>
  )
}
