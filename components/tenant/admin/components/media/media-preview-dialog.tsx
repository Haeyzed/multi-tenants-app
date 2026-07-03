"use client"

import dynamic from "next/dynamic"
import * as React from "react"

import "@cyntler/react-doc-viewer/dist/index.css"

import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"
import { getMediaFileExtension } from "@/lib/tenant/media-file-kind"
import type { MediaItem } from "@/types/tenant/media"
import { Spinner } from "@/components/ui/spinner"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"

const DocViewer = dynamic(
  () =>
    import("@cyntler/react-doc-viewer").then((mod) => {
      function MediaDocViewer({ item }: { item: MediaItem }) {
        const uri = resolveTenantMediaUrl(item)
        const extension = getMediaFileExtension(item)

        return (
          <mod.default
            documents={[
              {
                uri,
                fileName: item.file_name || item.name,
                fileType: extension || undefined,
              },
            ]}
            pluginRenderers={mod.DocViewerRenderers}
            config={{
              header: {
                disableHeader: false,
                disableFileName: false,
              },
            }}
            style={{ height: "100%", width: "100%" }}
          />
        )
      }

      return MediaDocViewer
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="size-8" />
      </div>
    ),
  }
)

interface MediaPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: MediaItem | null
}

export function MediaPreviewDialog({
  open,
  onOpenChange,
  item,
}: MediaPreviewDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="flex max-h-[92vh] w-[min(96vw,72rem)] max-w-[96vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-[96vw]">
        <ResponsiveDialogHeader className="border-b px-4 py-3">
          <ResponsiveDialogTitle className="truncate pe-8">
            {item?.title ?? item?.name ?? "Preview"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription className="sr-only">
            Document preview
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="min-h-[60vh] flex-1 overflow-hidden bg-muted/20">
          {item && open ? <DocViewer item={item} /> : null}
        </div>

        <ResponsiveDialogFooter className="border-t px-4 py-3">
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
