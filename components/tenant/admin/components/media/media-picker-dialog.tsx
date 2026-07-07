"use client"

import * as React from "react"

import { MediaLibraryPanel } from "@/components/tenant/admin/components/media/media-library-panel"
import type { MediaItem } from "@/types/tenant/media"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"

interface MediaPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value?: number | null
  onSelect: (item: MediaItem | null) => void
  accept?: string
  title?: string
  description?: string
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  value = null,
  onSelect,
  accept = "image/*",
  title = "Media library",
  description = "Upload a new file or choose an existing one from your library.",
}: MediaPickerDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {description}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <MediaLibraryPanel
          mode="picker"
          pickerValue={value}
          accept={accept}
          onPick={(item) => {
            onSelect(item)
            onOpenChange(false)
          }}
        />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
