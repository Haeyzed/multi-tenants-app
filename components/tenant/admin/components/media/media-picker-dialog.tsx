"use client"

import * as React from "react"

import { MediaLibraryPanel } from "@/components/tenant/admin/components/media/media-library-panel"
import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import type { MediaItem } from "@/types/tenant/media"

interface MediaPickerDialogBaseProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accept?: string
  title?: string
  description?: string
}

interface MediaPickerDialogSingleProps extends MediaPickerDialogBaseProps {
  multiple?: false
  value?: number | null
  onSelect: (item: MediaItem | null) => void
  onSelectMultiple?: never
}

interface MediaPickerDialogMultipleProps extends MediaPickerDialogBaseProps {
  multiple: true
  value?: never
  onSelect?: never
  onSelectMultiple: (items: MediaItem[]) => void
}

type MediaPickerDialogProps =
  | MediaPickerDialogSingleProps
  | MediaPickerDialogMultipleProps

export function MediaPickerDialog({
  open,
  onOpenChange,
  value = null,
  onSelect,
  onSelectMultiple,
  multiple = false,
  accept = "image/*",
  title = "Media library",
  description = "Upload a new file or choose an existing one from your library.",
}: MediaPickerDialogProps) {
  const [pendingSelections, setPendingSelections] = React.useState<
    Map<number, MediaItem>
  >(() => new Map())

  React.useEffect(() => {
    if (!open) {
      setPendingSelections(new Map())
    }
  }, [open])

  const handlePick = React.useCallback(
    (item: MediaItem) => {
      if (multiple) {
        setPendingSelections((current) => {
          const next = new Map(current)
          if (next.has(item.id)) {
            next.delete(item.id)
          } else {
            next.set(item.id, item)
          }
          return next
        })
        return
      }

      onSelect?.(item)
      onOpenChange(false)
    },
    [multiple, onOpenChange, onSelect]
  )

  const handleConfirmMultiple = React.useCallback(() => {
    if (pendingSelections.size === 0) {
      return
    }

    onSelectMultiple?.(Array.from(pendingSelections.values()))
    onOpenChange(false)
  }, [onOpenChange, onSelectMultiple, pendingSelections])

  const pickerValues = multiple ? Array.from(pendingSelections.keys()) : undefined

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {multiple
              ? "Select one or more files, then confirm your selection."
              : description}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <MediaLibraryPanel
          mode="picker"
          pickerValue={multiple ? null : value}
          pickerValues={pickerValues}
          pickerMultiple={multiple}
          accept={accept}
          onPick={handlePick}
        />

        {multiple ? (
          <ResponsiveDialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={pendingSelections.size === 0}
              onClick={handleConfirmMultiple}
            >
              Add selected
              {pendingSelections.size > 0
                ? ` (${pendingSelections.size})`
                : null}
            </Button>
          </ResponsiveDialogFooter>
        ) : null}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
